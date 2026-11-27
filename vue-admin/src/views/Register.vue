<template>
  <main class="register-page">
    <v-card class="register-card pa-6" rounded="lg" elevation="4">
      <v-card-title class="text-h5 px-0">Sign Up</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-form ref="form" @submit.prevent="handleSignUp">
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>
          <AppTextField
            v-model="firstName"
            label="First name"
            type="input"
            autocomplete="first-name"
            :rules="nameRules"
          />
          <AppTextField
            v-model="lastName"
            label="Last name"
            type="input"
            autocomplete="last-name"
            :rules="nameRules"
          />
          <AppTextField
            v-model="email"
            label="Email"
            type="email"
            icon="mdi-email-outline"
            autocomplete="email"
            :rules="emailRules"
          />
          <AppTextField
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            :rules="passwordRules"
          />
          <AppTextField
            v-model="passwordConfirmation"
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            :rules="confirmPasswordRules"
          />
          <v-btn 
            type="submit" 
            color="primary" 
            variant="flat" 
            block
            :loading="isSubmitting"
            :disabled="isSubmitting"
            >Sign Up</v-btn>
        </v-form>
      </v-card-text>
      <span class="d-flex justify-center ma-3">
        Já tem uma conta? <router-link class="ml-1 text-primary text-decoration-none" to="/login">Fazer Login</router-link>
      </span>
    </v-card>
  </main>
</template>

<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue'
import router from '@/router'
import { api } from '@/services/api'
import { ref } from 'vue'

  const form = ref()
  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const password = ref('')
  const passwordConfirmation = ref('')
  const errorMessage = ref<string | null>(null)
  const isSubmitting = ref(false)

  const nameRules = [
    (value: string) => !!value?.trim() || 'This field is required.'
  ]
  const emailRules = [
    (value: string) => !!value?.trim() || 'Email is required.',
    (value: string) => /.+@.+\..+/.test(value) || 'Enter a valid email address.'
  ]
  const passwordRules = [
    (value: string) => !!value || 'Password is required.',
    (value: string) => value.length >= 8 || 'Password must be at least 8 characters.'
  ]
  const confirmPasswordRules = [
    (value: string) => !!value || 'Please confirm your password.',
    (value: string) => value === password.value || 'Passwords do not match.'
  ]

  async function handleSignUp() {
    errorMessage.value = null

    const { valid } = await form.value.validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      await api.post('/register', {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value
      })

      await router.push('/login')
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped>
.register-page {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}

.register-card {
  width: min(100%, 420px);
}
</style>
