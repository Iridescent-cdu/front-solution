<script setup>
import { computed } from 'vue'
const props = defineProps({
  // 显示的svg
  name: {
    type: String,
    required: true
  },
  // svg图标的颜色
  color: {
    type: String,
    required: false
  },
  // tailwind指定svg颜色的类名
  fillClass: {
    type: String,
    required: false
  }
})

// 真实显示的svg图标（拼接#icon-）
const symbolId = computed(() => {
  return `#icon-${props.name}`
})
</script>

<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" :class="fillClass" :fill="color"></use>
  </svg>
</template>

<style scoped lang="scss"></style>
