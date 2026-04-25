import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);

  function show(
    message: string,
    variant: ToastVariant = "info",
    duration = 4000,
  ) {
    const id = Math.random().toString(36).slice(2);
    toasts.value.push({ id, message, variant });
    setTimeout(() => dismiss(id), duration);
    return id;
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  const success = (msg: string) => show(msg, "success");
  const error = (msg: string) => show(msg, "error", 6000);
  const warning = (msg: string) => show(msg, "warning");
  const info = (msg: string) => show(msg, "info");

  return { toasts, show, dismiss, success, error, warning, info };
});
