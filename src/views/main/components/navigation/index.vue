<!-- 导航栏组件 -->
<script setup>
import { useStore } from 'vuex'
import { isMobileTerminal } from '@/utils/flexible'
import mobileNavigationVue from '@/views/main/components/navigation/mobile/index.vue'
import pcNavigationVue from '@/views/main/components/navigation/pc/index.vue'
const store = useStore()
// 触发category获取数据
store.dispatch('category/useCategoryData')
</script>

<template>
  <mobile-navigation-vue v-if="isMobileTerminal"></mobile-navigation-vue>
  <pc-navigation-vue v-else></pc-navigation-vue>
</template>

<style scoped lang="scss"></style>
