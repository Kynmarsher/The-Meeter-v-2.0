<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Client, Account, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6655c51b002ccc6d11bf');

function createAcc() {
    const account = new Account(client);

    // Register User
    account.create(ID.unique(), email, password, fname + ' ' + lname).then(
        (response) => {
            console.log(response);
            const account = new Account(client);

            const promise = account.createEmailPasswordSession(email, password);

            promise.then(
                function (response) {
                    console.log("Сессия успешно создана");
                    console.log(response);
                    document.cookie = "userId =" + response["userId"];
                    document.cookie = "sessionId =" + response["$id"];
                    console.log(document.cookie);
                    setTimeout(() => {
                        return navigateTo({
                            path: '/CurrentConferences'
                        })
                    }, 2500);
                },
                function (error) {
                    console.log("Ошибка создания сессии");
                    console.log(error);
                    alert(error);
                }
            );
        },
        (error) => {
            console.log(error);
        }
    );
}

let password: string;
let email: string;
let fname: string;
let lname: string;
</script>

<template>
    <div class="fixed md:flex h-full w-full">
        <div class="flex w-full h-full bg-foreground items-center justify-center">
            <img src="/public/Gerb1.png" alt="Image" class="h-full object-cover p-8">
        </div>
        <div class="flex flex-row w-full h-full items-center justify-evenly">
            <div class="flex w-full h-full items-center justify-center">
                <div class="mx-auto grid w-[350px] gap-6">
                    <div class="grid gap-2 text-center">
                        <h1 class="text-3xl font-bold">
                            Регистрация
                        </h1>
                        <p class="text-wrap text-center text-muted-foreground">
                            Введите данные учетной записи
                        </p>
                    </div>
                    <div class="grid gap-4">
                        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div class="grid gap-2">
                                <Label for="name">Имя</Label>
                                <Input id="name" type="name" placeholder="" required v-model="fname" />
                            </div>
                            <div class="grid gap-2">
                                <Label for="name">Фамилия</Label>
                                <Input id="name" type="name" placeholder="" required v-model="lname" />
                            </div>
                        </div>
                        <div class="grid gap-2">
                            <Label for="email">Адрес электронной почты</Label>
                            <Input id="email" type="email" placeholder="" required v-model="email" />
                        </div>
                        <div class="grid gap-2">
                            <div class="flex items-center">
                                <Label for="password">Пароль</Label>
                            </div>
                            <Input id="password" type="password" required v-model="password" />
                        </div>
                        <Button type="submit" class="w-full bg-foreground text-background hover:bg-outcome-message" @click="createAcc()">
                            Зарегистрироваться
                        </Button>
                    </div>
                    <div class="mt-4 text-center text-sm">
                        Уже есть учетная запись?
                        <NuxtLink to="/Authorization" class="underline">
                            Войти
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>