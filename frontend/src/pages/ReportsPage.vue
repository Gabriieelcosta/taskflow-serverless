<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-6">Relatórios</h1>

    <LoadingSpinner v-if="loading" text="Carregando relatórios..." />

    <v-row v-else>
      <!-- Total de tarefas -->
      <v-col cols="12" md="4">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="primary" class="mb-2">mdi-checkbox-marked-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ summary.total ?? '—' }}</div>
          <div class="text-caption text-medium-emphasis">Total de Tarefas</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ doneCount }}</div>
          <div class="text-caption text-medium-emphasis">Concluídas</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="text-center pa-4">
          <v-icon size="48" color="error" class="mb-2">mdi-alert-circle</v-icon>
          <div class="text-h4 font-weight-bold">{{ summary.overdue ?? '—' }}</div>
          <div class="text-caption text-medium-emphasis">Vencidas</div>
        </v-card>
      </v-col>

      <!-- Tarefas por status -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="pa-4">Por Status</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item
              v-for="item in summary.byStatus"
              :key="item.status"
              :title="statusLabel(item.status)"
              :subtitle="`${item.count} tarefa(s)`"
            >
              <template #prepend>
                <v-icon :color="statusColor(item.status)" size="10">mdi-circle</v-icon>
              </template>
              <template #append>
                <v-chip size="small" variant="tonal" :color="statusColor(item.status)">{{ item.count }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- Tarefas por prioridade -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="pa-4">Por Prioridade</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item
              v-for="item in summary.byPriority"
              :key="item.priority"
              :title="priorityLabel(item.priority)"
              :subtitle="`${item.count} tarefa(s)`"
            >
              <template #prepend>
                <v-icon :color="priorityColor(item.priority)" size="10">mdi-circle</v-icon>
              </template>
              <template #append>
                <v-chip size="small" variant="tonal" :color="priorityColor(item.priority)">{{ item.count }}</v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import reportService from '@/services/reportService'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const loading = ref(false)
const summary = ref({})

const doneCount = computed(() => {
  const done = summary.value.byStatus?.find((s) => s.status === 'DONE')
  return done?.count ?? '—'
})

const statusLabels = {
  PENDING: 'Pendente', IN_PROGRESS: 'Em andamento',
  DONE: 'Concluída', CANCELLED: 'Cancelada',
}
const priorityLabels = {
  LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta', URGENT: 'Urgente',
}
const statusColors = {
  PENDING: 'warning', IN_PROGRESS: 'info', DONE: 'success', CANCELLED: 'default',
}
const priorityColors = {
  LOW: 'success', MEDIUM: 'warning', HIGH: 'error', URGENT: 'deep-orange',
}

function statusLabel(s) { return statusLabels[s] || s }
function priorityLabel(p) { return priorityLabels[p] || p }
function statusColor(s) { return statusColors[s] || 'default' }
function priorityColor(p) { return priorityColors[p] || 'default' }

onMounted(async () => {
  loading.value = true
  try {
    summary.value = await reportService.getSummary()
  } finally {
    loading.value = false
  }
})
</script>
