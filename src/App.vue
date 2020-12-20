<template lang="pug">
  v-app.overflow-hidden(:style="{background: $vuetify.theme.themes[theme].background}")
    vue-extend-layouts

    v-snackbar(
      :timeout="4000"
      v-model="showSnack"
    )
      .d-flex.align-center
        v-btn(
          icon
          color="grey"
          @click.native="showSnack = false"
        )
          v-icon mdi-close-circle
        p.ma-0 {{ message }}

    v-snackbar(
      :timeout="4000"
      v-model="showSuccessSnack"
      color="success"
    )
      .d-flex.align-center
        v-btn(
          icon
          color="white"
          @click.native="showSuccessSnack = false"
        )
          v-icon mdi-checkbox-marked-circle
        p.ma-0 {{ message }}

    v-snackbar(
      :timeout="4000"
      v-model="showErrorSnack"
      color="error"
    )
      .d-flex.align-center
        v-btn(
          icon
          color="white"
          @click.native="showErrorSnack = false"
        )
          v-icon mdi-close-circle
        p.ma-0 {{ message }}
</template>

<script>
import VueExtendLayouts from 'vue-extend-layout'

var appLog = require('debug')('app:app')

export default {
  name: 'App',
  components: { VueExtendLayouts },
  data () {
    return {
      showSnack: false,
      showSuccessSnack: false,
      showErrorSnack: false,
      message: ''
    }
  },
  computed: {
    theme () {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
  created () {
    appLog('Environment: ' + process.env.NODE_ENV)

    this.$store.watch(state => state.snack, () => {
      const msg = this.$store.state.snack
      if (msg !== '') {
        this.showSnack = true
        this.message = this.$store.state.snack
        this.$store.commit('setSnack', '')
      }
    })

    this.$store.watch(state => state.successSnack, () => {
      const msg = this.$store.state.successSnack
      if (msg !== '') {
        this.showSuccessSnack = true
        this.message = this.$store.state.successSnack
        this.$store.commit('setSuccessSnack', '')
      }
    })

    this.$store.watch(state => state.errorSnack, () => {
      const msg = this.$store.state.errorSnack
      if (msg !== '') {
        this.showErrorSnack = true
        this.message = this.$store.state.errorSnack
        this.$store.commit('setErrorSnack', '')
      }
    })
  }
}
</script>

<style lang="scss">
  @import '@/styles/_globals';
</style>
