<script setup lang="ts">
import { RouterView } from "vue-router";
import { useToastStore } from "@/app/stores/toastStore";
import BaseToast from "@/shared/ui/BaseToast.vue";

const toast = useToastStore();
</script>

<template>
  <RouterView />

  <!-- Toast контейнер -->
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
      <TransitionGroup name="toast">
        <BaseToast
          v-for="t in toast.toasts"
          :key="t.id"
          :message="t.message"
          :variant="t.variant"
          @close="toast.dismiss(t.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
