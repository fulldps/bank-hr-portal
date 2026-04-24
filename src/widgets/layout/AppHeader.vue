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
    class="fixed top-0 z-10 h-[60px] bg-white border-b border-bnb-border flex items-center justify-between px-6 transition-all duration-200"
    :class="
      ui.isSidebarCollapsed
        ? 'left-[64px] w-[calc(100%-64px)]'
        : 'left-[240px] w-[calc(100%-240px)]'
    "
  >
    <!-- Левая зона: заголовок + breadcrumbs -->
    <div class="flex flex-col gap-1">
      <h1 class="text-[15px] font-semibold text-bnb-text leading-none">
        {{ breadcrumbs.at(-1)?.label ?? "" }}
      </h1>
      <nav aria-label="breadcrumb">
        <ol class="flex items-center gap-1">
          <li
            v-for="(item, index) in breadcrumbs"
            :key="index"
            class="flex items-center"
          >
            <router-link
              v-if="index !== breadcrumbs.length - 1"
              :to="item.path"
              class="text-xs text-bnb-text-muted hover:text-bnb-primary transition-colors duration-150"
            >
              {{ item.label }}
            </router-link>
            <span v-else class="text-xs font-medium text-bnb-text">
              {{ item.label }}
            </span>
            <svg
              v-if="index !== breadcrumbs.length - 1"
              class="w-3 h-3 text-bnb-text-muted mx-1 flex-shrink-0"
              fill="none"
              viewBox="0 0 12 12"
            >
              <path
                d="M4 2l4 4-4 4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Правая зона: уведомления + разделитель + аватар -->
    <div class="flex items-center gap-3">
      <!-- Кнопка уведомлений -->
      <button
        class="w-9 h-9 rounded-lg flex items-center justify-center text-bnb-text-muted hover:bg-bnb-primary-light hover:text-bnb-primary transition-colors duration-150 relative"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 20 20">
          <path
            d="M10 2a6 6 0 00-6 6v3.5L2.5 13h15L16 11.5V8a6 6 0 00-6-6z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path
            d="M8.5 16a1.5 1.5 0 003 0"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
        <div
          class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
        >
          3
        </div>
      </button>

      <!-- Разделитель -->
      <div class="w-px h-6 bg-bnb-border" />

      <!-- Аватар пользователя -->
      <button
        class="w-9 h-9 rounded-full bg-bnb-primary flex items-center justify-center text-[11px] font-semibold text-white cursor-pointer hover:ring-2 hover:ring-bnb-primary hover:ring-offset-1 transition-all duration-150"
      >
        АИ
      </button>
    </div>
  </header>
</template>
