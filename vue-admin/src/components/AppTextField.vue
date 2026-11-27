<script setup lang="ts">
import { computed, ref } from 'vue';

  defineOptions({
    inheritAttrs: false
  })

  const props = withDefaults(defineProps<{
    label: string,
    type?: string,
    icon?: string,
    errorMessages?: string | string[]
  }>(), {
    type: 'text'
  })
  
  const model = defineModel<string | number | null>()
  const showPassword = ref(false)

  const isPassword = computed(() => props.type === 'password')

  const inputType = computed(() => {
    if (!isPassword.value) return props.type
    return showPassword.value ? 'text' : 'password'
  })
</script>

<template>
  <v-text-field
    v-model="model"
    v-bind="$attrs"
    class="mb-2"
    variant="outlined"
    :label="label"
    :type="inputType"
    :prepend-inner-icon="icon"
    :error-messages="errorMessages"
    :append-inner-icon="isPassword ? (showPassword ? 'mdi-eye-off' : 'mdi-eye') : undefined"
    @click:append-inner="showPassword = !showPassword"
  />
</template>