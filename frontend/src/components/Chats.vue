<script lang="ts" setup>
import axios from "axios";
import { Ref, ref } from "vue";

import Friend from "../components/Friend.vue";
import { SERVER_URL, SERVER_PORT } from "../Constants";

let chats: Ref<Array<any>> = ref([]);
let name: Ref<string> = ref("");

function listAllChats() {
    axios.post(`${SERVER_URL}:${SERVER_PORT}/chats`, {
        token: localStorage.getItem("token")
    }).then((response: any) => {
        chats.value = response.data.chats.reverse();
    });

}

function filterUsers(): void {
    if (name.value.length < 3) {
        listAllChats();
        return;
    }

    axios.post(`${SERVER_URL}:${SERVER_PORT}/search`, {
        token: localStorage.getItem("token"),
        name: name.value,
    }).then((response: any) => {
        chats.value = response.data.chats.reverse();
    });
}

listAllChats();
</script>

<template>
    <div class="flex flex-col w-80">
        <!-- search -->
        <div class="flex items-center flex-row bg-white rounded-full mt-16">
            <!--<img src="search.png" alt="search-icon" class="mt-px ml-4">-->
            <i class="fas fa-search text-mist mt-px ml-3"></i>
            <input type="text" placeholder="Search" class="pt-2 pb-2 rounded-full pl-3 pr-2 focus:outline-none text-mist font-heading font-normal" @keyup="filterUsers();" v-model="name" />
        </div>
        <div class="flex flex-col bg-white mt-4 rounded-xl overflow-y-scroll overflow-x-hidden min-h-lg max-h-lg">
           <Friend v-for="chat in chats" v-bind:key="chat" :photo="chat.image" :name="chat.name" :lastMessage="chat.lastMessage" :onlineStatus=chat.onlineColor :newMessages=chat.newMessages />
            <div v-if="chats.length === 0 && name.lenght === 0" class="flex justify-center items-center flex-col mt-48">
                <p class="font-heading font-bold">You don't have friends.</p>
                <div class="flex justify-center items-center bg-flame pt-2 pb-2 pl-8 pr-8 rounded-full mt-4">
                    <p class="text-white font-thin font-heading">Add Friends</p>
                </div>
            </div>
        </div>
    </div>
</template>
