import Vue from 'vue'
import Vuex from 'vuex'

import { FeathersVuex } from '@/api-client'
import auth from './store.auth'

Vue.use(Vuex)
Vue.use(FeathersVuex)

Vue.config.devtools = true

const requireModule = require.context(
  // The path where the service modules live
  './services',
  // Whether to look in subfolders
  true,
  // Only include .js files (prevents duplicate imports`)
  /.js$/
)
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default)

const state = () => ({
  snack: '',
  successSnack: '',
  errorSnack: ''
})

const mutations = {
  setSnack (state, snack) {
    state.snack = snack
  },
  setSuccessSnack (state, snack) {
    state.successSnack = snack
  },
  setErrorSnack (state, snack) {
    state.errorSnack = snack
  }
}

export default new Vuex.Store({
  mutations,
  state,
  plugins: [...servicePlugins, auth]
})
