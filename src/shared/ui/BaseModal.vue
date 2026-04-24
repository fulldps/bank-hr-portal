<script setup lang="ts">
import { onMounted, onUnmounted, OnUnmounted } from "vue";

// Props
interface Props {
  modelValue: boolean;
  title: string;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

// Emits
const emits = defineEmits(["update:modelValue"]);

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
  <Transition>
    <div v-if="modelValue"></div>
  </Transition>
</template>
