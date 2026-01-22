<template>
  <div class="student-list">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <h2>学生管理</h2>
      </div>
      <div class="toolbar-right">
        <t-space>
          <t-input v-model="searchKeyword" placeholder="搜索..." clearable />
          <t-button v-if="authStore.userInfo?.role === 'MANAGER'" theme="primary" @click="handleAdd">
            新增学生
          </t-button>
        </t-space>
      </div>
    </div>

    <!-- 学生表格 -->
    <t-card>
      <t-table :data="students" :columns="columns" row-key="studentId">
        <template #operation="{ row }">
          <t-space>
            <t-button size="small" @click="handleView(row.studentId)">查看</t-button>
            <t-button v-if="authStore.userInfo?.role === 'MANAGER'" size="small" @click="handleEdit(row)">编辑</t-button>
            <t-button v-if="authStore.userInfo?.role === 'MANAGER'" size="small" theme="danger" @click="handleDelete(row.studentId, row.name)">删除</t-button>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 表单对话框 -->
    <t-dialog v-model:visible="showDialog" :header="formMode === 'add' ? '新增学生' : '编辑学生'">
      <StudentForm ref="formRef" :form-data="formData" :mode="formMode" />
      <template #footer>
        <t-space>
          <t-button @click="showDialog = false">取消</t-button>
          <t-button theme="primary" @click="handleSubmit">确定</t-button>
        </t-space>
      </template>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
import { studentApi } from '@/api/student'
import { useAuthStore } from '@/stores/auth'
import StudentForm from '@/components/StudentForm.vue'  // 修复导入路径
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

const columns = [
  { title: '学号', colKey: 'studentId', width: 120 },
  { title: '姓名', colKey: 'name', width: 100 },
  { title: '性别', colKey: 'gender', width: 80 },
  { title: '电话', colKey: 'phone', width: 120 },
  { title: '专业', colKey: 'major', width: 150 },
  { title: '操作', colKey: 'operation', width: 200 }
]

const loadStudents = async () => {
  try {
    const res = await studentApi.getAllStudents()
    if (res.code === 200) {
      students.value = res.data
    }
  } catch (error) {
    console.error('加载学生列表失败:', error)
  }
}

const handleView = (studentId: string) => {
  router.push(`/students/${studentId}`)
}

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
    courses: student.courses
  }
  showDialog.value = true
}

const handleDelete = (studentId: string, studentName: string) => {
  DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除学生 "${studentName}" 吗？`,
    confirmBtn: '确定删除',
    cancelBtn: '取消',
    theme: 'danger',
    onConfirm: async () => {
      try {
        const res = await studentApi.deleteStudent(studentId)
        if (res.code === 200) {
          MessagePlugin.success('删除成功')
          loadStudents()
        }
      } catch (error) {
        MessagePlugin.error('删除失败')
      }
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    if (formMode.value === 'add') {
      const res = await studentApi.addStudent(formData.value)
      if (res.code === 200) {
        MessagePlugin.success('添加成功')
        showDialog.value = false
        loadStudents()
      }
    } else {
      const res = await studentApi.updateStudent(formData.value.studentId, formData.value)
      if (res.code === 200) {
        MessagePlugin.success('更新成功')
        showDialog.value = false
        loadStudents()
      }
    }
  } catch (error) {
    MessagePlugin.error('操作失败')
  }
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.student-list {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar-left h2 {
  margin: 0;
  font-size: 24px;
}
</style>