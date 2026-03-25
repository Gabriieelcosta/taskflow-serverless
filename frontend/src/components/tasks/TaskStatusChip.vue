<template>
  <v-chip :color="config.color" size="small" variant="tonal">
    <v-icon start :icon="config.icon" size="12" />
    {{ config.label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
})

const statusMap = {
  PENDING:     { label: 'Pendente',     color: 'default', icon: 'mdi-clock-outline' },
  IN_PROGRESS: { label: 'Em andamento', color: 'info',    icon: 'mdi-play-circle-outline' },
  DONE:        { label: 'Concluída',    color: 'success', icon: 'mdi-check-circle-outline' },
  CANCELLED:   { label: 'Cancelada',   color: 'error',   icon: 'mdi-close-circle-outline' },
}

const config = computed(() => statusMap[props.status] || statusMap.PENDING)
</script>
