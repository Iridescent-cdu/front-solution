<script>
const EMITS_ITEM_CLICK = 'itemClick'
</script>

<script setup>
import { ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/shared'
import { getHint } from '@/api/mock/pexels.js'
const props = defineProps({
  /**
   * 搜索文本
   */
  searchText: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['EMITS_ITEM_CLICK'])

/**
 * 处理搜索提示数据获取
 */
const hintData = ref([])
const getHintData = async () => {
  if (!props.searchText) return
  const { result } = await getHint(props.searchText)
  hintData.value = result
}
/**
 * watch可以监听一个ref响应式数据，或者一个包含getter的函数
 * 通过函数return props.searchText实现监听
 */
watchDebounced(() => props.searchText, getHintData, {
  immediate: true,
  //每次事件触发时，延迟的时间
  debounce: 500
})

/**
 * item点击事件处理
 */
const onItemClick = (item) => {
  emits(EMITS_ITEM_CLICK, item)
}

/**
 * 处理关键字高亮
 */
const hightlightText = (text) => {
  //生成高亮标签
  const hightlightStr = `<span class="text-zinc-900 dark:text-zinc-200">${props.searchText}</span>`
  //正则表达式：从显示的文本中找出与用户输入文本相同的内容，使用高亮标签进行替换
  const reg = new RegExp(props.searchText, 'gi')
  //把匹配到的部分用标签替换
  return text.replace(reg, hightlightStr)
}
</script>

<template>
  <div>
    <div
      v-for="(item, index) in hintData"
      :key="index"
      class="py-1 pl-1 text-base font-bold text-zinc-500 rounded cursor-pointer duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-900"
      v-html="hightlightText(item)"
      @click="onItemClick(item)"
    ></div>
  </div>
</template>

<style scoped lang="scss"></style>
