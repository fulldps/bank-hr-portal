import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/widgets/layout/AppLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: Dashboard,
          meta: { title: "Дашборд" },
        },
        {
          path: "tickets",
          name: "Tickets",
          component: Dashboard, // Заглушка до создания страницы
          meta: { title: "Тикеты" },
        },
        {
          path: "tasks",
          name: "Tasks",
          component: Dashboard,
          meta: { title: "Мои задачи" },
        },
        {
          path: "kanban",
          name: "Kanban",
          component: () => import("@/pages/KanbanView.vue"),
          meta: { title: "Канбан-доска" },
        },
        {
          path: "schedule",
          name: "Schedule",
          component: Dashboard,
          meta: { title: "График смен" },
        },
        {
          path: "analytics",
          name: "Analytics",
          component: Dashboard,
          meta: { title: "Аналитика" },
        },
        {
          path: "settings",
          name: "Settings",
          component: Dashboard,
          meta: { title: "Настройки" },
        },
      ],
    },
  ],
});

export default router;
