import axios from 'axios'

export const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000
})
/**
 * 请求拦截器
 */
// service.interceptors.request.use()
/**
 * 响应拦截器
 * 服务端返回数据之后，前端.then之前被调用
 */
service.interceptors.response.use((response) => {
  const { success, message, data } = response.data
  if (success) {
    return data
  }
  return Promise.reject(new Error(message))
})
export default service
