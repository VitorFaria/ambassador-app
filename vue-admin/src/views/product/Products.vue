<script setup lang="ts">
import ProductsTable from '@/components/ProductsTable.vue';

</script>

<template>
  <v-container class="py-12">
    <v-card class="mx-auto pa-6" rounded="lg">
      <v-card-title class="text-h4">Products List</v-card-title>
      <v-card-text>
        <ProductsTable/>
      </v-card-text>
    </v-card>
  </v-container>
</template>