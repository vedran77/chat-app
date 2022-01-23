<script lang="ts" setup>
import axios, { AxiosResponse } from "axios";
import { ref, Ref } from "vue";

import { SERVER_URL, SERVER_PORT } from "../Constants";
import { validate } from "email-validator";

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

const firstName: Ref<string> = ref("");
const lastName: Ref<string> = ref("");
const email: Ref<string> = ref(""); 
const password: Ref<string> = ref("");

function registerAccount(): void {
    if (!validate(email.value)) {
        console.log("error with email");
        return;
    }

    if (firstName.value.length < 3 || lastName.value.length < 3 || password.value.length < 3) {
        console.log("error with lenght");
        return;
    }

    axios.post(`${SERVER_URL}:${SERVER_PORT}/register`, {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value
    }).then((response: AxiosResponse<any, any>) => {
        console.log(response.data);
    });
}
</script>

<template>
    <selection id="register">
        <Navbar/>
        <div class="flex items-center flex-col">
            <div class="drop-shadow-sm flex justify-center flex-col mt-12">
                <h1 class="font-heading font-black text-charcoal text-4xl">Register</h1>
                <p class="text-mist font-heading font-bold">Hello, welcome to ChatApp please register.</p>

                <!-- sign up options -->
                <div class="rounded-full bg-white flex justify-center items-center mt-8 pt-3 pb-3 pl-16 pr-16 text-sm shadow-xl">
                    <img src="google.png" />
                    <a href="#" class="pl-4 font-heading text">Register with Google</a>
                </div>

                <!-- form -->
                <div class="flex justify-center flex-col mt-8">
                    <div class="flex justify-start items-center mb-4 ml-4">
                        <img src="user.png" class="mr-2"/>
                        <p class="font-heading font-bold text-charocoal text-sm">First Name</p>
                    </div>
                    <input v-model="firstName" type="text" placeholder="John" class="focus:outline-none rounded-full pb-3 pt-3 pl-4 font-heading font-normal text-sm text-mist"/>
                </div>
                <div class="flex justify-center flex-col mt-2">
                    <div class="flex justify-start items-center mb-4 ml-4">
                        <img src="user.png" class="mr-2"/>
                        <p class="font-heading font-bold text-charocoal text-sm">Last Name</p>
                    </div>
                    <input v-model="lastName" type="text" placeholder="Wayne" class="focus:outline-none rounded-full pb-3 pt-3 pl-4 font-heading font-normal text-sm text-mist"/>
                </div>
                <div class="flex justify-center flex-col mt-2">
                    <div class="flex justify-start items-center mb-4 ml-4">
                        <img src="email.png" class="mr-2"/>
                        <p class="font-heading font-bold text-charocoal text-sm">Email</p>
                    </div>
                    <input v-model="email" type="email" placeholder="example@example.com" class="focus:outline-none rounded-full pb-3 pt-3 pl-4 font-heading font-normal text-sm text-mist"/>
                </div>
                <div class="flex justify-center flex-col mt-2">
                    <div class="flex justify-start items-center mb-4 ml-4">
                        <img src="password.png" class="mr-2"/>
                        <p class="font-heading font-bold text-charocoal text-sm">Password</p>
                    </div>
                    <input v-model="password" type="password" placeholder="*************" class="focus:outline-none rounded-full pb-3 pt-3 pl-4 font-heading font-normal text-sm text-mist"/>
                </div>

                <!-- register btn -->
                <div class="flex justify-center flex-col">
                    <div class="cursor-pointer rounded-full bg-charcoal flex justify-center items-center mt-4 pt-4 pb-4 pl-14 pr-14 text-sm shadow-xl" @click="registerAccount();">
                        <p class="text-white font-bold uppercase">REGISTER</p>
                    </div>
                    <p class="text-charcoal font-bold uppercase text-center pt-4">OR</p>
                    <div class="cursor-pointer rounded-full bg-white flex justify-center items-center mt-4 p-3 text-sm shadow-xl">
                        <p class="text-charcoal font-bold uppercase">LOGIN</p>
                    </div>
                </div>
            </div>    
        </div>
        <Footer/>
    </selection>
    
</template>
