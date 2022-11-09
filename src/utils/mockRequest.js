import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

export const service = axios.create({
  baseURL: '/mock',
  timeout: 5000,
})

service.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  nprogress.start()
  // return出的对象，就是请求的配置对象
  return config
})
service.interceptors.response.use(
  (response) => {
    nprogress.done()
    const { success, data, message } = response.data
    if (success) {
      return data
    }
    return Promise.reject(new Error(message))
  },
  (error) => {
    // 处理token超时
    if (error.response && error.response.data && error.response.data.code === 401) {
      // 退出
      store.dispatch('user/logout')
    }
    return Promise.reject(error)
  },
)
export default service
