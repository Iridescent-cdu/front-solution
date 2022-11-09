<script setup>
import { useScrollLock, useVModel } from '@vueuse/core'
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emits = defineEmits(['update:modelValue'])

// 是一个响应式数据，当isVisable发生变化时，会自动触发emit修改modelValue
const isVisable = useVModel(props)

// 锁定滚动，通过isLocked可以进行锁定滚动
const isLocked = useScrollLock(document.body)
watch(
  isVisable,
  (val) => {
    isLocked.value = val
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>
    <teleport to="body">
      <!-- 蒙版 -->
      <transition name="fade">
        <div
          v-if="modelValue"
          class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
          @click="isVisable = false"></div>
      </transition>
      <!-- 内容 -->
      <transition name="popup-down-up">
        <div
          v-if="modelValue"
          v-bind="$attrs"
          class="w-screen bg-white dark:bg-zinc-800 z-50 fixed bottom-0">
          <slot></slot>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.popup-down-up-enter-acitve,
.popup-down-up-leave-active {
  transition: all 0.3s;
}
.popup-down-up-enter-from,
.popup-down-up-leave-to {
  transition: all 0.3s;
  transform: translateY(100%);
}
</style>
