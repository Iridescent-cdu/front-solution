import { THEME_LIGHT } from '@/constants'

export default {
  namespaced: true,
  state: () => {
    return {
      // 当前主题模式
      themeType: THEME_LIGHT,
    }
  },
  mutations: {
    changeThemeType(state, newTheme) {
      state.themeType = newTheme
    },
  },
  actions: {},
}
