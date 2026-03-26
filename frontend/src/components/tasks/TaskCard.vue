<template>
  <v-card
    class="task-card d-flex flex-column"
    :class="{ 'task-card--overdue': isOverdue }"
    height="100%"
    @click="emit('click', task)"
  >
    <v-card-item>
      <!-- Prioridade + Status -->
      <template #prepend>
        <v-icon :color="priorityColor" size="20">mdi-flag</v-icon>
      </template>

      <v-card-title class="text-body-1 font-weight-medium">
        {{ task.title }}
      </v-card-title>

      <template #append>
        <TaskStatusChip :status="task.status" />
      </template>
    </v-card-item>

    <v-card-text class="pt-0">
      <!-- Descrição -->
      <p v-if="task.description" class="text-body-2 text-medium-emphasis mb-3 text-truncate">
        {{ task.description }}
      </p>

      <!-- Rodapé do card -->
      <div class="d-flex align-center flex-wrap ga-2">
        <!-- Categoria -->
        <v-chip
          v-if="task.category"
          size="x-small"
          variant="tonal"
          :color="task.category.color || 'primary'"
        >
          {{ task.category.name }}
        </v-chip>

        <!-- Data de vencimento -->
        <v-chip v-if="task.dueDate" size="x-small" variant="text" :color="isOverdue ? 'error' : 'default'">
          <v-icon start size="12">mdi-calendar</v-icon>
          {{ formatDate(task.dueDate) }}
        </v-chip>

        <v-spacer />

        <!-- Responsável -->
        <v-avatar v-if="task.assignee" size="24" :image="assigneeAvatar" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import TaskStatusChip from './TaskStatusChip.vue'

const props = defineProps({
  task: { type: Object, required: true },
})

const emit = defineEmits(['click'])

const priorityMap = {
  LOW:    'success',
  MEDIUM: 'warning',
  HIGH:   'error',
  URGENT: 'deep-orange',
}

const priorityColor = computed(() => priorityMap[props.task.priority] || 'default')

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'DONE') return false
  return new Date(props.task.dueDate) < new Date()
})

const assigneeAvatar = computed(() => {
  const name = props.task.assignee?.name || 'U'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff&size=24`
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>

<style scoped>
.task-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}
.task-card--overdue {
  border-left: 3px solid rgb(var(--v-theme-error));
}
</style>
