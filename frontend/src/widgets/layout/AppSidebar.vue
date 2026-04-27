<script setup lang="ts">
import { useUiStore } from "@/app/stores/uiStore";
import { NAV_GROUPS } from "@/shared/config/navigation";
import NavIcon from "@/shared/ui/NavIcon.vue";
import { useAuthStore } from "@/app/stores/authStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/login");
}
const ui = useUiStore();
</script>

<template>
  <aside
    class="flex flex-col transition-all duration-200 h-screen bg-white border-r border-bnb-border fixed left-0 top-0 z-20 py-2"
    :class="ui.isSidebarCollapsed ? 'w-[64px]' : 'w-[240px]'"
  >
    <!-- Логотип -->
    <div
      class="flex items-center justify-center border-b border-bnb-border flex-shrink-0 transition-all duration-200"
      :class="
        ui.isSidebarCollapsed ? 'h-[64px] px-4' : 'h-[80px] px-4 flex-col gap-1'
      "
    >
      <img
        src="/bnb-logo.svg"
        alt="БНБ"
        class="transition-all duration-200 object-contain"
        :class="ui.isSidebarCollapsed ? 'w-8 h-8' : 'h-9'"
      />
      <span
        v-if="!ui.isSidebarCollapsed"
        class="text-3xl font-semibold text-bnb-primary whitespace-nowrap leading-none"
      >
        HR Portal
      </span>
    </div>

    <!-- Nav panel -->
    <nav class="p-4">
      <ul>
        <li v-for="group in NAV_GROUPS" :key="group.groupLabel">
          <h3
            v-if="!ui.isSidebarCollapsed"
            class="text-[10px] font-semibold text-bnb-text-muted uppercase tracking-widest px-3 mb-1 mt-5"
          >
            {{ group.groupLabel }}
          </h3>
          <div
            v-if="!ui.isSidebarCollapsed"
            class="border-b border border-bnb-border my-2 mx-2"
          />

          <!-- Menu -->
          <ul>
            <li v-for="item in group.items" :key="item.to">
              <router-link
                :to="item.to"
                class="nav-link flex items-center"
                active-class="nav-link-active"
                exact-active-class="nav-link-active"
              >
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
    <div class="mt-auto border-t border-bnb-border pt-3"></div>
    <button @click="ui.toggleSidebar()" class="flex justify-end mr-4">
      <img
        src="/arrow-right.svg"
        alt=""
        class="w-10 h-10 transition-all duration-600"
        :class="!ui.isSidebarCollapsed ? 'rotate-180' : ''"
      />
    </button>
    <div class="flex-shrink-0 border-t border-bnb-border p-3">
      <button
        class="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-bnb-text-muted hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        @click="handleLogout"
      >
        <svg
          class="w-[18px] h-[18px] flex-shrink-0"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            d="M7 3H3a1 1 0 00-1 1v10a1 1 0 001 1h4M12 13l4-4-4-4M16 9H7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-if="!ui.isSidebarCollapsed" class="text-sm font-medium"
          >Выйти</span
        >
      </button>
    </div>
  </aside>
</template>
