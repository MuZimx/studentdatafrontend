<!-- StudentDetail.vue 修改后的完整代码 -->
<template>
  <div class="student-detail">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <t-breadcrumb class="breadcrumb" :max-item-width="150">
        <t-breadcrumb-item to="/dashboard">首页</t-breadcrumb-item>
        <t-breadcrumb-item to="/students">学生管理</t-breadcrumb-item>
        <t-breadcrumb-item>学生详情</t-breadcrumb-item>
      </t-breadcrumb>
    </div>

    <!-- 主内容 -->
    <div class="detail-container">
      <!-- 操作工具栏 -->
      <div class="action-toolbar">
        <t-space>
          <t-button variant="text" @click="$router.push('/students')">
            <template #icon><t-icon name="arrow-left" /></template>
            返回列表
          </t-button>
          <t-button
              v-if="authStore.userInfo?.role === 'MANAGER'"
              theme="warning"
              @click="handleEdit"
          >
            <template #icon><t-icon name="edit" /></template>
            编辑信息
          </t-button>
          <t-button
              v-if="authStore.userInfo?.role === 'MANAGER'"
              theme="danger"
              variant="outline"
              @click="handleDelete"
          >
            <template #icon><t-icon name="delete" /></template>
            删除学生
          </t-button>
        </t-space>
      </div>

      <!-- 基本信息卡片 -->
      <t-card class="info-card">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <t-icon name="user" style="margin-right: 8px; color: #1890ff;" />
              <h2 class="card-title">学生基本信息</h2>
            </div>
            <div v-if="student" class="header-right">
              <t-tag size="large" :theme="student.gender === '男' ? 'primary' : 'warning'" shape="round">
                {{ student.gender }}
              </t-tag>
            </div>
          </div>
        </template>

        <t-loading :loading="loading" size="large">
          <div v-if="student" class="detail-content">
            <!-- 基本信息网格 -->
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">学号</div>
                <div class="info-value">
                  <t-tag size="large" theme="primary" variant="light-outline">
                    {{ student.studentId }}
                  </t-tag>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">姓名</div>
                <div class="info-value">
                  <span class="name-text">{{ student.name }}</span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">联系电话</div>
                <div class="info-value">
                  <div class="phone-container">
                    <t-icon name="phone" style="margin-right: 8px; color: #52c41a;" />
                    <span>{{ student.phone }}</span>
                  </div>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">专业</div>
                <div class="info-value">
                  <t-tag size="large" theme="success" variant="light-outline">
                    {{ student.major }}
                  </t-tag>
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">出生日期</div>
                <div class="info-value">
                  <t-tag size="large" variant="light">
                    {{ student.birthday }}
                  </t-tag>
                </div>
              </div>

              <div class="info-row full-width">
                <div class="info-label">联系地址</div>
                <div class="info-value">
                  <div class="address-container">
                    <t-icon name="location" style="margin-right: 8px; color: #fa8c16;" />
                    <span class="address-text">{{ student.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <t-result
                status="error"
                title="学生不存在"
                sub-title="请求的学生信息不存在或已被删除"
            >
              <template #actions>
                <t-space>
                  <t-button @click="$router.push('/students')">返回列表</t-button>
                  <t-button theme="primary" @click="loadStudent">重新加载</t-button>
                </t-space>
              </template>
            </t-result>
          </div>
        </t-loading>
      </t-card>

      <!-- 课程成绩卡片 -->
      <t-card v-if="student && student.courses && student.courses.length > 0" class="courses-card">
        <template #header>
          <div class="card-header">
            <div class="header-left">
              <t-icon name="book-open" style="margin-right: 8px; color: #722ed1;" />
              <h2 class="card-title">课程成绩信息</h2>
            </div>
            <div class="statistics">
              <t-space>
                <t-statistic
                    title="课程总数"
                    :value="student.courses.length"
                    prefix=""
                    suffix="门"
                    trend="increase"
                />
                <t-statistic
                    title="平均成绩"
                    :value="averageScore.toFixed(1)"
                    prefix=""
                    suffix="分"
                    :trend="getScoreTrend(averageScore)"
                />
              </t-space>
            </div>
          </div>
        </template>

        <div class="courses-content">
          <!-- 课程成绩网格 -->
          <div class="courses-grid">
            <div v-for="(course, index) in student.courses" :key="index" class="course-item">
              <div class="course-header">
                <h3 class="course-title">{{ course.courseName }}</h3>
                <t-tag
                    :theme="getScoreTheme(course.score)"
                    shape="round"
                    size="large"
                    class="score-tag"
                >
                  {{ course.score.toFixed(1) }}分
                </t-tag>
              </div>

              <div class="course-progress">
                <t-progress
                    :percentage="course.score"
                    :color="getScoreColor(course.score)"
                    :label="true"
                    :stroke-width="8"
                    size="large"
                />
              </div>

              <div class="course-level">
                <t-icon
                    :name="getScoreIcon(course.score)"
                    :style="{ color: getScoreColor(course.score) }"
                    size="20px"
                />
                <span class="level-text">{{ getScoreLevel(course.score) }}</span>
              </div>
            </div>
          </div>

          <!-- 成绩分析 -->
          <div class="analysis-section">
            <h3 class="analysis-title">成绩分析</h3>
            <div class="analysis-grid">
              <t-card class="analysis-card">
                <div class="analysis-item">
                  <div class="analysis-label">最高分</div>
                  <div class="analysis-value">{{ highestScore.toFixed(1) }}分</div>
                  <div class="analysis-desc">{{ getHighestCourse() }}</div>
                </div>
              </t-card>

              <t-card class="analysis-card">
                <div class="analysis-item">
                  <div class="analysis-label">最低分</div>
                  <div class="analysis-value">{{ lowestScore.toFixed(1) }}分</div>
                  <div class="analysis-desc">{{ getLowestCourse() }}</div>
                </div>
              </t-card>

              <t-card class="analysis-card">
                <div class="analysis-item">
                  <div class="analysis-label">及格率</div>
                  <div class="analysis-value">{{ passRate.toFixed(0) }}%</div>
                  <div class="analysis-desc">{{ passedCount }}/{{ student.courses.length }}门</div>
                </div>
              </t-card>

              <t-card class="analysis-card">
                <div class="analysis-item">
                  <div class="analysis-label">优秀率</div>
                  <div class="analysis-value">{{ excellentRate.toFixed(0) }}%</div>
                  <div class="analysis-desc">{{ excellentCount }}/{{ student.courses.length }}门</div>
                </div>
              </t-card>
            </div>
          </div>
        </div>
      </t-card>

      <!-- 无课程成绩提示 -->
      <t-card v-else-if="student" class="no-courses-card">
        <template #header>
          <div class="card-header">
            <t-icon name="book-open" style="margin-right: 8px; color: #722ed1;" />
            <h2 class="card-title">课程成绩信息</h2>
          </div>
        </template>

        <t-result
            title="暂无课程成绩"
            sub-title="该学生尚未添加任何课程成绩信息"
            icon="book"
        >
          <template #actions>
            <t-button
                v-if="authStore.userInfo?.role === 'MANAGER'"
                theme="primary"
                @click="handleEdit"
            >
              去添加课程
            </t-button>
          </template>
        </t-result>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { studentApi } from '@/api/student'
import { useAuthStore } from '@/stores/auth'
import type { Student } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const studentId = route.params.id as string
const student = ref<Student | null>(null)
const loading = ref(false)

// 计算统计信息
const averageScore = computed(() => {
  if (!student.value?.courses.length) return 0
  const sum = student.value.courses.reduce((acc, course) => acc + course.score, 0)
  return sum / student.value.courses.length
})

const highestScore = computed(() => {
  if (!student.value?.courses.length) return 0
  return Math.max(...student.value.courses.map(c => c.score))
})

const lowestScore = computed(() => {
  if (!student.value?.courses.length) return 0
  return Math.min(...student.value.courses.map(c => c.score))
})

const passedCount = computed(() => {
  if (!student.value?.courses.length) return 0
  return student.value.courses.filter(c => c.score >= 60).length
})

const excellentCount = computed(() => {
  if (!student.value?.courses.length) return 0
  return student.value.courses.filter(c => c.score >= 90).length
})

const passRate = computed(() => {
  if (!student.value?.courses.length) return 0
  return (passedCount.value / student.value.courses.length) * 100
})

const excellentRate = computed(() => {
  if (!student.value?.courses.length) return 0
  return (excellentCount.value / student.value.courses.length) * 100
})

// 获取最高分课程
const getHighestCourse = () => {
  if (!student.value?.courses.length) return ''
  const highest = student.value.courses.reduce((prev, current) =>
      prev.score > current.score ? prev : current
  )
  return highest.courseName
}

// 获取最低分课程
const getLowestCourse = () => {
  if (!student.value?.courses.length) return ''
  const lowest = student.value.courses.reduce((prev, current) =>
      prev.score < current.score ? prev : current
  )
  return lowest.courseName
}

// 获取分数标签主题
const getScoreTheme = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return 'var(--td-success-color)'
  if (score >= 80) return 'var(--td-primary-color)'
  if (score >= 60) return 'var(--td-warning-color)'
  return 'var(--td-error-color)'
}

// 获取分数等级
const getScoreLevel = (score: number) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  if (score >= 60) return '及格'
  return '不及格'
}

// 获取分数图标
const getScoreIcon = (score: number) => {
  if (score >= 90) return 'check-circle-filled'
  if (score >= 80) return 'check-circle'
  if (score >= 60) return 'info-circle'
  return 'error-circle'
}

// 获取分数趋势
const getScoreTrend = (score: number) => {
  if (score >= 85) return 'increase'
  if (score >= 70) return 'increase'
  return 'decrease'
}

// 获取学生详情
const loadStudent = async () => {
  loading.value = true
  try {
    const res = await studentApi.getStudentById(studentId)
    if (res.code === 200) {
      student.value = res.data
      MessagePlugin.success('学生信息加载成功')
    } else {
      MessagePlugin.error(res.message || '学生不存在')
      student.value = null
    }
  } catch (error: any) {
    MessagePlugin.error(error.message || '加载学生信息失败')
    student.value = null
  } finally {
    loading.value = false
  }
}

// 编辑学生
const handleEdit = () => {
  router.push({
    name: 'StudentList',
    query: { edit: studentId }
  })
}

// 删除学生
const handleDelete = () => {
  if (!student.value) return

  const dialog = DialogPlugin.confirm({
    header: '确认删除学生',
    body: `确定要删除学生 "${student.value.name}" (学号: ${studentId}) 吗？此操作不可恢复，且会删除该学生的所有课程成绩信息！`,
    confirmBtn: '确定删除',
    cancelBtn: '取消',
    theme: 'danger',
    onConfirm: async () => {
      try {
        const res = await studentApi.deleteStudent(studentId)
        if (res.code === 200) {
          MessagePlugin.success(`学生 "${student.value!.name}" 删除成功`)
          dialog.hide() // 确保对话框关闭
          router.push('/students')
        } else {
          MessagePlugin.error(res.message || '删除失败')
        }
      } catch (error: any) {
        MessagePlugin.error(error.message || '删除失败')
      }
    }
  })
}

// 生命周期
onMounted(() => {
  loadStudent()
})
</script>

<style scoped>
.student-detail {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 64px);
}

.breadcrumb-container {
  margin-bottom: 20px;
}

.action-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card,
.courses-card,
.no-courses-card {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #e8e8e8;
  background: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.detail-content {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.info-row.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.name-text {
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
}

.phone-container,
.address-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-text {
  line-height: 1.5;
}

.courses-content {
  padding: 20px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.course-item {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.course-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.course-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
}

.score-tag {
  font-weight: 600;
  font-size: 14px;
}

.course-progress {
  margin-bottom: 12px;
}

.course-level {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-text {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.analysis-section {
  margin-top: 30px;
}

.analysis-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1890ff;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.analysis-card {
  padding: 20px;
  text-align: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: none;
}

.analysis-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.analysis-label {
  font-size: 14px;
  color: #666;
}

.analysis-value {
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
}

.analysis-desc {
  font-size: 12px;
  color: #999;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-detail {
    padding: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-left,
  .header-right {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>