<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useKanbanStore } from "@/features/kanban/store";
import BaseCard from "@/shared/ui/BaseCard.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import StatusBadge from "@/shared/ui/StatusBadge.vue";
import PriorityBadge from "@/shared/ui/PriorityBadge.vue";
import SlaBadge from "@/shared/ui/SlaBadge.vue";
import { STATUS_CONFIG, COLUMN_ORDER } from "@/entities/ticket";
import type { TicketStatus } from "@/entities/ticket";

const route = useRoute();
const router = useRouter();
const store = useKanbanStore();

const ticket = computed(() =>
  store.tickets.find((t) => t.id === route.params.id),
);

function handleStatusChange(e: Event) {
  const newStatus = (e.target as HTMLSelectElement).value as TicketStatus;
  store.updateTicket(ticket.value!.id, { status: newStatus });
}

function handleDelete() {
  if (!confirm("Удалить тикет?")) return;
  store.deleteTicket(ticket.value!.id);
  router.push("/kanban");
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
</script>

<template>
  <div class="p-6 max-w-3xl">
    <!-- Не найден -->
    <div
      v-if="!ticket"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <p class="text-lg font-semibold text-bnb-text">Тикет не найден</p>
      <p class="text-sm text-bnb-text-muted mt-1">Возможно он был удалён</p>
      <BaseButton
        variant="primary"
        class="mt-4"
        @click="router.push('/kanban')"
      >
        Вернуться к доске
      </BaseButton>
    </div>

    <template v-else>
      <!-- Верхняя панель -->
      <div class="flex items-center justify-between mb-6">
        <button
          class="flex items-center gap-2 text-sm text-bnb-text-muted hover:text-bnb-primary transition-colors"
          @click="router.back()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Назад
        </button>

        <BaseButton variant="danger" size="sm" @click="handleDelete">
          Удалить
        </BaseButton>
      </div>

      <!-- Основная карточка -->
      <BaseCard>
        <div class="p-6 space-y-6">
          <!-- Заголовок + бейджи -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-mono text-bnb-text-muted">
                {{ ticket.id }}
              </span>
              <StatusBadge :status="ticket.status" />
              <PriorityBadge :priority="ticket.priority" />
              <SlaBadge :due-date="ticket.dueDate" />
            </div>
            <h1 class="text-xl font-semibold text-bnb-text">
              {{ ticket.title }}
            </h1>
          </div>

          <!-- Описание -->
          <div v-if="ticket.description">
            <p class="text-xs font-medium text-bnb-text-muted mb-1">Описание</p>
            <p class="text-sm text-bnb-text leading-relaxed">
              {{ ticket.description }}
            </p>
          </div>

          <!-- Метаданные -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-bnb-border">
            <!-- Статус (редактируемый) -->
            <div>
              <p class="text-xs font-medium text-bnb-text-muted mb-1">Статус</p>
              <select
                :value="ticket.status"
                class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
                @change="handleStatusChange"
              >
                <option
                  v-for="status in COLUMN_ORDER"
                  :key="status"
                  :value="status"
                >
                  {{ STATUS_CONFIG[status].label }}
                </option>
              </select>
            </div>

            <!-- Исполнитель -->
            <div>
              <p class="text-xs font-medium text-bnb-text-muted mb-1">
                Исполнитель
              </p>
              <div v-if="ticket.assignee" class="flex items-center gap-2 h-9">
                <div
                  class="w-6 h-6 rounded-full bg-bnb-primary flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-white text-[9px] font-bold">
                    {{
                      ticket.assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    }}
                  </span>
                </div>
                <span class="text-sm text-bnb-text">
                  {{ ticket.assignee.name }}
                </span>
              </div>
              <p
                v-else
                class="text-sm text-bnb-text-muted h-9 flex items-center"
              >
                Не назначен
              </p>
            </div>

            <!-- Срок -->
            <div>
              <p class="text-xs font-medium text-bnb-text-muted mb-1">Срок</p>
              <p class="text-sm text-bnb-text h-9 flex items-center">
                {{ formatDate(ticket.dueDate) }}
              </p>
            </div>

            <!-- Создан -->
            <div>
              <p class="text-xs font-medium text-bnb-text-muted mb-1">Создан</p>
              <p class="text-sm text-bnb-text h-9 flex items-center">
                {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Теги -->
          <div v-if="ticket.tags?.length">
            <p class="text-xs font-medium text-bnb-text-muted mb-2">Теги</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in ticket.tags"
                :key="tag"
                class="px-2 py-0.5 text-xs bg-bnb-bg border border-bnb-border rounded-md text-bnb-text-muted"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>
