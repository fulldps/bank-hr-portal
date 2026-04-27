<script setup lang="ts">
import { onMounted } from "vue";
import { TaskBoard } from "@/features/tasks/components";
import { useTaskStore } from "@/features/tasks/store";

const store = useTaskStore();
onMounted(() => store.fetchTasks());
</script>

<template>
  <div class="p-6 h-full">
    <TaskBoard />
  </div>
</template>
