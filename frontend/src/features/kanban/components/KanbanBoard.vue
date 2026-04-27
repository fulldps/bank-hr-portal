<script setup lang="ts">
import { ref } from "vue";
import { useKanbanStore } from "@/features/kanban/store";
import KanbanColumn from "./KanbanColumn.vue";
import TicketCreateForm from "./TicketCreateForm.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import type { TicketStatus } from "@/entities/ticket";

const store = useKanbanStore();
const isFormOpen = ref(false);

function handleTicketDrop(ticketId: string, newStatus: TicketStatus) {
  store.moveTicket(ticketId, newStatus);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-bnb-text-muted">
        Всего тикетов:
        <span class="font-semibold text-bnb-text">{{ store.stats.total }}</span>
      </p>
      <BaseButton variant="primary" size="sm" @click="isFormOpen = true">
        + Новый тикет
      </BaseButton>
    </div>

    <!-- Колонки -->
    <div class="overflow-x-auto flex-1">
      <div class="flex gap-4 h-full min-w-max pb-4">
        <KanbanColumn
          v-for="column in store.columns"
          :key="column.id"
          :column="column"
          @drop="handleTicketDrop"
        />
      </div>
    </div>

    <!-- Форма создания -->
    <TicketCreateForm v-model="isFormOpen" />
  </div>
</template>
