import request from './request'
import type { ApiResult, Student, StudentFormData } from '@/types'

export const studentApi = {
    // 获取所有学生列表
    getAllStudents(): Promise<ApiResult<Student[]>> {
        return request({
            url: '/students',
            method: 'get'
        })
    },

    // 根据ID查询学生
    getStudentById(studentId: string): Promise<ApiResult<Student>> {
        return request({
            url: `/students/${studentId}`,
            method: 'get'
        })
    },

    // 新增学生
    addStudent(data: StudentFormData): Promise<ApiResult<Student>> {
        return request({
            url: '/students',
            method: 'post',
            data
        })
    },

    // 修改学生信息
    updateStudent(studentId: string, data: StudentFormData): Promise<ApiResult<Student>> {
        return request({
            url: `/students/${studentId}`,
            method: 'put',
            data
        })
    },

    // 删除学生
    deleteStudent(studentId: string): Promise<ApiResult<string>> {
        return request({
            url: `/students/${studentId}`,
            method: 'delete'
        })
    }
}