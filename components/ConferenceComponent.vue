<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query, type Models } from 'appwrite';
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import ChatMessage from './ChatMessage.vue';

const props = defineProps<{
  item: Object,
  index: Number,
  accountInformation: Object,
  chatMessages: Object
}>()

console.log(props.item.ActiveCall)
console.log(props.item.Author)
console.log(props.accountInformation.name)
</script>

<template>
    <TabsContent :value="index" class="absolute top-42 right-10 pl-[5.5rem] w-8/12 pb-[12.5rem] h-full flex-col justify-between">
        <Card class="flex flex-col justify-between h-full">
          <CardHeader class="flex flex-row justify-between p-4">
            <div class="flex flex-row">
              <Avatar class="h-12 w-12 bg-background">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback class="text-foreground">{{ item.Name.substr(0, 2).toUpperCase() }}</AvatarFallback>
              </Avatar>
              <CardTitle class="p-3">{{item.Name}}</CardTitle>
            </div>
            <div v-if="item.ActiveCall === false && item.Author == accountInformation.$id" class="flex gap-x-4 p-1">
              <Button class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Начать
                видеозвонок</Button>
              <Button
                class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Участники</Button>
              <Button
                class="w-10 h-10 bg-background rounded-full text-foreground text-md font-semibold text-center hover:text-background">...</Button>
            </div>
            <div v-else-if="item.ActiveCall === true && item.Author == accountInformation.$id" class="flex gap-x-4 p-1">
              <Button class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Присоединиться к звонку</Button>
              <Button
                class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Участники </Button>
              <Button
                class="w-10 h-10 bg-background rounded-full text-foreground text-md font-semibold text-center hover:text-background">...</Button>
            </div>
            <div v-else-if="item.ActiveCall === false && item.Author != accountInformation.$id" class="flex gap-x-4 p-1">
              <Button
                class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Участники</Button>
              <Button
                class="w-10 h-10 bg-background rounded-full text-foreground text-md font-semibold text-center hover:text-background">...</Button>
            </div>
            <div v-else-if="item.ActiveCall === true && item.Author != accountInformation.$id" class="flex gap-x-4 p-1">
              <Button class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Присоединиться к звонку</Button>
              <Button
                class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background">Участники</Button>
              <Button
                class="w-10 h-10 bg-background rounded-full text-foreground text-md font-semibold text-center hover:text-background">...</Button>
            </div>
          </CardHeader>
          <ScrollArea>
          <ChatMessage v-if="chatMessages" v-for="(item, index) in chatMessages" :item="item" :index="index" :key="item.$id" :accountInformation="accountInformation"></ChatMessage>
        </ScrollArea>
          <CardFooter class="flex border-t border-border p-4 gap-4 bg-foreground">
            <textarea class="rounded-lg w-full bg-background border border-border px-3 py-2"></textarea>
            <Button class="w-11 h-11 bg-background rounded-full border border-input"></Button>
          </CardFooter>
        </Card>
      </TabsContent>
</template>