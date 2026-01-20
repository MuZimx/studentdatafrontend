import request from './request'

export const authApi = {
  register(data) {
    return request({
      url: '/auth/register',
      method: 'post',
      data
    })
  },

  login(data) {
    return request({
      url: '/auth/login',
      method: 'post',
      data
    })
  }
}
