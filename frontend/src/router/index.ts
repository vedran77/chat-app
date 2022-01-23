import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Register from '../views/Register.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
