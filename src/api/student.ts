import request from './request'
import type { ApiResult, Student, StudentFormData } from '@/types'

export const studentApi = {
    // 获取所有学生列表
    getAllStudents(): Promise<ApiResult<Student[]>> {
        return request({
            url: '/students',
            method: 'get'
        }).then(response => {
            // request拦截器已处理，直接返回response.data（即ApiResult）
            return response.data
        }).catch(error => {
            // 如果发生错误，返回统一的错误结构
            console.error('获取学生列表失败:', error)
            return {
                code: 500,
                message: error.message || '网络请求失败',
                data: []
            }
        })
    },

    // 根据ID查询学生
    getStudentById(studentId: string): Promise<ApiResult<Student>> {
        return request({
            url: `/students/${studentId}`,
            method: 'get'
        }).then(response => {
            return response.data
        }).catch(error => {
            console.error('获取学生详情失败:', error)
            return {
                code: 500,
                message: error.message || '网络请求失败',
                data: null as any
            }
        })
    },

    // 新增学生
    addStudent(data: StudentFormData): Promise<ApiResult<Student>> {
        return request({
            url: '/students',
            method: 'post',
            data
        }).then(response => {
            return response.data
        }).catch(error => {
            console.error('新增学生失败:', error)
            return {
                code: 500,
                message: error.message || '网络请求失败',
                data: null as any
            }
        })
    },

    // 修改学生信息
    updateStudent(studentId: string, data: StudentFormData): Promise<ApiResult<Student>> {
        return request({
            url: `/students/${studentId}`,
            method: 'put',
            data
        }).then(response => {
            return response.data
        }).catch(error => {
            console.error('更新学生失败:', error)
            return {
                code: 500,
                message: error.message || '网络请求失败',
                data: null as any
            }
        })
    },

    // 删除学生
    deleteStudent(studentId: string): Promise<ApiResult<string>> {
        return request({
            url: `/students/${studentId}`,
            method: 'delete'
        }).then(response => {
            return response.data
        }).catch(error => {
            console.error('删除学生失败:', error)
            return {
                code: 500,
                message: error.message || '网络请求失败',
                data: ''
            }
        })
    }
}