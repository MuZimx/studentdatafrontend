<template>
  <div class="dashboard">
    <!-- 顶部导航栏 -->
    <t-header class="dashboard-header">
      <div class="header-container">
        <div class="header-left">
          <div class="logo">
            <t-icon name="book" size="24px" style="margin-right: 12px" />
            <h1>学生信息管理系统</h1>
          </div>
        </div>
        <div class="header-right">
          <t-dropdown :options="userMenuOptions" @click="handleUserMenuClick">
            <div class="user-info">
              <t-avatar size="medium" shape="circle">
                {{ authStore.userInfo?.username?.charAt(0) }}
              </t-avatar>
              <div class="user-details">
                <div class="user-name">{{ authStore.userInfo?.username }}</div>
                <t-tag size="small" :theme="authStore.userInfo?.role === 'MANAGER' ? 'danger' : 'success'">
                  {{ authStore.userInfo?.role === 'MANAGER' ? '管理员' : '学生' }}
                </t-tag>
              </div>
              <t-icon name="chevron-down" size="16px" />
            </div>
            <!-- 自定义下拉菜单内容 -->
            <template #dropdown>
              <div class="custom-dropdown">
                <div class="dropdown-item" @click="handleLogout">
                  <t-icon name="logout" size="16px" />
                  <span>退出登录</span>
                </div>
              </div>
            </template>
          </t-dropdown>
        </div>
      </div>
    </t-header>

    <t-layout>
      <!-- 侧边栏菜单 -->
      <t-aside width="240px" class="dashboard-aside">
        <t-menu theme="light" :value="activeMenu" @change="handleMenuChange">
          <t-menu-item value="dashboard">
            <template #icon><t-icon name="home" /></template>
            首页概览
          </t-menu-item>
          <t-menu-item value="students">
            <template #icon><t-icon name="user" /></template>
            学生管理
          </t-menu-item>
          <t-menu-item value="profile">
            <template #icon><t-icon name="user-circle" /></template>
            个人中心
          </t-menu-item>
        </t-menu>
      </t-aside>

      <!-- 主内容区 -->
      <t-layout>
        <t-content class="dashboard-content">
          <div class="content-container">
            <router-view />
          </div>
        </t-content>
      </t-layout>
    </t-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DialogPlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'
import { authApi } from "@/api/auth.ts";

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = ref('dashboard')

const userMenuOptions = [
  {  value: 'logout', prefixIcon: 'logout' }
]

const handleMenuChange = (value: string) => {
  activeMenu.value = value
  switch (value) {
    case 'dashboard':
      router.push('/dashboard')
      break
    case 'students':
      router.push('/students')
      break
    case 'profile':
      router.push('/profile')
      break
  }
}


const handleUserMenuClick = ({ value }: { value: string }) => {
  if (value === 'logout') {
    handleLogout()
  }
}

const handleLogout = () => {
  const dialog = DialogPlugin.confirm({
    header: '确认退出',
    body: '确定要退出登录吗？',
    confirmBtn: '确定',
    cancelBtn: '取消',
    theme: 'warning',
    onConfirm: async () => {
      try {
        // 调用后端退出接口
        await authApi.logout()
      } catch (error) {
        console.error('退出登录失败:', error)
        // 即使后端退出失败，也要清理前端状态
      } finally {
        // 清理前端认证状态
        authStore.logout()
        // 跳转到登录页
        router.push('/login')
        dialog.hide()
      }
    }
  })
}

onMounted(() => {
  const path = route.path
  if (path.startsWith('/students')) {
    activeMenu.value = 'students'
  } else if (path === '/dashboard' || path === '/') {
    activeMenu.value = 'dashboard'
  } else if (path === '/profile') {
    activeMenu.value = 'profile'
  }
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.dashboard-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 64px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 100%;
}

.header-left .logo {
  display: flex;
  align-items: center;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--td-brand-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.dashboard-aside {
  background: #fff;
  border-right: 1px solid var(--td-component-border);
  height: calc(100vh - 64px);
}

.dashboard-content {
  background: #f5f7fa;
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 0;
}

.content-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100%;
}

.t-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.3s ease;
}

.t-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>