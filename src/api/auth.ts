import request from './request'
import type { RegisterData, LoginData, ApiResult, User, LoginResponse } from '@/types'

export const authApi = {
  register(data: RegisterData): Promise<ApiResult<User>> {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    })
  },

  login(data: LoginData): Promise<ApiResult<LoginResponse>> {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  }
}
