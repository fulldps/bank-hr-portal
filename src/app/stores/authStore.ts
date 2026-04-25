import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User, UserRole } from "@/entities/user";

const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "user-1",
    email: "ivanov@bnb.by",
    password: "123456",
    fullName: "Алексей Иванов",
    firstName: "Алексей",
    lastName: "Иванов",
    role: "hr",
    department: "HR-отдел",
    position: "HR-специалист",
    employeeId: "EMP-001",
  },
  {
    id: "user-2",
    email: "petrova@bnb.by",
    password: "123456",
    fullName: "Мария Петрова",
    firstName: "Мария",
    lastName: "Петрова",
    role: "manager",
    department: "HR-отдел",
    position: "Руководитель HR",
    employeeId: "EMP-002",
  },
  {
    id: "user-3",
    email: "sidorov@bnb.by",
    password: "123456",
    fullName: "Иван Сидоров",
    firstName: "Иван",
    lastName: "Сидоров",
    role: "employee",
    department: "IT-отдел",
    position: "Разработчик",
    employeeId: "EMP-003",
  },
  {
    id: "user-4",
    email: "admin@bnb.by",
    password: "admin123",
    fullName: "Администратор",
    firstName: "Админ",
    lastName: "Системы",
    role: "admin",
    department: "IT-отдел",
    position: "Системный администратор",
    employeeId: "EMP-004",
  },
];

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("bnb_user") ?? "null"),
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isManager = computed(() =>
    ["manager", "hr", "admin"].includes(user.value?.role ?? ""),
  );
  const initials = computed(() => {
    if (!user.value) return "";
    return (user.value.firstName[0] + user.value.lastName[0]).toUpperCase();
  });

  function canAccess(roles: UserRole[]): boolean {
    return roles.includes(user.value?.role ?? "employee");
  }

  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      await new Promise((r) => setTimeout(r, 600));

      const found = MOCK_USERS.find(
        (u) => u.email === email && u.password === password,
      );

      if (!found) {
        error.value = "Неверный email или пароль";
        return false;
      }

      const { password: _, ...userData } = found;
      user.value = userData;
      localStorage.setItem("bnb_user", JSON.stringify(userData));
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("bnb_user");
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    initials,
    canAccess,
    login,
    logout,
  };
});
