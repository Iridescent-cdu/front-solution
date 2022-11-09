<script setup>
import { saveAs } from 'file-saver'
import { computed, ref } from 'vue'
import { useElementBounding, useFullscreen } from '@vueuse/core'
import { message } from '@/libs/index'
import { randomRGB } from '@/utils/color'
import { weiboShare } from '@/utils/share'
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  width: {
    type: Number,
  },
})
const emits = defineEmits(['click'])

/**
 * 下载按钮点击事件
 */
const onDownload = () => {
  message('success', '图片开始下载')
  /**
   * 1.下载的图片链接
   * 2.重命名文件
   */
  // 延迟一段时间执行，可以得到更好地体验
  setTimeout(() => {
    saveAs(props.data.photoDownLink, '1.png')
  }, 200)
}

/**
 * 生成全屏的方法
 */
const imgTarget = ref(null)
const { enter: onImgFullscreen } = useFullscreen(imgTarget)

/**
 * pins跳转记录，记录图片的中心点（X|Y位置+宽|高 一半）
 */
const {
  x: imgContainerX,
  y: imgContainerY,
  width: imgContainerWidth,
  height: imgContainerHeight,
} = useElementBounding(imgTarget)
const imgContainerCenter = computed(() => {
  return {
    translateX: parseInt(imgContainerX.value + imgContainerWidth.value / 2),
    translateY: parseInt(imgContainerY.value + imgContainerHeight.value / 2),
  }
})

/**
 * 进入详情点击事件
 */
const onToPinsClick = () => {
  emits('click', {
    id: props.data.id,
    location: imgContainerCenter.value,
  })
}

/**
 * 分享按钮点击处理
 */
const onShareClick = () => {
  weiboShare(props.data.photo, `https://imooc-front.lgdsunday.club/pins/${props.data.id}`)
}
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 xl:dark:bg-zinc-800 rounded pb-1">
    <div
      class="relative w-full rounded cursor-zoom-in group"
      :style="{
        backgroundColor: randomRGB(),
      }"
      @click="onToPinsClick">
      <!-- 图片 -->
      <img
        ref="imgTarget"
        v-lazy
        class="w-full rounded bg-transparent"
        :src="data.photo"
        :style="{
          height: `${(width / data.photoWidth) * data.photoHeight}px`,
        }" />
      <!-- 遮罩层 -->
      <div
        class="hidden opacity-0 w-full h-full bg-zinc-900/50 absolute top-0 left-0 rounded duration-300 group-hover:opacity-100 xl:block">
        <!-- 分享 -->
        <m-button
          class="absolute top-1.5 left-1.5"
          @click="onShareClick"
          >分享</m-button
        >
        <!-- 点赞 -->
        <m-button
          class="absolute top-1.5 right-1.5"
          type="info"
          icon="heart"
          icon-class="fill-zinc-900 dark:fill-zinc-200"></m-button>
        <!-- 下载 -->
        <m-button
          class="absolute bottom-1.5 left-1.5 bg-zinc-100/70"
          type="info"
          icon="download"
          size="small"
          icon-class="fill-zinc-900 dark:fill-zinc-200"
          @click="onDownload"></m-button>

        <!-- 全屏 -->
        <m-button
          class="absolute bottom-1.5 right-1.5 bg-zinc-100/70"
          type="info"
          icon="full"
          size="small"
          icon-class="fill-zinc-900 dark:fill-zinc-200"
          @click="onImgFullscreen"></m-button>
      </div>
    </div>
    <!-- 标题 -->
    <p class="text-sm mt-1 font-bold text-zinc-900 dark:text-zinc-300 px-1">
      {{ data.title }}
    </p>
    <!-- 作者 -->
    <div class="flex items-center mt-1 px-1">
      <img
        v-lazy
        class="h-2 w-2 rounded-full"
        :src="data.avatar"
        alt="" />
      <spanc class="text-sm text-zinc-500 ml-1">{{ data.author }}</spanc>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
