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
         :class="info.indicators[0]?.color + ' absolute bottom-1 left-1 right-1 h-1 rounded-full'">
    </div>
</template>