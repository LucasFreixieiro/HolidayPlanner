<template>
  <div class="max-w-5xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Plan Your Time Off</h1>
      <p class="text-muted-foreground mt-2">
        Configure your holiday preferences to find the optimal vacation dates
      </p>
    </div>

    <form class="space-y-8">
      <!-- Date Range Section -->
      <div class="rounded-lg border bg-card p-6">
        <h2 class="text-xl font-semibold mb-6">Date Range</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <Field orientation="vertical">
            <FieldLabel>Start Date</FieldLabel>
            <FieldContent>
              <DatePicker v-model="startDate" placeholder="Select start date" />
              <FieldDescription>
                The first day of your planning period
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel>End Date</FieldLabel>
            <FieldContent>
              <DatePicker v-model="endDate" placeholder="Select end date" />
              <FieldDescription>
                The last day of your planning period
              </FieldDescription>
            </FieldContent>
          </Field>
        </div>
      </div>

      <!-- Location & Holidays Section -->
      <div class="rounded-lg border bg-card p-6">
        <h2 class="text-xl font-semibold mb-6">Location & Holidays</h2>
        <div class="space-y-6">
          <Field orientation="vertical">
            <FieldLabel>Country</FieldLabel>
            <FieldContent>
              <NativeSelect v-model="country" class="w-full" :disabled="loadingCountries">
                <NativeSelectOption value="">
                  {{ loadingCountries ? 'Loading countries...' : 'Select a country' }}
                </NativeSelectOption>
                <NativeSelectOption 
                  v-for="c in countries" 
                  :key="c.countryCode" 
                  :value="c.countryCode"
                >
                  {{ c.name }}
                </NativeSelectOption>
              </NativeSelect>
              <FieldDescription>
                Used to automatically load public holidays
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="vertical">
            <FieldLabel>Additional Holidays</FieldLabel>
            <FieldContent>
              <div class="space-y-2">
                <div class="flex gap-2">
                  <DatePicker v-model="newHoliday" placeholder="Select holiday date" />
                  <button
                    type="button"
                    @click="handleAddHoliday"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                  >
                    Add
                  </button>
                </div>
                <div v-if="holidays.length > 0" class="flex flex-wrap gap-2 mt-3">
                  <span
                    v-for="(holiday, index) in holidays"
                    :key="index"
                    class="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {{ holiday.date }}
                    <button
                      type="button"
                      @click="removeHoliday(index)"
                      class="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>
              <FieldDescription>
                Add custom holidays or company-specific days off
              </FieldDescription>
            </FieldContent>
          </Field>
        </div>
      </div>

      <!-- Unavailable Dates Section -->
      <div class="rounded-lg border bg-card p-6">
        <h2 class="text-xl font-semibold mb-6">Unavailable Dates</h2>
        <Field orientation="vertical">
          <FieldLabel>Dates You Cannot Take Off</FieldLabel>
          <FieldContent>
            <div class="space-y-2">
              <div class="flex gap-2">
                <DatePicker
                  v-model="newUnavailableDate"
                  placeholder="Select a date"
                  class="flex-1"
                />
                <button
                  type="button"
                  @click="handleAddUnavailableDate"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                >
                  Add
                </button>
              </div>
              <!-- <div v-if="unavailableDates.length > 0" class="flex flex-wrap gap-2 mt-3">
                <span
                  v-for="(date, index) in unavailableDates"
                  :key="index"
                  class="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-3 py-1 text-sm"
                >
                  {{ formatDate(date) }}
                  <button
                    type="button"
                    @click="removeUnavailableDate(index)"
                    class="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </span>
              </div> -->
            </div>
            <FieldDescription>
              Important meetings, deadlines, or other commitments
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>

      <!-- Preferences Section -->
      <div class="rounded-lg border bg-card p-6">
        <h2 class="text-xl font-semibold mb-6">Preferences</h2>
        <div class="space-y-6">
          <Field orientation="vertical">
            <FieldLabel>Days Off to Use</FieldLabel>
            <FieldContent>
              <input
                v-model.number="numberOfDaysOff"
                type="number"
                min="0"
                max="365"
                placeholder="0"
                class="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full md:w-48 min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
              <FieldDescription>
                Number of PTO/vacation days you want to use
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                id="includeWeekends"
                v-model="includeWeekends"
                class="h-4 w-4 rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary cursor-pointer"
              />
              <div class="space-y-1">
                <FieldLabel for="includeWeekends" class="cursor-pointer">
                  Include Weekends in Planning
                </FieldLabel>
                <FieldDescription>
                  Count weekends when calculating optimal vacation periods
                </FieldDescription>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
        >
          Reset
        </button>
        <button
          type="submit"
          :disabled="loadingHolidays"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
        >
          {{ loadingHolidays ? 'Loading holidays...' : 'Find Optimal Dates' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { type DateValue } from '@internationalized/date'
import { ref, watch } from 'vue';
import { NativeSelectOption, NativeSelect } from "@/components/ui/native-select";
import { Field, FieldLabel, FieldDescription, FieldContent } from "@/components/ui/field";
import { DatePicker } from "@/components/ui/calendar";
import { getAvailableCountries, getPublicHolidays } from '@/services/HolidayApi';
import type { Country } from '@/services/HolidayApi';
import { useHolidayPlanner } from '@/composables/useHolidayPlanner';
const { startDate, endDate, holidays, addHoliday, removeHoliday, addUnavailableDate } = useHolidayPlanner();

// Form data
const country = ref('');
const countries = ref<Country[]>([]);
const numberOfDaysOff = ref(0);
const includeWeekends = ref(false);

// Loading states
const loadingCountries = ref(false);
const loadingHolidays = ref(false);

// Load countries
loadingCountries.value = true;
getAvailableCountries().then((data) => {
  countries.value = data;
})
.catch((error) => {
  console.error(`Failed to load countries: ${error}`)
})
.finally(() => {
  loadingCountries.value = false;
});

// Temporary input values
const newHoliday = ref<DateValue | undefined>();
const newUnavailableDate = ref<DateValue | undefined>();

const handleAddHoliday = () => {
  if (newHoliday.value) {
    addHoliday(newHoliday.value);
    newHoliday.value = undefined;
  }
};

const handleAddUnavailableDate = () => {
  if (newUnavailableDate.value) {
    addUnavailableDate(newUnavailableDate.value);
    newUnavailableDate.value = undefined;
  }
};

watch([country, startDate, endDate], async ([c, s, e]) => {
  if(!c) {
    holidays.value = [];
    return;
  }

  const fromYear = s?.year ?? new Date().getFullYear();
  const toYear = e?.year ?? fromYear;
  const years = Array.from(new Set([fromYear, toYear]));
  
  loadingHolidays.value = true;
  getPublicHolidays(c, years)
  .then((publicHolidays) => {
    holidays.value = publicHolidays;
  })
  .catch((error) => {
    console.error(`Failed to load public holidays: ${error}`);
  })
  .finally(() => {
    loadingHolidays.value = false;
  });
});
</script>

<!-- const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  country: z.string(),
  holidays: z.array(z.string()),
  unavailableDates: z.array(z.date()),
  numberOfDaysOff: z.number().int().min(0),
  includeWeekends: z.boolean(),
}); -->