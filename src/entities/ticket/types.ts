// Статусы колонок канбана
export type TicketStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "done";

// Приоритеты тикетов
export type TicketPriority = "low" | "medium" | "high" | "critical";

// Базовая информация о пользователе
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

// Карточка тикета
export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  order: number; // Для сортировки внутри колонки
}

// Колонка канбана
export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

// Ответ от API (универсальный)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
