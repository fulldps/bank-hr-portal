import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Notification, NotificationType } from "@/entities/notification";

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "NTF-001",
    type: "sla_breached",
    title: "SLA нарушен",
    body: "Тикет TKT-001 просрочен на 2 часа",
    isRead: false,
    userId: "user-1",
    relatedId: "TKT-001",
    relatedType: "ticket",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "NTF-002",
    type: "ticket_assigned",
    title: "Тикет назначен вам",
    body: "TKT-002 — Исправить баг с авторизацией",
    isRead: false,
    userId: "user-1",
    relatedId: "TKT-002",
    relatedType: "ticket",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "NTF-003",
    type: "shift_approved",
    title: "Смена утверждена",
    body: "Ваша смена на 05.11 утверждена руководителем",
    isRead: false,
    userId: "user-1",
    relatedId: "SHF-001",
    relatedType: "shift",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "NTF-004",
    type: "task_due",
    title: "Срок задачи истекает",
    body: "Задача «Аудит отпускных дней за Q4» — завтра дедлайн",
    isRead: true,
    userId: "user-1",
    relatedId: "TSK-003",
    relatedType: "task",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "NTF-005",
    type: "ticket_resolved",
    title: "Тикет решён",
    body: "TKT-005 — Оптимизировать запросы к БД закрыт",
    isRead: true,
    userId: "user-1",
    relatedId: "TKT-005",
    relatedType: "ticket",
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

export const useNotificationStore = defineStore("notifications", () => {
  const items = ref<Notification[]>(MOCK_NOTIFICATIONS);
  const isDropdownOpen = ref(false);

  const unreadCount = computed(
    () => items.value.filter((n) => !n.isRead).length,
  );

  const recentItems = computed(() => items.value.slice(0, 6));

  function add(notification: Omit<Notification, "id" | "createdAt">) {
    items.value.unshift({
      ...notification,
      id: `NTF-${String(items.value.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    });
  }

  function markRead(id: string) {
    const n = items.value.find((x) => x.id === id);
    if (n) n.isRead = true;
  }

  function markAllRead() {
    items.value.forEach((n) => {
      n.isRead = true;
    });
  }

  function remove(id: string) {
    items.value = items.value.filter((x) => x.id !== id);
  }

  function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
  }

  function closeDropdown() {
    isDropdownOpen.value = false;
  }

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "только что";
    if (m < 60) return `${m} мин. назад`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ч. назад`;
    return `${Math.floor(h / 24)} дн. назад`;
  }

  return {
    items,
    isDropdownOpen,
    unreadCount,
    recentItems,
    add,
    markRead,
    markAllRead,
    remove,
    toggleDropdown,
    closeDropdown,
    timeAgo,
  };
});
