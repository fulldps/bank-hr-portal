export type TicketStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "done";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string;
  assignee?: User;
  author?: User;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  order: number;
}

export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
