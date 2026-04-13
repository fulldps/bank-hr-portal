<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
});
</script>

<template>
  <button
    :disabled="props.disabled"
    :class="[
      'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Базовые классы для размеров
      props.size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-base',
      // Логика цветов
      {
        'bg-bnb-primary text-white hover:bg-bnb-primaryHover focus:ring-bnb-primary':
          props.variant === 'primary',
        'bg-white text-bnb-text border border-bnb-border hover:bg-bnb-bg focus:ring-gray-200':
          props.variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500':
          props.variant === 'danger',
        'opacity-50 cursor-not-allowed': props.disabled,
      },
    ]"
  >
    <slot />
  </button>
</template>
