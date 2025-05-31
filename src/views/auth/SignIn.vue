<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border">
        <div class="shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Sign In</h4>
            <form @submit.prevent="handleSignIn">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  required
                  v-model.trim="formSignIn.email"
                />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  required
                  v-model.trim="formSignIn.password"
                />
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="isLoading">
                <span class="spinner-border spinner-border-sm me-2" v-if="isLoading"></span>
                Sign In
              </button>
              <div class="alert alert-danger mt-3 mb-0" v-if="errorList.length > 0">
                <ul>
                  <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
                </ul>
              </div>
              <div class="alert alert-danger mt-3 mb-0" v-if="errorFireBase">
                {{ errorFireBase }}
              </div>
            </form>
            <p class="mt-3 form-label text-center">
              Don't have an account?
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_UP }">Register here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useRouter } from 'vue-router'
import { useSweetAlert } from '@/utility/useSweetAlert'
import { useAuthStore } from '@/stores/authStore'
import { AUTH_ERROR_MESSAGES } from '@/constants/errorMessages'

const router = useRouter()
const { showSuccess, showError } = useSweetAlert()
const authStore = useAuthStore()

const isLoading = ref(false)
const errorFireBase = ref('')
const errorList = reactive([])
const formSignIn = reactive({
  email: '',
  password: '',
})

const validateForm = () => {
  errorList.length = 0

  if (!formSignIn.email) {
    errorList.push('Email is required')
  }

  if (formSignIn.email.includes('@') === false) {
    errorList.push('Email is invalid')
  }

  if (!formSignIn.password) {
    errorList.push('Password is required')
  }

  if (formSignIn.password.length < 6) {
    errorList.push('Password must be at least 6 characters long')
  }
}

function convertAuthErrorMessage(message) {
  if (message.includes('email-already-in-use')) {
    return AUTH_ERROR_MESSAGES['auth/email-already-in-use']
  }

  if (message.includes('weak-password')) {
    return AUTH_ERROR_MESSAGES['auth/weak-password']
  }

  if (message.includes('wrong-password')) {
    return AUTH_ERROR_MESSAGES['auth/wrong-password']
  }

  if (message.includes('invalid-email')) {
    return AUTH_ERROR_MESSAGES['auth/invalid-email']
  }

  if (message.includes('network-request-failed')) {
    return AUTH_ERROR_MESSAGES['network-request-failed']
  }

  if (message.includes('user-not-found')) {
    return AUTH_ERROR_MESSAGES['auth/user-not-found']
  }

  if (message.includes('invalid-credential')) {
    return AUTH_ERROR_MESSAGES['auth/invalid-credential']
  }

  return message
}

const handleSignIn = async () => {
  validateForm()

  if (!errorList.length) {
    try {
      console.log('formSignIn', formSignIn)
      errorFireBase.value = ''

      if (formSignIn.email && formSignIn.password) {
        await authStore.signInUser(formSignIn.email, formSignIn.password)
        showSuccess('You have been successfully logged in!')
        router.push({ name: APP_ROUTE_NAMES.HOME })
      }
    } catch (exception) {
      errorFireBase.value = convertAuthErrorMessage(exception.message)
      console.log('error', exception)
      showError(errorFireBase.value)
    }
  }
}
</script>
