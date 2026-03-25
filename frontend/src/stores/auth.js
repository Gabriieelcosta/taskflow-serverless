import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ESTADO 
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  // GETTERS 
  const isAuthenticated = computed(() => !!token.value)

  // ACTIONS 
  async function register(name, email, password) {
    const data = await authService.register({ name, email, password })
    _setSession(data)
    return data
  }

  async function login(email, password) {
    const data = await authService.login({ email, password })
    _setSession(data)
    return data
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Salva token e usuário no estado e no localStorage
  function _setSession({ token: newToken, user: newUser }) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  return { user, token, isAuthenticated, register, login, logout }
})
