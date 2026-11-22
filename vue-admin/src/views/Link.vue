<template>
  <v-table theme="dark">
    <thead>
      <tr>
        <th class="text-left">
          #
        </th>
        <th class="text-left">
          Code
        </th>
        <th class="text-left">
          Count
        </th>
        <th class="text-left">
          Revenue
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="link in links"
        :key="link.id"
      >
        <td>{{ link.id }}</td>
        <td>{{ link.code }}</td>
        <td>{{ link.orders.length }}</td>
        <td>{{ revenueTotal.toFixed(2) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { api } from '@/services/api';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

  interface ILink {
    id: number;
    code: string;
    orders: IOrder[];
    revenue: number;
  }

  interface IOrder {
    id: number;
    total: number;
  }

  const links = ref<ILink[]>([])
  const errorMessage = ref<string | null>(null)
  const route = useRoute()

  onMounted(async() => {
    try {
      const { data } = await api.get(`/user/${route.params.id}/links`)
      links.value = data
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
    }
  })

  const revenueTotal = computed(() => {
  return links.value.reduce((sum, link) => {
    const linkOrders = (link.orders ?? []).reduce(
      (orderSum, order) => orderSum + Number(order.total || 0),
      0
    )
    return sum + linkOrders
  }, 0)
})
</script>