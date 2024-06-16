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

const props = defineProps<{
    item: Object,
    index: Number,
    accountInformation: Object
}>()
</script>

<template>
    <CardContent v-if="item.Author == accountInformation.$id" class="flex flex-col bg-background h-full justify-end">
        <div class="w-full text-primary text-md font-medium text-center my-4">Сегодня</div>
        <div class="flex min-w-[400px] max-w-[600px] bg-income-message self-end gap-x-2 p-2 rounded-l-lg border border-border">
            <avatar class="h-12 w-12 bg-foreground">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback class="text-background">{{ item.AuthorName.substr(0, 2).toUpperCase() }}
                </AvatarFallback>
            </avatar>
            <div class="flex-col w-full">
                <a class="text-md font-medium leading-none">{{ item.AuthorName }}</a>
                <a class="text-sm font-medium leading-none float-end p-1"> {{ new
                    Date(item.MessageTime).toLocaleTimeString("ru",
                        {
                            hour: '2-digit',
                            minute: '2-digit'
                    }) }}</a>
                <div class="text-md font-medium text-primary break-all"> {{ item.Text }}</div>
            </div>
        </div>
    </CardContent>
    <CardContent v-if="item.Author != accountInformation.$id && item.SystemMessage === false" class="flex flex-col bg-background h-full justify-end">
        <div class="w-full text-primary text-md font-medium text-center my-4">Сегодня</div>
        <div class="flex min-w-[400px] max-w-[600px] bg-income-message self-start gap-x-2 p-2 rounded-r-lg border border-border">
            <avatar class="h-12 w-12 bg-foreground">
                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                <AvatarFallback class="text-background">{{ item.AuthorName.substr(0, 2).toUpperCase() }}
                </AvatarFallback>
            </avatar>
            <div class="flex-col w-full">
                <a class="text-md font-medium leading-none">{{ item.AuthorName }}</a>
                <a class="text-sm font-medium leading-none float-end p-1"> {{ new
                    Date(item.MessageTime).toLocaleTimeString("ru",
                        {
                            hour: '2-digit',
                            minute: '2-digit'
                    }) }}</a>
                <div class="text-md font-medium text-primary break-all"> {{ item.Text }}</div>
            </div>
        </div>
    </CardContent>
    <CardContent v-if="item.Author != accountInformation.$id && item.SystemMessage === true" class="flex flex-col bg-background h-full justify-center">
        <div class="w-full text-primary text-md font-medium text-center my-2">Сегодня</div>
        <div class="flex w-full bg-background self-center p-3 text-center">
            <div class="flex-col w-full">
                <div class="text-md font-medium text-muted-foreground italic break-all"> {{ item.Text }}</div>
            </div>
        </div>
    </CardContent>
</template>