<script setup lang="ts">
import { ref } from 'vue';
import HolidayCalendar from '@/components/HolidayCalendar.vue'
import type { DateIndicator, DateInfo } from './types';
import { CalendarDate } from '@internationalized/date';
import type { DateValue } from "reka-ui"
import HolidayOptions from '@/components/HolidayOptions.vue';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar.vue';

const startDate = new CalendarDate(2026, 1, 1);

const endDate = new CalendarDate(2026, 12, 31);

const PublicHolidayIndicator: DateIndicator = {
  id: "public-holiday",
  color: "bg-red-500",
  label: "Public Holiday",
};

const DefaultHolidayIndicator: DateIndicator = {
  id: "pto",
  color: "bg-gray-500",
  label: "PTO Indicator",
};

const PublicHolidays: DateInfo[] = [
  { date: new CalendarDate(startDate.year, 1, 1), indicators: [PublicHolidayIndicator, DefaultHolidayIndicator], tooltip: 'New Year\'s Day' },
  { date: new CalendarDate(startDate.year, 4, 25), indicators: [PublicHolidayIndicator], tooltip: 'Revolution Day' },
  { date: new CalendarDate(startDate.year, 12, 25), indicators: [PublicHolidayIndicator], tooltip: 'Christmas Day' },
];

const dates = ref<DateInfo[]>([...PublicHolidays]);

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
  <HolidayCalendar :dates="dates as DateInfo[]" :startDate="startDate" :endDate="endDate" @date-selected="handleDateSelected"/>
</template>

<style scoped>
</style>
