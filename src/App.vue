<script setup lang="ts">
import { computed } from 'vue';
import HolidayCalendar from '@/components/HolidayCalendar.vue'
import type { DateInfo } from './types';
import { CalendarDate } from '@internationalized/date';
import type { DateValue } from "reka-ui"
import HolidayOptions from '@/components/HolidayOptions.vue';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar.vue';
import { useHolidayPlanner } from './composables/useHolidayPlanner';
import { DefaultHolidayIndicator } from '@/data/indicators';

const { holidays } = useHolidayPlanner();

const startDate = new CalendarDate(2026, 1, 1);

const endDate = new CalendarDate(2026, 12, 31);

const dates = computed({
  get() {
    const _holidays = holidays.value as DateInfo[];
    return [...new Set([..._holidays])];
  },
  set(value) {
    holidays.value = value;
  }
});

function handleDateSelected(selectedDates: DateValue[]) {
  let newDatesArr = [...dates.value as DateInfo[]];
  newDatesArr = newDatesArr.filter(d => {
    return selectedDates.some(date => d.date.compare(date as DateValue) === 0)
  });

  for (const date of selectedDates) {
    const index = newDatesArr.findIndex(d =>
      d.date.compare(date as DateValue) === 0
    );
    if (index >= 0) continue;
    else {
      newDatesArr.push({ date, indicators: [DefaultHolidayIndicator], tooltip: "PTO" });
    }
  }
  dates.value = newDatesArr;
}
</script>

<template>
  <Navbar class="w-full" />
  
  <Card class="m-10 w-auto">
    <HolidayOptions />
  </Card>
  <HolidayCalendar class="bg-card text-card-foreground m-10" :startDate="startDate" :endDate="endDate" @date-selected="handleDateSelected" :dates="dates as DateInfo[]"></HolidayCalendar>
</template>

<style scoped>
</style>
