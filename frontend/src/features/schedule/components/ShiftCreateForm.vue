<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "@/shared/ui/BaseModal.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import { useShiftStore } from "@/features/schedule/store";
import { SHIFT_TYPE_CONFIG } from "@/entities/shift";
import type { ShiftType } from "@/entities/shift";

const props = defineProps<{
  modelValue: boolean;
  userId?: string;
  userName?: string;
  date?: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const store = useShiftStore();

const initialDate: string =
  props.date !== undefined
    ? props.date
    : new Date().toISOString().split("T")[0];

const form = ref<{
  type: ShiftType;
  startTime: string;
  endTime: string;
  date: string;
}>({
  type: "morning",
  startTime: "09:00",
  endTime: "18:00",
  date: initialDate,
});

const hasTime = (type: ShiftType): boolean =>
  ["morning", "evening", "night"].includes(type);

function handleSubmit() {
  store.createShift({
    userId: props.userId !== undefined ? props.userId : "user-1",
    userName: props.userName !== undefined ? props.userName : "Сотрудник",
    date: form.value.date,
    type: form.value.type,
    startTime: hasTime(form.value.type) ? form.value.startTime : undefined,
    endTime: hasTime(form.value.type) ? form.value.endTime : undefined,
    overtimeMinutes: 0,
    status: "pending",
  });
  emits("update:modelValue", false);
}

function handleClose() {
  emits("update:modelValue", false);
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Предложить смену"
    size="sm"
    @update:model-value="handleClose"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">Дата</label>
        <input
          v-model="form.date"
          type="date"
          class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
        />
      </div>
      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">Тип смены</label>
        <select
          v-model="form.type"
          class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
        >
          <option
            v-for="(cfg, key) in SHIFT_TYPE_CONFIG"
            :key="key"
            :value="key"
          >
            {{ cfg.label }}
          </option>
        </select>
      </div>
      <div v-if="hasTime(form.type)" class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Начало</label>
          <input
            v-model="form.startTime"
            type="time"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Конец</label>
          <input
            v-model="form.endTime"
            type="time"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          />
        </div>
      </div>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="handleClose">Отмена</BaseButton>
      <BaseButton variant="primary" @click="handleSubmit">Отправить</BaseButton>
    </template>
  </BaseModal>
</template>
