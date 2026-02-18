import { CalendarDate } from '@internationalized/date';
import { persistentCache } from './cache';
import type { DateInfo } from '@/types';
import { PublicHolidayIndicator } from '@/data/indicators';

const BASE_URL = 'https://date.nager.at/api/v3';

// Cache TTLs (Time To Live)
const CACHE_TTL = {
  COUNTRIES: 30 * 24 * 60 * 60 * 1000, // 30 days
  HOLIDAYS: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Types
export interface Country {
  countryCode: string;
  name: string;
}

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

/**
 * Fetch available countries from the API
 * Uses cache to avoid unnecessary API calls
 */
export async function getAvailableCountries(): Promise<Country[]> {
  const cacheKey = 'available_countries';

  // Check cache first
  const cached = persistentCache.get<Country[]>(cacheKey);
  if (cached) {
    console.log('Cache hit: available countries');
    return cached;
  }

  try {
    const response = await fetch(`${BASE_URL}/AvailableCountries`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const countries: Country[] = await response.json();

    // Sort countries alphabetically by name
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // Cache the result
    persistentCache.set(cacheKey, countries, CACHE_TTL.COUNTRIES);

    return countries;
  } catch (error) {
    console.error('Failed to fetch available countries:', error);
    throw error;
  }
}

/**
 * Fetch public holidays for a specific country and year
 * Uses cache to avoid unnecessary API calls
 */
export async function getPublicHolidaysForYear(
  countryCode: string,
  year: number
): Promise<DateInfo[]> {
  const cacheKey = `holidays_${countryCode}_${year}`;

  // Check cache first
  const cached = persistentCache.get<DateInfo[]>(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    // Convert cached data back to CalendarDate objects
    return cached.map((holiday: DateInfo) => 
      new Object({
        date: new CalendarDate(holiday.date.year, holiday.date.month, holiday.date.day),
        indicators: holiday.indicators,
        tooltip: holiday.tooltip
      }) as DateInfo
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/PublicHolidays/${year}/${countryCode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: PublicHoliday[] = await response.json();

    // Transform API response to DateValue[] format
    const holidays: DateInfo[] = data.filter((date) => date.global == true && date.types.includes("Public")).map((holiday: any) => {
      const [y, m, d] = holiday.date.split('-').map(Number);
      return new Object({
        date: new CalendarDate(y, m, d),
        indicators: [PublicHolidayIndicator],
        tooltip: holiday.localName
      }) as DateInfo;
    });

    // Store in cache
    const serializedHolidays = holidays.map((holiday) => ({
      date: {
        year: holiday.date.year,
        month: holiday.date.month,
        day: holiday.date.day,
      },
      indicators: holiday.indicators,
      tooltip: holiday.tooltip
    }));
    persistentCache.set(cacheKey, serializedHolidays, CACHE_TTL.HOLIDAYS);

    return holidays;
  } catch (error) {
    console.error(
      `Failed to fetch holidays for ${countryCode} ${year}:`,
      error
    );
    return [];
  }
}

/**
 * Fetch public holidays for multiple years (parallel requests)
 * Merges results into a single array
 */
export async function getPublicHolidays(
  countryCode: string,
  years: number[]
): Promise<DateInfo[]> {
  // Fetch all years in parallel
  const results = await Promise.all(
    years.map((year) => getPublicHolidaysForYear(countryCode, year))
  );

  // Flatten and merge all results into a single array
  return results.flat();
}

/**
 * Clear cache for a specific country and year
 */
export function clearHolidayCache(countryCode: string, year?: number): void {
  if (year) {
    persistentCache.delete(`holidays_${countryCode}_${year}`);
  } else {
    // Clear all entries for this country
    persistentCache.clearPattern(`^holidays_${countryCode}_`);
  }
}

/**
 * Clear all holiday and country caches
 */
export function clearAllCaches(): void {
  persistentCache.clear();
}