<script setup lang="ts">
import { useAnalyticsStore } from "@/features/analytics/store";
import StatsCard from "@/features/analytics/components/StatsCard.vue";
import TrendChart from "@/features/analytics/components/TrendChart.vue";
import PriorityChart from "@/features/analytics/components/PriorityChart.vue";
import DepartmentTable from "@/features/analytics/components/DepartmentTable.vue";

const analytics = useAnalyticsStore();
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- KPI карточки -->
    <div class="grid grid-cols-4 gap-4">
      <StatsCard
        label="Открытых тикетов"
        :value="analytics.kpi.ticketsOpen"
        :accent="analytics.kpi.ticketsOpen > 20 ? 'danger' : 'default'"
        sub="всего активных обращений"
      />
      <StatsCard
        label="Нарушений SLA"
        :value="analytics.kpi.ticketsOverdue"
        accent="danger"
        :trend="analytics.kpi.ticketsOverdue > 0 ? 'down' : 'up'"
        :trend-value="
          analytics.kpi.ticketsOverdue > 0 ? 'Требует внимания' : 'В норме'
        "
        sub="просроченных тикетов"
      />
      <StatsCard
        label="Соответствие SLA"
        :value="analytics.kpi.slaCompliancePercent + '%'"
        :accent="
          analytics.kpi.slaCompliancePercent >= 90 ? 'success' : 'warning'
        "
        :trend="analytics.kpi.slaCompliancePercent >= 90 ? 'up' : 'down'"
        :trend-value="
          analytics.kpi.slaCompliancePercent >= 90 ? 'Хорошо' : 'Внимание'
        "
        sub="тикетов в срок"
      />
      <StatsCard
        label="Среднее время"
        :value="analytics.kpi.avgResolutionHours + 'ч'"
        accent="default"
        sub="на закрытие тикета"
      />
    </div>

    <!-- Вторая строка KPI -->
    <div class="grid grid-cols-4 gap-4">
      <StatsCard
        label="Всего тикетов"
        :value="analytics.kpi.ticketsTotal"
        sub="за всё время"
      />
      <StatsCard
        label="Решено тикетов"
        :value="analytics.kpi.ticketsResolved"
        accent="success"
        sub="успешно закрыто"
      />
      <StatsCard
        label="Всего задач"
        :value="analytics.kpi.tasksTotal"
        sub="в системе"
      />
      <StatsCard
        label="Просроченных задач"
        :value="analytics.kpi.tasksOverdue"
        :accent="analytics.kpi.tasksOverdue > 0 ? 'danger' : 'success'"
        sub="задач с истёкшим сроком"
      />
    </div>

    <!-- Графики -->
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <TrendChart :data="analytics.weeklyTrend" />
      </div>
      <div>
        <PriorityChart :data="analytics.priorityStats" />
      </div>
    </div>

    <!-- Таблица отделов -->
    <DepartmentTable :data="analytics.departmentStats" />
  </div>
</template>
