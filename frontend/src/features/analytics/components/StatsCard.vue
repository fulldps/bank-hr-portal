<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "default" | "danger" | "success" | "warning";
}>();
</script>

<template>
  <div
    class="bg-white rounded-xl border border-bnb-border p-5 hover:shadow-md transition-shadow duration-200"
  >
    <p class="text-xs font-medium text-bnb-text-muted mb-1">{{ label }}</p>
    <div class="flex items-end justify-between">
      <p
        class="text-3xl font-bold leading-none"
        :class="{
          'text-bnb-text': accent === 'default' || !accent,
          'text-red-600': accent === 'danger',
          'text-green-600': accent === 'success',
          'text-amber-500': accent === 'warning',
        }"
      >
        {{ value }}
      </p>
      <span
        v-if="trendValue"
        class="text-xs font-semibold px-1.5 py-0.5 rounded mb-1"
        :class="{
          'bg-green-100 text-green-700': trend === 'up',
          'bg-red-100 text-red-700': trend === 'down',
          'bg-gray-100 text-gray-600': trend === 'neutral',
        }"
      >
        {{ trendValue }}
      </span>
    </div>
    <p v-if="sub" class="text-xs text-bnb-text-muted mt-2">{{ sub }}</p>
  </div>
</template>
