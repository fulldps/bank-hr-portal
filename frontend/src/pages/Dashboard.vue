<script setup lang="ts">
import { ref, onMounted } from "vue";
import BaseCard from "@/shared/ui/BaseCard.vue";
import SkeletonCard from "@/shared/ui/SkeletonCard.vue";
import { useToastStore } from "@/app/stores/toastStore";
import { useAuthStore } from "@/app/stores/authStore";

const toast = useToastStore();
const auth = useAuthStore();
const isLoading = ref(true);

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 800));
  isLoading.value = false;
  toast.success(`Добро пожаловать, ${auth.user?.firstName}!`);
});
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- KPI карточки -->
    <div class="grid grid-cols-4 gap-4">
      <template v-if="isLoading">
        <SkeletonCard v-for="i in 4" :key="i" />
      </template>
      <template v-else>
        <BaseCard>
          <div class="p-5">
            <p class="text-xs font-medium text-bnb-text-muted">
              Открытых тикетов
            </p>
            <p class="text-3xl font-bold text-bnb-text mt-1">24</p>
            <p class="text-xs text-bnb-text-muted mt-1">+3 за сегодня</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="p-5">
            <p class="text-xs font-medium text-bnb-text-muted">Нарушений SLA</p>
            <p class="text-3xl font-bold text-red-600 mt-1">3</p>
            <p class="text-xs text-bnb-text-muted mt-1">Требуют внимания</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="p-5">
            <p class="text-xs font-medium text-bnb-text-muted">
              Решено сегодня
            </p>
            <p class="text-3xl font-bold text-bnb-text mt-1">8</p>
            <p class="text-xs text-bnb-text-muted mt-1">из 12 в работе</p>
          </div>
        </BaseCard>
        <BaseCard>
          <div class="p-5">
            <p class="text-xs font-medium text-bnb-text-muted">Среднее время</p>
            <p class="text-3xl font-bold text-bnb-text mt-1">4.2ч</p>
            <p class="text-xs text-bnb-text-muted mt-1">на закрытие тикета</p>
          </div>
        </BaseCard>
      </template>
    </div>

    <!-- Виджеты -->
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <BaseCard>
          <div class="p-5">
            <p class="text-sm font-semibold text-bnb-text mb-4">
              Активность за неделю
            </p>
            <div
              class="h-40 flex items-center justify-center border-2 border-dashed border-bnb-border rounded-lg"
            >
              <p class="text-sm text-bnb-text-muted">График — Этап 4</p>
            </div>
          </div>
        </BaseCard>
      </div>
      <div>
        <BaseCard>
          <div class="p-5">
            <p class="text-sm font-semibold text-bnb-text mb-4">
              По приоритетам
            </p>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-bnb-text-muted">Критичный</span>
                <span class="text-xs font-semibold text-red-600">3</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-bnb-text-muted">Высокий</span>
                <span class="text-xs font-semibold text-orange-500">7</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-bnb-text-muted">Средний</span>
                <span class="text-xs font-semibold text-bnb-text">10</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-bnb-text-muted">Низкий</span>
                <span class="text-xs font-semibold text-bnb-text">4</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
