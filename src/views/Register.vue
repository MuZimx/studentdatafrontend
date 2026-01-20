<template>
  <div class="register-container">
    <t-card class="register-card">
      <template #header>
        <div class="register-header">
          <h1>学生信息管理系统</h1>
          <p>用户注册</p>
        </div>
      </template>
      
      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        @submit="onSubmit"
        label-width="0"
      >
        <t-form-item name="studentId">
          <t-input
            v-model="formData.studentId"
            placeholder="请输入学号"
            size="large"
            clearable
          >
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
        </t-form-item>
        
        <t-form-item name="username">
          <t-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
            clearable
          >
            <template #prefix-icon>
              <t-icon name="user" />
            </template>
          </t-input>
        </t-form-item>
        
        <t-form-item name="password">
          <t-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            clearable
          >
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>
        
        <t-form-item name="confirmPassword">
          <t-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            clearable
          >
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>
        
        <t-form-item name="role">
          <t-select
            v-model="formData.role"
            placeholder="请选择身份"
            size="large"
          >
            <t-option value="USER" label="学生" />
            <t-option value="MANAGER" label="管理员" />
          </t-select>
        </t-form-item>
        
        <t-form-item>
          <t-button
            theme="primary"
            type="submit"
            size="large"
            block
            :loading="loading"
          >
            注册
          </t-button>
        </t-form-item>
        
        <div class="register-footer">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </t-form>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { authApi } from '@/api/auth'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'

const router = useRouter()

const formRef = ref<FormInstanceFunctions>()
const loading = ref(false)

const formData = reactive({
  studentId: '',
  username: '',
  password: '',
  confirmPassword: '',
  role: 'USER' as 'USER' | 'MANAGER'
})

const validateConfirmPassword = (val: string) => {
  return new Promise((resolve) => {
    if (val !== formData.password) {
      resolve({ result: false, message: '两次输入的密码不一致', type: 'error' })
    } else {
      resolve({ result: true })
    }
  })
}

const rules: Record<string, FormRule[]> = {
  studentId: [
    { required: true, message: '请输入学号', type: 'error' }
  ],
  username: [
    { required: true, message: '请输入用户名', type: 'error' },
    { min: 3, message: '用户名长度至少3位', type: 'error' }
  ],
  password: [
    { required: true, message: '请输入密码', type: 'error' },
    { min: 6, message: '密码长度至少6位', type: 'error' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', type: 'error' },
    { validator: validateConfirmPassword }
  ],
  role: [
    { required: true, message: '请选择身份', type: 'error' }
  ]
}

const onSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    await authApi.register({
      studentId: formData.studentId,
      username: formData.username,
      password: formData.password,
      role: formData.role
    })
    MessagePlugin.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.register-card {
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
}

.register-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.register-header p {
  font-size: 14px;
  color: #999;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.register-footer span {
  color: #666;
}

.register-footer a {
  color: #0052d9;
  text-decoration: none;
  margin-left: 4px;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
