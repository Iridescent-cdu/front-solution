<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { confirm } from '@/libs'

const router = useRouter()
const store = useStore()
// 构建数据源
const menuArr = [
  {
    id: 0,
    title: '个人资料',
    icon: 'profile',
    path: '/profile',
  },
  {
    id: 1,
    title: '升级 VIP',
    icon: 'vip-profile',
    path: '/member',
  },
  {
    id: 2,
    title: '退出登录',
    icon: 'logout',
    path: '',
  },
]

/**
 * 登录按钮点击事件
 */
const onToLogin = () => {
  // 移动端下跳转的类型
  store.commit('app/changeRouterType', 'push')
  router.push('/login')
}

/**
 * menu点击事件
 */
const onItemClick = (item) => {
  if (item.id === 2) {
    confirm('您确定要退出登录吗？').then(() => {
      store.dispatch('user/logout')
    })

    return
  }
  router.push(item.path)
}
</script>

<template>
  <m-popover
    class="flex items-center"
    placement="bottom-left">
    <template #reference>
      <div
        v-if="$store.getters.token"
        class="guide-my relative flex items-center p-0.5 rounded-sm cursor-pointer duration-200 outline-none hover:bg-zinc-100 dark:hover:bg-zinc-900">
        <!-- 头像 -->
        <img
          v-lazy
          class="w-3 h-3 rounded-sm"
          :src="$store.getters.token ? $store.getters.userInfo.avatar : '@/assets/images/1.jpg'" />

        <!-- 下箭头 -->
        <m-svg-icon
          name="down-arrow"
          fill-class="fill-zinc-900 dark:fill-zinc-900"
          class="h-1.5 w-1.5 ml-0.5"></m-svg-icon>
        <!-- vip -->
        <m-svg-icon
          v-if="$store.getters.userInfo.vipLevel"
          name="vip"
          fill-class="fill-zinc-900"
          class="h-1.5 w-1.5 absolute right-[16px] bottom-0"></m-svg-icon>
      </div>
      <div v-else>
        <m-button
          class="guide-my"
          icon="profile"
          icon-color="#fff"
          @click="onToLogin"></m-button>
      </div>
    </template>
    <!-- 气泡 -->
    <div
      v-if="$store.getters.token"
      class="w-[140px] overflow-hidden">
      <div
        v-for="item in menuArr"
        :key="item.id"
        class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
        @click="onItemClick(item)">
        <m-svg-icon
          :name="item.icon"
          class="w-1.5 h-1.5 mr-1"
          fill-class="fill-zinc-900"></m-svg-icon>
        <span class="text-zinc-800 text-sm dark:text-zinc-300">{{ item.title }}</span>
      </div>
    </div>
  </m-popover>
</template>

<style scoped lang="scss"></style>
