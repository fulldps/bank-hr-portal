<script setup lang="ts">
import { ref } from "vue";
import BaseModal from "@/shared/ui/BaseModal.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import { useTaskStore } from "@/features/tasks/store";
import {
  TASK_PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  TASK_COLUMN_ORDER,
} from "@/entities/task";
import type { TaskStatus, TaskPriority } from "@/entities/task";

const props = defineProps<{
  modelValue: boolean;
  defaultStatus?: TaskStatus;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
}>();

const store = useTaskStore();

const form = ref({
  title: "",
  description: "",
  priority: "medium" as TaskPriority,
  status: (props.defaultStatus ?? "todo") as TaskStatus,
  dueDate: "",
  assigneeName: "",
  tags: "",
});

const errors = ref<Record<string, string>>({});

function validate() {
  errors.value = {};
  if (!form.value.title.trim()) errors.value.title = "Название обязательно";
  return Object.keys(errors.value).length === 0;
}

function resetForm() {
  form.value = {
    title: "",
    description: "",
    priority: "medium",
    status: props.defaultStatus ?? "todo",
    dueDate: "",
    assigneeName: "",
    tags: "",
  };
  errors.value = {};
}

function handleSubmit() {
  if (!validate()) return;
  store.createTask({
    title: form.value.title.trim(),
    description: form.value.description.trim() || undefined,
    priority: form.value.priority,
    status: form.value.status,
    dueDate: form.value.dueDate || undefined,
    assigneeName: form.value.assigneeName.trim() || undefined,
    tags: form.value.tags
      ? form.value.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  });
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
    title="Новая задача"
    size="md"
    @update:model-value="handleClose"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">
          Название <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          placeholder="Название задачи..."
          class="w-full h-9 px-3 text-sm border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted outline-none transition-colors"
          :class="
            errors.title
              ? 'border-red-400'
              : 'border-bnb-border focus:border-bnb-primary'
          "
        />
        <p v-if="errors.title" class="text-xs text-red-500">
          {{ errors.title }}
        </p>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">Описание</label>
        <textarea
          v-model="form.description"
          rows="2"
          placeholder="Подробности..."
          class="w-full px-3 py-2 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted focus:border-bnb-primary outline-none transition-colors resize-none"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted"
            >Приоритет</label
          >
          <select
            v-model="form.priority"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          >
            <option
              v-for="(cfg, key) in TASK_PRIORITY_CONFIG"
              :key="key"
              :value="key"
            >
              {{ cfg.label }}
            </option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Колонка</label>
          <select
            v-model="form.status"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          >
            <option v-for="s in TASK_COLUMN_ORDER" :key="s" :value="s">
              {{ TASK_STATUS_CONFIG[s].label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted">Срок</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text focus:border-bnb-primary outline-none transition-colors"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-medium text-bnb-text-muted"
            >Исполнитель</label
          >
          <input
            v-model="form.assigneeName"
            type="text"
            placeholder="Имя Фамилия"
            class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted focus:border-bnb-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs font-medium text-bnb-text-muted">Теги</label>
        <input
          v-model="form.tags"
          type="text"
          placeholder="audit, docs"
          class="w-full h-9 px-3 text-sm border border-bnb-border rounded-lg bg-white text-bnb-text placeholder:text-bnb-text-muted focus:border-bnb-primary outline-none transition-colors"
        />
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="handleClose">Отмена</BaseButton>
      <BaseButton variant="primary" @click="handleSubmit"
        >Создать задачу</BaseButton
      >
    </template>
  </BaseModal>
</template>
