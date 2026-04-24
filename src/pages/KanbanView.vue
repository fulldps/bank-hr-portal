<script setup lang="ts">
import { KanbanBoard } from "@/features/kanban/components";
import { useKanbanStore } from "@/features/kanban/store";
import { onMounted } from "vue";

const store = useKanbanStore();
onMounted(() => store.fetchTickets());
</script>

<template>
  <div class="h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-bnb-text">Канбан-доска</h2>
    </div>
    <KanbanBoard />
  </div>
</template>
