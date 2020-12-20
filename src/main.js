import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/dayjs'
import './plugins/filters'
import vueHeadful from 'vue-headful'

import VuetifyConfirm from 'vuetify-confirm'

import '@/styles/_globals.scss'
import '@/styles/material-palette.css'

import { FeathersVuexInputWrapper } from 'feathers-vuex'

// Register the Composition API plugin BEFORE you import App.vue
Vue.use(VueCompositionApi)

Vue.component('vue-headful', vueHeadful)
Vue.component('FeathersVuexInputWrapper', FeathersVuexInputWrapper)
Vue.use(VuetifyConfirm, { vuetify })

var appLog = require('debug')('app:app')

Vue.mixin({
  methods: {
    $snack (message) {
      this.$store.commit('setSnack', message)
    },
    $snackSuccess (message) {
      this.$store.commit('setSuccessSnack', message)
    },
    $snackError (message) {
      this.$store.commit('setErrorSnack', message)
    },

    $log (message) {
      appLog(message)
    },
    $logError (message) {
      appLog(message)
    }
  }
})

Vue.config.productionTip = false

store.dispatch('auth/authenticate')
  .catch((error) => {
    console.error(error)
    window.localStorage.removeItem('feathers-jwt')
  })
  // Render the app
  .then((response) => {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  })
