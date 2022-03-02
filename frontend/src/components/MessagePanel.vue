<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import Message from "../components/Message.vue";
import { SERVER_PORT, SERVER_URL } from "../Constants";
import { ClientMessage } from "./Types";

const messages = ref<ClientMessage[]>([]);


axios.post(`${SERVER_URL}:${SERVER_PORT}/messages`, {
    token: localStorage.getItem("token"),
}).then((response: any) => {
    console.log(response.data.messages);
    messages.value = response.data.messages;
});


</script>
<template>
    <selection>
        <div class="flex flex-col w-6x min-h-lg h-lg-x rounded-lg bg-white p-4 mt-16 ml-10">
            <div class="overflow-y-scroll mb-6">
                <Message @click="loadChat(message)" v-for="message in messages" :key="message" :image="message.image" :bgColor="message.sentByUser ? 'bg-light' : 'bg-flame'" :message="message.text" :showImage=true class="mt-2"/>
            </div>
        </div>
        <div class="flex justify-center h-16 items-center">
                <input type="text" placeholder="Type a message here..." class="focus:outline-none w-10/12 bg-light pt-2 pl-3 pr-3 rounded-full pb-2 font-heading font-light text-sm" />
                <div class="flex justify-center items-center ml-8 cursor-pointer">
                    <i class="fas fa-paper-plane p-3 bg-flame rounded-full text-white"></i>
                </div>
            </div>
    </selection>
</template>