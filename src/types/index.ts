export interface User {
  studentId: string
  username: string
  role: 'MANAGER' | 'USER'
}

export interface RegisterData {
  studentId: string
  username: string
  password: string
  role: 'MANAGER' | 'USER'
}

export interface LoginData {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  studentId: string
  username: string
  role: 'MANAGER' | 'USER'
}

export interface ApiResult<T = any> {
  code: number
  message: string
  data: T
}
