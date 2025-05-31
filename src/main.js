import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import firebaseConfig from './utility/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import router from './router/routes'

const { appFireBaseAuth } = firebaseConfig

let app

// eslint-disable-next-line no-unused-vars
onAuthStateChanged(appFireBaseAuth, async (user) => {
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.use(createPinia())
    app.mount('#app')
  }
})
