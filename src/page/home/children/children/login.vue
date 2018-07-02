<template>
  <div class="loginPage">
    <header-bar title="登录"></header-bar>
    <section class="login">
      <div class="loginDiv">
        <span class="title">手机号：</span>
        <input v-model="phoneNumber" type="text" class="text" :class="{errorBorder: inputError.account.error}">
      </div>
      <p v-if="inputError.account.error" class="errorMessage">{{inputError.account.message}}</p>
      <div class="loginDiv">
        <span class="title">密码：</span>
        <input v-model="password" type="password" class="text" :class="{errorBorder: inputError.password.error}">
      </div>
      <p v-if="inputError.password.error" class="errorMessage">{{inputError.password.message}}</p>
      <v-touch
        tag="div"
        class="loginButton"
        @tap="login">登录</v-touch>
    </section>
  </div>
</template>

<script>
import {login} from '../../../../api/getData'

export default {
  name: 'login',

  components: {
    HeaderBar: () => import('../../../../components/common/HeaderBar')
  },

  data () {
    return {
      phoneNumber: '',
      password: '',
      inputError: {
        account: {
          error: false,
          message: '请输入正确的账号'
        },
        password: {
          error: false,
          message: '请输入密码'
        }
      }
    }
  },

  methods: {
    async login () { // 登录
      try {
        if (!/^\d{11}$/.test(this.phoneNumber)) {
          this.inputError.account.error = true
          this.inputError.account.message = '手机号格式错误'
          return
        }
        this.inputError.account.error = false
        if (!/^[a-z0-9_]{5,20}$/.test(this.password)) {
          this.inputError.password.error = true
          this.inputError.password.message = '密码只能是5-10位字母数组或下划线'
          return
        }
        this.inputError.password.error = false
        let res = await login(this.phoneNumber, this.password)
        // 登录成功的操作没写
        this.inputError.account.error = true
        this.inputError.account.message = res.msg
      } catch (e) {
        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .loginPage {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #eee;
    .login {
      padding: 0 .1rem;
      .loginDiv {
        display: flex;
        margin: .1rem 0;
        align-items: center;    
        .title {
          width: 20%;
          font-size: .14rem;
          color: #464646;
        }
        .text {
          width: 80%;
          height: .3rem;
          text-indent: .1rem;
          color: #797979;
          border-radius: 2px;
          border: 1px solid #e7e7e7;
        }
        .errorBorder {
          border: 1px solid #f03a3a;
        }
      }
      .errorMessage {
        font-size: .12rem;
        color: #f03a3a;
        margin-left: 20%;
      }
      .loginButton {
        width: 80%;
        height: .3rem;
        background-color: #3ec0e7;
        color: #fff;
        text-align: center;
        line-height: .3rem;
        margin-top: .3rem;
        margin-left: 20%;
        border-radius: 2px;
      }
    }
  }
</style>

