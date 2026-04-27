<script setup lang="ts">
import { ref } from "vue";
import { useShiftStore } from "@/features/schedule/store";
import ShiftCell from "@/features/schedule/components/ShiftCell.vue";
import ShiftCreateForm from "@/features/schedule/components/ShiftCreateForm.vue";
import PendingShifts from "@/features/schedule/components/PendingShifts.vue";
import { WEEK_DAYS } from "@/entities/shift";
import { onMounted } from "vue";

onMounted(() => store.fetchShifts());
const store = useShiftStore();
const isFormOpen = ref(false);
const selectedUserId = ref("");
const selectedDate = ref("");

function openForm(userId: string, date: string) {
  selectedUserId.value = userId;
  selectedDate.value = date;
  isFormOpen.value = true;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

function isWeekend(dateStr: string): boolean {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Заголовок + навигация по неделям -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-bnb-border hover:bg-bnb-bg transition-colors"
          @click="store.prevWeek"
        >
          <svg
            class="w-4 h-4 text-bnb-text-muted"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          class="px-3 h-8 text-xs font-medium border border-bnb-border rounded-lg hover:bg-bnb-bg transition-colors text-bnb-text"
          @click="store.currentWeek"
        >
          Текущая неделя
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-bnb-border hover:bg-bnb-bg transition-colors"
          @click="store.nextWeek"
        >
          <svg
            class="w-4 h-4 text-bnb-text-muted"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <div class="text-sm text-bnb-text-muted">
        {{ formatDate(store.weekDates[0]) }} —
        {{ formatDate(store.weekDates[6]) }}
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- Таблица смен — 2/3 ширины -->
      <div class="col-span-2">
        <div
          class="bg-white rounded-xl border border-bnb-border overflow-hidden"
        >
          <table class="w-full">
            <thead>
              <tr class="bg-bnb-bg border-b border-bnb-border">
                <th
                  class="text-left px-4 py-3 text-xs font-semibold text-bnb-text-muted w-32"
                >
                  Сотрудник
                </th>
                <th
                  v-for="(date, i) in store.weekDates"
                  :key="date"
                  class="text-center px-2 py-3 text-xs font-semibold"
                  :class="[
                    isToday(date)
                      ? 'text-bnb-primary bg-bnb-primary-light'
                      : 'text-bnb-text-muted',
                    isWeekend(date) ? 'opacity-50' : '',
                  ]"
                >
                  <div>{{ WEEK_DAYS[i] }}</div>
                  <div class="font-normal text-[11px]">
                    {{ formatDate(date) }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-bnb-border">
              <tr
                v-for="employee in store.employees"
                :key="employee.id"
                class="hover:bg-bnb-bg transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full bg-bnb-primary flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-white text-[9px] font-bold">
                        {{
                          employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        }}
                      </span>
                    </div>
                    <span
                      class="text-xs font-medium text-bnb-text truncate max-w-[80px]"
                    >
                      {{ employee.name.split(" ")[0] }}
                    </span>
                  </div>
                </td>
                <td
                  v-for="date in store.weekDates"
                  :key="date"
                  class="px-1 py-2 text-center cursor-pointer hover:bg-bnb-primary-light transition-colors"
                  :class="isWeekend(date) ? 'bg-gray-50' : ''"
                  @click="openForm(employee.id, date)"
                >
                  <ShiftCell :shift="store.getShift(employee.id, date)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Легенда -->
        <div class="flex flex-wrap gap-3 mt-3">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
            <span class="text-[11px] text-bnb-text-muted"
              >Утренняя (09–18)</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <span
              class="w-3 h-3 rounded bg-purple-100 border border-purple-200"
            />
            <span class="text-[11px] text-bnb-text-muted"
              >Вечерняя (14–23)</span
            >
          </div>
          <div class="flex items-center gap-1.5">
            <span
              class="w-3 h-3 rounded bg-green-100 border border-green-200"
            />
            <span class="text-[11px] text-bnb-text-muted">Отпуск</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded bg-red-100 border border-red-200" />
            <span class="text-[11px] text-bnb-text-muted">Больничный</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-amber-600 text-xs">↑</span>
            <span class="text-[11px] text-bnb-text-muted">Переработка</span>
          </div>
        </div>
      </div>

      <!-- Правая колонка — согласование + переработки -->
      <div class="space-y-4">
        <PendingShifts />

        <!-- Переработки -->
        <div
          class="bg-white rounded-xl border border-bnb-border overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-bnb-border">
            <p class="text-sm font-semibold text-bnb-text">Переработки</p>
          </div>
          <div class="divide-y divide-bnb-border">
            <div
              v-for="employee in store.employees"
              :key="employee.id"
              class="flex items-center justify-between px-5 py-3"
            >
              <span class="text-sm text-bnb-text">{{
                employee.name.split(" ")[0]
              }}</span>
              <div class="flex items-center gap-1">
                <span
                  class="text-sm font-semibold"
                  :class="
                    (store.overtimeByUser.get(employee.id) ?? 0) > 0
                      ? 'text-amber-600'
                      : 'text-bnb-text-muted'
                  "
                >
                  {{
                    Math.round(
                      (store.overtimeByUser.get(employee.id) ?? 0) / 60,
                    )
                  }}ч
                </span>
                <span class="text-xs text-bnb-text-muted">/ месяц</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ShiftCreateForm
      v-model="isFormOpen"
      :user-id="selectedUserId"
      :date="selectedDate"
    />
  </div>
</template>
