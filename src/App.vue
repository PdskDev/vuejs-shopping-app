<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderTpl />
    <div class="flex-grow-1">
      <RouterView />
    </div>
    <FooterTpl />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderTpl from './components/layout/HeaderTpl.vue'
import FooterTpl from './components/layout/FooterTpl.vue'
</script>
