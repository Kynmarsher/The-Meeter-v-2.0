<script setup lang="ts">

const props = defineProps<{
    item: Object,
    index: Number,
    accountInformation: Object
}>()
</script>

<template>
    <div :id="item.userFrom + 'Div'" class="relative inline-block h-[32%] w-[20%]">
        <video :id="item.userFrom" class="w-full h-full bg-foreground object-cover rounded-[15px]">
        </video>
        <div v-show="item.activeVideo !== true" class="absolute rounded-lg right-0 bottom-0 left-0 top-0 bg-outcome-message z-20">
            <Avatar class="h-14 w-14 bg-foreground transition-all m-auto absolute top-0 left-0 bottom-0 right-0">
                <AvatarImage src="/avatars/01.png" alt="Avatar" class="" />
                <AvatarFallback class="text-base text-background">
                    {{ item.name.substr(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
        </div>
        <div
            class="absolute w-full h-[12.5%] bg-foreground/20 bottom-0 right-0 z-1 rounded-[15px] text-[0.85vw] whitespace-nowrap items-center justify-between flex flex-row z-30">
            <text v-if="item.userFrom == accountInformation.$id" class="pl-[10px] text-white">{{ 'Вы (' + item.name +
                ')' }}</text>
            <text v-else class="pl-[10px] text-white">{{ 'Вы (' + item.name + ')' }}</text>
            <button :id="item.userFrom + 'FullScreen'"
                class="border-[3px] border-white border-solid rounded-[7px] opacity-50 mr-[15px] my-auto h-[40%] w-[5%]"></button>
        </div>
    </div>
</template>