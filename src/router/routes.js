import { createRouter, createWebHistory } from 'vue-router'

import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import AccessDenied from '@/views/auth/AccessDenied.vue'
import ContactUS from '@/views/home/ContactUS.vue'
import HomePage from '@/views/home/HomePage.vue'
import NotFound from '@/views/pages/NotFound.vue'
import ProductList from '@/views/product/ProductList.vue'
import ProductUpsert from '@/views/product/ProductUpsert.vue'
import SignIn from '@/views/auth/SignIn.vue'
import SignUp from '@/views/auth/SignUp.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.HOME,
      component: HomePage,
    },
    {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/log-out',
      name: APP_ROUTE_NAMES.LOG_OUT,
      component: HomePage,
    },
    {
      path: '/product-list',
      name: APP_ROUTE_NAMES.PRODUCT_LIST,
      component: ProductList,
      beforeEnter: [isAdmin],
    },
    {
      path: '/product-create',
      name: APP_ROUTE_NAMES.PRODUCT_CREATE,
      component: ProductUpsert,
      beforeEnter: [isAdmin],
    },
    {
      path: '/product-update/:id',
      name: APP_ROUTE_NAMES.PRODUCT_UPDATE,
      component: ProductUpsert,
      beforeEnter: [isAdmin],
    },
    {
      path: '/product-upsert',
      name: APP_ROUTE_NAMES.PRODUCT_UPSERT,
      component: ProductUpsert,
      beforeEnter: [isAdmin],
    },
    {
      path: '/contact',
      name: APP_ROUTE_NAMES.CONTACT,
      component: ContactUS,
      beforeEnter: [isAuthenticated],
    },
    {
      path: '/contact-us',
      name: APP_ROUTE_NAMES.CONTACT_US,
      component: ContactUS,
      beforeEnter: [isAuthenticated],
    },
    {
      path: '/access-denied',
      name: APP_ROUTE_NAMES.ACCESS_DENIED,
      component: AccessDenied,
    },
    {
      path: '/:pathMatch(.*)*',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
  ],
})

// eslint-disable-next-line no-unused-vars
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  if (!authStore.sessionInitialized) {
    await authStore.initializeAuth()
  }
})

function isAdmin() {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      return true
    } else {
      router.push({ name: APP_ROUTE_NAMES.ACCESS_DENIED })
    }
  } else {
    return router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
  }
}

function isAuthenticated() {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    return true
  } else {
    return router.push({ name: APP_ROUTE_NAMES.SIGN_IN })
  }
}

export default router
