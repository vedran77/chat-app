<script lang="ts" setup>

let loggedIn = false;

if (localStorage.getItem("token") !== null) {
    loggedIn = true;
}
</script>

<template>
    <div class="container mx-auto mt-4 flex justify-between items-center">
        <img src="logo.png" class="float-left" />
        <div v-if="loggedIn" class="flex justify-center font-heading uppercase">
            <a href="#" class="pl-6 pr-6">Chat</a>
            <a href="#" class="pl-6 pr-6">Contacts</a>
            <a href="#" class="pl-6 pr-6">Settings</a>
        </div>
        <div v-if="loggedIn">s</div>
    </div>
</template>