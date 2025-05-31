import { ROLE_ADMIN, ROLE_USER } from '@/constants/productConstants'
import { collection, doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

import { defineStore } from 'pinia'
import firebaseConfig from '../utility/firebaseConfig'
import { ref } from 'vue'

const { appFirebaseDb, appFireBaseAuth } = firebaseConfig

const userCollection = collection(appFirebaseDb, 'users')

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const role = ref(null)

  const signUpUser = async (email, password) => {
    isLoading.value = true

    try {
      const userCredentials = await createUserWithEmailAndPassword(appFireBaseAuth, email, password)

      await setDoc(doc(userCollection, userCredentials.user.uid), {
        email: userCredentials.user.email,
        role: ROLE_USER,
        createdAt: new Date().toISOString(),
      })

      clearUser()
      error.value = null
    } catch (exception) {
      isLoading.value = false
      error.value = exception.message
      throw exception
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
    role.value = null
  }

  const signInUser = async (email, password) => {
    isLoading.value = true

    try {
      const userSignInCredentials = await signInWithEmailAndPassword(
        appFireBaseAuth,
        email,
        password,
      )

      user.value = userSignInCredentials.user
      role.value = ROLE_USER
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
    role,
    error,
    isLoading,

    //actions
    signUpUser,
    signInUser,
  }
})
