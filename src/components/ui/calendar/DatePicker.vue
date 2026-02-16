<template>
    <Popover v-slot="{ close }">
        <PopoverTrigger as-child>
            <Button variant="outline" class="w-48 justify-between font-normal">
                <span>{{ modelValue?.toString() }}</span>
                <ChevronDownIcon class="ml-2 h-4 w-4" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
            <Calendar v-model="modelValue" layout="month-and-year" :number-of-months="1"
                @update:modelValue="(value) => {
                    if (value) {
                    modelValue = value
                    close()
                    }
                }" 
            />
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import type { Ref } from "vue"
import type { DateValue } from '@internationalized/date';
import { ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const modelValue: Ref<DateValue | DateValue[] | undefined> = defineModel();
</script>