<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/features/tasks/store";
import TaskColumn from "./TaskColumn.vue";
import TaskCreateForm from "./TaskCreateForm.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import type { TaskStatus } from "@/entities/task";

const store = useTaskStore();
const isFormOpen = ref(false);

function handleDrop(taskId: string, newStatus: TaskStatus) {
  store.moveTask(taskId, newStatus);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <p class="text-sm text-bnb-text-muted">
          Всего задач:
          <span class="font-semibold text-bnb-text">{{
            store.stats.total
          }}</span>
        </p>
        <p
          v-if="store.stats.overdue > 0"
          class="text-sm text-red-500 font-medium"
        >
          Просрочено: {{ store.stats.overdue }}
        </p>
      </div>
      <BaseButton variant="primary" size="sm" @click="isFormOpen = true">
        + Новая задача
      </BaseButton>
    </div>

    <!-- Колонки -->
    <div class="overflow-x-auto flex-1">
      <div class="flex gap-4 min-w-max pb-4">
        <TaskColumn
          v-for="column in store.columns"
          :key="column.id"
          :column="column"
          @drop="handleDrop"
        />
      </div>
    </div>

    <TaskCreateForm v-model="isFormOpen" />
  </div>
</template>
