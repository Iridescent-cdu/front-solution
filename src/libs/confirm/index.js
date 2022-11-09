import { h, render } from 'vue'
import confirmComponent from './index.vue'

/**
 * 展示confirm，用户只传递一个参数，那么这个参数为content
 * @param {*} title 标题（如果用户没有传递内容，那么标题被作为内容）
 * @param {*} content 内容（如果没有title，那么content会被作为第一个参数传入）
 * @param {*} cancelText 取消按钮文本
 * @param {*} confirmText 确定按钮文本
 */
export const confirm = (title, content, cancelText, confirmText) => {
  return new Promise((resolve, reject) => {
    if (title && !content) {
      content = title
      title = ''
    }
    /**
     * 关闭的回调
     */
    const close = () => {
      // 3.把渲染的vnode卸载掉
      render(null, document.body)
    }
    /**
     * 取消按钮的回调
     */
    const cancelHandler = () => {
      // reject执行.catch中的回调
      reject(new Error('取消按钮点击'))
    }
    /**
     * 确定按钮的回调
     */
    const confirmHandler = () => {
      // resolve执行.then中的回调
      resolve()
    }
    // 1.生成vnode（type,prop,slot)
    const vnode = h(confirmComponent, {
      title,
      content,
      cancelText,
      confirmText,
      // 传入到confirm组件执行
      close,
      cancelHandler,
      confirmHandler,
    })
    // 2.render渲染
    render(vnode, document.body)
  })
}
