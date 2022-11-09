<script>
import { computed, onUnmounted, ref, watch } from 'vue'
import dayjs from './utils.js'
// 倒计时结束
const EMITS_FINISH = 'finish'
// 倒计时改变
const EMITS_CHANGE = 'change'
// 倒计时的时间间隔
const INTERVAL_COUNT = 1000
// 倒计时改变
</script>

<script setup>
const props = defineProps({
  // 毫秒时间-时间戳
  time: {
    type: Number,
    require: true,
  },
  // 遵循dayjs format标准
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
})

const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])

// 倒计时的时长
const duration = ref(0)

/**
 * 开始倒计时
 */
let interval
const start = () => {
  close()
  interval = setInterval(() => {
    durationFn()
  }, INTERVAL_COUNT)
}
/**
 * 倒计时的执行行为
 */
const durationFn = () => {
  duration.value -= INTERVAL_COUNT
  emits(EMITS_CHANGE)
  // 监听结束的行为
  if (duration.value <= 0) {
    duration.value = 0
    emits(EMITS_FINISH)
    close()
  }
}
/**
 * 倒计时结束
 */
const close = () => {
  interval && clearInterval(interval)
}

/**
 * 监听传入的时间戳以开始倒计时
 */
watch(
  () => props.time,
  (val) => {
    duration.value = val
    start()
  },
  {
    immediate: true,
  },
)

/**
 * 显示时间格式
 */
const showTime = computed(() => {
  return dayjs.duration(duration.value).format(props.format)
})

/**
 * 组件销毁时，清理定时器
 */
onUnmounted(() => {
  close()
})
</script>

<template>
  <div>
    <slot>
      <p class="text-sm">{{ showTime }}</p>
    </slot>
  </div>
</template>

<style scoped lang="scss"></style>
