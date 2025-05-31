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
                  v-model.trim="userSignInObject.email"
                />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  required
                  v-model.trim="userSignInObject.password"
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

const router = useRouter()
const { showError } = useSweetAlert()

const isLoading = ref(false)
const errorList = reactive([])
const userSignInObject = reactive({
  email: '',
  password: '',
})

const validateForm = () => {
  errorList.length = 0

  if (!userSignInObject.email) {
    errorList.push('Email is required')
  }

  if (userSignInObject.email.includes('@') === false) {
    errorList.push('Email is invalid')
  }

  if (!userSignInObject.password) {
    errorList.push('Password is required')
  }

  if (userSignInObject.password.length < 6) {
    errorList.push('Password must be at least 6 characters long')
  }
}

const handleSignIn = async () => {
  console.log('userSignInObject', userSignInObject)

  validateForm()

  if (!errorList.length) {
    try {
      isLoading.value = true

      const newUserData = {
        email: userSignInObject.email,
        password: userSignInObject.password,
      }

      if (newUserData) {
        new Promise(() => {
          setTimeout(() => {
            isLoading.value = false
            router.push({ name: APP_ROUTE_NAMES.HOME })
          }, 3000)
        })
      }
    } catch (error) {
      isLoading.value = false
      console.log('error', error)
      showError('Service temporarily unavailable. We apologize for any inconvenience.')
    } finally {
      isLoading.value = false
    }
  }
}
</script>
