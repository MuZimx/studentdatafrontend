import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Student } from '@/types'

export const useStudentStore = defineStore('student', () => {
    const students = ref<Student[]>([])
    const currentStudent = ref<Student | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchStudents = async () => {
        loading.value = true
        error.value = null
        try {
        } catch (err: any) {
            error.value = err.message || '获取学生列表失败'
        } finally {
            loading.value = false
        }
    }

    return {
        students,
        currentStudent,
        loading,
        error,
        fetchStudents
    }
})