export interface NavItem {
  label: string;
  to: string;
  icon: string;
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: "Обращения",
    items: [
      { label: "Дашборд", to: "/", icon: "dashboard" },
      { label: "Тикеты", to: "/tickets", icon: "ticket" },
      { label: "Мои задачи", to: "/tasks", icon: "tasks" },
    ],
  },
  {
    groupLabel: "Рабочее",
    items: [
      { label: "График смен", to: "/schedule", icon: "calendar" },
      { label: "Аналитика", to: "/analytics", icon: "chart" },
    ],
  },
  {
    groupLabel: "Система",
    items: [{ label: "Настройки", to: "/settings", icon: "settings" }],
  },
];
