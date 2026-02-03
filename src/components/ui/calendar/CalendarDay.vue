<script setup lang="ts">
import type { DateValue } from "reka-ui"
import type { DateInfo } from "@/types"

const props = defineProps<{
  date: DateValue;
  info?: DateInfo;
}>();
</script>

<template>
    <div v-if="info && info.indicators && info.indicators.length > 0"
        class="absolute bottom-1 left-1 right-1 h-1 rounded-full overflow-hidden flex">
      <div v-for="indicator in info.indicators" :key="indicator.id" class="flex-1 first:rounded-l-full last:rounded-r-full" :class="indicator.color"/>
    </div>
</template>