<template>
  <v-app>

    <!-- SIDEBAR -->
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="surface">

      <!-- Logo -->
      <v-list-item
        prepend-icon="mdi-movie-play"
        title="CLAQUETE"
        nav
        class="py-4"
      />

      <v-divider />

      <!-- Itens de navegação -->
      <v-list density="compact" nav class="mt-2">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.to"
          active-color="primary"
          rounded="lg"
        />
      </v-list>

      <!-- Usuário logado no rodapé da sidebar -->
      <template #append>
        <v-divider />
        <v-list density="compact" nav class="py-2">
          <v-list-item
            :prepend-avatar="userAvatar"
            :title="authStore.user?.name"
            :subtitle="authStore.user?.email"
            nav
          >
            <template #append>
              <v-btn
                icon="mdi-logout"
                variant="text"
                size="small"
                color="error"
                @click="handleLogout"
              />
            </template>
          </v-list-item>
        </v-list>
      </template>

    </v-navigation-drawer>

    <!-- HEADER -->
    <v-app-bar color="surface" elevation="0" border="b">
      <!-- Botão de toggle da sidebar — sempre visível no header -->
      <v-btn
        :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
        variant="text"
        class="ml-1"
        @click="rail = !rail"
      />

      <v-app-bar-title>
        <span class="text-medium-emphasis text-body-2">{{ currentPageTitle }}</span>
      </v-app-bar-title>

      <template #append>
        <!-- Indicador de SSE conectado -->
        <v-chip
          :color="sseStore.connected ? 'success' : 'error'"
          size="small"
          class="mr-3"
          variant="tonal"
        >
          <v-icon start size="10">mdi-circle</v-icon>
          {{ sseStore.connected ? 'Ao vivo' : 'Offline' }}
        </v-chip>
      </template>
    </v-app-bar>

    <!-- CONTEÚDO -->
    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSSEStore } from '@/stores/sse'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sseStore = useSSEStore()

const drawer = ref(true)
const rail = ref(false)

// Itens do menu lateral
const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Tarefas', icon: 'mdi-checkbox-marked-circle', to: '/tasks' },
  { title: 'Categorias', icon: 'mdi-tag-multiple', to: '/categories' },
  { title: 'Relatórios', icon: 'mdi-chart-bar', to: '/reports' },
]

// Título da página atual baseado na rota
const currentPageTitle = computed(() => {
  const item = navItems.find((i) => route.path.startsWith(i.to))
  return item?.title || 'Claquete'
})

// Avatar gerado a partir das iniciais do nome
const userAvatar = computed(() => {
  const name = authStore.user?.name || 'U'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E50914&color=fff`
})

function handleLogout() {
  sseStore.disconnect()
  authStore.logout()
  router.push('/login')
}

// Inicia a conexão SSE quando o layout é montado
onMounted(() => {
  if (authStore.token) {
    sseStore.connect(authStore.token)
  }
})

// Encerra a conexão SSE quando o layout é desmontado
onUnmounted(() => {
  sseStore.disconnect()
})
</script>
