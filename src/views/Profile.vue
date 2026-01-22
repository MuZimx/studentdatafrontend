<template>
  <div class="profile">
    <!-- 面包屑导航 -->
    <t-breadcrumb class="breadcrumb" :max-item-width="150">
      <t-breadcrumb-item to="/dashboard">首页</t-breadcrumb-item>
      <t-breadcrumb-item>个人中心</t-breadcrumb-item>
    </t-breadcrumb>

    <div class="profile-container">
      <!-- 用户基本信息卡片 -->
      <t-card :bordered="false" class="user-basic-card">
        <template #header>
          <h2 class="card-title">基本信息</h2>
        </template>

        <div class="user-basic-content">
          <!-- 身份标签和用户名 -->
          <div class="user-identity">
            <t-tag
                size="large"
                :theme="authStore.userInfo?.role === 'MANAGER' ? 'danger' : 'success'"
                shape="round"
                class="role-tag"
            >
              {{ authStore.userInfo?.role === 'MANAGER' ? '管理员' : '学生' }}
            </t-tag>
            <h3 class="user-name">{{ authStore.userInfo?.username }}</h3>
          </div>

          <!-- 基本信息表格 -->
          <t-descriptions class="basic-info-table" :column="2" bordered>
            <t-descriptions-item label="用户名">
              <span class="info-value">{{ authStore.userInfo?.username }}</span>
            </t-descriptions-item>

            <t-descriptions-item label="用户角色">
              <t-tag
                  size="small"
                  :theme="authStore.userInfo?.role === 'MANAGER' ? 'danger' : 'success'"
              >
                {{ authStore.userInfo?.role === 'MANAGER' ? '管理员' : '普通用户' }}
              </t-tag>
            </t-descriptions-item>

            <t-descriptions-item v-if="authStore.userInfo?.studentId" label="学号">
              <t-tag size="small" theme="primary" variant="light">
                {{ authStore.userInfo.studentId }}
              </t-tag>
            </t-descriptions-item>

            <t-descriptions-item label="当前时间">
              <span class="info-value">{{ formattedDateTime }}</span>
            </t-descriptions-item>
          </t-descriptions>
        </div>
      </t-card>

      <!-- 学生详细信息卡片（仅当用户有学生ID时显示） -->
      <t-card
          v-if="authStore.userInfo?.studentId"
          :bordered="false"
          class="student-detail-card"
      >
        <template #header>
          <h2 class="card-title">学生详细信息</h2>
        </template>

        <div class="student-detail-content" v-if="studentData">
          <!-- 学生基本信息 -->
          <div class="info-section">
            <h3 class="section-title">基本信息</h3>
            <t-descriptions class="info-table" :column="2" bordered>
              <t-descriptions-item label="学号">
                <span class="info-value">{{ studentData.studentId }}</span>
              </t-descriptions-item>

              <t-descriptions-item label="姓名">
                <span class="info-value">{{ studentData.name }}</span>
              </t-descriptions-item>

              <t-descriptions-item label="性别">
                <t-tag size="small" :theme="studentData.gender === '男' ? 'primary' : 'warning'">
                  {{ studentData.gender }}
                </t-tag>
              </t-descriptions-item>

              <t-descriptions-item label="专业">
                <span class="info-value">{{ studentData.major }}</span>
              </t-descriptions-item>

              <t-descriptions-item label="出生日期">
                <span class="info-value">{{ studentData.birthday }}</span>
              </t-descriptions-item>

              <t-descriptions-item label="联系电话">
                <span class="info-value">{{ studentData.phone }}</span>
              </t-descriptions-item>
            </t-descriptions>
          </div>

          <!-- 联系地址 -->
          <div class="info-section">
            <h3 class="section-title">联系地址</h3>
            <div class="address-box">
              {{ studentData.address }}
            </div>
          </div>

          <!-- 课程成绩 -->
          <div class="info-section" v-if="studentData.courses && studentData.courses.length > 0">
            <h3 class="section-title">课程成绩</h3>
            <t-table
                :data="studentData.courses"
                :columns="courseColumns"
                row-key="courseName"
                size="medium"
                :pagination="false"
                :bordered="true"
                class="courses-table"
                :hover="true"
            >
              <template #score="{ row }">
                <t-tag
                    :theme="getScoreColor(row.score)"
                    size="small"
                    variant="light"
                >
                  {{ row.score }} 分
                </t-tag>
              </template>
            </t-table>
          </div>

          <!-- 无课程信息的提示 -->
          <div v-else class="no-data">
            <t-icon name="info-circle" size="20px" />
            <span>暂无课程成绩信息</span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-else-if="loading" class="loading-state">
          <t-loading size="small" text="正在加载学生信息..." />
        </div>

        <!-- 无学生数据或加载失败 -->
        <div v-else class="no-data">
          <t-icon name="info-circle" size="20px" theme="warning" />
          <span>未找到学生信息</span>
        </div>
      </t-card>

      <!-- 管理员信息卡片 -->
      <t-card
          v-if="authStore.userInfo?.role === 'MANAGER'"
          :bordered="false"
          class="admin-info-card"
      >
        <template #header>
          <h2 class="card-title">管理员信息</h2>
        </template>

        <div class="admin-info-content">
          <t-descriptions class="info-table" :column="1" bordered>
            <t-descriptions-item label="管理员权限">
              <div class="permissions">
                <t-space>
                  <t-tag size="small" theme="success" variant="light">用户管理</t-tag>
                  <t-tag size="small" theme="primary" variant="light">学生管理</t-tag>
                  <t-tag size="small" theme="warning" variant="light">系统设置</t-tag>
                </t-space>
              </div>
            </t-descriptions-item>
          </t-descriptions>
        </div>
      </t-card>

      <!-- 无学生信息的提示（学生角色但无学号） -->
      <t-card
          v-else-if="authStore.userInfo?.role === 'USER' && !authStore.userInfo?.studentId"
          :bordered="false"
          class="no-student-card"
      >
        <template #header>
          <h2 class="card-title">学生信息</h2>
        </template>
        <div class="no-student-content">
          <t-icon name="info-circle" size="24px" theme="warning" />
          <p>当前账号未关联学生信息</p>
          <p class="hint">如需关联学生信息，请联系管理员</p>
        </div>
      </t-card>

      <!-- 操作按钮 -->
      <div class="action-section">
        <t-space>
          <t-button
              theme="primary"
              variant="outline"
              @click="handleRefresh"
              :loading="loading"
          >
            <t-icon name="refresh" />
            刷新信息
          </t-button>
          <t-button
              theme="danger"
              variant="outline"
              @click="handleLogout"
          >
            <t-icon name="logout" />
            退出登录
          </t-button>
        </t-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'

// 定义接口类型
interface CourseScore {
  courseName: string;
  score: number;
}

interface StudentData {
  studentId: string;
  name: string;
  gender: string;
  phone: string;
  address: string;
  major: string;
  birthday: string;
  courses: CourseScore[];
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const router = useRouter()
const authStore = useAuthStore()
const studentData = ref<StudentData | null>(null)
const loading = ref(false)

// 表格列配置
const courseColumns = [
  {
    title: '课程名称',
    colKey: 'courseName',
    align: 'left',
    width: '200px',
  },
  {
    title: '成绩',
    colKey: 'score',
    align: 'center',
    width: '120px',
  },
]

// 格式化日期时间
const formattedDateTime = computed(() => {
  const now = new Date()
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
})

// 根据成绩获取颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

// 获取学生信息
const fetchStudentInfo = async () => {
  if (!authStore.userInfo?.studentId || authStore.userInfo?.role !== 'USER') {
    studentData.value = null
    return
  }

  loading.value = true
  try {
    const response = await fetch(`/api/students/${authStore.userInfo.studentId}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    })

    const result: ApiResponse<StudentData> = await response.json()

    if (result.code === 200) {
      studentData.value = result.data
      MessagePlugin.success('学生信息加载成功')
    } else {
      MessagePlugin.error(result.message || '获取学生信息失败')
      studentData.value = null
    }
  } catch (error) {
    console.error('获取学生信息失败:', error)
    MessagePlugin.error('网络错误，获取学生信息失败')
    studentData.value = null
  } finally {
    loading.value = false
  }
}

// 刷新信息
const handleRefresh = () => {
  fetchStudentInfo()
}

// 退出登录
const handleLogout = async () => {
  const dialog = DialogPlugin.confirm({
    header: '确认退出',
    body: '确定要退出登录吗？',
    confirmBtn: '确定',
    cancelBtn: '取消',
    theme: 'warning',
    onConfirm: async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('退出登录接口调用失败:', error)
      } finally {
        authStore.logout()
        router.push('/login')
        dialog.hide()
      }
    }
  })
}

// 页面加载时获取学生信息
onMounted(() => {
  if (authStore.userInfo?.studentId && authStore.userInfo?.role === 'USER') {
    fetchStudentInfo()
  }
})
</script>

<style scoped>
.profile {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 24px;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* 卡片通用样式 */
.user-basic-card,
.student-detail-card,
.admin-info-card,
.no-student-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  background: #ffffff;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  padding: 4px 0;
}

/* 用户基本信息卡片 */
.user-basic-content {
  padding: 20px;
}

.user-identity {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.role-tag {
  font-size: 16px;
  padding: 8px 16px;
}

.user-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
}

.basic-info-table {
  font-size: 14px;
}

.info-value {
  font-weight: 500;
  color: #1d2129;
}

/* 学生详细信息卡片 */
.student-detail-content {
  padding: 20px;
}

.info-section {
  margin-bottom: 28px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
}

.info-table {
  font-size: 14px;
}

.address-box {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-size: 14px;
  line-height: 1.6;
  color: #1d2129;
}

.courses-table {
  font-size: 14px;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  color: #8a9099;
  gap: 8px;
  font-size: 14px;
}

.loading-state {
  padding: 32px 20px;
  text-align: center;
}

/* 管理员信息卡片 */
.admin-info-content {
  padding: 20px;
}

.permissions {
  padding: 4px 0;
}

/* 无学生信息提示 */
.no-student-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  gap: 12px;
}

.no-student-content p {
  margin: 0;
  font-size: 15px;
  color: #1d2129;
}

.no-student-content .hint {
  font-size: 13px;
  color: #8a9099;
}

/* 操作按钮区域 */
.action-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile {
    padding: 16px;
  }

  .user-identity {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-section {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
  }

  .user-name {
    font-size: 18px;
  }
}
</style>