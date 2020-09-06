<template>
  <div class="login-wrapper">
    <div class="login">
      <div class="login-title">
        HBooker Extractor
      </div>
      <at-input v-model="account" placeholder="用户名" icon="user" class="input-account"></at-input>
      <at-input v-model="password" placeholder="密码" icon="lock" type="password" class="input-password"></at-input>
    </div>
    <div class="button-wrapper">
      <div class="login-button">
        <at-button type="primary" @click="login" :disabled="canLogin">刺猬猫账户登陆</at-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: '',
      canLogin: false
    }
  },
  methods: {
    login() {
      this.canLogin = true
      this.$get(
        {
          url: '/signup/login',
          para: {
            login_name: this.account,
            passwd: this.password
          }
        },
        // eslint-disable-next-line no-unused-vars
        () => {
          this.canLogin = false
        }
      ).then(
        res => {
          localStorage.setItem('account', this.account)
          localStorage.setItem('password', this.password)
          localStorage.setItem('accountInfo', JSON.stringify(res))
          this.$router.push('/')
        },
        // eslint-disable-next-line no-unused-vars
        err => {
          this.canLogin = false
        },
        () => {
          this.canLogin = false
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-wrapper{
    width 420px
    margin 0 auto
    height 100%
    display flex
    flex-direction column
    justify-content center

    .login{
        .login-title{
            font-size 18px
            font-weight 600
            margin-bottom 12px
        }

        .input-account{
            margin 24px 0
        }
        .input-password{
            margin 24px 0
        }
    }

    .button-wrapper{
        width 100%
        margin-top 12px
        .login-button{
            float right
        }
    }
}
</style>
