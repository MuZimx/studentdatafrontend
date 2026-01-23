<template>
  <div class="student-detail">
    <!-- 面包屑导航 -->
    <t-breadcrumb class="breadcrumb" :max-item-width="150">
      <t-breadcrumbItem to="/dashboard">首页</t-breadcrumbItem>
      <t-breadcrumbItem to="/students">学生管理</t-breadcrumbItem>
      <t-breadcrumbItem>学生详情</t-breadcrumbItem>
    </t-breadcrumb>

    <!-- 主内容 -->
    <div class="detail-container">
      <!-- 基本信息卡片 -->
      <t-card :bordered="false" class="info-card">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">
              <t-icon name="user" style="margin-right: 8px" />
              学生基本信息
            </h2>
            <t-space>
              <t-button
                  variant="text"
                  @click="$router.push('/students')"
              >
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
        </template>

        <t-loading :loading="loading" size="large">
          <div v-if="student" class="detail-content">
            <t-row :gutter="[32, 24]">
              <t-col :span="8">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="id-card" style="margin-right: 8px" />
                    学号
                  </div>
                  <div class="info-value">
                    <t-tag size="large" variant="light-outline" theme="primary">
                      {{ student.studentId }}
                    </t-tag>
                  </div>
                </div>
              </t-col>

              <t-col :span="8">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="user" style="margin-right: 8px" />
                    姓名
                  </div>
                  <div class="info-value">{{ student.name }}</div>
                </div>
              </t-col>

              <t-col :span="8">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="gender" style="margin-right: 8px" />
                    性别
                  </div>
                  <div class="info-value">
                    <t-tag
                        :theme="student.gender === '男' ? 'primary' : 'warning'"
                        shape="round"
                        size="large"
                    >
                      {{ student.gender }}
                    </t-tag>
                  </div>
                </div>
              </t-col>

              <t-col :span="8">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="phone" style="margin-right: 8px" />
                    联系电话
                  </div>
                  <div class="info-value">{{ student.phone }}</div>
                </div>
              </t-col>

              <t-col :span="16">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="location" style="margin-right: 8px" />
                    联系地址
                  </div>
                  <div class="info-value">{{ student.address }}</div>
                </div>
              </t-col>

              <t-col :span="12">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="book" style="margin-right: 8px" />
                    专业
                  </div>
                  <div class="info-value">
                    <t-tag size="large" variant="light-outline" theme="success">
                      {{ student.major }}
                    </t-tag>
                  </div>
                </div>
              </t-col>

              <t-col :span="12">
                <div class="info-item">
                  <div class="info-label">
                    <t-icon name="calendar" style="margin-right: 8px" />
                    出生日期
                  </div>
                  <div class="info-value">
                    <t-tag size="large" variant="light">
                      {{ student.birthday }}
                    </t-tag>
                  </div>
                </div>
              </t-col>
            </t-row>
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
      <t-card v-if="student && student.courses && student.courses.length > 0"
              :bordered="false"
              class="courses-card">
        <template #header>
          <div class="card-header">
            <h2 class="card-title">
              <t-icon name="book-open" style="margin-right: 8px" />
              课程成绩信息
            </h2>
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
          <t-row :gutter="[16, 16]">
            <t-col
                v-for="(course, index) in student.courses"
                :key="index"
                :span="6"
            >
              <t-card :bordered="false" class="course-card" hover>
                <template #header>
                  <div class="course-header">
                    <h3 class="course-title">{{ course.courseName }}</h3>
                    <t-tag
                        :theme="getScoreTheme(course.score)"
                        shape="round"
                        size="large"
                    >
                      {{ course.score.toFixed(1) }}
                    </t-tag>
                  </div>
                </template>

                <div class="course-info">
                  <t-progress
                      :percentage="course.score"
                      :color="getScoreColor(course.score)"
                      :label="true"
                      :stroke-width="8"
                      size="large"
                  />
                  <div class="course-level">
                    <t-icon
                        :name="getScoreIcon(course.score)"
                        :style="{ color: getScoreColor(course.score) }"
                        size="20px"
                    />
                    <span class="level-text">{{ getScoreLevel(course.score) }}</span>
                  </div>
                </div>
              </t-card>
            </t-col>
          </t-row>

          <!-- 成绩分析 -->
          <div class="analysis-section">
            <h3 class="analysis-title">成绩分析</h3>
            <t-row :gutter="[16, 16]">
              <t-col :span="6">
                <t-card :bordered="false" class="analysis-card">
                  <div class="analysis-item">
                    <div class="analysis-label">最高分</div>
                    <div class="analysis-value">{{ highestScore.toFixed(1) }}分</div>
                    <div class="analysis-desc">{{ getHighestCourse() }}</div>
                  </div>
                </t-card>
              </t-col>
              <t-col :span="6">
                <t-card :bordered="false" class="analysis-card">
                  <div class="analysis-item">
                    <div class="analysis-label">最低分</div>
                    <div class="analysis-value">{{ lowestScore.toFixed(1) }}分</div>
                    <div class="analysis-desc">{{ getLowestCourse() }}</div>
                  </div>
                </t-card>
              </t-col>
              <t-col :span="6">
                <t-card :bordered="false" class="analysis-card">
                  <div class="analysis-item">
                    <div class="analysis-label">及格率</div>
                    <div class="analysis-value">{{ passRate.toFixed(0) }}%</div>
                    <div class="analysis-desc">{{ passedCount }}/{{ student.courses.length }}门</div>
                  </div>
                </t-card>
              </t-col>
              <t-col :span="6">
                <t-card :bordered="false" class="analysis-card">
                  <div class="analysis-item">
                    <div class="analysis-label">优秀率</div>
                    <div class="analysis-value">{{ excellentRate.toFixed(0) }}%</div>
                    <div class="analysis-desc">{{ excellentCount }}/{{ student.courses.length }}门</div>
                  </div>
                </t-card>
              </t-col>
            </t-row>
          </div>
        </div>
      </t-card>

      <!-- 无课程成绩提示 -->
      <t-card
          v-else-if="student"
          :bordered="false"
          class="no-courses-card"
      >
        <template #header>
          <h2 class="card-title">
            <t-icon name="book-open" style="margin-right: 8px" />
            课程成绩信息
          </h2>
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
          router.push('/students')
        } else {
          MessagePlugin.error(res.message || '删除失败')
        }
      } catch (error: any) {
        MessagePlugin.error(error.message || '删除失败')
      }
      dialog.hide()
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
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: calc(100vh - 70px);
}

.info-card, .courses-card, .no-courses-card {
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover, .courses-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.course-card {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 10px;
  border: 1px solid var(--td-component-border);
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--td-brand-color);
}

.analysis-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  border: none;
}

.analysis-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--td-brand-color);
}
</style>