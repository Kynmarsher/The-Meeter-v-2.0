<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query } from 'appwrite';
import { onMounted } from 'vue'

/* const Conferences[]; */
let cookie;
let enterAccount;
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

onMounted(() => {
    console.log("Куки:");
    console.log(document.cookie);
    cookie = getCookie();
    console.log("Обработанные куки:");
    console.log(cookie);

    const account = new Account(client);

    if (cookie.sessionId != "") {
        const promise0 = account.getSession(cookie.sessionId);

        promise0.then(
            function (response) {
                console.log("Сессия найдена:");
                console.log(response); // Success
                enterAccount = true;

                const promise00 = account.get();

                promise00.then(
                    function (response) {
                        console.log("Информация по аккаунту:");
                        console.log(response); // Success
                        navigateTo({
                            path: '/CurrentConferences'
                        });
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
                navigateTo({
                    path: '/Authorization'
                });
            }
        );
    } else {
        navigateTo({
            path: '/Authorization'
        });
    }
})
</script>


<template>
    <div class="fixed flex flex-col h-full w-full">
        <img src="/public/Flag.jpg" alt="Image" class="h-full object-cover">
        </img>
    </div>
</template>