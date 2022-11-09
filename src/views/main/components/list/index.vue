<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import gsap from 'gsap'
import { useEventListener } from '@vueuse/core'
import itemVue from './item.vue'
import pinsVue from '@/views/pins/components/pins.vue'
import { isMobileTerminal } from '@/utils/flexible'
import { getPexlesList } from '@/api/mock/pexels'

const store = useStore()
/**
 * 构建数据请求
 */
let query = {
  page: 1,
  size: 20
}
// 数据是否在加载中
const loading = ref(false)
// 数据是否全部加载完成
const isFinished = ref(false)
// 数据源
const pexelsList = ref([])
/**
 * 加载数据的方法
 */
const getPexlesListData = async () => {
  // 数据全部加载完成 return
  if (isFinished.value) {
    return
  }
  // 完成了第一次请求之后，后续的请求让page自增
  if (pexelsList.value.length) {
    query.page += 1
  }
  const res = await getPexlesList(query)
  if (query.page === 1) {
    pexelsList.value = res.list
  } else {
    pexelsList.value.push(...res.list)
  }
  pexelsList.value.push(...res.list)
  // 判断数据是否全部加载完成
  if (pexelsList.value.length === res.total) {
    isFinished.value = true
  }
  // 修改loading标记
  loading.value = false
}

/**
 * 通过此方法修改query，重新发起请求
 */
const resetQuery = (newQuery) => {
  query = { ...query, ...newQuery }
  // 重置状态
  isFinished.value = false
  // 当数据源变为空时，页面重新渲染，重新执行useIntersectionObserver获取数据
  pexelsList.value = []
}
/**
 * 监听currentCategory的变化
 */
watch(
  () => store.getters.currentCategory,
  // currentCategory为变化后的新值
  (currentCategory) => {
    resetQuery({
      page: 1,
      categoryId: currentCategory.categoryId
    })
  }
)
watch(
  () => store.getters.searchText,
  (currentSearchText) => {
    resetQuery({
      page: 1,
      searchText: currentSearchText
    })
  }
)
// 控制pins展示
const isVisablePins = ref(false)
// 当前选中的pins属性
const currentPins = ref({})

/**
 * 监听浏览器后退按钮事件
 * 使用vueuse监听popstate事件
 */
useEventListener(window, 'popstate', () => {
  isVisablePins.value = false
})
/**
 * 进入pins
 */
const onToPins = (item) => {
  /**
   * js状态的对象
   * title当前大多数浏览器忽略此参数
   * url 新历史记录条目的URL由此参数指定
   */
  // 修改浏览器的url
  history.pushState(null, null, `/pins/${item.id}`)
  isVisablePins.value = true
  currentPins.value = item
}
// 进入前的状态
const beforeEnter = (el) => {
  gsap.set(el, {
    // 缩放
    scaleX: 0,
    scaleY: 0,
    transformOrigin: '0 0',
    translateX: currentPins.value.location?.translateX,
    translateY: currentPins.value.location?.translateY,
    opacity: 0
  })
}
// 进入后的状态
const enter = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    opacity: 1,
    onComplete: done
  })
}
const leave = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    translateX: currentPins.value.location?.translateX,
    translateY: currentPins.value.location?.translateY,
    opacity: 0,
    onComplete: done
  })
}
</script>

<template>
  <div>
    <m-infinite
      v-model="loading"
      :is-finished="isFinished"
      @onLoad="getPexlesListData"
    >
      <m-waterfall
        class="px-1 w-full"
        :data="pexelsList"
        node-key="id"
        :column="isMobileTerminal ? 2 : 5"
        :picture-pre-reading="false"
      >
        <template #default="{ item, width }">
          <item-vue :data="item" :width="width" @click="onToPins"></item-vue>
        </template>
      </m-waterfall>
    </m-infinite>

    <!-- 详情内容展示 -->
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <pins-vue v-if="isVisablePins" :id="currentPins.id"></pins-vue>
    </transition>
  </div>
</template>

<style scoped lang="scss"></style>
