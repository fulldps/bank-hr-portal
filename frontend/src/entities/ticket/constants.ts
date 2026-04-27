import type { TicketStatus, TicketPriority } from "./types";

// Конфигурация статусов для колонок
export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bgColor: string }
> = {
  backlog: {
    label: "Бэклог",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  todo: {
    label: "Нужно сделать",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  in_progress: {
    label: "В работе",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  review: {
    label: "На проверке",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  done: {
    label: "Готово",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
};

// Конфигурация приоритетов
export const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; color: string; bgColor: string }
> = {
  low: {
    label: "Низкий",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
  },
  medium: {
    label: "Средний",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
  },
  high: {
    label: "Высокий",
    color: "text-orange-800",
    bgColor: "bg-orange-100",
  },
  critical: {
    label: "Критичный",
    color: "text-red-800",
    bgColor: "bg-red-100",
  },
};

// Порядок колонок (слева направо)
export const COLUMN_ORDER: TicketStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
];
