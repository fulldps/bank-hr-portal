export type NotificationType =
  | "ticket_assigned"
  | "ticket_resolved"
  | "ticket_comment"
  | "sla_warning"
  | "sla_breached"
  | "task_due"
  | "shift_approved"
  | "shift_rejected"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  userId: string;
  relatedId?: string;
  relatedType?: "ticket" | "task" | "shift";
  createdAt: string;
}
