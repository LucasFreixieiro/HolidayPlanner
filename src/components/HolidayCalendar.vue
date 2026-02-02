<template>
  <Calendar
      class="rounded-md border shadow-sm"
      :placeholder="startDate"
      :multiple="true"
      :numberOfMonths="numberOfMonths"
      :pagedNavigation="true"
      :isDateDisabled="(date) => isWeekend(date, 'en')"
      :minValue="startDate"
      :disableDaysOutsideCurrentView="true"
      v-model="selectedDates"
    >
    <template #calendar-heading="{date}">
      <div class="flex items-center justify-center gap-1">
        {{ formatter.custom(toDate(date), { year: 'numeric' }) }}
      </div>
    </template>
    <template #calendar-grid-heading="{month}">
      <div class="text-center font-medium pb-2">
        {{ formatter.custom(toDate(month.value), { month: 'long' }) }}
      </div>
    </template>
    <template #calendar-cell="{ date }">
      <CalendarDay  v-if="getDateInfo(date)" :date="date" :info="getDateInfo(date)"/>
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { useDateFormatter } from "reka-ui"
import type { DateValue, PrimitiveProps } from "reka-ui"
import type { DateInfo } from "@/types"
import { toDate } from "reka-ui/date"
import { Calendar, CalendarDay } from "@/components/ui/calendar";
import { isWeekend, today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { computed } from "vue";

export interface HolidayCalendarProps extends PrimitiveProps {
  startDate?: CalendarDate;
  endDate?: CalendarDate;
  dates: DateInfo[];
}
const props = withDefaults(defineProps<HolidayCalendarProps>(), {
  startDate: () =>today(getLocalTimeZone()).set({ month: 1, day: 1 }),
  endDate: () => today(getLocalTimeZone()).set({ month: 12, day: 31 }),
  dates: () => []
})

const emit = defineEmits<{
  (e: 'date-selected', dates: DateValue[]): void;
}>();

const formatter = useDateFormatter("en");

const numberOfMonths = props.endDate && props.startDate ? 
  (props.endDate.year - props.startDate.year) * 12 + (props.endDate.month - props.startDate.month + 1) 
  : 12;

// Map DateInfo[] to DateValue[] for Calendar v-model
const selectedDates = computed<DateValue[]>({
  get() {
    return props.dates.map(info => info.date);
  },
  set(newDates: DateValue[]) {
    emit('date-selected', newDates);
  }
});

// Create lookup map: DateValue string -> DateInfo for quick access to indicators
const dateInfoMap = computed(() => {
  const map = new Map<string, DateInfo>();
  props.dates.forEach(dateInfo => {
    const key = `${dateInfo.date.year}-${dateInfo.date.month}-${dateInfo.date.day}`;
    map.set(key, dateInfo);
  });
  return map;
});

// Helper to get indicators for a specific date
const getDateInfo = (dateValue: any) => {
  const key = `${dateValue.year}-${dateValue.month}-${dateValue.day}`;
  return dateInfoMap.value.get(key);
};
</script>

<style scoped>
</style>