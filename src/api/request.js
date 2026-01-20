import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    
    if (code === 200) {
      return response.data
    } else {
      MessagePlugin.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        MessagePlugin.error('未登录或登录已过期')
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/login'
      } else if (status === 403) {
        MessagePlugin.error('无权限访问')
      } else if (status === 500) {
        MessagePlugin.error(data.message || '服务器错误')
      } else {
        MessagePlugin.error(data.message || '请求失败')
      }
    } else {
      MessagePlugin.error('网络连接失败')
    }
    
    return Promise.reject(error)
  }
)

export default request
