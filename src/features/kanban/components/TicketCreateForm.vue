<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "@/shared/ui/BaseModal.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import { useKanbanStore } from "@/features/kanban/store";
import type { TicketStatus, TicketPriority } from "@/entities/ticket";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  COLUMN_ORDER,
} from "@/entities/ticket";

interface Props {
  modelValue: boolean;
  defaultStatus?: TicketStatus;
}

const props = withDefaults(defineProps<Props>(), {
  defaultStatus: "todo",
});

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "created"): void;
}>();

const store = useKanbanStore();

// ── Состояние формы ───────────────────────────────────────
const form = ref({
  title: "",
  description: "",
  priority: "medium" as TicketPriority,
  status: props.defaultStatus as TicketStatus,
  dueDate: "",
  tags: "",
});

const errors = ref<Record<string, string>>({});

// ── Валидация ─────────────────────────────────────────────
function validate(): boolean {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = "Название обязательно";
  }

  return Object.keys(errors.value).length === 0;
}

// ── Сброс формы ───────────────────────────────────────────
function resetForm() {
  form.value = {
    title: "",
    description: "",
    priority: "medium",
    status: props.defaultStatus,
    dueDate: "",
    tags: "",
  };
  errors.value = {};
}

// ── Сабмит ────────────────────────────────────────────────
function handleSubmit() {
  if (!validate()) return;

  store.createTicket({
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: form.value.priority,
    status: form.value.status,
    dueDate: form.value.dueDate || undefined,
    tags: form.value.tags
      ? form.value.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  });

  emits("created");
  emits("update:modelValue", false);
  resetForm();
}

function handleClose() {
  emits("update:modelValue", false);
  resetForm();
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Новый тикет"
    size="md"
    @update:model-value="handleClose"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Название -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">
          Название <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Кратко опишите проблему..."
          class="w-full h-9 px-3 text-sm border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted transition-colors duration-150 outline-none"
          :class="
            errors.title
              ? 'border-red-400 focus:border-red-500'
              : 'border-bnb-border focus:border-bnb-primary'
          "
        />
        <p v-if="errors.title" class="text-xs text-red-500">
          {{ errors.title }}
        </p>
      </div>

      <!-- Описание -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">Описание</label>
        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Подробно опишите ситуацию..."
          class="w-full px-3 py-2 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted focus:border-bnb-primary outline-none transition-colors duration-150 resize-none"
        />
      </div>

      <!-- Приоритет + Колонка -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted"
            >Приоритет</label
          >
          <select
            v-model="form.priority"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors duration-150"
          >
            <option
              v-for="(config, key) in PRIORITY_CONFIG"
              :key="key"
              :value="key"
            >
              {{ config.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Колонка</label>
          <select
            v-model="form.status"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors duration-150"
          >
            <option
              v-for="status in COLUMN_ORDER"
              :key="status"
              :value="status"
            >
              {{ STATUS_CONFIG[status].label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Срок + Теги -->
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Срок</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors duration-150"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Теги</label>
          <input
            v-model="form.tags"
            type="text"
            placeholder="devops, urgent"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted focus:border-bnb-primary outline-none transition-colors duration-150"
          />
        </div>
      </div>
    </form>

    <!-- Footer -->
    <template #footer>
      <BaseButton variant="secondary" @click="handleClose"> Отмена </BaseButton>
      <BaseButton variant="primary" @click="handleSubmit">
        Создать тикет
      </BaseButton>
    </template>
  </BaseModal>
</template>
