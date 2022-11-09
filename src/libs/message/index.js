import { h, render } from 'vue'
import messageComponent from './index.vue'
/**
 *
 * @param {*} type 类型：success、warn、error
 * @param {*} content 描述文本
 * @param {*} duration 展示时间（毫秒），默认3000
 */
export const message = (type, content, duration = 3000) => {
  /**
   * 动画结束时的回调
   */
  const onDestroy = () => {
    //3.删除render
    render(null, document.body)
  }
  //1.拿到vnode
  const vnode = h(messageComponent, {
    type,
    content,
    duration,
    destroy: onDestroy
  })
  //2.render node
  render(vnode, document.body)
}
