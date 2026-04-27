import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/entities/user";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem("bnb_user") ?? "null"),
  );
  const accessToken = ref<string | null>(localStorage.getItem("bnb_token"));
  const refreshToken = ref<string | null>(localStorage.getItem("bnb_refresh"));
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isManager = computed(() =>
    ["manager", "hr", "admin"].includes(user.value?.role ?? ""),
  );
  const initials = computed(() => {
    if (!user.value) return "";
    return (user.value.firstName[0] + user.value.lastName[0]).toUpperCase();
  });

  async function login(email: string, password: string) {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        error.value = data.error?.message || "Ошибка входа";
        return false;
      }

      user.value = data.data.user;
      accessToken.value = data.data.accessToken;
      refreshToken.value = data.data.refreshToken;

      localStorage.setItem("bnb_user", JSON.stringify(data.data.user));
      localStorage.setItem("bnb_token", data.data.accessToken);
      localStorage.setItem("bnb_refresh", data.data.refreshToken);

      return true;
    } catch {
      error.value = "Ошибка подключения к серверу";
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    if (refreshToken.value) {
      fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken.value }),
      }).catch(() => {});
    }
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem("bnb_user");
    localStorage.removeItem("bnb_token");
    localStorage.removeItem("bnb_refresh");
  }

  function canAccess(roles: string[]): boolean {
    return roles.includes(user.value?.role ?? "employee");
  }

  return {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    initials,
    login,
    logout,
    canAccess,
  };
});
