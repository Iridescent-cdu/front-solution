<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from '@/constants/index'
// const themeArr = [
//   {
//     id: 0,
//     type: THEME_LIGHT,
//     icon: 'theme-light',
//     name: '极简白'
//   },
//   {
//     id: 1,
//     type: THEME_DARK,
//     icon: 'theme-dark',
//     name: '极夜黑'
//   },
//   {
//     id: 2,
//     type: THEME_SYSTEM,
//     icon: 'theme-system',
//     name: '跟随系统'
//   }
// ]

import { themeArr } from '@/constants/index.js'

const store = useStore()

// 1.监听主题的切换行为
// 2.根据行为保存当前需要展示的主题到vuex中
// 3.根据vuex中保存的当前主题，展示header-theme下的显示图标
// 4.根据vuex中保存的当前主题，修改html的class

/**
 * menu 切换事件
 */
const onItemClick = (themeItem) => {
  store.commit('theme/changeThemeType', themeItem.type)
}

/**
 * 展示图标
 */
const svgIconName = computed(() => {
  const findTheme = themeArr.find((item) => {
    return item.type === store.getters.themeType
  })
  return findTheme?.icon || THEME_LIGHT
})
</script>

<template>
  <m-popover placement="bottom-left">
    <!-- 具名插槽：触发弹层的视图 -->
    <template #reference>
      <m-svg-icon
        :name="svgIconName"
        class="guide-theme w-4 h-4 p-1 cursor-pointer rounded-sm duration-200 outline-none hover:bg-zinc-100/60 dark:hover:bg-zinc-900"
        fill-class="fill-zinc-900 dark:fill-zinc-300"></m-svg-icon>
    </template>
    <!-- 匿名插槽：弹出层视图中展示的内容 -->
    <div class="w-[140px] overflow-hidden">
      <div
        v-for="item in themeArr"
        :key="item.id"
        class="flex items-center p-1 cursor-pointer rounded hover:bg-zinc-100/60 dark:hover:bg-zinc-800"
        @click="onItemClick(item)">
        <m-svg-icon :name="item.icon" class="w-1.5 h-1.5 mr-1" fill-class="fill-zinc-900"></m-svg-icon>
        <span class="text-zinc-900 text-sm dark:text-zinc-300">{{ item.name }}</span>
      </div>
    </div>
  </m-popover>
</template>

<style scoped lang="scss"></style>
