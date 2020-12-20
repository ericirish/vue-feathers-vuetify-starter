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
        v-sheet.pa-4.mb-6(
          v-if="!validUrl"
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
            v-toolbar-title Set New Password
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
                v-model="formData.email"
                readonly
                name="email"
              )
              v-text-field(
                filled
                label="Password"
                type="password"
                v-model="formData.password"
                :rules="[rules.required, rules.isEightCharacters]"
                :error-messages="matchPasswords"
                hint="Must include at least 8 characters"
              )
              v-text-field(
                filled
                type="password"
                label="Confirm Password"
                v-model="formData.confirmPassword"
                :rules="[rules.required]"
                :error-messages="matchPasswords"
              )
              v-btn.mt-5(
                block
                color="primary"
                type="submit"
                :disabled="!valid"
                :loading="sendingRequest"
                depressed
              ) Reset
</template>

<script>
import { mapActions } from 'vuex'
import validations from '@/mixins/validationRulesMixin'

export default {
  name: 'RequestPassword',
  mixins: [validations],
  data () {
    return {
      passwordError: '',
      validUrl: false,
      error: null,
      sendingRequest: false,
      formData: {
        email: '',
        password: '',
        newPassword: ''
      }
    }
  },
  mounted () {
    this.token = this.$route.query.token
    this.formData.email = this.$route.query.email
    this.validUrl = !!this.token && !!this.formData.email

    if (!this.validUrl) {
      this.passwordError = 'Invalid or old link, please contact support'
    }
  },
  computed: {
    matchPasswords () {
      return (this.formData.password === this.formData.confirmPassword)
        ? '' : 'Passwords must match'
    }
  },
  methods: {
    ...mapActions('authManagement', ['create']),
    async resetPassword () {
      this.sendingRequest = true
      try {
        await this.create({
          action: 'resetPwdLong',
          notifierOptions: {
            preferredComm: 'email'
          },
          value: {
            token: this.token,
            password: this.formData.password
          }
        })
        this.$router.push({
          name: 'login'
        })
        this.$snackSuccess('Successfully reset password, you may now login!')
      } catch (error) {
        if (error.code === 404 && error.name === 'NotFound') {
          this.$snackError('Invalid or old link, please contact support')
        }
      }

      this.sendingRequest = false
    }
  }
}
</script>
