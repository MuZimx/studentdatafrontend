import request from './request'
import type { RegisterData, LoginData, ApiResult, User, LoginResponse } from '@/types'

export const authApi = {
  async register(data: RegisterData): Promise<ApiResult<User>> {
    const response = await request({
      url: '/auth/register',
      method: 'post',
      data
    })
    return response.data
  },

  async login(data: LoginData): Promise<ApiResult<LoginResponse>> {
    const response = await request({
      url: '/auth/login',
      method: 'post',
      data
    })
    return response.data
  },

  async logout(): Promise<ApiResult<void>> {
    const response = await request({
      url: '/auth/logout',
      method: 'post'
    })
    return response.data
  }
}
