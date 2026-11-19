<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';

</script>

<template>
  <main class="login-page">
    <v-card class="login-card pa-6" rounded="lg" elevation="4">
      <v-card-title class="text-h5 px-0">Login</v-card-title>
      <v-card-text class="px-0 pb-0">
        <v-form @submit.prevent>
          <AppTextField
            label="Email"
            type="email"
            icon="mdi-email-outline"
            autocomplete="email"
            required
          />
          <AppTextField
            label="Password"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock-outline"
            required
          />
          <v-checkbox
            label="Remember password"
            density="compact"
            hide-details
            class="mb-4"
          />
          <v-btn type="submit" color="primary" variant="flat" block>Login</v-btn>
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
