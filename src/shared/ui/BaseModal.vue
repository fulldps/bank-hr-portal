<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";

interface Props {
  modelValue: boolean;
  title: string;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const sizeClass = computed(
  () =>
    ({
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl",
    })[props.size],
);

function close() {
  emits("update:modelValue", false);
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/40" @click="close" />

        <!-- Центрирующий контейнер -->
        <div
          class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        >
          <!-- Окно -->
          <div
            class="modal-window bg-white rounded-xl shadow-xl w-full pointer-events-auto"
            :class="sizeClass"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-bnb-border"
            >
              <h3 class="text-base font-semibold text-bnb-text">
                {{ title }}
              </h3>
              <button
                class="w-8 h-8 flex items-center justify-center rounded-lg text-bnb-text-muted hover:bg-bnb-bg hover:text-bnb-text transition-colors duration-150"
                @click="close"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-bnb-border flex items-center justify-end gap-3"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-window,
.modal-leave-active .modal-window {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-window,
.modal-leave-to .modal-window {
  opacity: 0;
  transform: scale(0.95);
}
</style>
