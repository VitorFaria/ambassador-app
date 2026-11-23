<script setup lang="ts">
  const model = defineModel<boolean>({ default: false})

  const props = withDefaults(defineProps<{
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
    loading?: boolean
  }>(), {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'error',
    loading: false,
  })

  const emit = defineEmits<{
    confirm: []
    cancel: []
  }>()

  function onCancel() {
    if (props.loading) return
    
    model.value = false
    emit('cancel')
  }
</script>

<template>
  <v-dialog v-model="model" max-width="420" persistent>
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text>
        <slot>{{ message }}</slot>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          variant="text"
          :disabled="loading"
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>