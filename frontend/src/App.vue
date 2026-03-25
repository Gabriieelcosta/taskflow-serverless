<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()

const currentLayout = computed(() =>
  route.meta.layout === 'auth' ? AuthLayout : DefaultLayout
)
</script>
