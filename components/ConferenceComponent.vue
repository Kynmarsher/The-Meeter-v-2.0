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
import { socket } from "../components/socket"

const props = defineProps<{
  item: Object,
  index: Number,
  accountInformation: Object,
  chatMessages: Object
}>()

function createRoom(id) {
  // CreateRoomRequestPacket(String name)
  socket.emit('createRoom', { roomId: id }, (response) => {
    // CreateRoomResponsePacket(String roomId)
    var data = JSON.parse(response);
    console.log(window.location.href + data.roomId);
    location.href = './VideoConference-' + data.roomId
  });

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('6655c51b002ccc6d11bf'); // Your project ID

  const databases = new Databases(client);

  const result = databases.updateDocument(
    '666459840018cf31333a', // databaseId
    '6664599a003c2329af67', // collectionId
    props.item.$id, // documentId
    { "ActiveCall": true } // data (optional)
  )
  location.href = './VideoConference-' + id;
}


function joinRoom(id) {
  location.href = './VideoConference-' + id
}
</script>

<template>
  <TabsContent :value="index" class="w-full h-full flex-col justify-between">
    <Card class="flex flex-col justify-between h-full rounded-lg">
      <CardHeader class="flex flex-row justify-between p-3 rounded-none bg-foreground text-background">
        <div class="flex flex-row">
          <Avatar class="h-12 w-12 bg-background">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback class="text-foreground">{{ item.Name.substr(0, 2).toUpperCase() }}</AvatarFallback>
          </Avatar>
          <CardTitle class="p-3">{{ item.Name }}</CardTitle>
        </div>
        <div v-if="item.ActiveCall === false && item.Author == accountInformation.$id" class="flex gap-x-4 p-1">
          <Button @click="createRoom(item.$id)"
            class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background hover:bg-outcome-message">Начать
            видеозвонок</Button>
          <Button
            class="w-10 h-10 bg-background text-foreground text-md rounded-full font-semibold hover:text-background hover:bg-outcome-message">...</Button>
        </div>
        <div v-else-if="item.ActiveCall === true && item.Author == accountInformation.$id" class="flex gap-x-4 p-1">
          <Button @click="joinRoom(item.$id)"
            class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background hover:bg-outcome-message">Присоединиться
            к
            звонку</Button>
          <Button
            class="w-10 h-10 bg-background text-foreground text-md rounded-full font-semibold hover:text-background hover:bg-outcome-message">...</Button>
        </div>
        <div v-else-if="item.ActiveCall === false && item.Author != accountInformation.$id" class="flex gap-x-4 p-1">
          <Button
            class="w-10 h-10 bg-background text-foreground text-md rounded-full font-semibold hover:text-background hover:bg-outcome-message">...</Button>
        </div>
        <div v-else-if="item.ActiveCall === true && item.Author != accountInformation.$id" class="flex gap-x-4 p-1">
          <Button @click="joinRoom(item.$id)"
            class="px-4 py-2 bg-background text-foreground text-md font-semibold hover:text-background hover:bg-outcome-message">Присоединиться
            к
            звонку</Button>
          <Button
            class="w-10 h-10 bg-background text-foreground text-md rounded-full font-semibold hover:text-background hover:bg-outcome-message">...</Button>
        </div>
      </CardHeader>
      <ScrollArea>
        <ChatMessage v-if="chatMessages" v-for="(item, index) in chatMessages" :item="item" :index="index"
          :key="item.$id" :accountInformation="accountInformation"></ChatMessage>
      </ScrollArea>
      <CardFooter class="flex border-t border-border p-4 gap-4 bg-foreground">
        <textarea class="rounded-lg w-full bg-background border border-border px-3 py-2"></textarea>
        <Button class="w-11 h-11 bg-background rounded-full border border-input hover:bg-outcome-message"></Button>
      </CardFooter>
    </Card>
  </TabsContent>
</template>