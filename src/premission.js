import { message } from './libs'
import router from '@/router'
import store from '@/store'
/**
 * 使用router的全局前置守卫beforeEach处理需要登录页面的访问权限
 * return false表示取消当前的跳转
 * return 路由地址则跳转到对应的地址
 * return undefined或true表示跳转有效
 */
router.beforeEach((to) => {
  // 无需登录的页面访问
  if (!to.meta.user) {
    return true
  }
  // 已登录
  if (store.getters.token) {
    return true
  }
  // 需要登录才能访问的页面，并且用户还没登录
  message('warn', '登录失效，请重新登录')
  return '/'
})
