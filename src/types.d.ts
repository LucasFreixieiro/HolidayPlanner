import type { DateValue } from "reka-ui";

export type DateState = 'default' | 'disabled' | 'selected'
export interface DateIndicator {
    id: string;
    color: string;
    label: string;
}

export interface DateInfo {
    date: DateValue;
    indicators: DateIndicator[];
    tooltip: string | null;
}

export interface HolidayMonth {
    placeholder: DateValue; // e.g. new CalendarDate(2026, 1, 1) for January 2026
    holidays: DateInfo[]; // dates within the month that are holidays/break days
    label: string; // e.g. "January 2026"
}