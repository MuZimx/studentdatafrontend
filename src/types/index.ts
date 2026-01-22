// 统一响应结构
export interface ApiResult<T = any> {
  code: number
  message: string
  data: T
}

// 用户相关类型
export interface User {
  id?: number
  username: string
  studentId: string
  role: 'MANAGER' | 'USER'
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  studentId: string
  role: 'MANAGER' | 'USER'
}

export interface LoginResponse {
  token: string
  studentId: string
  username: string
  role: 'MANAGER' | 'USER'
}

// 学生相关类型
export interface CourseScore {
  courseName: string
  score: number
}

export interface Student {
  studentId: string
  name: string
  gender: '男' | '女'
  phone: string
  address: string
  major: string
  birthday: string
  courses: CourseScore[]
}

export interface StudentFormData {
  studentId: string
  name: string
  gender: '男' | '女'
  phone: string
  address: string
  major: string
  birthday: string
  courses: CourseScore[]
}

// 分页类型
export interface Pagination {
  current: number
  pageSize: number
  total: number
}