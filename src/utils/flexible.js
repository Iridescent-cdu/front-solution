import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { PC_DEVICE_WIDTH } from '@/constants/index.js'
/**
 * 判断当前是否为移动端设备，判断依据屏幕宽度是否小于一个指定宽度(1280)
 * 通过计算属性直接算出来结果方便呈现出结果，不使用计算属性则需要手动加()进行调用
 * 这种方案不是响应式的
 */
// export const isMobileTerminal = computed(() => {
//   return document.documentElement.clientWidth < PC_DEVICE_WIDTH
// })

/**
 * 使用VueUse中的useWindowSize解决屏幕宽度响应式问题
 */
const { width } = useWindowSize()
export const isMobileTerminal = computed(() => {
  return width.value < PC_DEVICE_WIDTH
})

/**
 * 实际开发通过正则判断用户代理可以更准确的判断移动端设备
 */
// export const isMobileTerminal = computed(() => {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
// })

/**
 * 动态指定rem基准值，最大为40px
 * 根据用户的屏幕宽度，进行一些计算，把计算出来的值赋值给根标签作为fontsize大小
 */
export const useREM = () => {
  // 定义最大的fontSize
  const MAX_FONT_SIZE = 40
  // 监听html文档被解析完成的事件
  document.addEventListener('DOMContentLoaded', () => {
    // 拿到html标签
    const html = document.querySelector('html')
    // 计算fontSize
    let fontSize = window.innerWidth / 10
    fontSize = (fontSize > MAX_FONT_SIZE && MAX_FONT_SIZE) || fontSize
    // 赋值给html
    html.style.fontSize = `${fontSize}px`
  })
}
