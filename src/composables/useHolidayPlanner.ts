import { ref } from 'vue';
import type { DateValue } from '@internationalized/date';
import type { DateIndicator, DateInfo } from '@/types';
import { PublicHolidayIndicator, DefaultHolidayIndicator } from '@/data/indicators';


// Shared state for holiday planning options
const startDate = ref<DateValue | undefined>();
const endDate = ref<DateValue | undefined>();
const holidays = ref<DateInfo[]>([]);
const unavailableDates = ref<DateValue[]>([]);
const ptoDates = ref<DateInfo[]>([]);

export function useHolidayPlanner() {
    const addHoliday = (holiday: DateValue, indicator: DateIndicator = PublicHolidayIndicator): Boolean => {
        if (holiday) {
            holidays.value.push({
                date: holiday,
                indicators: [indicator],
                tooltip: indicator.label
            } as DateInfo);
            return true;
        }
        else {
            return false;
        }
    };

    const removeHoliday = (index: number): Boolean => {
        if (index >= 0 && index < holidays.value.length) {
            holidays.value.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    };

    const addUnavailableDate = (date: DateValue): Boolean => {
        if (date) {
            unavailableDates.value.push(date);
            return true;
        }
        else {
            return false;
        }
    };

    const removeUnavailableDate = (index: number): Boolean => {
        if (index >= 0 && index < unavailableDates.value.length) {
            unavailableDates.value.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    };

    const addPtoDate = (date: DateValue): Boolean => {
        if (date) {
            ptoDates.value.push({
                date,
                indicators: [DefaultHolidayIndicator],
                tooltip: 'PTO'
            } as DateInfo);
            return true;
        }
        else {
            return false;
        }
    };

    const removePtoDate = (index: number): Boolean => {
        if (index >= 0 && index < ptoDates.value.length) {
            ptoDates.value.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    };

    return {
        startDate,
        endDate,
        holidays,
        unavailableDates,
        addHoliday,
        removeHoliday,
        addUnavailableDate,
        removeUnavailableDate,
        addPtoDate,
        removePtoDate,
    }
}