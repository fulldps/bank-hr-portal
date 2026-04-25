<script setup lang="ts">
import type { Shift } from "@/entities/shift";
import { SHIFT_TYPE_CONFIG } from "@/entities/shift";

defineProps<{ shift?: Shift }>();
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <span
      v-if="shift"
      class="text-[11px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap"
      :class="[
        SHIFT_TYPE_CONFIG[shift.type].bgColor,
        SHIFT_TYPE_CONFIG[shift.type].color,
      ]"
      :title="SHIFT_TYPE_CONFIG[shift.type].label"
    >
      {{ SHIFT_TYPE_CONFIG[shift.type].short }}
      <span v-if="shift.overtimeMinutes > 0" class="ml-0.5 text-amber-600"
        >↑</span
      >
    </span>
    <span v-else class="text-[11px] text-bnb-text-muted">—</span>
  </div>
</template>
