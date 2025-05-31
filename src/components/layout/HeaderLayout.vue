<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img
          src="../../assets/shopping-cart.png"
          alt="NadetDev Vue.js Shopping App"
          style="width: 32px"
          class="mx-3"
        />
        <span class="sr-only">NadetDev Vue.js Shopping App</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.HOME }"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: APP_ROUTE_NAMES.PRODUCT_LIST }"
              >Product</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated && authStore.isAdmin">
            <router-link class="nav-link" :to="{ name: APP_ROUTE_NAMES.PRODUCT_CREATE }"
              >Add Product</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: APP_ROUTE_NAMES.CONTACT_US }"
              >Contact Us</router-link
            >
          </li>
        </ul>
        <ul class="d-flex navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-link" v-if="authStore.isAuthenticated">Welcome {{ userLabel() }} !</li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link" :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"
              >Sign In</router-link
            >
          </li>

          <li class="nav-item" v-if="authStore.isAuthenticated">
            <button
              class="nav-link"
              type="button"
              title="Log Out"
              @click="[authStore.signOutUser(), router.push({ name: APP_ROUTE_NAMES.HOME })]"
            >
              <i class="bi bi-box-arrow-right"><span class="sr-only">Log Out</span></i>
            </button>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticated">
            <router-link class="nav-link" :to="{ name: APP_ROUTE_NAMES.SIGN_UP }"
              >Sign Up</router-link
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-laptop"></i><span class="sr-only">Change Theme</span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <button class="dropdown-item" @click="themeStore.setTheme('light')">
                  <i class="bi bi-sun"></i>&nbsp; Light
                </button>
              </li>
              <li>
                <button class="dropdown-item" @click="themeStore.setTheme('dark')">
                  <i class="bi bi-moon-stars-fill"></i>&nbsp; Dark
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()

const themeStore = useThemeStore()

const userLabel = () => {
  const userEmail = authStore.user?.email.split('@')
  return userEmail[0].toUpperCase()
}
</script>
<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
