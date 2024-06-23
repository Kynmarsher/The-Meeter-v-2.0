<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
    <div class="ml-auto flex items-center">
      <NuxtLink to="./">
        <img src="/public/logo1.png" class="h-[3.8rem] w-[14rem] rotate-0 scale-100">
      </NuxtLink>
    </div>
    <a href="./" class="text-medium font-medium text-muted-foreground transition-colors hover:text-primary">
      Текущие конференции
    </a>
    <a href="./VideoConference" class="text-medium font-medium text-muted-foreground transition-colors hover:text-primary">
      Запланированные конференции
    </a>
    <a href="./" class="text-medium font-medium text-muted-foreground transition-colors hover:text-primary">
      Настройки
    </a>
  </nav>
</template>
