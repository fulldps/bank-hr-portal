<script setup lang="ts">
import { useShiftStore } from "@/features/schedule/store";
import { SHIFT_TYPE_CONFIG } from "@/entities/shift";
import BaseButton from "@/shared/ui/BaseButton.vue";
import { ref } from "vue";

const store = useShiftStore();
const rejectReason = ref("");
const rejectingId = ref<string | null>(null);

function approve(id: string) {
  store.approveShift(id);
}

function startReject(id: string) {
  rejectingId.value = id;
}

function confirmReject() {
  if (!rejectingId.value) return;
  store.rejectShift(rejectingId.value, rejectReason.value || "Без причины");
  rejectingId.value = null;
  rejectReason.value = "";
}
</script>

<template>
  <div class="bg-white rounded-xl border border-bnb-border overflow-hidden">
    <div
      class="px-5 py-4 border-b border-bnb-border flex items-center justify-between"
    >
      <p class="text-sm font-semibold text-bnb-text">На согласовании</p>
      <span
        v-if="store.pendingShifts.length > 0"
        class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"
      >
        {{ store.pendingShifts.length }}
      </span>
    </div>

    <div v-if="store.pendingShifts.length === 0" class="px-5 py-8 text-center">
      <p class="text-sm text-bnb-text-muted">Нет смен на согласовании</p>
    </div>

    <div v-else class="divide-y divide-bnb-border">
      <div
        v-for="shift in store.pendingShifts"
        :key="shift.id"
        class="px-5 py-3"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-bnb-text">
              {{ shift.userName }}
            </p>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-bnb-text-muted">
                {{
                  new Date(shift.date).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                  })
                }}
              </span>
              <span
                class="text-[11px] font-semibold px-1.5 py-0.5 rounded"
                :class="[
                  SHIFT_TYPE_CONFIG[shift.type].bgColor,
                  SHIFT_TYPE_CONFIG[shift.type].color,
                ]"
              >
                {{ SHIFT_TYPE_CONFIG[shift.type].label }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton
              variant="secondary"
              size="sm"
              @click="startReject(shift.id)"
            >
              Отклонить
            </BaseButton>
            <BaseButton variant="primary" size="sm" @click="approve(shift.id)">
              Утвердить
            </BaseButton>
          </div>
        </div>

        <div v-if="rejectingId === shift.id" class="mt-2 flex gap-2">
          <input
            v-model="rejectReason"
            type="text"
            placeholder="Причина отклонения..."
            class="flex-1 h-8 px-2 text-xs border border-bnb-border rounded-lg focus:border-bnb-primary outline-none"
          />
          <BaseButton variant="danger" size="sm" @click="confirmReject">
            Подтвердить
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
