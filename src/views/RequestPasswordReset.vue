<template lang="pug">
  v-container.fill-height(fluid='')
    v-row(
      align="center"
      justify="center"
    )
      v-col(
        cols='12'
        sm='8'
        md='6'
        lg='4'
        :class="{ 'px-0' : $vuetify.breakpoint.smAndDown }"
      )
        v-card.elevation-12(
          :disabled="passwordSent"
        )
          v-toolbar(
            height="100px"
            color='primary'
            dark
            flat
          )
            v-toolbar-title Request Password Reset
              div.text-subtitle-2.text-center To reset your password, enter the email address you use to sign in to App.
              div.text-subtitle-2 You'll receive an email with a link to reset your password.
          v-card-text
            v-alert(
              v-if="error"
              type="error"
            ) {{ error }}
            v-form.pa-4(
              ref="form"
              v-model="valid"
              v-on:submit.prevent="resetPassword"
            )
              v-text-field(
                filled
                label="Email Address"
                v-model="email"
                name="email"
                :rules="[rules.required, rules.email]"
              )
              v-btn.mt-5(
                block
                color="primary"
                type="submit"
                :disabled="!valid"
                :loading="sendingRequest"
                depressed
              ) Request
</template>

<script>
import { mapActions } from 'vuex'
import validations from '@/mixins/validationRulesMixin'

export default {
  name: 'RequestPasswordReset',
  mixins: [validations],
  data () {
    return {
      email: null,
      error: null,
      passwordSent: false,
      sendingRequest: false
    }
  },
  mounted () {
    if (Object.keys(this.$route.query).length > 0) {
      this.email = this.$route.query.email
      this.validUrl = !!this.email

      if (!this.validUrl) {
        this.passwordError = 'Invalid link, please contact support'
      }
    }
  },
  methods: {
    ...mapActions('authManagement', ['create']),
    async resetPassword () {
      this.sendingRequest = true
      try {
        await this.create({
          action: 'sendResetPwd',
          notifierOptions: {
            preferredComm: 'email'
          },
          value: {
            token: this.token,
            email: this.email
          }
        })
        this.passwordSent = true
        this.$snackSuccess('Email sent with instructions')
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 3000)
      } catch (error) {
        this.$snackError(error)
      }

      this.sendingRequest = false
    }
  }
}
</script>
