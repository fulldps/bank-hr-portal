<script setup lang="ts">
import type { NotificationType } from "@/entities/notification";

defineProps<{ type: NotificationType }>();
</script>

<template>
  <!-- ticket / ticket_assigned / ticket_comment -->
  <svg
    v-if="type.startsWith('ticket')"
    class="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 14 14"
  >
    <rect
      x="1"
      y="1"
      width="12"
      height="12"
      rx="2"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <path
      d="M1 5h12M4 1v4"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>

  <!-- sla -->
  <svg
    v-else-if="type.startsWith('sla')"
    class="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 14 14"
  >
    <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2" />
    <path
      d="M7 4v3l2 1.5"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>

  <!-- task -->
  <svg
    v-else-if="type === 'task_due'"
    class="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      d="M2 4h10M2 7h6M2 10h8"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>

  <!-- shift -->
  <svg
    v-else-if="type.startsWith('shift')"
    class="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 14 14"
  >
    <rect
      x="1"
      y="2"
      width="12"
      height="11"
      rx="1.5"
      stroke="currentColor"
      stroke-width="1.2"
    />
    <path
      d="M1 6h12M5 1v2M9 1v2"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>

  <!-- system / default -->
  <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
    <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2" />
    <path
      d="M7 6v4M7 4.5v.5"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>
</template>
