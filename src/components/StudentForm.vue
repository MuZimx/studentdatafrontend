<template>
  <t-form ref="formRef" :data="formData" :rules="rules" label-align="left" :disabled="props.mode === 'view'">
    <t-form-item label="学号" name="studentId" required>
      <t-input v-model="formData.studentId" placeholder="请输入学号" />
    </t-form-item>

    <t-form-item label="姓名" name="name" required>
      <t-input v-model="formData.name" placeholder="请输入姓名" />
    </t-form-item>

    <t-form-item label="性别" name="gender" required>
      <t-radio-group v-model="formData.gender">
        <t-radio value="男">男</t-radio>
        <t-radio value="女">女</t-radio>
      </t-radio-group>
    </t-form-item>

    <t-form-item label="电话" name="phone" required>
      <t-input v-model="formData.phone" placeholder="请输入联系电话" />
    </t-form-item>

    <t-form-item label="地址" name="address" required>
      <t-input v-model="formData.address" placeholder="请输入联系地址" />
    </t-form-item>

    <t-form-item label="专业" name="major" required>
      <t-input v-model="formData.major" placeholder="请输入专业" />
    </t-form-item>

    <t-form-item label="出生日期" name="birthday" required>
      <t-date-picker v-model="formData.birthday" format="YYYY-MM-DD" />
    </t-form-item>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const rules: Record<string, FormRule[]> = {
  studentId: [{ required: true, message: '请输入学号' }],
  name: [{ required: true, message: '请输入姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  phone: [{ required: true, message: '请输入电话' }],
  address: [{ required: true, message: '请输入地址' }],
  major: [{ required: true, message: '请输入专业' }],
  birthday: [{ required: true, message: '请选择出生日期' }]
}

const validate = async (): Promise<boolean> => {
  try {
    await formRef.value?.validate()
    return true
  } catch {
    return false
  }
}

defineExpose({ validate })
</script>

<style scoped>
:deep(.t-form__item) {
  margin-bottom: 16px;
}
</style>