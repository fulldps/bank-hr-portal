<script setup lang="ts">
import { computed } from "vue";
import type { TrendPoint } from "@/entities/analytics";

const props = defineProps<{ data: TrendPoint[] }>();

const maxValue = computed(() =>
  Math.max(...props.data.flatMap((d) => [d.tickets, d.resolved]), 1),
);

function barHeight(value: number): number {
  return Math.round((value / maxValue.value) * 100);
}
</script>

<template>
  <div class="bg-white rounded-xl border border-bnb-border p-5">
    <p class="text-sm font-semibold text-bnb-text mb-4">Активность за 7 дней</p>

    <!-- Легенда -->
    <div class="flex items-center gap-4 mb-4">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-bnb-primary" />
        <span class="text-xs text-bnb-text-muted">Создано</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-green-500" />
        <span class="text-xs text-bnb-text-muted">Решено</span>
      </div>
    </div>

    <!-- График -->
    <div class="flex items-end justify-between gap-2 h-32">
      <div
        v-for="point in data"
        :key="point.date"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <div class="w-full flex items-end justify-center gap-0.5 h-24">
          <!-- Создано -->
          <div
            class="flex-1 bg-bnb-primary rounded-t transition-all duration-500"
            :style="{ height: barHeight(point.tickets) + '%' }"
            :title="`Создано: ${point.tickets}`"
          />
          <!-- Решено -->
          <div
            class="flex-1 bg-green-500 rounded-t transition-all duration-500"
            :style="{ height: barHeight(point.resolved) + '%' }"
            :title="`Решено: ${point.resolved}`"
          />
        </div>
        <span class="text-[10px] text-bnb-text-muted">{{ point.date }}</span>
      </div>
    </div>
  </div>
</template>
