<script setup lang="ts">
import type { Task, TaskStatus } from "@/entities/task";
import { TASK_STATUS_CONFIG } from "@/entities/task";
import TaskCard from "./TaskCard.vue";

const props = defineProps<{
  column: { id: TaskStatus; tasks: Task[] };
}>();

const emit = defineEmits<{
  (e: "drop", taskId: string, status: TaskStatus): void;
}>();

const config = TASK_STATUS_CONFIG[props.column.id];

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  const taskId = e.dataTransfer?.getData("task-id");
  if (taskId) emit("drop", taskId, props.column.id);
}
</script>

<template>
  <div
    class="flex flex-col w-[260px] bg-bnb-bg rounded-xl border border-bnb-border flex-shrink-0"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Заголовок колонки -->
    <div
      class="flex items-center justify-between px-3 py-3 border-b border-bnb-border"
    >
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold" :class="config.color">
          {{ config.label }}
        </span>
      </div>
      <span
        class="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
        :class="[config.bgColor, config.color]"
      >
        {{ column.tasks.length }}
      </span>
    </div>

    <!-- Карточки -->
    <div class="flex-1 overflow-y-auto p-2 min-h-[200px]">
      <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" />
      <div
        v-if="column.tasks.length === 0"
        class="flex items-center justify-center h-20 text-xs text-bnb-text-muted"
      >
        Нет задач
      </div>
    </div>
  </div>
</template>
