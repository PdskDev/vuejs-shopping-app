<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderLayout />
    <div class="flex-grow-1">
      <RouterView />
    </div>
    <FooterLayout />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderLayout from './components/layout/HeaderLayout.vue'
import FooterLayout from './components/layout/FooterLayout.vue'
</script>
