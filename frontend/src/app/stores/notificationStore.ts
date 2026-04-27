import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Notification } from "@/entities/notification";
import { api } from "@/shared/api/client";

export const useNotificationStore = defineStore("notifications", () => {
  const items = ref<Notification[]>([]);
  const isDropdownOpen = ref(false);
  const isLoading = ref(false);

  const unreadCount = computed(
    () => items.value.filter((n) => !n.isRead).length,
  );

  const recentItems = computed(() => items.value.slice(0, 6));

  async function fetchNotifications() {
    isLoading.value = true;
    try {
      const data = await api.get<Notification[]>("/notifications");
      items.value = data;
    } catch {
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const data = await api.get<{ count: number }>(
        "/notifications/unread-count",
      );
      return data.count;
    } catch {
      return 0;
    }
  }

  async function markRead(id: string) {
    const n = items.value.find((x) => x.id === id);
    if (n) n.isRead = true;
    try {
      await api.patch(`/notifications/${id}/read`, {});
    } catch {
      if (n) n.isRead = false;
    }
  }

  async function markAllRead() {
    items.value.forEach((n) => {
      n.isRead = true;
    });
    try {
      await api.patch("/notifications/read-all", {});
    } catch {}
  }

  async function remove(id: string) {
    const prev = [...items.value];
    items.value = items.value.filter((x) => x.id !== id);
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      items.value = prev;
    }
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
    isLoading,
    unreadCount,
    recentItems,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
    remove,
    toggleDropdown,
    closeDropdown,
    timeAgo,
  };
});
