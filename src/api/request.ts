import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'
import type { ApiResult } from '@/types'

const request = axios.create({
    baseURL: '/api',
    timeout: 10000
})

request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore()
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    (response: AxiosResponse<ApiResult>) => {
        const { code, message } = response.data

        if (code === 200) {
            // 直接返回 response，让调用方处理 data
            return response
        } else {
            MessagePlugin.error(message || '请求失败')
            return Promise.reject(new Error(message))
        }
    },
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response
            const data = error.response.data as any

            if (status === 401) {
                MessagePlugin.error('未登录或登录已过期')
                const authStore = useAuthStore()
                authStore.logout()
                window.location.href = '/login'
            } else if (status === 403) {
                MessagePlugin.error('无权限访问')
            } else if (status === 429) {
                MessagePlugin.error('操作太频繁，请稍后再试')
            } else if (status === 500) {
                MessagePlugin.error(data?.message || '服务器错误')
            } else {
                MessagePlugin.error(data?.message || `请求失败: ${status}`)
            }
        } else if (error.request) {
            MessagePlugin.error('网络连接失败，请检查网络')
        } else {
            MessagePlugin.error('请求发送失败')
        }

        return Promise.reject(error)
    }
)

export default request