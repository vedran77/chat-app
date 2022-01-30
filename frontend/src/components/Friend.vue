<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
    photo: {
        default: "",
        type: String,
    },
    name: {
        default: "",
        type: String,
    },
    lastMessage: {
        default: "No messages.",
        type: String,
    },
    newMessages: {
        default: 0,
        type: Number,
    },
    onlineStatus: {
        defualt: "bg-green-500",
        type: String,
    }
});

</script>

<template>
    <div>
        <div class="flex justify-between cursor-pointer p-4">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <img :src="photo" class="w-14 h-14 rounded-full">
                    <div :class="`w-5 h-5 rounded-full -mt-4 ml-10 border-3 border-white ${onlineStatus}`"></div>
                </div>
                <div class="flex justify-center flex-col ml-4">
                    <h4 class="font-heading font-bold text-md">{{name}}</h4>
                    <p class="font-light text-xs font-heading truncate h-4 w-40">{{lastMessage}}</p>
                </div>
            </div>
            <div class="flex items-center justify-center">
                <div v-if="newMessages > 0" class="w-5 h-5 flex justify-center items-center bg-red-800 rounded-full">
                    <p v-if="newMessages > 9" class="font-heading text-white font-bold text-xs">9+</p>
                    <p v-else class="font-heading text-white font-bold text-xs">{{newMessages}}</p>
                </div>
            </div>
        </div>
        <div class="w-80 h-px bg-gray-300 opacity-30"></div>
    </div>
</template>