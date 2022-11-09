<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  iconClass: {
    type: String,
  },
  textClass: {
    type: String,
    default: 'text-zinc-900 dark:text-zinc-200',
  },
  to: {
    type: String,
  },
})
const router = useRouter()
const onItemClick = () => {
  if (!props.to) {
    return null
  }
  router.push(props.to)
}
</script>

<template>
  <div
    class="w-5 flex flex-col items-center justify-center col mx-0.5"
    @click="onItemClick">
    <m-svg-icon
      :name="icon"
      :fill-class="iconClass"
      class="w-2 h-2"></m-svg-icon>
    <p
      class="text-sm mt-0.5"
      :class="textClass">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped lang="scss"></style>
