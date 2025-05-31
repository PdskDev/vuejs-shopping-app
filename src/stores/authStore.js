import { ROLE_ADMIN, ROLE_USER } from '@/constants/productConstants'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

import { defineStore } from 'pinia'
import firebaseConfig from '../utility/firebaseConfig'

const { appFirebaseDb, appFireBaseAuth } = firebaseConfig

const userCollection = collection(appFirebaseDb, 'users')

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const role = ref(null)
  const sessionInitialized = ref(false)

  const initializeAuth = async () => {
    onAuthStateChanged(appFireBaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        await fetchUserRole(firebaseUser.uid)
        sessionInitialized.value = true
      } else {
        clearUser()
      }
    })
  }

  const isAuthenticated = computed(() => {
    return user.value !== null
  })

  const isAdmin = computed(() => {
    return role.value === ROLE_ADMIN && user.value !== null
  })

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

  const fetchUserRole = async (uid) => {
    const userInfo = await getDoc(doc(userCollection, uid))
    role.value = userInfo.exists() ? userInfo.data().role : ''
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

      error.value = null
    } catch (exception) {
      isLoading.value = false
      error.value = exception.message
      throw exception
    } finally {
      isLoading.value = false
    }
  }

  const signOutUser = async () => {
    isLoading.value = true

    try {
      await signOut(appFireBaseAuth)
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

  return {
    //state
    user,
    role,
    error,
    isLoading,
    sessionInitialized,

    //getters
    isAdmin,
    isAuthenticated,

    //actions
    signUpUser,
    signInUser,
    signOutUser,
    initializeAuth,
  }
})
