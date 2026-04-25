import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/widgets/layout/AppLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import { useAuthStore } from "@/app/stores/authStore";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    public?: boolean;
    roles?: string[];
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/LoginView.vue"),
      meta: { title: "Вход", public: true },
    },
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
          component: () => import("@/pages/KanbanView.vue"),
          meta: { title: "Тикеты" },
        },
        {
          path: "tickets/:id",
          name: "TicketDetail",
          component: () => import("@/pages/TicketDetailView.vue"),
          meta: { title: "Тикет" },
        },
        {
          path: "tasks",
          name: "Tasks",
          component: () => import("@/pages/TasksView.vue"),
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
          component: () => import("@/pages/ScheduleView.vue"),
          meta: { title: "График смен" },
        },
        {
          path: "analytics",
          name: "Analytics",
          component: () => import("@/pages/AnalyticsView.vue"),
          meta: { title: "Аналитика", roles: ["manager", "hr", "admin"] },
        },
        {
          path: "notifications",
          name: "Notifications",
          component: () => import("@/pages/NotificationsView.vue"),
          meta: { title: "Уведомления" },
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

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.title) {
    document.title = `${to.meta.title} — БНБ HR`;
  }

  if (to.meta.public) {
    if (auth.isAuthenticated && to.name === "Login") {
      return next({ name: "Dashboard" });
    }
    return next();
  }

  if (!auth.isAuthenticated) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role ?? "")) {
    return next({ name: "Dashboard" });
  }

  next();
});

export default router;
