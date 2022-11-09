<template>
  <div class="w-full guide-search">
    <m-search v-model:modelValue="inputValue" @search="onSearchHandler">
      <template #dropdown>
        <div>
          <!-- 搜索提示 -->
          <hint-vue
            :searchText="inputValue"
            v-show="inputValue"
            @itemClick="onSearchHandler"
          ></hint-vue>
          <!-- 最近搜索 -->
          <history-vue
            v-show="!inputValue"
            @itemClick="onSearchHandler"
          ></history-vue>
          <!-- 推荐主题 -->
          <theme-vue v-show="!inputValue"></theme-vue>
        </div>
      </template>
    </m-search>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import hintVue from './hint.vue'
import historyVue from './history.vue'
import themeVue from './theme.vue'
const inputValue = ref('')
const store = useStore()
/**
 * 触发搜索回调
 */
const onSearchHandler = (val) => {
  inputValue.value = val
  if (val) {
    store.commit('search/addHistory', val)
    //触发searchText变化
    store.commit('app/changeSearchText', val)
  }
}
</script>

<style scoped lang="scss"></style>
