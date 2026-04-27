<script setup lang="ts">
import type { DepartmentStat } from "@/entities/analytics";

defineProps<{ data: DepartmentStat[] }>();
</script>

<template>
  <div class="bg-white rounded-xl border border-bnb-border overflow-hidden">
    <div class="px-5 py-4 border-b border-bnb-border">
      <p class="text-sm font-semibold text-bnb-text">Статистика по отделам</p>
    </div>

    <table class="w-full">
      <thead>
        <tr class="bg-bnb-bg">
          <th
            class="text-left px-5 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
          >
            Отдел
          </th>
          <th
            class="text-center px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
          >
            Открыто
          </th>
          <th
            class="text-center px-4 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
          >
            Закрыто
          </th>
          <th
            class="text-left px-5 py-3 text-[11px] font-semibold text-bnb-text-muted uppercase tracking-wider"
          >
            SLA
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-bnb-border">
        <tr
          v-for="dept in data"
          :key="dept.name"
          class="hover:bg-bnb-bg transition-colors duration-150"
        >
          <td class="px-5 py-3 text-sm font-medium text-bnb-text">
            {{ dept.name }}
          </td>
          <td class="px-4 py-3 text-center">
            <span
              class="text-sm font-semibold"
              :class="dept.open > 8 ? 'text-red-600' : 'text-bnb-text'"
            >
              {{ dept.open }}
            </span>
          </td>
          <td class="px-4 py-3 text-center text-sm text-bnb-text">
            {{ dept.closed }}
          </td>
          <td class="px-5 py-3">
            <div class="flex items-center gap-2">
              <div
                class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="
                    dept.slaPercent >= 90
                      ? 'bg-green-500'
                      : dept.slaPercent >= 75
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                  "
                  :style="{ width: dept.slaPercent + '%' }"
                />
              </div>
              <span
                class="text-xs font-semibold w-9 text-right"
                :class="
                  dept.slaPercent >= 90
                    ? 'text-green-600'
                    : dept.slaPercent >= 75
                      ? 'text-yellow-600'
                      : 'text-red-600'
                "
              >
                {{ dept.slaPercent }}%
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
