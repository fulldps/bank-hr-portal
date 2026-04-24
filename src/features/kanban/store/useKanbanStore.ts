import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Ticket, TicketStatus } from "@/entities/ticket/types";
import { COLUMN_ORDER, STATUS_CONFIG } from "@/entities/ticket/constants";

// Моковые данные для разработки
const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    title: "Настроить CI/CD пайплайн",
    description: "Интегрировать GitHub Actions для автоматического деплоя",
    status: "todo",
    priority: "high",
    assigneeId: "user-1",
    assignee: { id: "user-1", name: "Александр Иванов" },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-20T18:00:00Z",
    tags: ["devops", "urgent"],
    order: 0,
  },
  {
    id: "TKT-002",
    title: "Исправить баг с авторизацией",
    description: "Пользователи не могут войти через SSO",
    status: "in_progress",
    priority: "critical",
    assigneeId: "user-2",
    assignee: { id: "user-2", name: "Мария Петрова" },
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    dueDate: "2024-01-16T18:00:00Z",
    tags: ["bug", "auth"],
    order: 0,
  },
  {
    id: "TKT-003",
    title: "Обновить документацию API",
    status: "backlog",
    priority: "low",
    assigneeId: "user-1",
    assignee: { id: "user-1", name: "Александр Иванов" },
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-10T14:00:00Z",
    tags: ["docs"],
    order: 0,
  },
  {
    id: "TKT-004",
    title: "Реализовать экспорт в Excel",
    status: "review",
    priority: "medium",
    assigneeId: "user-3",
    assignee: { id: "user-3", name: "Иван Сидоров" },
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    dueDate: "2024-01-18T18:00:00Z",
    tags: ["feature", "reporting"],
    order: 0,
  },
  {
    id: "TKT-005",
    title: "Оптимизировать запросы к БД",
    status: "done",
    priority: "medium",
    assigneeId: "user-2",
    assignee: { id: "user-2", name: "Мария Петрова" },
    createdAt: "2024-01-08T10:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    tags: ["performance"],
    order: 0,
  },
];

export const useKanbanStore = defineStore("kanban", () => {
  // State
  const tickets = ref<Ticket[]>(MOCK_TICKETS);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters: сгруппированные тикеты по колонкам
  const columns = computed(() => {
    return COLUMN_ORDER.map((status) => ({
      id: status,
      title: STATUS_CONFIG[status].label,
      tickets: tickets.value
        .filter((ticket) => ticket.status === status)
        .sort((a, b) => a.order - b.order),
    }));
  });

  // Getters: статистика
  const stats = computed(() => ({
    total: tickets.value.length,
    byStatus: COLUMN_ORDER.reduce(
      (acc, status) => {
        acc[status] = tickets.value.filter((t) => t.status === status).length;
        return acc;
      },
      {} as Record<string, number>,
    ),
    byPriority: {
      critical: tickets.value.filter((t) => t.priority === "critical").length,
      high: tickets.value.filter((t) => t.priority === "high").length,
    },
  }));

  // Actions: перемещение тикета между колонками
  function moveTicket(ticketId: string, newStatus: TicketStatus) {
    const ticket = tickets.value.find((t) => t.id === ticketId);
    if (!ticket) {
      error.value = `Тикет ${ticketId} не найден`;
      return;
    }

    const oldStatus = ticket.status;
    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    ticket.order = tickets.value.filter((t) => t.status === newStatus).length;

    // Здесь будет API call
    // await api.updateTicket(ticketId, { status: newStatus })
  }

  // Actions: создание нового тикета
  function createTicket(
    ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "order">,
  ) {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${String(tickets.value.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      order: tickets.value.filter((t) => t.status === ticketData.status).length,
    };

    tickets.value.push(newTicket);
    return newTicket;
  }

  // Actions: обновление тикета
  function updateTicket(ticketId: string, updates: Partial<Ticket>) {
    const ticket = tickets.value.find((t) => t.id === ticketId);
    if (!ticket) {
      error.value = `Тикет ${ticketId} не найден`;
      return null;
    }

    Object.assign(ticket, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return ticket;
  }

  // Actions: удаление тикета
  function deleteTicket(ticketId: string) {
    const index = tickets.value.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      error.value = `Тикет ${ticketId} не найден`;
      return false;
    }

    tickets.value.splice(index, 1);
    return true;
  }

  // Actions: загрузка данных (для будущего API)
  async function fetchTickets() {
    isLoading.value = true;
    error.value = null;

    try {
      // Имитация API запроса
      await new Promise((resolve) => setTimeout(resolve, 500));
      // В реальности: const response = await api.getTickets()
      // tickets.value = response.data
    } catch (err) {
      error.value = "Не удалось загрузить тикеты";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    tickets,
    isLoading,
    error,
    // Getters
    columns,
    stats,
    // Actions
    moveTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    fetchTickets,
  };
});
