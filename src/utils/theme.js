import { watch } from 'vue'
import store from '../store'
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '@/constants/index.js'

/**
 * 初始化监听系统主题变更，单例模式
 */
let matchMedia
const watchSystemThemeChange = () => {
  // 仅需一次初始化
  if (matchMedia) {
    return
  }

  matchMedia = window.matchMedia('(prefers-color-scheme:dark)')

  // 监听主题变化重新变更主题
  matchMedia.onchange = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    changeTheme(THEME_SYSTEM)
  }
}

/**
 * 变更主题
 */
const changeTheme = (theme) => {
  // html的class
  let themeClassName = ''

  // 判断当前选择的主题模式
  switch (theme) {
    case THEME_LIGHT:
      themeClassName = 'light'
      break
    case THEME_DARK:
      themeClassName = 'dark'
      break
    case THEME_SYSTEM:
      // 调用方法，监听系统主题变化
      watchSystemThemeChange()
      themeClassName = matchMedia.matches ? 'dark' : 'light'
      break
  }

  // 修改html的class
  document.querySelector('html').className = themeClassName
}

/**
 * 初始化主题
 */
export default () => {
  // 1.当主题发生改变时，或者当进入系统时，可以进行html class的配置
  watch(() => store.getters.themeType, changeTheme, {
    // 初始执行一次
    immediate: true,
  })
}
