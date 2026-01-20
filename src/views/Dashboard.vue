<template>
  <div class="dashboard">
    <t-layout>
      <t-layout>
        <t-header>
          <div class="header-content">
            <h1>学生信息管理系统</h1>
            <div class="user-info">
              <t-space>
                <span>欢迎，{{ authStore.userInfo?.username }}</span>
                <t-tag :theme="authStore.userInfo?.role === 'MANAGER' ? 'danger' : 'success'">
                  {{ authStore.userInfo?.role === 'MANAGER' ? '管理员' : '学生' }}
                </t-tag>
                <t-button theme="default" size="small" @click="handleLogout">
                  退出登录
                </t-button>
              </t-space>
            </div>
          </div>
        </t-header>
        <t-content>
          <div class="content-wrapper">
            <t-card title="欢迎使用学生信息管理系统">
              <p>这是一个基于 Vue 3 + TDesign + TypeScript 的前端项目</p>
              <p>当前用户信息：</p>
              <t-descriptions :column="2" bordered>
                <t-descriptions-item label="学号">{{ authStore.userInfo?.studentId }}</t-descriptions-item>
                <t-descriptions-item label="用户名">{{ authStore.userInfo?.username }}</t-descriptions-item>
                <t-descriptions-item label="身份">
                  {{ authStore.userInfo?.role === 'MANAGER' ? '管理员' : '学生' }}
                </t-descriptions-item>
              </t-descriptions>
            </t-card>
          </div>
        </t-content>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  const dialog = DialogPlugin.confirm({
    header: '确认退出',
    body: '确定要退出登录吗？',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: () => {
      authStore.logout()
      MessagePlugin.success('已退出登录')
      router.push('/login')
      dialog.hide()
    }
  })
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 20px;
  color: #333;
}

.user-info {
  font-size: 14px;
}

.content-wrapper {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
