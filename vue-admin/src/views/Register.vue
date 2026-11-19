<template>
  <main class="register-page">
    <v-card class="register-card pa-6" rounded="lg" elevation="4">
      <v-card-title class="text-h5 px-0">Sign Up</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-form @submit.prevent="handleSignUp">
          <AppTextField
            v-model="firstName"
            label="First name"
            type="input"
            autocomplete="first-name"
            required
          />
          <AppTextField
            v-model="lastName"
            label="Last name"
            type="input"
            autocomplete="first-name"
            required
          />
          <AppTextField
            v-model="email"
            label="Email"
            type="email"
            icon="mdi-email-outline"
            autocomplete="email"
            required
          />
          <AppTextField
            v-moddel="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            required
          />
          <AppTextField
            v-moddel="confirmPassword"
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            required
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
    </v-card>
  </main>
</template>

<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';
import router from '@/router';
import axios from 'axios';
import { ref } from 'vue';

  const firstName = ref('')
  const lastName = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const errorMessage = ref<string | null>(null)
  const isSubmitting = ref(false)

  async function handleSignUp() {
    console.log('here');
    errorMessage.value = null
    isSubmitting.value = true

    try {
      await axios.post('/api/admin/register', {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirmPassword.value
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
