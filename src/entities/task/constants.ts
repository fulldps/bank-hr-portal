import type { TaskStatus, TaskPriority } from "./types";

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string }
> = {
  todo: {
    label: "К выполнению",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  in_progress: {
    label: "В работе",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
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

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
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

export const TASK_COLUMN_ORDER: TaskStatus[] = [
  "todo",
  "in_progress",
  "review",
  "done",
];
