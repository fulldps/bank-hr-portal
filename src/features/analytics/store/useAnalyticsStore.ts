import { defineStore } from "pinia";
import { computed } from "vue";
import { useKanbanStore } from "@/features/kanban/store";
import { useTaskStore } from "@/features/tasks/store";
import type {
  TrendPoint,
  PriorityStats,
  DepartmentStat,
} from "@/entities/analytics";

export const useAnalyticsStore = defineStore("analytics", () => {
  const kanban = useKanbanStore();
  const tasks = useTaskStore();

  const kpi = computed(() => {
    const total = kanban.tickets.length;
    const open = kanban.tickets.filter((t) => t.status !== "done").length;
    const resolved = kanban.tickets.filter((t) => t.status === "done").length;
    const overdue = kanban.tickets.filter(
      (t) =>
        t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done",
    ).length;

    const resolvedWithTime = kanban.tickets.filter(
      (t) => t.status === "done" && t.dueDate,
    );
    const avgResolutionHours =
      resolvedWithTime.length > 0
        ? Math.round(
            resolvedWithTime.reduce((acc, t) => {
              const diff =
                new Date(t.updatedAt).getTime() -
                new Date(t.createdAt).getTime();
              return acc + diff / 3600000;
            }, 0) / resolvedWithTime.length,
          )
        : 0;

    const slaCompliant = kanban.tickets.filter(
      (t) => !t.dueDate || new Date(t.dueDate) >= new Date(),
    ).length;
    const slaCompliancePercent =
      total > 0 ? Math.round((slaCompliant / total) * 100) : 100;

    return {
      ticketsTotal: total,
      ticketsOpen: open,
      ticketsResolved: resolved,
      ticketsOverdue: overdue,
      tasksTotal: tasks.tasks.length,
      tasksOverdue: tasks.stats.overdue,
      avgResolutionHours,
      slaCompliancePercent,
    };
  });

  const priorityStats = computed<PriorityStats>(() => ({
    critical: kanban.tickets.filter((t) => t.priority === "critical").length,
    high: kanban.tickets.filter((t) => t.priority === "high").length,
    medium: kanban.tickets.filter((t) => t.priority === "medium").length,
    low: kanban.tickets.filter((t) => t.priority === "low").length,
  }));

  const weeklyTrend = computed<TrendPoint[]>(() => {
    const days: TrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayTickets = kanban.tickets.filter((t) =>
        t.createdAt.startsWith(dateStr),
      ).length;
      const dayResolved = kanban.tickets.filter(
        (t) => t.status === "done" && t.updatedAt.startsWith(dateStr),
      ).length;
      days.push({
        date: date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        }),
        tickets: dayTickets,
        resolved: dayResolved,
      });
    }
    return days;
  });

  const departmentStats = computed<DepartmentStat[]>(() => [
    { name: "HR-отдел", open: 8, closed: 24, slaPercent: 92 },
    { name: "Бухгалтерия", open: 5, closed: 18, slaPercent: 88 },
    { name: "IT-отдел", open: 11, closed: 31, slaPercent: 95 },
    { name: "Юридический", open: 3, closed: 12, slaPercent: 100 },
    { name: "Маркетинг", open: 6, closed: 9, slaPercent: 78 },
  ]);

  return { kpi, priorityStats, weeklyTrend, departmentStats };
});
