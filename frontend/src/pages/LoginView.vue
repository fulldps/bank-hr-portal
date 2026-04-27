<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/app/stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const emailError = ref("");
const passwordError = ref("");

function validate(): boolean {
  emailError.value = "";
  passwordError.value = "";

  if (!email.value.trim()) {
    emailError.value = "Введите email";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Некорректный формат email";
    return false;
  }

  if (!password.value) {
    passwordError.value = "Введите пароль";
    return false;
  }

  if (password.value.length < 6) {
    passwordError.value = "Пароль минимум 6 символов";
    return false;
  }

  return true;
}

async function handleSubmit() {
  if (!validate()) return;

  const success = await auth.login(email.value, password.value);
  if (success) {
    router.push("/");
  }
}
</script>

<template>
  <div class="min-h-screen bg-bnb-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Логотип -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-bnb-primary mb-4"
        >
          <span class="text-white font-bold text-lg tracking-tight">БНБ</span>
        </div>
        <h1 class="text-2xl font-bold text-bnb-text">HR Portal</h1>
        <p class="text-sm text-bnb-text-muted mt-1">Беларускі Народны Банк</p>
      </div>

      <!-- Карточка формы -->
      <div class="bg-white rounded-2xl border border-bnb-border shadow-sm p-8">
        <h2 class="text-lg font-semibold text-bnb-text mb-6">Вход в систему</h2>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="ivanov@bnb.by"
              autocomplete="email"
              class="w-full h-10 px-3 text-sm border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted outline-none transition-colors"
              :class="
                emailError
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-bnb-border focus:border-bnb-primary'
              "
            />
            <p v-if="emailError" class="text-xs text-red-500">
              {{ emailError }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">
              Пароль <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full h-10 px-3 pr-10 text-sm border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted outline-none transition-colors"
                :class="
                  passwordError
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-bnb-border focus:border-bnb-primary'
                "
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-bnb-text-muted hover:text-bnb-text transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-if="!showPassword"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <circle
                    cx="8"
                    cy="8"
                    r="2"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M2 2l12 12M6.5 6.5A2 2 0 0010 10M4 4.5C2.5 5.8 1 8 1 8s2.5 5 7 5c1.4 0 2.6-.4 3.6-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-2 2.7"
                    stroke="currentColor"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-xs text-red-500">
              {{ passwordError }}
            </p>
          </div>

          <!-- Ошибка авторизации -->
          <div
            v-if="auth.error"
            class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg"
          >
            <svg
              class="w-4 h-4 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                stroke-width="1.2"
              />
              <path
                d="M8 5v4M8 10.5v.5"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            <p class="text-xs text-red-600 font-medium">{{ auth.error }}</p>
          </div>

          <!-- Кнопка -->
          <button
            type="submit"
            class="w-full h-10 bg-bnb-primary text-white text-sm font-semibold rounded-lg hover:bg-bnb-primary-hover active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
            :disabled="auth.isLoading"
          >
            <svg
              v-if="auth.isLoading"
              class="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-dasharray="20 14"
              />
            </svg>
            {{ auth.isLoading ? "Вход..." : "Войти" }}
          </button>
        </form>

        <!-- Тестовые аккаунты -->
        <div class="mt-6 pt-5 border-t border-bnb-border">
          <p
            class="text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider mb-3"
          >
            Тестовые аккаунты
          </p>
          <div class="space-y-2">
            <button
              v-for="acc in [
                {
                  email: 'ivanov@bnb.by',
                  role: 'HR-специалист',
                  color: 'bg-blue-50 text-blue-700 border-blue-200',
                },
                {
                  email: 'petrova@bnb.by',
                  role: 'Руководитель',
                  color: 'bg-purple-50 text-purple-700 border-purple-200',
                },
                {
                  email: 'sidorov@bnb.by',
                  role: 'Сотрудник',
                  color: 'bg-gray-50 text-gray-700 border-gray-200',
                },
                {
                  email: 'admin@bnb.by',
                  role: 'Администратор',
                  color: 'bg-red-50 text-red-700 border-red-200',
                },
              ]"
              :key="acc.email"
              type="button"
              class="w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-colors hover:opacity-80"
              :class="acc.color"
              @click="
                email = acc.email;
                password = acc.email === 'admin@bnb.by' ? 'admin123' : '123456';
              "
            >
              <span class="font-medium">{{ acc.role }}</span>
              <span class="opacity-70">{{ acc.email }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
