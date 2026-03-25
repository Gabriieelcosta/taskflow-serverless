<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-text>
      <v-row dense align="center">
        <!-- Busca por texto -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localFilters.search"
            placeholder="Buscar tarefa..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            clearable
            @update:model-value="emitFilters"
          />
        </v-col>

        <!-- Filtro de status -->
        <v-col cols="6" md="3">
          <v-select
            v-model="localFilters.status"
            :items="statusOptions"
            item-title="label"
            item-value="value"
            placeholder="Status"
            hide-details
            clearable
            @update:model-value="emitFilters"
          />
        </v-col>

        <!-- Filtro de prioridade -->
        <v-col cols="6" md="2">
          <v-select
            v-model="localFilters.priority"
            :items="priorityOptions"
            item-title="label"
            item-value="value"
            placeholder="Prioridade"
            hide-details
            clearable
            @update:model-value="emitFilters"
          />
        </v-col>

        <!-- Filtro de categoria -->
        <v-col cols="12" md="3">
          <v-select
            v-model="localFilters.categoryId"
            :items="categories"
            item-title="name"
            item-value="id"
            placeholder="Categoria"
            hide-details
            clearable
            @update:model-value="emitFilters"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  categories: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({
  search: '',
  status: null,
  priority: null,
  categoryId: null,
})

const statusOptions = [
  { label: 'Pendente',     value: 'PENDING' },
  { label: 'Em andamento', value: 'IN_PROGRESS' },
  { label: 'Concluída',    value: 'DONE' },
  { label: 'Cancelada',    value: 'CANCELLED' },
]

const priorityOptions = [
  { label: 'Baixa',  value: 'LOW' },
  { label: 'Média',  value: 'MEDIUM' },
  { label: 'Alta',   value: 'HIGH' },
]

function emitFilters() {
  emit('update:filters', { ...localFilters.value })
}
</script>
