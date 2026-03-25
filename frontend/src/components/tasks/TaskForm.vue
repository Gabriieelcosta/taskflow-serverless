<template>
  <v-card>
    <v-card-title class="pa-4">
      {{ isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-4">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row dense>
          <!-- Título -->
          <v-col cols="12">
            <v-text-field
              v-model="form.title"
              label="Título *"
              :rules="[rules.required]"
              autofocus
            />
          </v-col>

          <!-- Descrição -->
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Descrição"
              rows="3"
              auto-grow
            />
          </v-col>

          <!-- Status -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.status"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              label="Status"
            />
          </v-col>

          <!-- Prioridade -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.priority"
              :items="priorityOptions"
              item-title="label"
              item-value="value"
              label="Prioridade"
            />
          </v-col>

          <!-- Categoria -->
          <v-col cols="12" sm="6">
            <v-select
              v-model="form.categoryId"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Categoria"
              clearable
            />
          </v-col>

          <!-- Data de vencimento -->
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="form.dueDate"
              label="Vencimento"
              type="date"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn variant="text" @click="emit('cancel')">Cancelar</v-btn>
      <v-btn color="primary" :loading="loading" @click="handleSubmit">
        {{ isEditing ? 'Salvar' : 'Criar Tarefa' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  task: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const isEditing = computed(() => !!props.task)

// Inicializa o form com os dados da tarefa (edição) ou valores padrão (criação)
const form = ref({
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  categoryId: null,
  dueDate: '',
})

// Quando a prop task mudar, preenche o formulário com os dados dela
watch(
  () => props.task,
  (task) => {
    if (task) {
      form.value = {
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        categoryId: task.categoryId || null,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      }
    }
  },
  { immediate: true }
)

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

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

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  emit('submit', { ...form.value })
}
</script>
