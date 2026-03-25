import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTaskStore } from './tasks'

export const useSSEStore = defineStore('sse', () => {
  // ESTADO 
  const connected = ref(false)
  let eventSource = null

  // ACTIONS 
  function connect(token) {
    // Evita abrir conexão duplicada
    if (eventSource) return

    const baseURL = import.meta.env.VITE_API_URL || ''
    eventSource = new EventSource(`${baseURL}/events?token=${token}`)

    eventSource.onopen = () => {
      connected.value = true
    }

    // Escuta eventos de tarefas enviados pelo backend
    eventSource.addEventListener('task:created', (e) => {
      const taskStore = useTaskStore()
      taskStore.applySSEUpdate({ type: 'task:created', task: JSON.parse(e.data) })
    })

    eventSource.addEventListener('task:updated', (e) => {
      const taskStore = useTaskStore()
      taskStore.applySSEUpdate({ type: 'task:updated', task: JSON.parse(e.data) })
    })

    eventSource.addEventListener('task:deleted', (e) => {
      const taskStore = useTaskStore()
      taskStore.applySSEUpdate({ type: 'task:deleted', taskId: JSON.parse(e.data).id })
    })

    eventSource.onerror = () => {
      connected.value = false
      // Tenta reconectar após 5 segundos
      disconnect()
      setTimeout(() => connect(token), 5000)
    }
  }

  function disconnect() {
    if (eventSource) {
      eventSource.close()
      eventSource = null
      connected.value = false
    }
  }

  return { connected, connect, disconnect }
})
