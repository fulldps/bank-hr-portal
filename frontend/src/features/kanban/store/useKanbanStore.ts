import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Ticket, TicketStatus } from "@/entities/ticket";
import { COLUMN_ORDER, STATUS_CONFIG } from "@/entities/ticket";
import { api } from "@/shared/api/client";

export const useKanbanStore = defineStore("kanban", () => {
  const tickets = ref<Ticket[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const columns = computed(() =>
    COLUMN_ORDER.map((status) => ({
      id: status,
      title: STATUS_CONFIG[status].label,
      tickets: tickets.value
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order),
    })),
  );

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

  async function fetchTickets(filters?: {
    status?: string;
    priority?: string;
  }) {
    isLoading.value = true;
    error.value = null;
    try {
      const params = new URLSearchParams(
        filters as Record<string, string>,
      ).toString();
      const url = `/tickets${params ? `?${params}` : ""}`;
      const data = await api.get<Ticket[]>(url);
      tickets.value = data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTicket(
    ticketData: Omit<
      Ticket,
      "id" | "createdAt" | "updatedAt" | "order" | "author"
    >,
  ) {
    try {
      const created = await api.post<Ticket>("/tickets", ticketData);
      tickets.value.unshift({ ...created, order: 0 });
      return created;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function moveTicket(ticketId: string, newStatus: TicketStatus) {
    const ticket = tickets.value.find((t) => t.id === ticketId);
    if (!ticket) return;

    const oldStatus = ticket.status;
    ticket.status = newStatus;

    try {
      await api.patch(`/tickets/${ticketId}`, { status: newStatus });
    } catch (e: any) {
      ticket.status = oldStatus;
      error.value = e.message;
    }
  }

  async function updateTicket(ticketId: string, updates: Partial<Ticket>) {
    try {
      const updated = await api.patch<Ticket>(`/tickets/${ticketId}`, updates);
      const index = tickets.value.findIndex((t) => t.id === ticketId);
      if (index !== -1)
        tickets.value[index] = { ...tickets.value[index], ...updated };
      return updated;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  async function deleteTicket(ticketId: string) {
    try {
      await api.delete(`/tickets/${ticketId}`);
      tickets.value = tickets.value.filter((t) => t.id !== ticketId);
      return true;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    }
  }

  return {
    tickets,
    isLoading,
    error,
    columns,
    stats,
    fetchTickets,
    createTicket,
    moveTicket,
    updateTicket,
    deleteTicket,
  };
});
