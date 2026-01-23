<template>
  <t-form ref="formRef" :data="localFormData" :rules="rules" label-align="left" :disabled="props.mode === 'view'">
    <t-form-item label="学号" name="studentId" required>
      <t-input v-model="localFormData.studentId" placeholder="请输入学号" :disabled="props.mode === 'edit'" />
    </t-form-item>

    <t-form-item label="姓名" name="name" required>
      <t-input v-model="localFormData.name" placeholder="请输入姓名" />
    </t-form-item>

    <t-form-item label="性别" name="gender" required>
      <t-radio-group v-model="localFormData.gender">
        <t-radio value="男">男</t-radio>
        <t-radio value="女">女</t-radio>
      </t-radio-group>
    </t-form-item>

    <t-form-item label="电话" name="phone" required>
      <t-input v-model="localFormData.phone" placeholder="请输入联系电话" />
    </t-form-item>

    <t-form-item label="地址" name="address" required>
      <t-input v-model="localFormData.address" placeholder="请输入联系地址" />
    </t-form-item>

    <t-form-item label="专业" name="major" required>
      <t-input v-model="localFormData.major" placeholder="请输入专业" />
    </t-form-item>

    <t-form-item label="出生日期" name="birthday" required>
      <t-date-picker v-model="localFormData.birthday" format="YYYY-MM-DD" />
    </t-form-item>

    <!-- 课程成绩动态表单部分 -->
    <div class="courses-section">
      <div class="section-header">
        <h3 class="section-title">课程成绩</h3>
        <t-button
            v-if="props.mode !== 'view'"
            size="small"
            variant="outline"
            @click="addCourse"
        >
          <template #icon><t-icon name="add" /></template>
          添加课程
        </t-button>
      </div>

      <div v-if="localFormData.courses.length === 0" class="no-courses">
        <t-icon name="info-circle" size="20px" />
        <span>暂无课程信息</span>
      </div>

      <div v-else class="courses-list">
        <div v-for="(course, index) in localFormData.courses" :key="index" class="course-item">
          <div class="course-header">
            <span class="course-index">课程 {{ index + 1 }}</span>
            <t-button
                v-if="props.mode !== 'view'"
                size="small"
                variant="text"
                theme="danger"
                @click="removeCourse(index)"
            >
              <template #icon><t-icon name="delete" /></template>
              删除
            </t-button>
          </div>


          <div class="course-form">
            <t-row :gutter="16">
              <t-col :span="16">
                <t-form-item :label="`课程名称 ${index + 1}`" label-width="80px">
                  <t-input
                      v-model="course.courseName"
                      placeholder="请输入课程名称"
                      :disabled="props.mode === 'view'"
                  />
                </t-form-item>
              </t-col>
              <t-col :span="8">
                <t-form-item :label="`成绩 ${index + 1}`" label-width="60px">
                  <t-input-number
                      v-model="course.score"
                      placeholder="请输入成绩"
                      :min="0"
                      :max="100"
                      :step="0.5"
                      :decimal-places="1"
                      :disabled="props.mode === 'view'"
                      style="width: 100%"
                  />
                </t-form-item>
              </t-col>
            </t-row>
          </div>
        </div>
      </div>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import type { StudentFormData } from '@/types'

interface Props {
  formData: StudentFormData
  mode?: 'add' | 'edit' | 'view'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add'
})

const formRef = ref<FormInstanceFunctions>()

// 创建本地的响应式表单数据副本
const localFormData = reactive<StudentFormData>({
  studentId: '',
  name: '',
  gender: '男',
  phone: '',
  address: '',
  major: '',
  birthday: '',
  courses: []
})

// 当props.formData变化时，更新本地副本
watch(
    () => props.formData,
    (newFormData) => {
      // 只在 formData 确实变化时才更新（避免不必要的重置）
      if (newFormData && newFormData.studentId !== localFormData.studentId) {
        Object.assign(localFormData, newFormData)
      }
      // 确保courses存在且是数组
      if (!localFormData.courses || !Array.isArray(localFormData.courses)) {
        localFormData.courses = []
      }
    },
    { immediate: true }
)

// 添加课程成绩验证规则
const rules: Record<string, FormRule[]> = {
  studentId: [{ required: true, message: '请输入学号' }],
  name: [{ required: true, message: '请输入姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  phone: [{ required: true, message: '请输入电话' }],
  address: [{ required: true, message: '请输入地址' }],
  major: [{ required: true, message: '请输入专业' }],
  birthday: [{ required: true, message: '请选择出生日期' }]
}

// 添加课程
const addCourse = () => {
  localFormData.courses.push({
    courseName: '',
    score: 0
  })
}

// 删除课程
const removeCourse = (index: number) => {
  localFormData.courses.splice(index, 1)
}

// 验证所有课程
const validateCourses = (): boolean => {
  // 如果没有课程，也是有效的
  if (localFormData.courses.length === 0) {
    return true
  }

  for (let i = 0; i < localFormData.courses.length; i++) {
    const course = localFormData.courses[i]
    if (!course.courseName || course.courseName.trim() === '') {
      return false
    }
    if (course.score === undefined || course.score === null || course.score < 0 || course.score > 100) {
      return false
    }
  }
  return true
}

// 表单验证
const validate = async (): Promise<boolean> => {
  try {
    // 验证基础表单
    await formRef.value?.validate()

    // 验证课程信息
    if (!validateCourses()) {
      return false
    }

    return true
  } catch {
    return false
  }
}

const getFormData = (): StudentFormData => {
  const cleanedCourses = localFormData.courses
      .filter(course => course.courseName && course.courseName.trim() !== '')
      .map(course => ({
        courseName: course.courseName.trim(),
        score: Number(course.score)
      }))

  return {
    studentId: localFormData.studentId.trim(),
    name: localFormData.name.trim(),
    gender: localFormData.gender,
    phone: localFormData.phone.trim(),
    address: localFormData.address.trim(),
    major: localFormData.major.trim(),
    birthday: localFormData.birthday,
    courses: cleanedCourses
  }
}

defineExpose({ validate, getFormData })
</script>

<style scoped>
.courses-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--td-component-border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.no-courses {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: var(--td-bg-color-secondarycontainer);
  border-radius: 8px;
  color: var(--td-text-color-placeholder);
  gap: 8px;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-item {
  border: 1px solid var(--td-component-border);
  border-radius: 8px;
  padding: 16px;
  background: var(--td-bg-color-secondarycontainer);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--td-component-stroke);
}

.course-index {
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.t-form__item) {
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .course-form {
    flex-direction: column;
  }
}
</style>