<script setup lang="ts">
import { useKanbanStore } from "@/features/kanban/store";
import KanbanColumn from "./KanbanColumn.vue";
import type { TicketStatus } from "@/entities/ticket/types";

const store = useKanbanStore();

function handleTicketDrop(ticketId: string, newStatus: TicketStatus) {
  store.moveTicket(ticketId, newStatus);
}
</script>

<template>
  <div class="h-full overflow-x-auto">
    <div class="flex gap-4 h-full min-w-max px-6 pb-6">
      <KanbanColumn
        v-for="column in store.columns"
        :key="column.id"
        :column="column"
        @drop="handleTicketDrop"
      />
    </div>
  </div>
</template>
