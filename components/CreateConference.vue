<script setup lang="ts">
import { computed, ref } from 'vue'
import { ComboboxAnchor, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Client, Databases, ID } from "appwrite";
import { socket } from './socket';

const modelValue = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')
const conferenceName = ref('')
const conferenceDescription = ref('')

const emit = defineEmits(['close'])

const props = defineProps<{
    accountInformation: Object,
    frameworks: []
}>()

const filteredFrameworks = computed(() => props.frameworks.filter(i => !modelValue.value.includes(i.name)))

function createConference() {
    var idArray = []
    modelValue.value.forEach((element) => {
        var id = props.frameworks.find(id => id.name === element)
        idArray.push(id.id)
    }
    )

    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('6655c51b002ccc6d11bf'); // Your project ID

    const databases = new Databases(client);

    let date = new Date()

    const result = databases.createDocument(
        '666459840018cf31333a', // databaseId
        '6664599a003c2329af67', // collectionId
        ID.unique(), // documentId
        { "Name": conferenceName.value, "Author": props.accountInformation.$id, "Members": idArray, "Description": conferenceDescription.value, "LastMessageTime": date, "ActiveCall": false } // data
    )
    result.then(function (response) {
        console.log(idArray)
    });
}
</script>

<template>
    <div class="flex w-full h-full items-center justify-center">
        <div class="flex w-[30%] h-[50%] bg-white rounded-lg p-12">
            <div class="flex flex-row w-full h-full items-center justify-evenly">
                <div class="flex w-full h-full items-center justify-center">
                    <div class="mx-auto grid w-[500px] gap-6">
                        <div class="relative gap-2 text-center">
                            <h1 class="text-3xl font-bold">
                                Создание конференции
                            </h1>
                            <button class="absolute rounded-full text-lg font-bold h-10 w-10 -right-5 -top-5">
                                <img src="/public/icons/cross.png" class="w-[40%] h-[40%] object-contain">
                            </button>
                        </div>
                        <div class="grid gap-6">
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="conferenceName" class="w-auto text-lg col-span-5">Название
                                    конференции</Label>
                                <Input id="conferenceName" class="w-auto col-span-7 text-lg" v-model="conferenceName"
                                    placeholder="" required />
                            </div>
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="conferenceDescription" class="w-auto text-lg col-span-5">Описание
                                    конференции</Label>
                                <textarea id="conferenceDescription"
                                    class="col-span-7 w-full min-h-[75px] text-md rounded-lg border border-border p-2 bg-white"
                                    v-model="conferenceDescription" placeholder="" />
                            </div>
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="email" class="w-auto text-lg col-span-4">Участники</Label>
                                <div class="w-full col-span-8">
                                    <TagsInput class="px-0 gap-0" :model-value="modelValue">
                                        <div class="flex gap-2 flex-wrap items-center px-3">
                                            <TagsInputItem class="p-4" v-for="item in modelValue" :key="item"
                                                :value="item">
                                                <avatar class="h-8 w-8 bg-foreground">
                                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                                    <AvatarFallback class="text-background">{{
                                                        item.substr(0, 2).toUpperCase() }}
                                                    </AvatarFallback>
                                                </avatar>
                                                <TagsInputItemText />
                                                <TagsInputItemDelete />
                                            </TagsInputItem>
                                        </div>

                                        <ComboboxRoot v-model="modelValue" v-model:open="open"
                                            v-model:searchTerm="searchTerm" class="w-full">
                                            <ComboboxAnchor as-child>
                                                <ComboboxInput placeholder="Введите имя участника..." as-child>
                                                    <TagsInputInput class="w-full px-3"
                                                        :class="modelValue.length > 0 ? 'mt-2' : ''"
                                                        @keydown.enter.prevent />
                                                </ComboboxInput>
                                            </ComboboxAnchor>

                                            <ComboboxPortal>
                                                <CommandList position="popper"
                                                    class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                                                    <CommandEmpty />
                                                    <CommandGroup>
                                                        <CommandItem class="gap-2"
                                                            v-for="framework in filteredFrameworks"
                                                            :key="framework.value" :value="framework.name"
                                                            @select.prevent="(ev) => {
                                                                if (typeof ev.detail.value === 'string') {
                                                                    searchTerm = ''
                                                                    modelValue.push(ev.detail.value)
                                                                }

                                                                if (filteredFrameworks.length === 0) {
                                                                    open = false
                                                                }
                                                            }">
                                                            <avatar class="h-8 w-8 bg-foreground">
                                                                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                                                <AvatarFallback class="text-background">{{
                                                                    framework.name.substr(0, 2).toUpperCase() }}
                                                                </AvatarFallback>
                                                            </avatar>
                                                            {{ framework.name }}
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </ComboboxPortal>
                                        </ComboboxRoot>
                                    </TagsInput>
                                </div>
                            </div>
                            <Button type="submit" class="w-full" @click="close; createConference()">
                                Создать конференцию
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>