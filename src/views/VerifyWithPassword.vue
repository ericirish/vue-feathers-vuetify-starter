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
        v-sheet.pa-4.mb-6(
          v-if="passwordError"
          color="error lighten-2"
        )
          h3.text-center.white--text {{ passwordError }}
        v-card.elevation-12(
          :disabled="!validUrl"
        )
          v-toolbar(
            color='primary'
            dark
            flat
          )
            v-toolbar-title Welcome to App
              div.text-subtitle-2.text-center Please set your password to get started.
          v-card-text
            v-form.pa-4(
              ref="form"
              v-model="valid"
              @submit.prevent="verifyEmailWithPassword"
            )
              v-text-field(
                label='Email Address'
                filled
                readonly
                :value="$route.query.email"
              )
              v-text-field(
                label='New Password'
                filled
                v-model="match"
                name='new-password'
                type='password'
                :rules="[rules.required, rules.isEightCharacters]"
                validate-on-blur
                :error-messages="matchPasswords"
                hint="Must include at least 8 characters"
              )
              v-text-field(
                label='Confirm Password'
                filled
                v-model="newPassword"
                name='confirm-password'
                type='password'
                :error-messages="matchPasswords"
                :rules="[rules.required]"
              )
              v-checkbox.mb-5.mt-n1(
                :rules="[rules.required]"
              )
                template(v-slot:label)
                  label I agree to the&nbsp;
                    router-link(to="/terms-of-service")
                      span Terms of Service.
              v-btn(
                block
                depressed
                color="primary"
                large
                :disabled="!valid"
                type="submit"
                :loading="sendingChange"
              ) Set Password
</template>

<script>
import { mapActions } from 'vuex'
import validations from '@/mixins/validationRulesMixin'

export default {
  name: 'VerifyWithPassword',
  mixins: [
    validations
  ],
  data: () => ({
    match: '',
    sendingChange: false,
    tokenExists: false,
    passwordError: '',
    validUrl: false,
    newPassword: '',
    email: ''
  }),
  mounted () {
    if (Object.keys(this.$route.query).length > 0) {
      this.token = this.$route.query.token
      this.email = this.$route.query.email
      this.validUrl = !!this.token && !!this.email

      if (!this.validUrl) {
        this.passwordError = 'Invalid link, please contact support'
      }
    }
  },
  computed: {
    matchPasswords () {
      return (this.newPassword === this.match) ? '' : 'Values do not match'
    }
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('authManagement', ['create']),
    async verifyEmailWithPassword () {
      this.sendingChange = true

      this.create({
        action: 'verifySignupSetPasswordLong',
        value: {
          token: this.token,
          password: this.newPassword
        }
      }).then(() => {
        this.sendingChange = true
        this
          .authenticate({
            email: this.email,
            password: this.newPassword,
            strategy: 'local'
          })
          .then(() => {
            this.$router.push({ name: 'login' })
          })
          .catch(() => {
            this.$snackError('Unable to verifiy account, please contact support')
          })
      }).catch((error) => {
        this.sendingChange = false

        if (error.code === 400 && error.name === 'BadRequest') {
          this.$snackError('Verification token has expired. Contact support to resend verification.')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
