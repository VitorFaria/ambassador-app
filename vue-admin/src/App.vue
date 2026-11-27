<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon v-if="user" @click="drawer = !drawer"/>
      <v-app-bar-title>Admin Checkout</v-app-bar-title>
      <v-spacer />
      <span v-if="user" class="mr-4">
        {{  user.first_name }} {{  user.last_name }}
      </span>
      <v-btn
        v-if="user"
        variant="text"
        prepend-icon="mdi-logout"
        :loading="isSigningOut"
        :disabled="isSigningOut"
        @click="signOut"
      >
        Sign out
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="user" v-model="drawer">
      <v-list nav>
        <v-list-item title="Users" to="/users"></v-list-item>
      </v-list>
      <v-list nav>
        <v-list-item title="Products" to="/products"></v-list-item>
      </v-list>
      <v-list nav>
        <v-list-item title="Orders" to="/orders"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main><router-view /></v-main>
    <v-snackbar v-model="showSignOutError" color="error" timeout="5000">
      {{ signOutError }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { api } from '@/services/api'
import router from '@/router'
import store from '@/store'

const drawer = ref(false)
const user = computed(() => store.state.user)
const isSigningOut = ref(false)
const showSignOutError = ref(false)
const signOutError = ref('')

watch(user, (authenticatedUser) => {
  if (!authenticatedUser) {
    drawer.value = false
  }
})

async function signOut() {
  isSigningOut.value = true
  showSignOutError.value = false

  try {
    await api.post('/logout')
    store.commit('setUser', null)
    await router.replace({ name: 'login' })
  } catch (error) {
    signOutError.value =
    error instanceof Error ? error.message : 'Could not sign out. Please try again.'
    showSignOutError.value = true
  } finally {
    isSigningOut.value = false
  }
}
</script>
