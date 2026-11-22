<template>
  <v-app>
    <div>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search ambassadors"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />

      <v-data-table 
        :headers="headers" 
        :items="users" 
        :search="search"
      >
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            icon="mdi-eye-outline"
            @click="showUserLinks(item)"
          />
        </template>
      </v-data-table>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import router from '@/router'
import { api } from '@/services/api'
import type { IAuthenticatedUser } from '@/types/user.interface'
import { onMounted, ref } from 'vue'

  const search = ref('')
  const users = ref<IAuthenticatedUser[]>([])
  const errorMessage = ref<string | null>(null)

  const headers = [
    { title: '#', key: 'id'},
    { 
      title: 'Name', 
      key: 'full_name', 
      value: (item: IAuthenticatedUser) => `${item.first_name} ${item.last_name}`.trim(), 
    },
    { title: 'Email', key: 'email' },
    { title: 'Actions', key: 'actions' },
  ]

  onMounted(async() => {
    try {
      const { data } = await api.get<IAuthenticatedUser[]>('/ambassadors')
      for (const user of data) {
        users.value.push(user)
      }
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
      users.value = []
    }
  })

  function showUserLinks(user: IAuthenticatedUser) {
    router.push({ name: 'user-links', params: {id: user.id}})
  }
</script>
