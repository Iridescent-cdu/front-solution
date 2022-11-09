import md5 from 'md5'
import { getUserDetail, loginUser, registerUser } from '@/api/mock/sys'
import { message } from '@/libs'
import { LOGIN_TYPE_OAUTH_NO_REGISTER_CODE } from '@/constants'
/**
 * user模块
 */
export default {
  namespaced: true,
  state: () => {
    return {
      // 登录的token
      token: '',
      // 用户信息
      userInfo: {},
    }
  },
  mutations: {
    /**
     * 保存token
     */
    setToken(state, newToken) {
      state.token = newToken
    },
    /**
     * 保存用户信息
     */
    setUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo
    },
  },
  actions: {
    /**
     * 注册
     */
    async register(context, payload) {
      // 加密密码
      const { password } = payload
      return await registerUser({
        ...payload,
        password: password ? md5(password) : '',
      })
    },
    /**
     * 登录
     */
    async login(context, payload) {
      // 加密密码
      const { password } = payload
      const data = await loginUser({
        ...payload,
        password: password ? md5(password) : '',
      })
      // 第三方登录判断是否需要注册
      if (data.code === LOGIN_TYPE_OAUTH_NO_REGISTER_CODE) {
        return data.code
      }
      // 保存token
      context.commit('setToken', data.token)
      // 获取用户信息
      context.dispatch('profile')
    },
    /**
     * 获取用户信息
     */
    async profile(context) {
      const data = await getUserDetail()
      context.commit('setUserInfo', data)
      // 提示
      message(
        'success',
        `欢迎您${data.vipLevel ? `尊贵的VIP${data.vipLevel}用户${data.nickname}` : data.nickname}`,
        6000,
      )
    },
    /**
     * 退出登录
     */
    logout(context) {
      // 清空token
      context.commit('setToken', '')
      // 清空用户信息
      context.commit('setUserInfo', {})
      // 刷新页面以使用户跳转到无需权限的页面
      location.reload()
    },
  },
}
