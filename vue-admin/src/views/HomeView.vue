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

<script setup lang="ts">
import type { RootState } from '@/store';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

  const route = useRoute()
  const store = useStore<RootState>()
  const user = computed(() => store.state.user)
  console.log(user.value?.email);
</script>
