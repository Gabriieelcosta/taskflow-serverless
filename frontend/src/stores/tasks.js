import { defineStore } from 'pinia'
import { ref } from 'vue'
import taskService from '@/services/taskService'

export const useTaskStore = defineStore('tasks', () => {
  // ESTADO 
  const tasks = ref([])
  const selectedTask = ref(null)
  const loading = ref(false)
  const filters = ref({ status: null, priority: null, categoryId: null })

  // ACTIONS
  async function fetchTasks() {
    loading.value = true
    try {
      tasks.value = await taskService.getAll(filters.value)
    } finally {
      loading.value = false
    }
  }

  async function fetchTask(id) {
    loading.value = true
    try {
      selectedTask.value = await taskService.getById(id)
    } finally {
      loading.value = false
    }
  }

  async function createTask(data) {
    const task = await taskService.create(data)
    tasks.value.unshift(task) // adiciona no início da lista
    return task
  }

  async function updateTask(id, data) {
    const updated = await taskService.update(id, data)
    // Atualiza a tarefa na lista sem precisar refazer o fetch
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) tasks.value[index] = updated
    if (selectedTask.value?.id === id) selectedTask.value = updated
    return updated
  }

  async function deleteTask(id) {
    await taskService.remove(id)
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = { status: null, priority: null, categoryId: null }
  }

  // Atualiza uma tarefa recebida via SSE em tempo real
  function applySSEUpdate(event) {
    if (event.type === 'task:created') {
      const exists = tasks.value.find((t) => t.id === event.task.id)
      if (!exists) tasks.value.unshift(event.task)
    } else if (event.type === 'task:updated') {
      const index = tasks.value.findIndex((t) => t.id === event.task.id)
      if (index !== -1) tasks.value[index] = event.task
    } else if (event.type === 'task:deleted') {
      tasks.value = tasks.value.filter((t) => t.id !== event.taskId)
    }
  }

  return {
    tasks,
    selectedTask,
    loading,
    filters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearFilters,
    applySSEUpdate,
  }
})
