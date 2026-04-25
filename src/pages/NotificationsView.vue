<script setup lang="ts">
import { useNotificationStore } from "@/app/stores/notificationStore";
import { NOTIFICATION_CONFIG } from "@/entities/notification";
import NotificationIcon from "@/features/notifications/components/NotificationIcon.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";

const store = useNotificationStore();
</script>

<template>
  <div class="p-6 max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-bnb-text-muted mt-0.5">
          Непрочитанных: {{ store.unreadCount }}
        </p>
      </div>
      <BaseButton
        v-if="store.unreadCount > 0"
        variant="secondary"
        size="sm"
        @click="store.markAllRead"
      >
        Прочитать все
      </BaseButton>
    </div>

    <div class="bg-white rounded-xl border border-bnb-border overflow-hidden">
      <div
        v-for="n in store.items"
        :key="n.id"
        class="flex items-start gap-4 px-5 py-4 border-b border-bnb-border last:border-0 transition-colors"
        :class="!n.isRead ? 'bg-bnb-primary-light/30' : 'hover:bg-bnb-bg'"
      >
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          :class="[
            NOTIFICATION_CONFIG[n.type].bgColor,
            NOTIFICATION_CONFIG[n.type].color,
          ]"
        >
          <NotificationIcon :type="n.type" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-bnb-text">{{ n.title }}</p>
          <p class="text-xs text-bnb-text-muted mt-0.5 leading-relaxed">
            {{ n.body }}
          </p>
          <time class="text-[11px] text-bnb-text-muted mt-1 block">
            {{ store.timeAgo(n.createdAt) }}
          </time>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            v-if="!n.isRead"
            class="text-[11px] font-medium text-bnb-primary hover:underline"
            @click="store.markRead(n.id)"
          >
            Прочитать
          </button>
          <button
            class="text-[11px] text-bnb-text-muted hover:text-red-500 transition-colors"
            @click="store.remove(n.id)"
          >
            ✕
          </button>
        </div>
      </div>

      <div v-if="store.items.length === 0" class="px-5 py-12 text-center">
        <p class="text-sm text-bnb-text-muted">Нет уведомлений</p>
      </div>
    </div>
  </div>
</template>
