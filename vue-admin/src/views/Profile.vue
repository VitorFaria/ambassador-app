<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';
import { api } from '@/services/api';
import type { RootState } from '@/store';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

  const store = useStore<RootState>()
  const user = computed(() => store.state.user)
  
  const accountForm = ref()
  const passwordForm = ref()
  const firstName = ref(user.value?.first_name)
  const lastName = ref(user.value?.last_name)
  const email = ref(user.value?.email)
  const currentPassword = ref('')
  const newPassword = ref('')
  const newPasswordConfirmation = ref('')
  const isSubmitting = ref(false)
  const isSubmittingPassword = ref(false)
  const errorMessage = ref<string | null>(null)

  const firstNameRules = [
    (value: string) => !!value?.trim() || 'This field is required.',
    (value: string) => value.length >= 3 || 'First Name must have at least 3 characters.'
  ]
  console.log(firstNameRules)
  const lastNameRules = [
    (value: string) => !!value?.trim() || 'This field is required.',
    (value: string) => value.length >= 3 || 'Last Name must have at least 3 characters.'
  ]

  const emailRules = [
    (value: string) => !!value?.trim() || 'Email is required.',
    (value: string) => /.+@.+\..+/.test(value) || 'Enter a valid email address.'
  ]

  const currentPasswordRules = [
    (value: string) => !!value || 'Password is required.',
    (value: string) => value.length >= 8 || 'Password must be at least 8 characters.'
  ]

  const newPasswordRules = [
    (value: string) => !!value || 'Password is required.',
    (value: string) => value.length >= 8 || 'Password must be at least 8 characters.'
  ]
  
  const newPasswordConfirmationRules = [
    (value: string) => !!value || 'Please confirm your password.',
    (value: string) => value === newPassword.value || 'Passwords do not match.'
  ]

  async function accountSubmit() {
    errorMessage.value = null

    const { valid } = await accountForm.value.validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      await api.put('/user/info', {
        first_name: firstName.value,
        last_name: lastName.value,
        email: email.value
      })
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }

  async function passwordSubmit() {
    errorMessage.value = null

    const { valid } = await passwordForm.value.validate()
    if (!valid) return

    isSubmittingPassword.value = true

    try {
      await api.put('/user/password', {
        current_password: currentPassword.value,
        password: newPassword.value,
        password_confirmation: newPasswordConfirmation.value
      })
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
    } finally {
      isSubmittingPassword.value = false
    }
  }
</script>

<template>
  <v-container class="py-12">
    <h3 class="mb-5">Account Information</h3>
    <v-form ref="accountForm" @submit.prevent="accountSubmit">
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
        label="First Name"
        type="input"
        autocomplete="first_name"
        :rules="firstNameRules"
      />

      <AppTextField
        v-model="lastName"
        label="Last Name"
        type="input"
        autocomplete="last_name"
        :rules="lastNameRules"
      />

      <AppTextField
        v-model="email"
        label="Email"
        type="input"
        autocomplete="email"
        :rules="emailRules"
      />

      <v-btn 
        type="submit" 
        color="primary" 
        variant="flat"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        >
        Update Account
      </v-btn>
    </v-form>

    <h3 class="mt-5 mb-5">Change Password</h3>
    <v-form ref="passwordForm" @submit.prevent="passwordSubmit">
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>
      <AppTextField
        v-model="currentPassword"
        label="Current Password"
        type="password"
        autocomplete="current-password"
        :rules="currentPasswordRules"
      />

      <AppTextField
        v-model="newPassword"
        label="New Password"
        type="password"
        autocomplete="new-password"
        :rules="newPasswordRules"
      />

      <AppTextField
        v-model="newPasswordConfirmation"
        label="Confirm Password"
        type="password"
        autocomplete="new-password-confirmation"
        :rules="newPasswordConfirmationRules"
      />

      <v-btn 
        type="submit" 
        color="primary" 
        variant="flat"
        :loading="isSubmittingPassword"
        :disabled="isSubmittingPassword"
        >
        Update Password
      </v-btn>
    </v-form>
  </v-container>
</template>