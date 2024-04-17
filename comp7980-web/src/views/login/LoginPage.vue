<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { userLogin, userRegister } from '@/api/user'

import { ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isLogin: true // 用于切换显示的是登录表单还是注册表单
})

const toggleForm = () => {
  form.value.isLogin = !form.value.isLogin // 切换表单
}

const validateForm = () => {
  // Common checks for both login and register
  if (!form.value.username) {
    ElMessageBox.alert('The username cannot be empty!', 'Error', {
      confirmButtonText: '确定',
      type: 'error',
      center: true
    })
    return false
  }
  if (!form.value.password) {
    ElMessageBox.alert('The password cannot be empty!', 'Error', {
      confirmButtonText: '确定',
      type: 'error',
      center: true
    })
    return false
  }

  // Additional checks for register
  if (!form.value.isLogin) {
    if (form.value.password !== form.value.confirmPassword) {
      ElMessageBox.alert('The passwords entered twice do not match!', 'Registration Error', {
        confirmButtonText: '确定',
        type: 'error',
        center: true
      })
      return false
    }
    // 可以添加更多注册字段的验证
  }

  return true
}

const handleSubmit = async () => {
  // 添加条件验证表单所有字段
  if (!validateForm()) {
    return // 如果验证失败，就终止函数执行
  }
  if (form.value.isLogin) {
    const res = await userLogin(form.value)
    userStore.setToken(res.token)
    router.push('/')
    // console.log('登录信息', form.value);
  } else {
    // 注册之前检查密码是否匹配
    if (form.value.password !== form.value.confirmPassword) {
      // 如果密码不匹配，则可能需要显示一个错误消息
      ElMessageBox.alert('The passwords entered twice do not match!', 'Error', {
        confirmButtonText: 'Confirm',
        type: 'error',
        center: true
      })
      return
    }
    // 这里处理注册逻辑
    try {
      const res = await userRegister(form.value)
      if (res && res.token) {
        userStore.setToken(res.token)
        router.push('/login')
        // 切换回去login界面
        toggleForm()
      } else {
        throw new Error('Registration failed to get a token! token!')
      }
    } catch (error) {
      ElMessageBox.alert(error.message || 'Unknown error', 'Registration Failed', {
        confirmButtonText: 'Confirm',
        type: 'error',
        center: true
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <el-card :header="form.isLogin ? 'SIGN IN' : 'SIGN UP'">
      <el-form :model="form" label-position="top" style="width: 300px; margin: auto">
        <el-form-item label="USERNAME">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="PASSWORD">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <!-- 注册时显示密码确认 -->
        <el-form-item v-if="!form.isLogin" label="CONFIRM PASSWORD">
          <el-input type="password" v-model="form.confirmPassword"></el-input>
        </el-form-item>
        <el-space direction="vertical">
          <el-row>
            <el-button type="primary" @click="handleSubmit">{{
              form.isLogin ? 'SIGN IN' : 'SIGN UP'
            }}</el-button></el-row
          >
          <el-row
            ><el-text v-if="form.isLogin" type="info" size="small">HAVE NO ACCOUNT?</el-text
            ><el-text v-if="!form.isLogin" type="info" size="small"
              >HAVE AN ACCOUNT?</el-text
            ></el-row
          >
          <el-row>
            <el-button type="info" @click="toggleForm">{{
              form.isLogin ? 'SIGN UP' : 'SIGN IN'
            }}</el-button></el-row
          ></el-space
        >
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-row {
  justify-content: center;
  align-items: center;
}

.el-space {
  width: 100%;
}
</style>
