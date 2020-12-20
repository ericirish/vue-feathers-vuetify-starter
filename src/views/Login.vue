<template lang="pug">
  v-container.fill-height(fluid='')
    v-row(
      align='center'
      justify='center'
    )
      v-col(
        cols='12'
        sm='8'
        md='6'
        lg='4'
        :class="{ 'px-0' : $vuetify.breakpoint.smAndDown }"
      )
        v-card.elevation-12
          v-toolbar(
            color='primary'
            dark
            flat
          )
            v-toolbar-title Login to App
          v-card-text
            v-form.pa-4(
              ref="form"
              v-model="valid"
              v-on:submit.prevent="login"
            )
              v-sheet.pa-4.mb-6(
                v-if="loginError"
                color="error lighten-2"
              )
                h3.text-center {{ loginError }}
              v-text-field(
                label='Email Address'
                name='email'
                v-model="userLogin.email"
                filled
                type='text'
                :rules="[rules.required, rules.email]"
              )
              v-text-field#password(
                label='Password'
                filled
                v-model="userLogin.password"
                name='password'
                type='password'
                :rules="[rules.required]"
              )
              v-btn(
                block
                depressed
                color="primary"
                large
                type="submit"
                :disabled="!valid"
                :loading="sendingLogin"
              ) Login

              .mt-4.text-center
                router-link(
                  :to="{ name: 'reset-password-request' }"
                ) Forgot password?
</template>

<script>
import validations from '@/mixins/validationRulesMixin'

import { mapActions } from 'vuex'
import store from '@/store'

var log = require('debug')('app:authentication')

export default {
  name: 'login',
  mixins: [validations],
  data: () => ({
    userLogin: {
      email: '',
      password: ''
    },
    loginError: '',
    sendingLogin: false
  }),
  created () {
    if (store.getters['auth/isAuthenticated']) {
      this.routeUserAfterLogin()
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    async login () {
      this.sendingLogin = true
      const self = this
      console.log('logign in')

      try {
        const response = await this.authenticate({ ...this.userLogin, strategy: 'local' })
        log('Authentication Success: ', response)

        self.routeUserAfterLogin()
      } catch (error) {
        this.sendingLogin = false
        if (error.message === 'Invalid login') {
          this.loginError = 'Your email and/or password are invalid'
        } else {
          this.loginError = error.message
        }
      }
    },
    routeUserAfterLogin () {
      const userPermissions = store.getters['auth/user'].permissions

      if (userPermissions.includes('admin')) {
        this.$router.push({ name: 'admin-parents' })
      } else if (userPermissions.includes('trainer')) {
        this.$router.push({ name: 'sessions' })
      } else if (userPermissions.includes('parent')) {
        this.$router.push({ name: 'dashboard' })
      } else {
        this.$router.push('/dashboard')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
