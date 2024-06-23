<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query, type Models } from 'appwrite'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'

const props = defineProps<{
  accountInformation: Object
  sessionInformation: Object
  cookie: Object
}>()

function exitAcc() {
  console.log(document.cookie);

  const client = new Client();

  const account = new Account(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6655c51b002ccc6d11bf');


  const promise = account.deleteSession(props.cookie.sessionId);

  promise.then(
    function (response) {
      document.cookie = `userId=;expires=-1`;
      document.cookie = "sessionId=;expires =-1";
      console.log("Сессия успешна удалена");
      console.log(response); // Success
      setTimeout(() => {
        window.location.href='/'
      }, 1000);
    },
    function (error) {
      console.log("Ошибка при удалении сессии");
      console.log(error); // Failure
    }
  );
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-12 w-12 bg-foreground">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback class="text-background"> {{ accountInformation.name[0] + accountInformation.name.split(' ')[1][0]}}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ accountInformation.name }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ accountInformation.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Профиль
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="exitAcc()">
        Выход
        <DropdownMenuShortcut></DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
