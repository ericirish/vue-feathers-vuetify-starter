import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../views/Login.vue'
import VerifyWithPassword from '../views/VerifyWithPassword'
import RequestPasswordReset from '../views/RequestPasswordReset'
import RequestPassword from '../views/ResetPassword'

import store from '../store'

var log = require('debug')('app:router')
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/verify',
    name: 'verify',
    component: VerifyWithPassword
  },
  {
    path: '/reset-password-request',
    name: 'reset-password-request',
    component: RequestPasswordReset
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: RequestPassword
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title !== undefined) {
    document.title = process.env.VUE_APP_TITLE + ' ' + to.meta.title
  } else {
    document.title = process.env.VUE_APP_TITLE + ' App'
  }

  const isAuthenticated = store.getters['auth/isAuthenticated']
  const user = store.getters['auth/user']
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  log(`isAuthenticated: ${isAuthenticated}`)

  const superAdminAuth = to.matched.some(record => record.meta.superAdminAuth)

  // If auth is required and there's not current user
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.path } })
    log('Requires Auth: not logged in')
    next(false)
  } else if (superAdminAuth && !user.isSuperAdmin) {
    log('User is not a SuperAdmin, denying route')
    next(false)
  } else {
    next()
  }
})

export default router
