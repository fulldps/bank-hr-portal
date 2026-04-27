<script setup lang="ts">
import { onMounted } from "vue";
import { KanbanBoard } from "@/features/kanban/components";
import { useKanbanStore } from "@/features/kanban/store";

const store = useKanbanStore();
onMounted(() => store.fetchTickets());
</script>

<template>
  <div class="p-6 h-full">
    <KanbanBoard />
  </div>
</template>
