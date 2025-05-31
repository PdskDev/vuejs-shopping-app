<template>
  <div class="container py-5 my-3">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border rounded">
        <div class="shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Create Account</h4>
            <form v-on:submit.prevent="handleSignUp">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  required
                  v-model.trim="formSignUp.email"
                />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  required
                  v-model.trim="formSignUp.password"
                />
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="authStore.isLoading">
                <span
                  class="spinner-border spinner-border-sm me-2"
                  v-if="authStore.isLoading"
                ></span>
                Create Account
              </button>
              <div class="alert alert-danger mt-3 mb-0" v-if="errorFireBase">
                {{ errorFireBase }}
              </div>
            </form>
            <p class="mt-3 form-label text-center">
              Already have an account?
              <router-link :to="{ name: APP_ROUTE_NAMES.SIGN_IN }">Login here</router-link>
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

const errorFireBase = ref('')
const errorList = reactive([])
const formSignUp = reactive({
  email: '',
  password: '',
})

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

  return message
}

const handleSignUp = async () => {
  if (!errorList.length) {
    try {
      console.log('userSignUpObject', formSignUp)
      errorFireBase.value = ''

      if (formSignUp.email && formSignUp.password) {
        await authStore.signUpUser(formSignUp.email, formSignUp.password)
        showSuccess('You have been successfully registered!')
        router.push({ name: APP_ROUTE_NAMES.PRODUCT_LIST })
      }
    } catch (err) {
      errorFireBase.value = convertAuthErrorMessage(err.message)
      console.log('error', err)
      showError(errorFireBase.value)
    }
  }
}
</script>
