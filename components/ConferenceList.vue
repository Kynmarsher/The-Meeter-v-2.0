<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from './ui/avatar'

const props = defineProps<{
  item: Object,
  index: Number
}>()
</script>

<template>
    <TabsTrigger :value="index" class="group items-center w-full py-3">
      <Avatar class="h-12 w-12 bg-foreground transition-all group-data-[state=active]:bg-background group-focus-visible:bg-background">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback class="text-base text-background group-data-[state=active]:text-foreground">
          {{ item.Name.substr(0, 2).toUpperCase() }}</AvatarFallback>
      </Avatar>
      <div class="ml-4 space-y-1">
        <p class="text-lg font-medium leading-none text-left">
          {{ item.Name }}
        </p>
        <p class="text-base text-muted-foreground text-left group-data-[state=active]:text-background">
          {{ item.Description }}
        </p>
      </div>
      <div class="ml-auto mr-0.5 pl-8 font-medium text-sm float-end text-right whitespace-nowrap">
        <div class="text-center">
          {{ new Date(item.LastMessageTime).toLocaleDateString("ru", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).replace(/\s*г\./, "") }}
        </div>
        <div class="text-right">
          {{ new Date(item.LastMessageTime).toLocaleTimeString("ru", {
            hour: '2-digit',
            minute: '2-digit'
          })}}
        </div>
      </div>
    </TabsTrigger>
</template>
