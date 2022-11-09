<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { isMobileTerminal } from '@/utils/flexible'
import { getOSSClient } from '@/utils/sts'
import { message } from '@/libs'
import { putProfile } from '@/api/mock/sys'
const EMITS_CLOSE = 'close'
// pc端配置对象
const pcOptions = {
  // 剪裁框固定纵横比：1:1
  aspectRatio: 1,
}
// 移动端配置对象
const mobileOptions = {
  // 将裁剪框限制在画布的大小
  viewModel: 1,
  // 移动画布，剪裁框不动
  dragMode: 'move',
  // 剪裁框固定纵横比：1:1
  aspectRatio: 1,
  // 剪裁框不可移动
  cropBoxMovable: false,
  // 不可调整剪裁框大小
  cropBoxResizable: false,
}
</script>

<script setup>
defineProps({
  blob: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([EMITS_CLOSE])
const store = useStore()
const loading = ref(false)
/**
 * 关闭按钮点击事件
 */
const close = () => {
  emits(EMITS_CLOSE)
}

/**
 * 进行OSS上传
 */
let ossClient // 单例模式
const putObjectToOSS = async (file) => {
  if (!ossClient) {
    ossClient = await getOSSClient()
  }
  try {
    const fileTypeArr = file.type.split('/')
    const filename = `${store.getters.userInfo.username}/${Date.now()}.${fileTypeArr[fileTypeArr.length - 1]}`
    // 1.存放的路径（包含名称）
    // 2.file
    const res = await ossClient.put(`images/${filename}`, file)
    onChangeProfile(res.url)
  } catch (e) {
    message('error', e)
  }
}

/**
 * 上传新头像到服务器
 *  图片文件存放在OSS中，图片文件访问的URL存放在后端服务器中
 */
const onChangeProfile = async (avatar) => {
  // 更新本地数据
  store.commit('user/setUserInfo', {
    ...store.getters.userInfo,
    avatar,
  })
  // 更新服务器数据（更新头像url）
  await putProfile(store.getters.userInfo)
  message('success', '用户头像修改成功')
  // 关闭loading
  loading.value = false
  close()
}

/**
 * 确定按钮点击事件
 */
const onConfirmClick = () => {
  loading.value = true
  // 拿到裁剪后的图片
  cropper.getCroppedCanvas().toBolb((blob) => {
    // 裁剪后的blob地址
    // URL.createObjectURL(blob)
    putObjectToOSS(blob)
  })
}

/**
 * 图片裁剪
 */
const imageTarget = ref(null)
let cropper = null
onMounted(() => {
  const image = document.getElementById('image')
  cropper = new Cropper(image, isMobileTerminal.value ? mobileOptions : pcOptions)
})
</script>

<template>
  <div class="overflow-auto flex flex-col items-center">
    <m-svg-icon
      v-if="isMobileTerminal"
      name="close"
      fill-class="fill-zinc-800 dark:fill-zinc-200"
      class="w-3 h-3 p-0.5 m-1 ml-auto"
      @click="close"></m-svg-icon>

    <img
      id="image"
      ref="imageTarget"
      :src="blob"
      alt="" />

    <m-button
      :loading="loading"
      class="mt-4 w-[80%] xl:w-1/2"
      @click="onConfirmClick"
      >确定</m-button
    >
  </div>
</template>

<style scoped lang="scss"></style>
