<script setup lang="ts">
const links: string[] = ["link1", "link2", "link3"];
</script>

<template>
  <aside
    class="w-[260px] h-screen bg-white border-r border-bnb-border fixed left-0 top-0 z-20 py-2"
  >
    <div
      class="h-[100px] flex flex-wrap items-center justify-center px-6 border-b border-bnb-border"
    >
      <img src="/bnb-logo.svg" alt="" />
      <h1 class="text-3xl font-extrabold text-bnb-accent">HR Portal</h1>
    </div>
    <nav class="p-4">
      <ul>
        <li v-for="link in links">
          <router-link :to="link" class="font-bold text-bnb-accent">
            {{ link }}</router-link
          >
        </li>
      </ul>
    </nav>
  </aside>
</template>
