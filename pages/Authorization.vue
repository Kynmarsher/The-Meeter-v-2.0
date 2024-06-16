<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Client, Account, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6655c51b002ccc6d11bf');

function enterAcc() {
  const account = new Account(client);

  const promise = account.createEmailPasswordSession(email, password);

  promise.then(
    function (response) {
      console.log("Сессия успешно создана");
      console.log(response);
      document.cookie = "userId =" + response["userId"];
      document.cookie = "sessionId =" + response["$id"];
      console.log(document.cookie);
      navigateTo({
        path: '/CurrentConferences'
      });;
    },
    function (error) {
      console.log("Ошибка создания сессии");
      console.log(error);
      alert(error);
    }
  );
}

let AuthOrReg = true
let password: string;
let email: string;
let name: string;
</script>

<template>
  <div class="fixed md:flex h-full w-full">
    <div class="flex flex-row w-full h-full items-center justify-evenly">
      <div class="flex w-full h-full items-center justify-center">
        <div class="mx-auto grid w-[350px] gap-6">
          <div class="grid gap-2 text-center">
            <h1 class="text-3xl font-bold">
              Авторизация
            </h1>
            <p class="text-wrap text-center text-muted-foreground">
              Введите свой адрес электронной почты и пароль
            </p>
          </div>
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="email">Адрес электронной почты</Label>
              <Input id="email" type="email" v-model="email" placeholder="" required />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password">Пароль</Label>
                <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
                  Забыли пароль?
                </a>
              </div>
              <Input id="password" type="password" v-model="password" required />
            </div>
            <Button type="submit" class="w-full" @click="enterAcc()">
              Войти
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            У вас нет учетной записи?
            <NuxtLink to="/Registration" class="underline">
              Зарегистрироваться
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="flex w-full h-full bg-foreground items-center justify-center">
        <img src="/public/Gerb1.png" alt="Image" class="h-full object-cover p-8">
      </div>
    </div>
  </div>
</template>