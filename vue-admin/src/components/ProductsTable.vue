<script setup lang="ts">
import { api } from '@/services/api'
import { onMounted, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

  const search = ref('')
  const products = ref<IProduct[]>([])
  const confirmDialog = ref(false)
  const deleting = ref(false)
  const selectedProduct = ref<IProduct | null>(null)
  const errorMessage = ref<string | null>(null)

  interface IProduct {
    id: number;
    title: string
    description: string
    image: string
  }

  const headers = [
    { title: '#', key: 'id'},
    { 
      title: 'Title', 
      key: 'title', 
    },
    { title: 'Description', key: 'description' },
    { title: 'Image', key: 'image' },
    { title: 'Actions', key: 'actions' },
  ]

  onMounted(async() => {
    try {
      const { data } = await api.get<IProduct[]>('/products')
      for (const product of data) {
        products.value.push(product)
      }
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Something went wrong.'
      console.error(errorMessage)
      products.value = []
    }
  })

  function openDeleteConfirm(product: IProduct) {
    selectedProduct.value = product
    confirmDialog.value = true
  }

  async function deleteProduct() {
    if (!selectedProduct.value) return

    deleting.value = true
    try {
      await api.delete(`/products/${selectedProduct.value.id}`)
      products.value = products.value.filter(p => p.id !== selectedProduct.value?.id)
      confirmDialog.value = false
      selectedProduct.value = null
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Product could not be deleted.'
      console.error(errorMessage)
    } finally {
      deleting.value = false
    }
  }

  function handleCancel() {
    selectedProduct.value = null
  }
</script>

<template>
  <v-app>
    <div>
      <v-text-field
        v-model="search"
        class="mb-4"
        label="Search products"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      />

      <v-data-table 
        :headers="headers" 
        :items="products" 
        :search="search"
      >
        <template #item.image="{ item, value }">
          <img
            :src="value"
            :alt="item.title"
            width="80"
            height="80"
            class="product-image"
          />
        </template>
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="error"
            icon="mdi-delete-outline"
            @click="openDeleteConfirm(item)"
          />

          <ConfirmDialog
            v-model="confirmDialog"
            :loading="deleting"
            @confirm="deleteProduct"
            @cancel="handleCancel"
          />
        </template>
      </v-data-table>
    </div>
  </v-app>
</template>

<style scoped>
.product-image {
  display: block;
  object-fit: contain;
}
</style>
