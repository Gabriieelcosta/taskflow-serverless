import { createRouter, createWebHistory } from 'vue-router'

// Rotas públicas — acessíveis sem login
const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { public: true },
  },
]

// Rotas protegidas — exigem login
const protectedRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/pages/TasksPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: () => import('@/pages/TaskDetailPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/pages/CategoriesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/pages/ReportsPage.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Redireciona raiz para dashboard
    { path: '/', redirect: '/dashboard' },
    ...publicRoutes,
    ...protectedRoutes,
    // Rota 404 — qualquer URL não mapeada vai para o dashboard
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

// NAVIGATION GUARD 
// Roda antes de cada navegação e verifica autenticação
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rota protegida + sem login → vai para login
    next({ name: 'Login' })
  } else if (to.meta.public && isAuthenticated) {
    // Rota pública (login/register) + já logado → vai para dashboard
    next({ name: 'Dashboard' })
  } else {
    // Tudo certo → deixa navegar
    next()
  }
})

export default router
