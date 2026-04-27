<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useKanbanStore } from "@/features/kanban/store";
import StatusBadge from "@/shared/ui/StatusBadge.vue";
import PriorityBadge from "@/shared/ui/PriorityBadge.vue";
import SlaBadge from "@/shared/ui/SlaBadge.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import SkeletonTable from "@/shared/ui/SkeletonTable.vue";
import EmptyState from "@/shared/ui/EmptyState.vue";
import TicketCreateForm from "@/features/kanban/components/TicketCreateForm.vue";
import type { TicketStatus, TicketPriority } from "@/entities/ticket";

const store = useKanbanStore();
const router = useRouter();
const isFormOpen = ref(false);

const filterStatus = ref<TicketStatus | "">("");
const filterPriority = ref<TicketPriority | "">("");
const search = ref("");

onMounted(() => store.fetchTickets());

const filtered = computed(() => {
  return store.tickets.filter((t) => {
    if (filterStatus.value && t.status !== filterStatus.value) return false;
    if (filterPriority.value && t.priority !== filterPriority.value)
      return false;
    if (
      search.value &&
      !t.title.toLowerCase().includes(search.value.toLowerCase())
    )
      return false;
    return true;
  });
});

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const statusOptions: { value: TicketStatus | ""; label: string }[] = [
  { value: "", label: "Все статусы" },
  { value: "backlog", label: "Бэклог" },
  { value: "todo", label: "К выполнению" },
  { value: "in_progress", label: "В работе" },
  { value: "review", label: "На проверке" },
  { value: "done", label: "Готово" },
];

const priorityOptions: { value: TicketPriority | ""; label: string }[] = [
  { value: "", label: "Все приоритеты" },
  { value: "critical", label: "Критичный" },
  { value: "high", label: "Высокий" },
  { value: "medium", label: "Средний" },
  { value: "low", label: "Низкий" },
];
</script>

<template>
  <div class="p-6 space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Поиск -->
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bnb-text-muted"
            fill="none"
            viewBox="0 0 16 16"
          >
            <circle
              cx="6.5"
              cy="6.5"
              r="4"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M10 10l3.5 3.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Поиск тикетов..."
            class="pl-8 pr-3 h-9 w-56 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          />
        </div>

        <!-- Фильтр статуса -->
        <select
          v-model="filterStatus"
          class="h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
        >
          <option v-for="o in statusOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </select>

        <!-- Фильтр приоритета -->
        <select
          v-model="filterPriority"
          class="h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
        >
          <option v-for="o in priorityOptions" :key="o.value" :value="o.value">
            {{ o.label }}
          </option>
        </select>

        <span class="text-xs text-bnb-text-muted">
          Найдено:
          <span class="font-semibold text-bnb-text">{{ filtered.length }}</span>
        </span>
      </div>

      <BaseButton variant="primary" size="sm" @click="isFormOpen = true">
        + Новый тикет
      </BaseButton>
    </div>

    <!-- Скелетон -->
    <SkeletonTable v-if="store.isLoading" :rows="5" :cols="5" />

    <!-- Пустое состояние -->
    <EmptyState
      v-else-if="filtered.length === 0"
      title="Тикеты не найдены"
      description="Попробуйте изменить фильтры или создайте новый тикет"
    />

    <!-- Таблица -->
    <div
      v-else
      class="bg-white rounded-xl border border-bnb-border overflow-hidden shadow-sm"
    >
      <table class="w-full">
        <thead>
          <tr class="bg-bnb-bg border-b border-bnb-border">
            <th
              class="text-left px-5 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              Тема
            </th>
            <th
              class="text-left px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              Статус
            </th>
            <th
              class="text-left px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              Приоритет
            </th>
            <th
              class="text-left px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              SLA
            </th>
            <th
              class="text-left px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              Исполнитель
            </th>
            <th
              class="text-left px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
            >
              Создан
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-bnb-border">
          <tr
            v-for="ticket in filtered"
            :key="ticket.id"
            class="hover:bg-bnb-bg transition-colors cursor-pointer group"
            @click="router.push(`/tickets/${ticket.id}`)"
          >
            <!-- Тема -->
            <td class="px-5 py-3.5 max-w-xs">
              <p
                class="text-sm font-medium text-bnb-text group-hover:text-bnb-primary transition-colors truncate"
              >
                {{ ticket.title }}
              </p>
              <div v-if="ticket.tags?.length" class="flex gap-1 mt-1 flex-wrap">
                <span
                  v-for="tag in ticket.tags.slice(0, 3)"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.5 rounded bg-bnb-bg text-bnb-text-muted"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <!-- Статус -->
            <td class="px-4 py-3.5">
              <StatusBadge :status="ticket.status" />
            </td>

            <!-- Приоритет -->
            <td class="px-4 py-3.5">
              <PriorityBadge :priority="ticket.priority" />
            </td>

            <!-- SLA -->
            <td class="px-4 py-3.5">
              <SlaBadge :due-date="ticket.dueDate" />
            </td>

            <!-- Исполнитель -->
            <td class="px-4 py-3.5">
              <div v-if="ticket.assignee" class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-bnb-primary flex items-center justify-center flex-shrink-0"
                >
                  <span class="text-white text-[9px] font-bold">
                    {{
                      ticket.assignee.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    }}
                  </span>
                </div>
                <span class="text-xs text-bnb-text truncate max-w-[100px]">
                  {{ ticket.assignee.name }}
                </span>
              </div>
              <span v-else class="text-xs text-bnb-text-muted italic"
                >Не назначен</span
              >
            </td>

            <!-- Дата -->
            <td
              class="px-4 py-3.5 text-xs text-bnb-text-muted whitespace-nowrap"
            >
              {{ formatDate(ticket.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TicketCreateForm v-model="isFormOpen" />
  </div>
</template>
