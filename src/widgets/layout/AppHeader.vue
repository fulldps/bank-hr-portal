<script setup lang="ts">
import { useUiStore } from "@/app/stores/uiStore";
import { useRoute } from "vue-router";
import { computed } from "vue";

const ui = useUiStore();
const route = useRoute();

const breadcrumbs = computed(() => {
  return route.matched
    .filter((record) => record.meta?.title)
    .map((record) => ({
      label: record.meta.title as string,
      path: record.path,
    }));
});
</script>

<template>
  <header
    class="fixed top-0 z-10 h-[60px] bg-white border-b border-bnb-border flex items-center justify-between px-6"
    :class="
      ui.isSidebarCollapsed
        ? 'left-[64px] w-[calc(100%-64px)]'
        : 'left-[240px] w-[calc(100%-240px)]'
    "
  >
    <nav aria-label="breadcrumb">
      <ol class="flex items-center gap">
        <li v-for="(item, index) in breadcrumbs" :key="index">
          <router-link v-if="index !== breadcrumbs.length - 1" :to="item.path">
            {{ item.label }}
          </router-link>

          <span v-else>
            {{ item.label }}
          </span>

          <span
            v-if="index !== breadcrumbs.length - 1"
            class="text-bnb-border mx-1"
            >/</span
          >
        </li>
      </ol>
    </nav>

    <div class="flex items-center gap-3">
      <button
        class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-bnb-primary-light hover:text-bnb-primary relative"
      >
        <div
          class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
        >
          3
        </div>
      </button>

      <button
        class="w-8 h-8 rounded-full bg-bnb-primary flex items-center justify-center text-[11px] font-semibold text-white"
      >
        АИ
      </button>
    </div>
  </header>
</template>
