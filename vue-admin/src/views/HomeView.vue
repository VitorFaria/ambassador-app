<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-6" rounded="lg">
      <v-card-title class="text-h4">Table Order List</v-card-title>
      <v-card-text>
        <OrdersTable />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import OrdersTable from '@/components/OrdersTable.vue'
</script>
