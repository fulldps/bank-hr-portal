<script setup lang="ts">
import BaseCard from "@/shared/ui/BaseCard.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import BaseBadge from "@/shared/ui/BaseBadge.vue";
</script>

<template>
  <div class="p-8 space-y-6">
    <!-- Тест Карты -->
    <BaseCard>
      <div class="p-4">
        <h2 class="text-lg font-bold text-bnb-text">Тестовая карточка</h2>
        <p class="text-sm text-bnb-text-muted mt-1">
          Здесь будет контент виджета.
        </p>
      </div>
    </BaseCard>

    <!-- Тест Кнопок -->
    <div class="flex gap-4">
      <BaseButton variant="primary">Primary</BaseButton>
      <BaseButton variant="secondary">Secondary</BaseButton>
      <BaseButton variant="danger">Danger</BaseButton>
    </div>

    <!-- Тест Бейджей -->
    <div class="flex gap-2">
      <BaseBadge label="New" colorClass="bg-blue-100 text-blue-800" />
      <BaseBadge label="Critical" colorClass="bg-red-100 text-red-800" />
      <BaseBadge label="Done" colorClass="bg-green-100 text-green-800" />
    </div>
  </div>
</template>
