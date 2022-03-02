<script lang="ts" setup>
import { defineProps, onMounted, ref } from "vue";

const msg = ref<HTMLElement | null>(null);

onMounted(() => {    
    msg.value.scrollIntoView();
});

const props = defineProps({
    image: {
        default: "",
        type: String,
    },
    bgColor: {
        default: "",
        type: String,
    },
    message: {
        default: "",
        type: String,
    },
    showImage: {
        default: false,
        type: Boolean,
    }
});

</script>

<template>
    <div v-if="bgColor === 'bg-flame'" class="flex flex-row items-center">
        <img :src="image" alt="profilephoto" v-if="showImage" />
        <div :class="`flex justify-start max-h-screen w-4/6 h-6/6 ${bgColor} rounded-2xl pl-2 pr-4 pt-3 pb-3 ml-${showImage ? '4' : '16'} `" ref="msg">
            <p class="text-white font-heading font-light break-all">{{message}}</p>
        </div>
    </div>
    
    <div v-else class="flex flex-row items-center ml-16">
        <div :class="`flex justify-end max-h-screen w-5/6 h-6/6 ${bgColor} rounded-2xl pl-2 pr-4 pt-3 pb-3 mr-${showImage ? '4' : '16'}`" ref="msg">
            <p class="text-black font-heading font-light break-all">{{message}}</p>
        </div>
        <img :src="image" alt="profilephoto" v-if="showImage" />
    </div>
</template>
