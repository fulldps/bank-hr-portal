<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div
      class="w-12 h-12 rounded-full bg-bnb-bg border border-bnb-border flex items-center justify-center mb-4"
    >
      <svg class="w-5 h-5 text-bnb-text-muted" fill="none" viewBox="0 0 20 20">
        <circle
          cx="10"
          cy="10"
          r="8"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <path
          d="M10 7v4M10 12.5v.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <p class="text-sm font-semibold text-bnb-text">{{ title }}</p>
    <p v-if="description" class="text-xs text-bnb-text-muted mt-1 max-w-xs">
      {{ description }}
    </p>
    <RouterLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="mt-4 px-4 py-2 bg-bnb-primary text-white text-xs font-semibold rounded-lg hover:bg-bnb-primary-hover transition-colors"
    >
      {{ actionLabel }}
    </RouterLink>
  </div>
</template>
