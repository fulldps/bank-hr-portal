<script setup lang="ts">
import { computed } from "vue";
import type { Ticket } from "@/entities/ticket/types";
import { PRIORITY_CONFIG } from "@/entities/ticket/constants";
import BaseBadge from "@/shared/ui/BaseBadge.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function openDetail() {
  router.push(`/tickets/${props.ticket.id}`);
}

const props = defineProps<{
  ticket: Ticket;
}>();

const priorityConfig = computed(() => PRIORITY_CONFIG[props.ticket.priority]);

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
};

// Для drag-and-drop
function handleDragStart(event: DragEvent) {
  if (!event.dataTransfer) return;

  event.dataTransfer.setData("ticket-id", props.ticket.id);
  event.dataTransfer.effectAllowed = "move";

  // Визуальный эффект при перетаскивании
  const el = event.target as HTMLElement;
  el.classList.add("opacity-50", "scale-95");
}

function handleDragEnd(event: DragEvent) {
  const el = event.target as HTMLElement;
  el.classList.remove("opacity-50", "scale-95");
}
</script>

<template>
  <div
    draggable="true"
    @click.stop="openDetail()"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    class="group bg-white rounded-lg border border-bnb-border p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 hover:border-bnb-primary/30"
  >
    <!-- Заголовок -->
    <h4 class="text-sm font-semibold text-bnb-text mb-2 line-clamp-2">
      {{ ticket.title }}
    </h4>

    <!-- Теги -->
    <div v-if="ticket.tags?.length" class="flex flex-wrap gap-1 mb-3">
      <span
        v-for="tag in ticket.tags"
        :key="tag"
        class="text-[10px] px-2 py-0.5 rounded bg-bnb-bg text-bnb-text-muted"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Мета-информация -->
    <div class="flex items-center justify-between">
      <!-- Приоритет -->
      <BaseBadge
        :label="priorityConfig.label"
        :colorClass="`${priorityConfig.bgColor} ${priorityConfig.color}`"
      />

      <!-- Дата или исполнитель -->
      <div class="flex items-center gap-2">
        <span v-if="ticket.dueDate" class="text-xs text-bnb-text-muted">
          {{ formatDate(ticket.dueDate) }}
        </span>

        <div
          v-if="ticket.assignee"
          class="w-6 h-6 rounded-full bg-bnb-primary-light flex items-center justify-center text-[10px] font-semibold text-bnb-primary"
          :title="ticket.assignee.name"
        >
          {{
            ticket.assignee.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
          }}
        </div>
      </div>
    </div>
  </div>
</template>
