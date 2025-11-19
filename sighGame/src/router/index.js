import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { 
    path: '/', 
    component: LoginForm 
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }   
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuario') 

  if (to.path === '/' && usuario) {
    return next('/dashboard')
  }

  if (to.meta.requiresAuth && !usuario) {
    return next('/')
  }

  next() 
})

export default router
