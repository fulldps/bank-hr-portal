<script setup lang="ts">
defineProps<{ lines?: number }>();
</script>

<template>
  <div class="bg-white rounded-xl border border-bnb-border p-5 animate-pulse">
    <div class="h-3 bg-gray-200 rounded w-1/3 mb-3" />
    <div class="h-8 bg-gray-200 rounded w-1/2 mb-3" />
    <div
      v-for="i in lines ?? 2"
      :key="i"
      class="h-2.5 bg-gray-100 rounded mb-2"
      :class="i % 2 === 0 ? 'w-3/4' : 'w-full'"
    />
  </div>
</template>
