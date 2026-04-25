<script setup lang="ts">
import { TaskBoard } from "@/features/tasks/components";
import { useTaskStore } from "@/features/tasks/store";
import { onMounted } from "vue";

const store = useTaskStore();
onMounted(() => {});
</script>

<template>
  <div class="p-6 h-full">
    <TaskBoard />
  </div>
</template>
