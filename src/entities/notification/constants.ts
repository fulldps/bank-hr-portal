import type { NotificationType } from "./types";

export const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { icon: string; bgColor: string; color: string }
> = {
  ticket_assigned: {
    icon: "ticket",
    bgColor: "bg-blue-100",
    color: "text-blue-700",
  },
  ticket_resolved: {
    icon: "check",
    bgColor: "bg-green-100",
    color: "text-green-700",
  },
  ticket_comment: {
    icon: "comment",
    bgColor: "bg-blue-100",
    color: "text-blue-700",
  },
  sla_warning: {
    icon: "clock",
    bgColor: "bg-amber-100",
    color: "text-amber-700",
  },
  sla_breached: { icon: "clock", bgColor: "bg-red-100", color: "text-red-700" },
  task_due: {
    icon: "task",
    bgColor: "bg-orange-100",
    color: "text-orange-700",
  },
  shift_approved: {
    icon: "check",
    bgColor: "bg-green-100",
    color: "text-green-700",
  },
  shift_rejected: { icon: "x", bgColor: "bg-red-100", color: "text-red-700" },
  system: { icon: "info", bgColor: "bg-gray-100", color: "text-gray-600" },
};
