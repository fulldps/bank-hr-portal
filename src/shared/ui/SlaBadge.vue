<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ dueDate?: string }>();

const sla = computed(() => {
  if (!props.dueDate) return null;
  const diff = new Date(props.dueDate).getTime() - Date.now();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (diff < 0)
    return { label: "SLA нарушен", classes: "bg-red-100 text-red-700" };
  if (hours < 2)
    return {
      label: `${minutes}м осталось`,
      classes: "bg-orange-100 text-orange-700",
    };
  if (hours < 24)
    return {
      label: `${hours}ч осталось`,
      classes: "bg-yellow-100 text-yellow-700",
    };
  return {
    label: `${Math.floor(hours / 24)}д осталось`,
    classes: "bg-green-100 text-green-700",
  };
});
</script>

<template>
  <span
    v-if="sla"
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
    :class="sla.classes"
  >
    <svg class="w-3 h-3" fill="none" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2" />
      <path
        d="M6 3v3l2 1.5"
        stroke="currentColor"
        stroke-width="1.2"
        stroke-linecap="round"
      />
    </svg>
    {{ sla.label }}
  </span>
</template>
