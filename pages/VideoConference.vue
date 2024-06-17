<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query, type Models } from 'appwrite'

let chatMessages = ref(undefined)
let chat = ref(false)

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6655c51b002ccc6d11bf');

const databases = new Databases(client);

function toogleChat() {
    chat.value = !chat.value
}

function getChatMessages(conference) {
    const promise = databases.listDocuments(
        "666459840018cf31333a",
        "666595dd002b049dc275",
        [Query.equal("Conference", conference),
        Query.orderAsc("MessageTime")]
    );
    promise.then(function (response) {
        chatMessages.value = response.documents
        console.log("Список сообщений в чате:")
        console.log(chatMessages.value)
    })
}
</script>


<template>
    <div class="fixed flex flex-col h-full w-full">
        <img src="/public/Flag.jpg" alt="Image" class="h-full object-cover">
        <div class='absolute flex auto-cols-max w-full h-screen justify-end bg-black bg-opacity-80'>
            <div class="relative flex w-full h- bg-transparent">
                <div class="flex flex-wrap gap-4 p-8 w-full h-[90vh] justify-around content-start overflow-hidden">
                    <div class="flex w-full max-w-[300px] min-w-[100px] h-[200px] bg-white"></div>
                </div>
                <button
                    class="absolute h-[250px] w-[50px] bg-foreground/80 border-border border hover:border-white right-3 self-center rounded-3xl transition-all"
                    @click="toogleChat()"></button>
            </div>
            <Transition enter-active-class="duration-300 ease-out" enter-from-class="transform w-0"
                enter-to-class="w-full" leave-active-class="duration-300 ease-in" leave-from-class="w-full"
                leave-to-class="transform w-0">
                <div v-show="chat" class="h-full w-5/12 bg-transparent">
                    <card class="flex flex-col justify-between h-full">
                        <CardHeader class="flex flex-row justify-between p-4 gap-4">
                            <div class="flex flex-row">
                                <Avatar class="h-12 w-12 bg-background">
                                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                    <AvatarFallback class="text-foreground">123
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle class="p-3">ФРИК</CardTitle>
                            </div>
                        </CardHeader>
                        <ScrollArea>
                            <ChatMessage v-if="chatMessages" v-for="(item, index) in chatMessages" :item="item"
                                :index="index" :key="item.$id" :accountInformation="accountInformation"></ChatMessage>
                        </ScrollArea>
                        <CardFooter class="flex border-t border-border p-4 gap-4 bg-foreground">
                            <textarea class="rounded-lg w-full bg-background border border-border px-3 py-2"></textarea>
                            <Button class="w-11 h-11 bg-background rounded-full border border-input"></Button>
                        </CardFooter>
                    </card>
                </div>
            </Transition>
        </div>
        <div class="group absolute bottom-0  w-full h-1/6 bg-transparent">
            <div
                class="w-[550px] h-[100px] mx-auto mt-28 bg-foreground/80 rounded-3xl transition-all duration-300 group-hover:mt-0">
            </div>
        </div>
    </div>
</template>