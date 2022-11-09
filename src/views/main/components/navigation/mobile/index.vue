<script setup>
import { onBeforeUpdate, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { useStore } from 'vuex'
import menuVue from '@/views/main/components/menu/index.vue'

const store = useStore()
// 滑块
const sliderStyle = ref({
  transform: 'translateX(0px)',
  width: '1.37rem',
})

// 选中的item下标
// const currentCategoryIndex = ref(0)

// 通过函数ref的形式获取所有的item元素
let itemRefs = []
const setItemRef = (el) => {
  if (el) {
    itemRefs.push(el)
  }
}

// 数组改变之后，DOM变化之前
onBeforeUpdate(() => {
  itemRefs = []
})

// 获取ul元素
const ulTarget = ref(null)

// 通过vueuse中的useScroll获取响应式的scroll滚动距离
const { x: ulScrollLeft } = useScroll(ulTarget)

// wacth监听getters的时候，我们需要传递一个函数
watch(
  () => store.getters.currentCategoryIndex,
  (val) => {
    // 获取元素的信息
    const { left, width } = itemRefs[val].getBoundingClientRect()
    sliderStyle.value = {
      // 滑块的位置=ul横向滚动的位置+当前元素的偏移-ul的padding
      // transform: `translateX(${ulScrollLeft.value + left - 10}px)`,
      // 使用原生offsetLeft完美解决点击按钮滚动条滚动的问题
      transform: `translateX(${itemRefs[val].offsetLeft - 10}px)`,
      width: `${width}px`,
    }
  },
)

// item点击事件
const onItemClick = (item) => {
  store.commit('app/changeCurrentCategory', item)
}
// 控制popup展示
const isVisable = ref(false)

// 点击按钮滚动条滚动
const onItemClickScroll = (index) => {
  currentCategoryIndex.value = index
  isVisable.value = false
  ulTarget.value.scrollLeft = itemRefs[index].offsetLeft
}

const onShowPopup = () => {
  isVisable.value = true
}
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 sticky top-0 left-0 z-10 duration-500">
    <ul
      ref="ulTarget"
      class="relative flex overflow-x-auto p-1 text-xs text-zinc-600 overflow-hidden">
      <!-- 滑块 -->
      <li
        ref="sliderTarget"
        :style="sliderStyle"
        class="absolute h-[22px] bg-zinc-900 dark:bg-zinc-800 rounded-lg duration-200"></li>
      <!-- 汉堡按钮    -->
      <li
        class="fixed top-0 right-[-1px] h-4 px-1 flex items-center bg-white dark:bg-zinc-900 z-20 shadow-l-white dark:shadow-l-zinc"
        @click="onShowPopup">
        <m-svg-icon
          class="w-1.5 h-1.5"
          name="hamburger" />
      </li>
      <li
        v-for="(item, index) in $store.getters.categorys"
        :key="item.id"
        :ref="setItemRef"
        class="shrink-0 px-1.5 py-0.5 z-10 duration-200 last:mr-4"
        :class="$store.getters.currentCategoryIndex === index && 'text-zinc-100'"
        @click="onItemClick(item)">
        {{ item.name }}
      </li>
    </ul>
    <m-popup v-model:modelValue="isVisable">
      <template #default>
        <menu-vue @onItemClick="onItemClickScroll" />
      </template>
    </m-popup>
  </div>
</template>

<style scoped lang="scss"></style>
