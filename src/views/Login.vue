<template>
  <div class="login">
    <div class="box">
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/logo.png" class="face">
      </div>
      
      <!-- 表单 -->
      <el-form class="form" label-width="80px" :model="loginForm" :rules="loginRules" ref="loginRef">
        <el-form-item class="username" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item class="password" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetIpts">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入正确名称', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确密码', trigger: 'blur' },
          { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetIpts() {
      this.$refs.loginRef.resetFields();
    },
    login() {
      this.$refs.loginRef.validate(async valid => {
        if(!valid) return;
        const { data : res } = await this.$http.post('login', this.loginForm)
        if(res.meta.status !== 200) return this.$message.error('账号密码错误')
        this.$message.success('登录成功')
        window.sessionStorage.setItem("token", res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background: hsl(200, 55%, 33%);
  height: 100%;
  
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  width: 450px;
  height: 300px;

  background: white;
  border-radius: 5px;
  position: relative;
}
.logo {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  background: white;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 5px #eee;

  display: flex;
  justify-content: center;
  align-items: center;
  
  .face {
    width: 66%;
    height: 66%;
  }
}
.form {
  position: absolute;
  bottom: 0;

  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;

  .username {
    transform: translate(-40px, -10px)
  }
  .password {
    transform: translate(-40px, -10px)
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
