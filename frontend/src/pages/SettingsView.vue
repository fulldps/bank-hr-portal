<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/app/stores/authStore";
import BaseCard from "@/shared/ui/BaseCard.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import { useToastStore } from "@/app/stores/toastStore";

const auth = useAuthStore();
const toast = useToastStore();

const activeTab = ref<"profile" | "notifications" | "security">("profile");

const profileForm = ref({
  firstName: auth.user?.firstName ?? "",
  lastName: auth.user?.lastName ?? "",
  email: auth.user?.email ?? "",
  position: auth.user?.position ?? "",
  department: auth.user?.department ?? "",
});

const notifSettings = ref({
  ticketAssigned: true,
  ticketResolved: true,
  slaWarning: true,
  slaBreached: true,
  taskDue: true,
  shiftApproved: true,
  emailNotifications: false,
});

const passwordForm = ref({
  current: "",
  next: "",
  confirm: "",
});

function saveProfile() {
  toast.success("Профиль обновлён");
}

function saveNotifications() {
  toast.success("Настройки уведомлений сохранены");
}

function changePassword() {
  if (passwordForm.value.next !== passwordForm.value.confirm) {
    toast.error("Пароли не совпадают");
    return;
  }
  if (passwordForm.value.next.length < 6) {
    toast.error("Пароль минимум 6 символов");
    return;
  }
  toast.success("Пароль изменён");
  passwordForm.value = { current: "", next: "", confirm: "" };
}

const tabs = [
  { key: "profile", label: "Профиль" },
  { key: "notifications", label: "Уведомления" },
  { key: "security", label: "Безопасность" },
] as const;
</script>

<template>
  <div class="p-6 max-w-3xl space-y-6">
    <!-- Tabs -->
    <div
      class="flex gap-1 bg-bnb-bg rounded-xl p-1 w-fit border border-bnb-border"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
        :class="
          activeTab === tab.key
            ? 'bg-white text-bnb-primary shadow-sm border border-bnb-border'
            : 'text-bnb-text-muted hover:text-bnb-text'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Профиль -->
    <BaseCard v-if="activeTab === 'profile'">
      <div class="p-6 space-y-5">
        <div class="flex items-center gap-4 pb-4 border-b border-bnb-border">
          <div
            class="w-14 h-14 rounded-full bg-bnb-primary flex items-center justify-center flex-shrink-0"
          >
            <span class="text-white font-bold text-lg">{{
              auth.initials
            }}</span>
          </div>
          <div>
            <p class="font-semibold text-bnb-text">{{ auth.user?.fullName }}</p>
            <p class="text-sm text-bnb-text-muted">{{ auth.user?.position }}</p>
            <p class="text-xs text-bnb-text-muted mt-0.5">
              {{ auth.user?.department }} · ID: {{ auth.user?.employeeId }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">Имя</label>
            <input
              v-model="profileForm.firstName"
              type="text"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted"
              >Фамилия</label
            >
            <input
              v-model="profileForm.lastName"
              type="text"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted"
              >Должность</label
            >
            <input
              v-model="profileForm.position"
              type="text"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1 col-span-2">
            <label class="text-xs font-medium text-bnb-text-muted">Отдел</label>
            <input
              v-model="profileForm.department"
              type="text"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <BaseButton variant="primary" @click="saveProfile">
            Сохранить изменения
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Уведомления -->
    <BaseCard v-if="activeTab === 'notifications'">
      <div class="p-6 space-y-4">
        <p class="text-sm font-semibold text-bnb-text mb-2">Push-уведомления</p>

        <div class="space-y-3">
          <div
            v-for="(value, key) in notifSettings"
            :key="key"
            class="flex items-center justify-between py-2 border-b border-bnb-border last:border-0"
          >
            <span class="text-sm text-bnb-text">
              {{
                {
                  ticketAssigned: "Тикет назначен на меня",
                  ticketResolved: "Тикет решён",
                  slaWarning: "Предупреждение о SLA",
                  slaBreached: "Нарушение SLA",
                  taskDue: "Срок задачи истекает",
                  shiftApproved: "Смена утверждена / отклонена",
                  emailNotifications: "Email-уведомления",
                }[key]
              }}
            </span>
            <button
              class="relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
              :class="
                notifSettings[key as keyof typeof notifSettings]
                  ? 'bg-bnb-primary'
                  : 'bg-gray-200'
              "
              @click="
                notifSettings[key as keyof typeof notifSettings] =
                  !notifSettings[key as keyof typeof notifSettings]
              "
            >
              <span
                class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                :class="
                  notifSettings[key as keyof typeof notifSettings]
                    ? 'translate-x-[18px]'
                    : 'translate-x-0.5'
                "
              />
            </button>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <BaseButton variant="primary" @click="saveNotifications">
            Сохранить
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Безопасность -->
    <BaseCard v-if="activeTab === 'security'">
      <div class="p-6 space-y-4">
        <p class="text-sm font-semibold text-bnb-text mb-2">Изменение пароля</p>

        <div class="space-y-3 max-w-sm">
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">
              Текущий пароль
            </label>
            <input
              v-model="passwordForm.current"
              type="password"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">
              Новый пароль
            </label>
            <input
              v-model="passwordForm.next"
              type="password"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-medium text-bnb-text-muted">
              Повторите пароль
            </label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg focus:border-bnb-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <BaseButton variant="primary" @click="changePassword">
            Изменить пароль
          </BaseButton>
        </div>

        <div class="pt-4 border-t border-bnb-border">
          <p class="text-sm font-semibold text-bnb-text mb-1">
            Активные сессии
          </p>
          <p class="text-xs text-bnb-text-muted mb-3">
            Текущая сессия — {{ auth.user?.email }}
          </p>
          <BaseButton variant="danger" size="sm" @click="auth.logout">
            Выйти из всех устройств
          </BaseButton>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
