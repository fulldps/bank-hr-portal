<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "@/entities/task";
import { TASK_PRIORITY_CONFIG } from "@/entities/task";

const props = defineProps<{ task: Task }>();

const priority = computed(() => TASK_PRIORITY_CONFIG[props.task.priority]);

const isOverdue = computed(
  () =>
    props.task.dueDate &&
    new Date(props.task.dueDate) < new Date() &&
    props.task.status !== "done",
);

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

function handleDragStart(e: DragEvent) {
  if (!e.dataTransfer) return;
  e.dataTransfer.setData("task-id", props.task.id);
  e.dataTransfer.effectAllowed = "move";
  (e.target as HTMLElement).classList.add("opacity-50");
}

function handleDragEnd(e: DragEvent) {
  (e.target as HTMLElement).classList.remove("opacity-50");
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    class="bg-white rounded-lg border border-bnb-border p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-bnb-primary/30 transition-all duration-200"
  >
    <!-- Приоритет -->
    <div class="flex items-center justify-between mb-2">
      <span
        class="text-[10px] font-semibold px-1.5 py-0.5 rounded"
        :class="[priority.bgColor, priority.color]"
      >
        {{ priority.label }}
      </span>
      <span
        v-if="task.ticketId"
        class="text-[10px] text-bnb-text-muted font-mono"
      >
        {{ task.ticketId }}
      </span>
    </div>

    <!-- Заголовок -->
    <p class="text-sm font-medium text-bnb-text leading-snug line-clamp-2 mb-2">
      {{ task.title }}
    </p>

    <!-- Теги -->
    <div v-if="task.tags?.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="text-[10px] px-1.5 py-0.5 rounded bg-bnb-bg text-bnb-text-muted"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Футер -->
    <div class="flex items-center justify-between mt-2">
      <span
        v-if="task.dueDate"
        class="text-[11px] font-medium"
        :class="isOverdue ? 'text-red-500' : 'text-bnb-text-muted'"
      >
        {{ isOverdue ? "⚠ " : "" }}{{ formatDate(task.dueDate) }}
      </span>
      <span v-else />

      <div
        v-if="task.assigneeName"
        class="w-6 h-6 rounded-full bg-bnb-primary flex items-center justify-center flex-shrink-0"
        :title="task.assigneeName"
      >
        <span class="text-white text-[9px] font-bold">
          {{
            task.assigneeName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          }}
        </span>
      </div>
    </div>
  </div>
</template>
