import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import Register from '../views/Register.vue';
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import { SERVER_URL, SERVER_PORT } from "../Constants";
import axios, { AxiosResponse } from 'axios';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.name !== "register" && to.name !== "login") {
    const token: string = localStorage.getItem("token") || "";

    if (token.length === 0) {
      router.push("register");
    } else {
      axios.post(`${SERVER_URL}:${SERVER_PORT}/loggedin`, {
        token,
      }).then((response: AxiosResponse<any, any>) => {
        if (response.data.expired) {
          router.push("login");
        }
      });
    }
  }

  next();
});


export function changeRoute(path: string): void {
  router.push(path);
}

export default router
