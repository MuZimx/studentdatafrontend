<template>
  <div class="student-list">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2>学生管理</h2>
      </div>
      <div class="toolbar-right">
        <t-space>
          <t-input v-model="searchKeyword" placeholder="搜索学号、姓名、专业..." clearable />
          <t-button
              v-if="authStore.userInfo?.role === 'MANAGER'"
              theme="primary"
              @click="handleAdd"
              :loading="loading.add"
          >
            新增学生
          </t-button>
        </t-space>
      </div>
    </div>

    <!-- 学生表格 -->
    <t-card class="student-table-card">
      <t-loading :loading="loading.table" size="small">
        <div v-if="students.length > 0">
          <t-table
              :data="filteredStudents"
              :columns="columns"
              row-key="studentId"
              hover
              stripe
              size="medium"
          >
            <template #gender="{ row }">
              <t-tag :theme="row.gender === '男' ? 'primary' : 'warning'" variant="light" size="small">
                {{ row.gender }}
              </t-tag>
            </template>

            <template #courses="{ row }">
              <div v-if="row.courses && row.courses.length > 0">
                <t-popup
                    :content="getCoursesPopupContent(row)"
                    placement="top"
                    show-arrow
                    theme="default"
                >
                  <t-button size="small" variant="text">
                    {{ row.courses.length }} 门课程
                  </t-button>
                </t-popup>
              </div>
              <span v-else class="no-courses-text">暂无课程</span>
            </template>

            <template #operation="{ row }">
              <t-space>
                <t-button size="small" @click="handleView(row.studentId)">查看</t-button>
                <t-button
                    v-if="authStore.userInfo?.role === 'MANAGER'"
                    size="small"
                    @click="handleEdit(row)"
                >
                  编辑
                </t-button>
                <t-button
                    v-if="authStore.userInfo?.role === 'MANAGER'"
                    size="small"
                    theme="danger"
                    @click="handleDelete(row.studentId, row.name)"
                    :loading="loading.delete === row.studentId"
                >
                  删除
                </t-button>
              </t-space>
            </template>
          </t-table>
        </div>

        <div v-else class="empty-state">
          <t-result
              status="default"
              title="暂无学生数据"
              sub-title="点击上方按钮添加学生"
          >
            <template #icon>
              <t-icon name="user-search" size="48px" style="color: var(--td-text-color-placeholder);" />
            </template>
          </t-result>
        </div>
      </t-loading>
    </t-card>

    <!-- 表单对话框 -->
    <t-dialog
        v-model:visible="showDialog"
        :header="formMode === 'add' ? '新增学生' : '编辑学生'"
        width="600px"
        :on-close="handleDialogClose"
    >
      <StudentForm ref="formRef" :form-data="formData" :mode="formMode" />
      <template #footer>
        <t-space>
          <t-button @click="showDialog = false">取消</t-button>
          <t-button
              theme="primary"
              @click="handleSubmit"
              :loading="loading.submit"
          >
            确定
          </t-button>
        </t-space>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { studentApi } from '@/api/student'
import { useAuthStore } from '@/stores/auth'
import StudentForm from '@/components/StudentForm.vue'
import type { Student, StudentFormData } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const students = ref<Student[]>([])
const searchKeyword = ref('')
const showDialog = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const formData = ref<StudentFormData>({
  studentId: '',
  name: '',
  gender: '男',
  phone: '',
  address: '',
  major: '',
  birthday: '',
  courses: []
})
const formRef = ref<InstanceType<typeof StudentForm> | null>(null)

// 加载状态管理
const loading = ref({
  table: false,
  add: false,
  submit: false,
  delete: null as string | null
})


const columns = [
  {
    title: '学号',
    colKey: 'studentId',
    width: 120,
    align: 'center',
    ellipsis: true
  },
  {
    title: '姓名',
    colKey: 'name',
    width: 100,
    align: 'center'
  },
  {
    title: '性别',
    colKey: 'gender',
    width: 80,
    align: 'center'
  },
  {
    title: '电话',
    colKey: 'phone',
    width: 130,
    align: 'center'
  },
  {
    title: '专业',
    colKey: 'major',
    width: 180,
    ellipsis: true
  },
  {
    title: '课程',
    colKey: 'courses',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 180, // 减少宽度
    align: 'center'
  }
]

// 过滤学生列表
const filteredStudents = computed(() => {
  if (!searchKeyword.value.trim()) {
    return students.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  return students.value.filter(student =>
      student.studentId.toLowerCase().includes(keyword) ||
      student.name.toLowerCase().includes(keyword) ||
      student.major.toLowerCase().includes(keyword)
  )
})

// 获取课程弹窗内容
const getCoursesPopupContent = (student: Student): string => {
  if (!student.courses || student.courses.length === 0) {
    return '暂无课程'
  }

  return student.courses
      .map(course => `${course.courseName}: ${course.score}分`)
      .join('\n')
}


const loadStudents = async () => {
  loading.value.table = true
  try {
    const res = await studentApi.getAllStudents()

    if (res.code === 200) {
      if (res.data && Array.isArray(res.data)) {
        students.value = res.data
        MessagePlugin.success(`成功加载 ${res.data.length} 名学生`)
      } else {
        students.value = []
        MessagePlugin.warning('数据格式异常，已重置列表')
      }
    } else {
      MessagePlugin.error(res.message || '获取学生列表失败')
      students.value = []
    }
  } catch (error: any) {
    students.value = []
  } finally {
    loading.value.table = false
  }
}

// 查看学生详情
const handleView = (studentId: string) => {
  router.push(`/students/${studentId}`)
}

// 新增学生
const handleAdd = () => {
  formMode.value = 'add'
  formData.value = {
    studentId: '',
    name: '',
    gender: '男',
    phone: '',
    address: '',
    major: '',
    birthday: '',
    courses: []
  }
  showDialog.value = true
}

// 编辑学生
const handleEdit = (student: Student) => {
  formMode.value = 'edit'
  formData.value = {
    studentId: student.studentId,
    name: student.name,
    gender: student.gender,
    phone: student.phone,
    address: student.address,
    major: student.major,
    birthday: student.birthday,
    courses: student.courses || []
  }
  showDialog.value = true
}

// 删除学生
const handleDelete = (studentId: string, studentName: string) => {
  DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除学生 "${studentName}" 吗？`,
    confirmBtn: '确定删除',
    cancelBtn: '取消',
    theme: 'danger',
    onConfirm: async () => {
      loading.value.delete = studentId
      try {
        const res = await studentApi.deleteStudent(studentId)

        console.log('删除响应:', res)

        if (res.code === 200) {
          MessagePlugin.success('删除成功')
          await loadStudents() // 重新加载列表
        } else {
          MessagePlugin.error(res.message || '删除失败')
        }
      } catch (error: any) {
        console.error('删除失败:', error)
        MessagePlugin.error(error.message || '删除失败')
      } finally {
        loading.value.delete = null
      }
    }
  })
}

// 处理表单提交
const handleSubmit = async () => {
  if (!formRef.value) return

  loading.value.submit = true

  try {
    // 验证表单
    const valid = await formRef.value.validate()
    if (!valid) {
      MessagePlugin.warning('请填写完整信息')
      return
    }

    // 获取表单数据
    const data = formRef.value.getFormData ? await formRef.value.getFormData() : formData.value

    console.log('提交的数据:', data)

    let res
    if (formMode.value === 'add') {
      res = await studentApi.addStudent(data)
    } else {
      res = await studentApi.updateStudent(data.studentId, data)
    }

    console.log('提交响应:', res)

    if (res.code === 200) {
      MessagePlugin.success(formMode.value === 'add' ? '添加成功' : '更新成功')
      showDialog.value = false
      await loadStudents() // 重新加载列表
    } else {
      MessagePlugin.error(res.message || '操作失败')
    }
  } catch (error: any) {
    console.error('提交失败:', error)

    if (error.response) {
      // 处理HTTP错误
      const { status, data } = error.response
      if (status === 401) {
        MessagePlugin.error('未授权，请重新登录')
      } else if (status === 400) {
        MessagePlugin.error(data?.message || '请求参数错误')
      } else if (status === 429) {
        MessagePlugin.error('操作太频繁，请稍后再试')
      } else {
        MessagePlugin.error(data?.message || `请求失败: ${status}`)
      }
    } else if (error.request) {
      MessagePlugin.error('网络连接失败，请检查网络')
    } else {
      MessagePlugin.error(error.message || '操作失败')
    }
  } finally {
    loading.value.submit = false
  }
}

// 处理对话框关闭
const handleDialogClose = () => {
  showDialog.value = false
}

// 初始化加载
onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.student-list {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  min-height: calc(100vh - 70px);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--td-text-color-primary);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right .t-input {
  width: 240px;
}

.student-table-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: none;
  min-height: 400px;
}

.no-courses-text {
  color: var(--td-text-color-placeholder);
  font-size: 12px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-list {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    width: 100%;
  }

  .toolbar-right .t-input {
    width: 100%;
  }
}
</style>