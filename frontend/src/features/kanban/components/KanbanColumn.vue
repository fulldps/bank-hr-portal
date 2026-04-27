<script setup lang="ts">
import { computed } from "vue";
import type { Ticket, TicketStatus } from "@/entities/ticket/types";
import type { KanbanColumn as ColumnType } from "@/entities/ticket/types";
import { STATUS_CONFIG } from "@/entities/ticket/constants";
import KanbanCard from "./KanbanCard.vue";

const props = defineProps<{
  column: ColumnType;
}>();

const emit = defineEmits<{
  (e: "drop", ticketId: string, status: TicketStatus): void;
}>();

const config = computed(() => STATUS_CONFIG[props.column.id]);

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "move";
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  const ticketId = event.dataTransfer?.getData("ticket-id");
  if (ticketId) {
    emit("drop", ticketId, props.column.id);
  }
}
</script>

<template>
  <div class="flex-shrink-0 w-80 flex flex-col max-h-full">
    <!-- Заголовок колонки -->
    <div
      :class="`flex items-center justify-between px-4 py-3 rounded-t-lg border-t-4 ${config.bgColor} border-bnb-border`"
    >
      <h3 :class="`text-sm font-bold ${config.color}`">
        {{ config.label }}
      </h3>
      <span
        :class="`text-xs font-semibold px-2 py-1 rounded-full ${config.bgColor} ${config.color}`"
      >
        {{ column.tickets.length }}
      </span>
    </div>

    <!-- Зона для карточек -->
    <div
      @dragover="handleDragOver"
      @drop="handleDrop"
      class="flex-1 overflow-y-auto p-3 bg-bnb-bg/50 border-x border-b border-bnb-border rounded-b-lg min-h-[200px]"
    >
      <!-- Список карточек -->
      <KanbanCard
        v-for="ticket in column.tickets"
        :key="ticket.id"
        :ticket="ticket"
      />

      <!-- Пустое состояние -->
      <div
        v-if="column.tickets.length === 0"
        class="flex items-center justify-center h-32 text-bnb-text-muted text-sm border-2 border-dashed border-bnb-border rounded-lg"
      >
        Нет тикетов
      </div>
    </div>
  </div>
</template>
