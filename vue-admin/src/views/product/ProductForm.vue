<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';
import router from '@/router';
import { api } from '@/services/api';
import type { IProduct } from '@/types/product.interface';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const productForm = ref()
const title = ref('')
const description = ref('')
const image = ref('')
const price = ref(0)
const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)
const route = useRoute()
const productId = route.params.id ?? null

const titleRules = [
  (value: string) => !!value?.trim() || 'This field is required.',
  (value: string) => value.length >= 3 || 'Title must have at least 3 characters.'
]

const descriptionRules = [
  (value: string) => !!value?.trim() || 'This field is required.',
  (value: string) => value.length >= 10 || 'Description must have at least 10 characters.'
]

const priceRules = [
  (value: number) => !!value || 'This field is required.',
]

onMounted(async() => {
  try {
    if (productId) {
      const { data } = await api.get<IProduct>(`/products/${productId}`)
      
      title.value = data.title
      description.value = data.description
      image.value = data.image
      price.value = data.price
    }
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'No data retrieved from current product.'
    console.error(errorMessage)
  }
})

async function saveProduct() {
  errorMessage.value = null
  const { valid } = await productForm.value.validate()
  if (!valid) return

  isSubmitting.value = true

  try {
    const data: IProduct = {
      title: title.value,
      description: description.value,
      image: image.value,
      price: price.value
    }

    productId 
      ? await api.put<IProduct>(`/products/${productId}`, data)
      :
        await api.post<IProduct>('/products', data)

    await router.push('/products')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Product could not be created.'
    console.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <v-container class="py-12">
    <v-form ref="productForm" @submit.prevent="saveProduct">
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>
      <AppTextField
        v-model="title"
        label="Title"
        type="input"
        autocomplete="title"
        :rules="titleRules"
      />

      <v-textarea
        v-model="description" 
        label="Description" 
        variant="underlined"
        :rules="descriptionRules"
      />

      <AppTextField
        v-model="image"
        label="Upload Image"
        type="input"
        autocomplete="image"
      />

      <AppTextField
        v-model="price"
        label="Price"
        type="number"
        autocomplete="price"
        min=0
        :rules="priceRules"
      />
      <v-btn 
        type="submit" 
        color="primary" 
        variant="flat"
        :loading="isSubmitting"
        :disabled="isSubmitting"
        >
        Save Product
      </v-btn>
    </v-form>
  </v-container>
</template>