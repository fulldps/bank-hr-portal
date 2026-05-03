import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Shift } from "@/entities/shift";
import { api } from "@/shared/api/client";

export const useShiftStore = defineStore("shifts", () => {
  const shifts = ref<Shift[]>([]);
  const isLoading = ref(false);
  const selectedWeekOffset = ref(0);

  const weekDates = computed(() => {
    const dates: string[] = [];
    const now = new Date();
    const day = now.getDay();
    const monday = new Date(now);
    monday.setDate(
      now.getDate() - (day === 0 ? 6 : day - 1) + selectedWeekOffset.value * 7,
    );
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  });

  const employees = computed(() => {
    const map = new Map<string, string>();
    shifts.value.forEach((s) => {
      const name: string = s.userName;
      map.set(s.userId, name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  const pendingShifts = computed(() =>
    shifts.value.filter((s) => s.status === "pending"),
  );

  const overtimeByUser = computed(() => {
    const map = new Map<string, number>();
    shifts.value.forEach((s) => {
      const current = map.get(s.userId) ?? 0;
      map.set(s.userId, current + (s.overtimeMinutes ?? 0));
    });
    return map;
  });

  function getShift(userId: string, date: string): Shift | undefined {
    return shifts.value.find((s) => s.userId === userId && s.date === date);
  }

  async function fetchShifts() {
    isLoading.value = true;
    try {
      const dateFrom: string = weekDates.value[0];
      const dateTo: string = weekDates.value[6];
      const data = await api.get<Shift[]>(
        `/shifts?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      );
      shifts.value = data;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function createShift(data: Omit<Shift, "id" | "createdAt">) {
    try {
      const created = await api.post<Shift>("/shifts", data);
      const index = shifts.value.findIndex(
        (s) => s.userId === data.userId && s.date === data.date,
      );
      if (index !== -1) {
        shifts.value[index] = created;
      } else {
        shifts.value.push(created);
      }
      return created;
    } catch (e: any) {
      throw e;
    }
  }

  async function approveShift(shiftId: string) {
    try {
      const updated = await api.patch<Shift>(`/shifts/${shiftId}/approve`, {});
      const index = shifts.value.findIndex((s) => s.id === shiftId);
      if (index !== -1) shifts.value[index] = updated;
    } catch (e: any) {
      throw e;
    }
  }

  async function rejectShift(shiftId: string, reason: string) {
    try {
      const updated = await api.patch<Shift>(`/shifts/${shiftId}/reject`, {
        reason,
      });
      const index = shifts.value.findIndex((s) => s.id === shiftId);
      if (index !== -1) shifts.value[index] = updated;
    } catch (e: any) {
      throw e;
    }
  }

  function prevWeek() {
    selectedWeekOffset.value--;
    fetchShifts();
  }

  function nextWeek() {
    selectedWeekOffset.value++;
    fetchShifts();
  }

  function currentWeek() {
    selectedWeekOffset.value = 0;
    fetchShifts();
  }

  return {
    shifts,
    isLoading,
    selectedWeekOffset,
    weekDates,
    employees,
    pendingShifts,
    overtimeByUser,
    getShift,
    fetchShifts,
    createShift,
    approveShift,
    rejectShift,
    prevWeek,
    nextWeek,
    currentWeek,
  };
});
