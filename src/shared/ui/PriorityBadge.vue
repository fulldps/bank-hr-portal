<script setup lang="ts">
import type { TicketPriority } from "@/entities/ticket";
import { PRIORITY_CONFIG } from "@/entities/ticket";

defineProps<{ priority: TicketPriority }>();
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
    :class="[
      PRIORITY_CONFIG[priority].bgColor,
      PRIORITY_CONFIG[priority].color,
    ]"
  >
    {{ PRIORITY_CONFIG[priority].label }}
  </span>
</template>
