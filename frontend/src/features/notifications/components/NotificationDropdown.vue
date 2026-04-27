<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/app/stores/notificationStore";
import { NOTIFICATION_CONFIG } from "@/entities/notification";
import NotificationIcon from "./NotificationIcon.vue";

const store = useNotificationStore();
const router = useRouter();
const dropdownRef = ref<HTMLElement | null>(null);

async function handleToggle() {
  store.toggleDropdown();
  if (store.isDropdownOpen) {
    await store.fetchNotifications();
  }
}

function handleNotifClick(
  id: string,
  relatedType?: string,
  relatedId?: string,
) {
  store.markRead(id);
  store.closeDropdown();
  if (relatedType === "ticket" && relatedId) {
    router.push(`/tickets/${relatedId}`);
  }
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    store.closeDropdown();
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => document.removeEventListener("click", handleClickOutside));
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Кнопка колокольчика -->
    <button
      class="relative w-9 h-9 flex items-center justify-center rounded-lg text-bnb-text-muted hover:bg-bnb-primary-light hover:text-bnb-primary transition-colors duration-150"
      @click.stop="handleToggle"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
        <path
          d="M10 2a6 6 0 00-6 6v3.5L2.5 13h15L16 11.5V8a6 6 0 00-6-6z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M8.5 16a1.5 1.5 0 003 0"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>
      <span
        v-if="store.unreadCount > 0"
        class="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
      >
        {{ store.unreadCount > 9 ? "9+" : store.unreadCount }}
      </span>
    </button>

    <!-- Дропдаун -->
    <Transition name="dropdown">
      <div
        v-if="store.isDropdownOpen"
        class="absolute top-[calc(100%+8px)] right-0 w-[360px] bg-white rounded-xl border border-bnb-border shadow-xl z-50 overflow-hidden"
      >
        <!-- Заголовок -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-bnb-border"
        >
          <span class="text-sm font-semibold text-bnb-text">Уведомления</span>
          <button
            v-if="store.unreadCount > 0"
            class="text-xs font-medium text-bnb-primary hover:underline"
            @click="store.markAllRead"
          >
            Прочитать все
          </button>
        </div>

        <!-- Список -->
        <div class="max-h-[380px] overflow-y-auto">
          <div
            v-for="n in store.recentItems"
            :key="n.id"
            class="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-bnb-bg transition-colors border-b border-bnb-border last:border-0"
            :class="!n.isRead ? 'bg-bnb-primary-light/40' : ''"
            @click="handleNotifClick(n.id, n.relatedType, n.relatedId)"
          >
            <!-- Иконка -->
            <div
              class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              :class="[
                NOTIFICATION_CONFIG[n.type].bgColor,
                NOTIFICATION_CONFIG[n.type].color,
              ]"
            >
              <NotificationIcon :type="n.type" />
            </div>

            <!-- Текст -->
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-bnb-text leading-snug">
                {{ n.title }}
              </p>
              <p
                class="text-[11px] text-bnb-text-muted mt-0.5 leading-snug line-clamp-2"
              >
                {{ n.body }}
              </p>
              <time class="text-[10px] text-bnb-text-muted mt-1 block">
                {{ store.timeAgo(n.createdAt) }}
              </time>
            </div>

            <!-- Индикатор непрочитанного -->
            <div
              v-if="!n.isRead"
              class="w-2 h-2 rounded-full bg-bnb-primary flex-shrink-0 mt-2"
            />
          </div>

          <div v-if="store.items.length === 0" class="px-4 py-8 text-center">
            <p class="text-sm text-bnb-text-muted">Нет уведомлений</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-bnb-border">
          <router-link
            to="/notifications"
            class="block text-center py-3 text-xs font-semibold text-bnb-primary hover:bg-bnb-bg transition-colors"
            @click="store.closeDropdown"
          >
            Смотреть все уведомления
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
