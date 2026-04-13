<script setup lang="ts">
// colorClass: класс Tailwind для фона и текста
defineProps<{
  label: string;
  colorClass: string;
}>();
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colorClass,
    ]"
  >
    {{ label }}
  </span>
</template>
