import { collection, doc, setDoc } from 'firebase/firestore'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { defineStore } from 'pinia'
import firebaseConfig from '../utility/firebaseConfig'
import { ref } from 'vue'

const { appFirebaseDb, appFireBaseAuth } = firebaseConfig

const userCollection = collection(appFirebaseDb, 'users')

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const signUpUser = async (email, password) => {
    isLoading.value = true

    try {
      const userCredentials = await createUserWithEmailAndPassword(appFireBaseAuth, email, password)
      user.value = userCredentials.user
      error.value = null
    } catch (exception) {
      isLoading.value = false
      error.value = exception.message
      throw exception
    } finally {
      isLoading.value = false
    }
  }

  return {
    //state
    user,
    error,
    isLoading,

    //actions
    signUpUser,
  }
})
