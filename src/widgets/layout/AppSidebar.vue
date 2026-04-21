<script setup lang="ts">
import { useUiStore } from "@/app/stores/uiStore";
import { NAV_GROUPS } from "@/shared/config/navigation";
import NavIcon from "@/shared/ui/NavIcon.vue";

const ui = useUiStore();
</script>

<template>
  <aside
    class="flex flex-col transition-all duration-200 h-screen bg-white border-r border-bnb-border fixed left-0 top-0 z-20 py-2"
    :class="ui.isSidebarCollapsed ? 'w-[64px]' : 'w-[240px]'"
  >
    <div
      class="h-[100px] flex flex-wrap items-center justify-center px-6 border-b border-bnb-border"
    >
      <img src="/bnb-logo.svg" alt="" class="h-[60px]" />
      <h1 class="text-3xl font-extrabold text-bnb-accent">HR Portal</h1>
    </div>

    <!-- Nav panel -->
    <nav class="p-4">
      <ul>
        <li v-for="group in NAV_GROUPS" :key="group.groupLabel">
          <h3
            class="text-xl text-bnb-accent px-3 mb-2 font-semibold uppercase tracking-wider"
          >
            {{ group.groupLabel }}
          </h3>

          <!-- Menu -->
          <ul class="space-y-1">
            <li v-for="item in group.items" :key="item.to">
              <router-link :to="item.to" class="nav-link">
                <NavIcon :name="item.icon" />
                <span v-if="!ui.isSidebarCollapsed" class="ml-2">
                  {{ item.label }}
                </span></router-link
              >
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>
