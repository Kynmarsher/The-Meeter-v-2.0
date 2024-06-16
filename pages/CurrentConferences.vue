<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query, type Models } from 'appwrite'
import { refDebounced } from '@vueuse/core'
import DateRangePicker from '../components/DateRangePicker.vue'
import MainNav from '../components/MainNav.vue'
import ConferenceList from '../components/ConferenceList.vue'
import CreateConference from '../components/CreateConference.vue'
import Search from '../components/Search.vue'
import UserNav from '../components/UserNav.vue'
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
import { onMounted } from 'vue'

/* const Conferences[]; */
let cookie = ref(undefined);
let accountInformation = ref(undefined);
let sessionInformation = ref(undefined);
let conferenceList = ref(undefined)
let chatMessages = ref(undefined)
let createConferenceProp = ref(false)

const searchValue = ref('')
const debouncedSearch = refDebounced(searchValue, 250)

function toogleCreateConferenceModal(){
  createConferenceProp.value = !createConferenceProp.value
}

const filteredConferencesList = computed(() => {
  let output
  const searchValue = debouncedSearch.value?.trim()
  if (!searchValue) {
    output = conferenceList.value
  }

  else {
    output = conferenceList.value.filter((item) => {
      return item.Name.includes(debouncedSearch.value)
      || item.Description.includes(debouncedSearch.value)
    })
  }
  return output
})


const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6655c51b002ccc6d11bf');

const databases = new Databases(client);

function getCookie() {
  return document.cookie.split("; ").reduce((acc, item) => {
    const [name, value] = item.split("=");
    acc[name] = value;
    return acc;
  }, {});
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

onMounted(() => {
  console.log("Куки:");
  console.log(document.cookie);
  cookie.value = getCookie();
  console.log("Обработанные куки:");
  console.log(cookie.value);

  const account = new Account(client);

  if (cookie.value.sessionId != "") {
    const promise0 = account.getSession(cookie.value.sessionId);

    promise0.then(
      function (response) {
        console.log("Сессия найдена:");
        console.log(response); // Success
        sessionInformation.value = response
        const promise00 = account.get();

        promise00.then(
          function (response) {
            console.log("Информация по аккаунту:");
            console.log(response); // Success
            accountInformation.value = response
            const promise01 = databases.listDocuments(
              "666459840018cf31333a",
              "6664599a003c2329af67",
              [Query.or([
                Query.equal("Author", accountInformation.value.$id),
                Query.contains("Members", [accountInformation.value.$id])]),
              Query.orderDesc("LastMessageTime")
              ]
            );
            promise01.then(function (response) {
              conferenceList.value = response.documents
              console.log("Список конференций:")
              console.log(conferenceList.value)
            })
          },
          function (error) {
            ("Ошибка подгрузки информации по аккаунту");
            console.log(error); // Failure
          }
        );
      },
      function (error) {
        console.log("Сессия НЕ найдена:");
        console.log(error); // Failure
        document.cookie = `userId=;expires=-1`;
        document.cookie = "sessionId=;expires =-1";
      }
    );
  }
})
</script>

<template>
  <div class="fixed flex flex-col md:flex h-full w-full">
    <div class="border-b">
      <div class="flex h-[5rem] items-center px-4">
        <MainNav class="mx-6" />
        <div class="ml-auto flex items-center space-x-4">
          <UserNav v-if="accountInformation" :accountInformation="accountInformation"
            :sessionInformation="sessionInformation" :cookie="cookie" />
        </div>
      </div>
    </div>
    <div class="flex-1 space-y-4 p-8 pt-6">
      <div class="flex space-x-8 space-y-1">
        <h2 class="text-3xl font-bold tracking-tight whitespace-nowrap">
          Текущие конференции
        </h2>
        <div class="mr-auto items-center space-x-4">
          <Input v-model="searchValue" placeholder="Найти конференцию..." type="search" class="md:w-[100px] lg:w-[300px]"/>
        </div>
        <div class="flex w-full justify-between">
          <DateRangePicker />
          <Button
            class="md:w-[100px] lg:w-[300px] rounded-md border border-green-button bg-green-button text-lg font-semibold" @click="toogleCreateConferenceModal">
            + Создать новую конференцию</Button>
        </div>
      </div>
      <Tabs v-if="conferenceList" :default-value="0" class="flex flex-row gap-4 w-full h-full pb-16">
        <Card class="w-4/12">
          <CardHeader>
            <CardTitle>Конференции</CardTitle>
          </CardHeader>
          <CardContent>
            <scroll-area id="scroller">
              <TabsList class="h-full w-full space-y-2 flex-col">
                <ConferenceList :items="filteredConferencesList" v-for="(item, index) in filteredConferencesList" :item="item" :index="index" :key="item.$id" @add-task="addtask"
                  @click="getChatMessages(item.$id)" @focus="getChatMessages(item.$id)" @active="getChatMessages(item.$id)"/>
              </TabsList>
            </scroll-area>
          </CardContent>
        </Card>
        <ConferenceComponent v-if="conferenceList && accountInformation" v-for="(item, index) in conferenceList"
          :item="item" :index="index" :key="item.$id" :accountInformation="accountInformation"
          :chatMessages="chatMessages" />
      </Tabs>
    </div>
  </div>
  <CreateConference v-if="createConferenceProp" class="absolute flex w-full h-full bg-transparent/50"></CreateConference>
</template>