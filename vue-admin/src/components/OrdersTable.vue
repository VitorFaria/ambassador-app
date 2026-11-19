<template>
  <v-app>
    <div>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search orders"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />

      <v-data-table :headers="headers" :items="orders" :search="search" />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')

const headers = [
  { title: 'Order', key: 'id' },
  { title: 'Customer', key: 'customer' },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
  { title: 'Total', key: 'total' },
]

const orders = [
  { id: '#1048', customer: 'Olivia Martin', date: 'Nov 18, 2026', status: 'Paid', total: '$240.00' },
  { id: '#1047', customer: 'Jackson Lee', date: 'Nov 17, 2026', status: 'Pending', total: '$125.00' },
  { id: '#1046', customer: 'Isabella Nguyen', date: 'Nov 16, 2026', status: 'Paid', total: '$89.50' },
  { id: '#1045', customer: 'William Kim', date: 'Nov 15, 2026', status: 'Refunded', total: '$310.00' },
]
</script>
