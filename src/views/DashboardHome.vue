<template>
  <div class="home-content">
    <t-card title="欢迎使用学生信息管理系统">
      <p>欢迎回来，{{ authStore.userInfo?.username }}！</p>
      <p>今天是 {{ currentDate }}</p>
    </t-card>

    <t-card title="快捷操作" style="margin-top: 20px;">
      <t-space>
        <t-button @click="$router.push('/students')">学生管理</t-button>
        <t-button @click="$router.push('/profile')">个人中心</t-button>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN')
})
</script>

<style scoped>
.home-content {
  padding: 20px;
}
</style>