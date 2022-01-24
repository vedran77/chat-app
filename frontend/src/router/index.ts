import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import Register from '../views/Register.vue';
import Home from "../views/Home.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log(to.name);
  console.log('token', localStorage.getItem("token"));

  if (to.name === "home") {
    const token: string = localStorage.getItem("token") || "";

    if (token.length === 0) {
      router.push("register");
    }
  }

  next();
});


export function changeRoute(path: string): void {
  router.push(path);
}

export default router
