<script setup lang="ts">
import { computed, ref } from 'vue'
import { ComboboxAnchor, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'

const modelValue = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

const filteredFrameworks = computed(() => frameworks.filter(i => !modelValue.value.includes(i.label)))
</script>

<template>
    <div class="flex w-full h-full items-center justify-center">
        <div class="flex w-2/6 bg-white rounded-lg p-12">
            <div class="flex flex-row w-full h-full items-center justify-evenly">
                <div class="flex w-full h-full items-center justify-center">
                    <div class="mx-auto grid w-[500px] gap-6">
                        <div class="grid gap-2 text-center">
                            <h1 class="text-3xl font-bold">
                                Создание конференции
                            </h1>
                        </div>
                        <div class="grid gap-6">
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="conferenceName" class="w-auto text-lg col-span-5">Название
                                    конференции</Label>
                                <Input id="conferenceName" class="w-auto col-span-7" v-model="conferenceName"
                                    placeholder="" required />
                            </div>
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="conferenceDescription" class="w-auto text-lg col-span-5">Описание
                                    конференции</Label>
                                <textarea id="conferenceDescription"
                                    class="col-span-7 w-full min-h-[75px] text-md rounded-lg border border-border p-2"
                                    lass="w-full" v-model="conferenceDescription" placeholder="" />
                            </div>
                            <div class="grid grid-cols-12 gap-4">
                                <Label for="email" class="w-auto text-lg col-span-4">Участники</Label>
                                <div class="w-full col-span-8">
                                    <TagsInput class="px-0 gap-0" :model-value="modelValue">
                                        <div class="flex gap-2 flex-wrap items-center px-3">
                                            <TagsInputItem class="p-4" v-for="item in modelValue" :key="item" :value="item">
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
                                                            :key="framework.value" :value="framework.label"
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
                                                                    framework.label.substr(0, 2).toUpperCase() }}
                                                                </AvatarFallback>
                                                            </avatar>
                                                            {{ framework.label }}
                                                        </CommandItem>
                                                    </CommandGroup>
                                                </CommandList>
                                            </ComboboxPortal>
                                        </ComboboxRoot>
                                    </TagsInput>
                                </div>
                            </div>
                            <Button type="submit" class="w-full" @click="enterAcc()">
                                Создать конференцию
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
            </div>
        </div>
    </div>
</template>