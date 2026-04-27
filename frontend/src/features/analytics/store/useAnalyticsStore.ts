import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  DashboardStats,
  TrendPoint,
  PriorityStats,
  DepartmentStat,
} from "@/entities/analytics";
import { api } from "@/shared/api/client";

export const useAnalyticsStore = defineStore("analytics", () => {
  const kpi = ref<DashboardStats>({
    ticketsTotal: 0,
    ticketsOpen: 0,
    ticketsResolved: 0,
    ticketsOverdue: 0,
    tasksTotal: 0,
    tasksOverdue: 0,
    avgResolutionHours: 0,
    slaCompliancePercent: 100,
  });

  const weeklyTrend = ref<TrendPoint[]>([]);
  const priorityStats = ref<PriorityStats>({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });
  const departmentStats = ref<DepartmentStat[]>([]);
  const isLoading = ref(false);

  async function fetchAll() {
    isLoading.value = true;
    try {
      const [kpiData, trendData, priorityData, deptData] = await Promise.all([
        api.get<DashboardStats>("/analytics/kpi"),
        api.get<TrendPoint[]>("/analytics/trend"),
        api.get<PriorityStats>("/analytics/priority"),
        api.get<DepartmentStat[]>("/analytics/departments"),
      ]);

      kpi.value = kpiData;
      weeklyTrend.value = trendData;
      priorityStats.value = priorityData;
      departmentStats.value = deptData;
    } catch (e) {
      console.error("Analytics fetch error:", e);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    kpi,
    weeklyTrend,
    priorityStats,
    departmentStats,
    isLoading,
    fetchAll,
  };
});
