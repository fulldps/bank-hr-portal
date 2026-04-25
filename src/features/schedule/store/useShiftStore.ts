import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Shift, ShiftType, ShiftStatus } from "@/entities/shift";

const MOCK_SHIFTS: Shift[] = [
  {
    id: "SHF-001",
    userId: "user-1",
    userName: "Алексей Иванов",
    date: getDateStr(0),
    type: "morning",
    startTime: "09:00",
    endTime: "18:00",
    overtimeMinutes: 0,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "SHF-002",
    userId: "user-1",
    userName: "Алексей Иванов",
    date: getDateStr(1),
    type: "morning",
    startTime: "09:00",
    endTime: "21:00",
    overtimeMinutes: 180,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "SHF-003",
    userId: "user-2",
    userName: "Мария Петрова",
    date: getDateStr(0),
    type: "vacation",
    overtimeMinutes: 0,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "SHF-004",
    userId: "user-2",
    userName: "Мария Петрова",
    date: getDateStr(2),
    type: "morning",
    startTime: "09:00",
    endTime: "18:00",
    overtimeMinutes: 0,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "SHF-005",
    userId: "user-3",
    userName: "Ольга Козлова",
    date: getDateStr(1),
    type: "sick",
    overtimeMinutes: 0,
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "SHF-006",
    userId: "user-3",
    userName: "Ольга Козлова",
    date: getDateStr(0),
    type: "evening",
    startTime: "14:00",
    endTime: "23:00",
    overtimeMinutes: 60,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

function getDateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

export const useShiftStore = defineStore("shifts", () => {
  const shifts = ref<Shift[]>(MOCK_SHIFTS);
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
    shifts.value.forEach((s) => map.set(s.userId, s.userName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  const pendingShifts = computed(() =>
    shifts.value.filter((s) => s.status === "pending"),
  );

  const overtimeByUser = computed(() => {
    const map = new Map<string, number>();
    shifts.value.forEach((s) => {
      const current = map.get(s.userId) ?? 0;
      map.set(s.userId, current + s.overtimeMinutes);
    });
    return map;
  });

  function getShift(userId: string, date: string): Shift | undefined {
    return shifts.value.find((s) => s.userId === userId && s.date === date);
  }

  function createShift(data: Omit<Shift, "id" | "createdAt">) {
    const shift: Shift = {
      ...data,
      id: `SHF-${String(shifts.value.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
    };
    shifts.value.push(shift);
    return shift;
  }

  function approveShift(shiftId: string) {
    const shift = shifts.value.find((s) => s.id === shiftId);
    if (shift) {
      shift.status = "approved";
      shift.approvedById = "current-user";
    }
  }

  function rejectShift(shiftId: string, reason: string) {
    const shift = shifts.value.find((s) => s.id === shiftId);
    if (shift) {
      shift.status = "rejected";
      shift.rejectReason = reason;
    }
  }

  function prevWeek() {
    selectedWeekOffset.value--;
  }
  function nextWeek() {
    selectedWeekOffset.value++;
  }
  function currentWeek() {
    selectedWeekOffset.value = 0;
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
    createShift,
    approveShift,
    rejectShift,
    prevWeek,
    nextWeek,
    currentWeek,
  };
});
