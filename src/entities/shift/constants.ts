import type { ShiftType, ShiftStatus } from "./types";

export const SHIFT_TYPE_CONFIG: Record<
  ShiftType,
  { label: string; color: string; bgColor: string; short: string }
> = {
  morning: {
    label: "Утренняя",
    short: "09–18",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  evening: {
    label: "Вечерняя",
    short: "14–23",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  night: {
    label: "Ночная",
    short: "22–07",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  day_off: {
    label: "Выходной",
    short: "Вых",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
  },
  vacation: {
    label: "Отпуск",
    short: "Отп",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  sick: {
    label: "Больничный",
    short: "Бол",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

export const SHIFT_STATUS_CONFIG: Record<
  ShiftStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: { label: "Черновик", color: "text-gray-600", bgColor: "bg-gray-100" },
  pending: {
    label: "На согласовании",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  approved: {
    label: "Утверждено",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  rejected: {
    label: "Отклонено",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
};

export const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
