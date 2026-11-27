<script setup lang="ts">
import { useRoute } from 'vue-router';

  const route = useRoute()
</script>

<template>
  <v-container v-if="route.name === 'users'" class="py-12">
    <v-card class="mx-auto pa-6" rounded="lg">
      <v-card-title class="text-h4">Ambassadors List</v-card-title>
      <v-card-text>
        <router-view/>
      </v-card-text>
    </v-card>
  </v-container>
  <router-view v-else />
</template>
