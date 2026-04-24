<script setup lang="ts">
import AppHeader from "@/widgets/layout/AppHeader.vue";
import AppSidebar from "@/widgets/layout/AppSidebar.vue";
import { useUiStore } from "@/app/stores/uiStore";

const ui = useUiStore();
</script>

<template>
  <AppHeader />
  <AppSidebar />
  <main
    class="min-h-screen pt-[60px] bg-bnb-bg transition-all duration-200"
    :class="ui.isSidebarCollapsed ? 'ml-[64px]' : 'ml-[240px]'"
  >
    <div><RouterView /></div>
  </main>
</template>
