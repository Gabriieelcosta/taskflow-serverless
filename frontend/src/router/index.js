import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },

    // Rotas públicas — usam AuthLayout
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { layout: 'auth', public: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/pages/RegisterPage.vue'),
      meta: { layout: 'auth', public: true },
    },

    // Rotas protegidas — usam DefaultLayout
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

    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

// NAVIGATION GUARD
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.meta.public && isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
