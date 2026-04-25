<script setup lang="ts">
defineProps<{
  message: string;
  variant?: "success" | "error" | "warning" | "info";
}>();

defineEmits<{ (e: "close"): void }>();
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-sm"
    :class="{
      'bg-green-50 border-green-200 text-green-800': variant === 'success',
      'bg-red-50 border-red-200 text-red-800': variant === 'error',
      'bg-amber-50 border-amber-200 text-amber-800': variant === 'warning',
      'bg-bnb-primary-light border-bnb-border text-bnb-primary':
        !variant || variant === 'info',
    }"
  >
    <!-- Иконка -->
    <svg
      v-if="variant === 'success'"
      class="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2" />
      <path
        d="M5 8l2.5 2.5L11 5.5"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      v-else-if="variant === 'error'"
      class="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2" />
      <path
        d="M5.5 5.5l5 5M10.5 5.5l-5 5"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
    <svg
      v-else-if="variant === 'warning'"
      class="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 2L14.5 13H1.5L8 2z"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linejoin="round"
      />
      <path
        d="M8 7v3M8 11.5v.5"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.2" />
      <path
        d="M8 7v4M8 5.5v.5"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>

    <span class="text-xs font-medium flex-1">{{ message }}</span>

    <button
      class="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
      @click="$emit('close')"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 12 12">
        <path
          d="M2 2l8 8M10 2L2 10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>
