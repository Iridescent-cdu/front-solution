<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
// 无
const NONE = 'none'
// 进入
const ROUTER_TYPE_PUSH = 'push'
// 退出
const ROUTER_TYPE_BACK = 'back'
const ROUTER_TYPE_ENUM = [NONE, ROUTER_TYPE_PUSH, ROUTER_TYPE_BACK]
</script>

<script setup>
const props = defineProps({
  // 路由的跳转类型，进入组件，退出组件
  routerType: {
    type: String,
    default: NONE,
    validator(val) {
      const result = ROUTER_TYPE_ENUM.includes(val)

      if (!result) {
        throw new Error(`路由的跳转类型必须在以下${ROUTER_TYPE_ENUM.join('、')}范围内`)
      }
      return result
    },
  },
  // 首页的组件名称作为虚拟任务栈的根元素
  mainComponentName: {
    type: String,
    required: true,
  },
})
const router = useRouter()
// 跳转动画
const transitionName = ref('')
// 虚拟任务栈的数组，用它来表示栈操作
const virtualTaskStack = ref([props.mainComponentName])
/**
 * 清空栈
 */
const clearTask = () => {
  virtualTaskStack.value = [props.mainComponentName]
}
/**
 *  router的前置守卫
 *  在路由跳转之间，指定路由的过渡动画名称
 */
router.beforeEach((to, from) => {
  // 定义动画名称
  transitionName.value = props.routerType
  // 根据动画名称执行入栈或者出栈操作：push、back
  if (props.routerType === ROUTER_TYPE_PUSH) {
    // 入栈
    virtualTaskStack.value.push(to.name)
  } else if (props.routerType === ROUTER_TYPE_BACK) {
    // 出栈
    virtualTaskStack.value.pop()
  }
  // 当进入首页之后
  if (to.name === props.mainComponentName) {
    clearTask()
  }
})

/**
 * 处理动画状态
 */
const isAnimation = ref(false)
const beforeEnter = () => {
  isAnimation.value = true
}
const afterLeave = () => {
  isAnimation.value = false
}
</script>

<template>
  <!-- 使用router-view时，对应的视图组件被插进视图组件中，通过作用域插槽获取内部组件的信息并解构出Component，然后在component这个特殊元素中展示 -->
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      @before-enter="beforeEnter"
      @after-leave="afterLeave">
      <keep-alive :include="virtualTaskStack">
        <component
          :is="Component"
          :key="$route.fullPath"
          :class="{ 'fixed top-0 left-0 w-screen z-50': isAnimation }"></component>
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
//push页面时：新页面的进入动画
.push-enter-active {
  animation-name: push-in;
  animation-duration: 0.4s;
}
//push页面时：老页面的退出动画
.push-leave-active {
  animation-name: push-out;
  animation-duration: 0.4s;
}
@keyframes push-in {
  0% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
@keyframes push-out {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-50%, 0);
  }
}
//后退页面时：即将展示的页面动画
.back-enter-active {
  animation-name: back-in;
  animation-duration: 0.4s;
}
//后退页面时：后退的页面执行的动画
.back-leave-active {
  animation-name: back-out;
  animation-duration: 0.4s;
}
@keyframes back-in {
  0% {
    width: 100%;
    transform: translate(-100%, 0);
  }
  100% {
    width: 100%;
    transform: translate(0, 0);
  }
}
@keyframes back-out {
  0% {
    width: 100%;
    transform: translate(0, 0);
  }
  100% {
    width: 100%;
    transform: translate(50%, 0);
  }
}
</style>
