<script setup lang="ts">
defineProps<{ rows?: number; cols?: number }>();
</script>

<template>
  <div
    class="bg-white rounded-xl border border-bnb-border overflow-hidden animate-pulse"
  >
    <!-- Header -->
    <div class="flex gap-4 px-5 py-3 border-b border-bnb-border bg-bnb-bg">
      <div
        v-for="i in cols ?? 4"
        :key="i"
        class="h-3 bg-gray-200 rounded flex-1"
      />
    </div>
    <!-- Rows -->
    <div
      v-for="row in rows ?? 5"
      :key="row"
      class="flex gap-4 px-5 py-4 border-b border-bnb-border last:border-0"
    >
      <div
        v-for="col in cols ?? 4"
        :key="col"
        class="h-3 bg-gray-100 rounded flex-1"
        :class="col === 1 ? 'flex-[2]' : ''"
      />
    </div>
  </div>
</template>
