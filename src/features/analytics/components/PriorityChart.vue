<script setup lang="ts">
import { computed } from "vue";
import type { PriorityStats } from "@/entities/analytics";

const props = defineProps<{ data: PriorityStats }>();

const total = computed(
  () =>
    props.data.critical + props.data.high + props.data.medium + props.data.low,
);

const items = computed(() => [
  {
    label: "Критичный",
    value: props.data.critical,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
  {
    label: "Высокий",
    value: props.data.high,
    color: "bg-orange-400",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
  },
  {
    label: "Средний",
    value: props.data.medium,
    color: "bg-yellow-400",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  {
    label: "Низкий",
    value: props.data.low,
    color: "bg-blue-400",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
]);

function percent(value: number): number {
  if (total.value === 0) return 0;
  return Math.round((value / total.value) * 100);
}
</script>

<template>
  <div class="bg-white rounded-xl border border-bnb-border p-5">
    <p class="text-sm font-semibold text-bnb-text mb-4">По приоритетам</p>

    <div class="space-y-3">
      <div v-for="item in items" :key="item.label">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-bnb-text">{{
            item.label
          }}</span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-bnb-text">{{
              item.value
            }}</span>
            <span class="text-[11px] text-bnb-text-muted"
              >{{ percent(item.value) }}%</span
            >
          </div>
        </div>
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="item.color"
            :style="{ width: percent(item.value) + '%' }"
          />
        </div>
      </div>
    </div>

    <div
      class="mt-4 pt-3 border-t border-bnb-border flex items-center justify-between"
    >
      <span class="text-xs text-bnb-text-muted">Всего тикетов</span>
      <span class="text-sm font-bold text-bnb-text">{{ total }}</span>
    </div>
  </div>
</template>
