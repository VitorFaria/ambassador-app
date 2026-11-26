<script setup lang="ts">
import AppTextField from '@/components/AppTextField.vue';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/config/upload';
import router from '@/router';
import { api } from '@/services/api';
import type { IProduct } from '@/types/product.interface';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { VFileUpload } from 'vuetify/labs/VFileUpload'

const productForm = ref()
const title = ref('')
const description = ref('')
const image = ref('')
const price = ref(0)
const selectedFile = ref<File | File[]>()
const errorMessage = ref<string | null>(null)
const uploadError = ref<string | null>(null)
const isSubmitting = ref(false)
const isUploadingImage = ref(false)
const route = useRoute()
const productId = route.params.id ?? null

interface UploadImageResponse {
  url: string
  key: string
}

const titleRules = [
  (value: string) => !!value?.trim() || 'This field is required.',
  (value: string) => value.length >= 3 || 'Title must have at least 3 characters.'
]

const descriptionRules = [
  (value: string) => !!value?.trim() || 'This field is required.',
  (value: string) => value.length >= 10 || 'Description must have at least 10 characters.'
]

const imageRules = [
  (value: string) => !!value?.trim() || 'Please upload a product image.',
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

async function handleImageUpload(files: File | File[] | null) {
  uploadError.value = null

  if (!files) {
    image.value = ''
    return
  }

  const file = Array.isArray(files) ? files[0] : files
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    uploadError.value = 'Only JPEG, PNG, and WebP images are allowed.'
    selectedFile.value = []
    image.value = ''
    return
  }

  if (file.size > MAX_IMAGE_BYTES) {
    uploadError.value = 'Image must be 5 MB or smaller.'
    selectedFile.value = []
    image.value = ''
    return
  }

  isUploadingImage.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)

    const { data } = await api.post<UploadImageResponse>('/products/upload-image', formData)

    image.value = data.url
    await productForm.value.validate()
  } catch (err) {
    image.value = ''
    selectedFile.value = []
    const apiMessage =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    uploadError.value =
      apiMessage || (err instanceof Error ? err.message : 'Image upload failed.')
  } finally {
    isUploadingImage.value = false
  }
}

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
      <div class="mb-5">
        <v-file-upload
          v-model="selectedFile"
          density="compact" 
          variant="compact"
          accept="image/jpeg,image/png,image/webp"
          :disabled="isUploadingImage || isSubmitting"
          @update:model-value="handleImageUpload"
        />
  
        <v-input
          v-model="image"
          :rules="imageRules"
          class="d-none"
        />
  
        <div v-if="isUploadingImage" class="text-caption text-medium-emphasis mt-1">
          Uploading image...
        </div>
  
        <div v-if="uploadError" class="text-caption text-error mt-1">
          {{ uploadError }}
        </div>
      </div>

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
        :disabled="isSubmitting || isUploadingImage"
        >
        Save Product
      </v-btn>
    </v-form>
  </v-container>
</template>