<template>
  <div class="login-container">
    <t-card class="login-card">
      <template #header>
        <div class="login-header">
          <h1>学生信息管理系统</h1>
          <p>用户登录</p>
        </div>
      </template>
      
      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        @submit="onSubmit"
        label-width="0"
      >
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
        
        <t-form-item>
          <t-button
            theme="primary"
            type="submit"
            size="large"
            block
            :loading="loading"
          >
            登录
          </t-button>
        </t-form-item>
        
        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
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
import { useAuthStore } from '@/stores/auth'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstanceFunctions>()
const loading = ref(false)

const formData = reactive({
  username: '',
  password: ''
})

const rules: Record<string, FormRule[]> = {
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  password: [
    { required: true, message: '请输入密码', type: 'error' },
    { min: 6, message: '密码长度至少6位', type: 'error' }
  ]
}

const onSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await authApi.login(formData)
    authStore.setToken(res.data.token)
    authStore.setUserInfo({
      studentId: res.data.studentId,
      username: res.data.username,
      role: res.data.role
    })
    MessagePlugin.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
}

.login-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.login-header p {
  font-size: 14px;
  color: #999;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.login-footer span {
  color: #666;
}

.login-footer a {
  color: #0052d9;
  text-decoration: none;
  margin-left: 4px;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
