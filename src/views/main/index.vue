<script>
import { onActivated, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useScroll } from '@vueuse/core'

import navigationVue from './components/navigation/index.vue'
import listVue from './components/list/index.vue'
import { isMobileTerminal } from '@/utils/flexible'
export default {
  name: 'Home',
}
</script>

<script setup>
const store = useStore()
const router = useRouter()
/**
 * vip点击事件
 */
const onVipClick = () => {
  store.commit('app/changeRouterType', 'push')
  router.push('/member')
}
/**
 *my点击事件
 */
const onMyClick = () => {
  if (store.getters.token) {
    // 移动端下跳转的类型
    store.commit('app/changeRouterType', 'push')
    router.push('/profile')
  } else {
    // 移动端下跳转的类型
    store.commit('app/changeRouterType', 'push')
    router.push('/login')
  }
}

/**
 * 记录滚动
 */
const containerTarget = ref(null)
const { y: containerTargetScrollY } = useScroll(containerTarget)
// 被缓存的组件再次可见时会回到onActivated方法
onActivated(() => {
  if (!containerTarget.value) {
    return null
  }
  containerTarget.value.scrollTop = containerTargetScrollY.value
})
</script>

<template>
  <div
    ref="containerTarget"
    class="h-full overflow-auto bg-white dark:bg-zinc-800 duration-500 scrollbar-thin scrollbar-thumb-transparent xl:scrollbar-thumb-zinc-200 xl:dark:scrollbar-thumb-zinc-900 scrollbar-track-transparent">
    <!-- 导航栏组件 -->
    <navigation-vue />
    <div class="max-w-screen-xl mx-auto relative m-1 xl:mt-4">
      <list-vue></list-vue>
    </div>
    <!-- 移动端下的tabbar -->
    <m-trigger-menu
      v-if="isMobileTerminal"
      class="fixed bottom-6 m-auto left-0 right-0 w-[220px]">
      <m-trigger-menu-item
        icon="home"
        icon-class="fill-zinc-900 dark:fill-zinc-200"
        >首页</m-trigger-menu-item
      >
      <m-trigger-menu-item
        v-if="$store.getters.token"
        icon="vip"
        icon-class="text-zinc-400 dark:text-zinc-500"
        text-class=" text-zinc-400 dark:text-zinc-500"
        @click="onVipClick"
        >VIP</m-trigger-menu-item
      >
      <m-trigger-menu-item
        icon="profile"
        icon-class="text-zinc-400 dark:text-zinc-500"
        text-class=" text-zinc-400 dark:text-zinc-500"
        @click="onMyClick"
        >{{ $store.getters.token ? '我的' : '去登录' }}</m-trigger-menu-item
      >
    </m-trigger-menu>
  </div>
</template>

<style scoped lang="scss"></style>
