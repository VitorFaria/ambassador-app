<script setup lang="ts">
import { api } from '@/services/api';
import { onMounted, ref } from 'vue';

  interface Order {
    id: number
    name: string
    total: number
    order_items: OrderItem[]
  }

  interface OrderItem {
    id: number
    product_title: string
    price: number
    quantity: number
  }

  const orders = ref<Order[] | []>([])
  const errorMessage = ref<string | null>(null)

  onMounted(async () => {
    try {
      const { data } = await api.get<Order[]>('/orders')
      
      orders.value = data
      console.log(orders)
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
      orders.value = []
    }
  })
</script>

<template>
  <v-container>
    <h1 class="text-title-medium ma-2 mb-4">Orders</h1>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="order in orders"
          :key="order.id"
          :title="`${order.name} $${order.total}`"
        >
          <template #text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.order_items ?? []" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.product_title }}</td>
                  <td>{{ Number(item.price) }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </tbody>
            </v-table>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
  </v-container>
</template>