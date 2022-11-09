<script setup>
import { onMounted, ref } from 'vue'
// 因为将来confirm组件会以方法调用的形式展示，需要主动导入组件
import mButton from '../button/index.vue'
const props = defineProps({
  // 标题
  title: {
    type: String,
  },
  // 描述
  content: {
    type: String,
    required: true,
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消',
  },
  // 确定按钮文本
  confirmText: {
    type: String,
    default: '确定',
  },
  // 取消按钮事件
  cancelHandler: {
    type: Function,
  },
  // 确定按钮事件
  confirmHandler: {
    type: Function,
  },
  // 关闭confirm的回调
  close: {
    type: Function,
  },
})

// 组件展示隐藏
const isVisable = ref(false)
const show = () => {
  isVisable.value = true
}
/**
 * 处理动画（render函数的渲染，会直接进行，动画将失效）
 * 可通过在transition组件上添加appear属性，当组件初次展示时加载动画
 */
onMounted(() => {
  show()
})
/**
 * 关闭动画展示处理
 */
const duration = '0.5s'
/**
 * 点击关闭事件处理函数
 */
const close = () => {
  isVisable.value = false
  // 先通过v-if隐藏执行动画，再延迟一段时间执行render(null, document.body)进行卸载
  setTimeout(() => {
    if (props.close) {
      props.close()
    }
  }, parseInt(duration.replace('0.', '').replace('s', '') * 100))
}
/**
 * 取消按钮点击事件
 */
const onCancelClick = () => {
  if (props.cancelHandler) {
    props.cancelHandler()
  }
  close()
}

/**
 * 确定按钮点击事件
 */
const onConfirmClick = () => {
  if (props.confirmHandler) {
    props.confirmHandler()
  }
  close()
}
</script>

<template>
  <div>
    <!-- 蒙版 -->
    <transition name="fade" appear>
      <div v-if="isVisable" class="w-screen h-screen bg-zinc-900/80 z-20 fixed top-0 left-0" @click="close"></div>
    </transition>
    <!-- 内容 -->
    <transition name="up" appear>
      <div
        v-if="isVisable"
        class="w-[80%] fixed top-1/3 left-1/2 translate-x-[-50%] z-50 px-2 py-1.5 rounded-sm border dark:border-zinc-600 cursor-pointer bg-white dark:bg-zinc-800 xl:w-[35%]">
        <!-- 标题 -->
        <div class="text-lg font-bold text-zinc-900 dark:text-zinc-200 mb-2">
          {{ title }}
        </div>
        <!-- 文本 -->
        <div class="text-base text-zinc-900 dark:text-zinc-200 mb-2">
          {{ content }}
        </div>
        <!-- 按钮 -->
        <div class="flex justify-end">
          <m-button type="info" class="mr-2" @click="onCancelClick">
            {{ cancelText }}
          </m-button>
          <m-button type="primary" @click="onConfirmClick">
            {{ confirmText }}
          </m-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind(duration);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

//up动画
.up-enter-active,
.up-leave-active {
  transition: all v-bind(duration);
}
//准备进入和离开之后的状态
.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}
</style>
