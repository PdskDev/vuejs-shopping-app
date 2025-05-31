import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import firebaseConfig from './utility/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router/routes'
import { useThemeStore } from './stores/themeStore'

const { appFireBaseAuth } = firebaseConfig

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)

const themeStore = useThemeStore()
if (themeStore.theme) {
  const bodyElement = document.querySelector('body')
  bodyElement.setAttribute('data-bs-theme', themeStore.theme)
}

let isMounted = false

// eslint-disable-next-line no-unused-vars
onAuthStateChanged(appFireBaseAuth, async (user) => {
  if (!isMounted) {
    app.mount('#app')
    isMounted = true
  }
})
