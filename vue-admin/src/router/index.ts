import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import UsersTable from '@/components/UsersTable.vue'
import Link from '@/views/Link.vue'
import Products from '@/views/product/Products.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        { path: '/', name: 'home-redirect', redirect: '/users' },
        { path: '/users', name: 'users', component: UsersTable},
        { path: '/user/:id/link', name: 'user-links', component: Link},
        { path: '/products', name: 'products', component: Products},
      ],
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth || store.state.user) {
    return true
  }

  try {
    await store.dispatch('fetchAuthenticatedUser')
    return store.state.user ? true : { name: 'login' }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { name: 'login' }
    }

    throw error
  }
})

export default router
