<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';
import { api } from '@/services/api'
import { ref } from 'vue'
import router from '@/router'
import store from '@/store';

  const form = ref()
  const email = ref('')
  const password = ref('')
  const errorMessage = ref<string | null>(null)
  const isSubmitting = ref(false)

  const emailRules = [
    (value: string) => !!value?.trim() || 'Email is required.',
    (value: string) => /.+@.+\..+/.test(value) || 'Enter a valid email address.'
  ]
  const passwordRules = [
    (value: string) => !!value || 'Password is required.',
    (value: string) => value.length >= 8 || 'Password must be at least 8 characters.'
  ]

  async function handleLogin() {
    errorMessage.value = null

    const { valid } = await form.value.validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      await api.post('/login', {
        email: email.value,
        password: password.value
      })

      await store.dispatch('fetchAuthenticatedUser')
      await router.push('/')
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<template>
  <main class="login-page">
    <v-card class="login-card pa-6" rounded="lg" elevation="4">
      <v-card-title class="text-h5 px-0">Login</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-form ref="form" @submit.prevent="handleLogin">
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>
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
          <v-checkbox
            label="Remember password"
            density="compact"
            hide-details
            class="mb-4"
          />
          <v-btn 
            type="submit" 
            color="primary" 
            variant="flat" 
            block
            :loading="isSubmitting"
            :disabled="isSubmitting"
            >
            Login
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(100%, 420px);
}
</style>
