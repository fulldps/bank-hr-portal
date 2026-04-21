<script setup lang="ts">
import { RouterView } from "vue-router";
import AppSidebar from "./widgets/layout/AppSidebar.vue";
import AppHeader from "./widgets/layout/AppHeader.vue";
</script>

<template>
  <RouterView />
  <AppHeader />
  <AppSidebar />
</template>

<style scoped></style>
