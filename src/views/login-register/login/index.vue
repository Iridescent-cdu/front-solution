<script setup>
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm } from 'vee-validate'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { validatePassword, validateUsername } from '../validate'
import headerVue from '../components/header.vue'
import SliderCaptchaVue from './slider-captcha.vue'
import qqLoginVue from './qq-login.vue'
import weixinLoginVue from './weixin-login.vue'
import { LOGIN_TYPE_USERNAME } from '@/constants/index'

const store = useStore()
const router = useRouter()
// 控制sliderCaptcha展示
const isSliderCaptchaVisible = ref(false)
/**
 * 触发登录，表单校验通过之后触发
 */
const onLoginHandler = () => {
  isSliderCaptchaVisible.value = true
}
/**
 * 用户登录行为
 */
const loading = ref(false)
const loginForm = ref({
  username: '',
  password: '',
})
const onLogin = async () => {
  loading.value = true
  try {
    await store.dispatch('user/login', {
      ...loginForm.value,
      loginForm: LOGIN_TYPE_USERNAME,
    })
  } finally {
    loading.value = false
  }
  router.push('/')
}
/**
 * 人类行为验证通过
 */
const onCaptchaSuccess = () => {
  isSliderCaptchaVisible.value = false
  // 登录操作
  onLogin()
}

/**
 * 去注册
 */
const onToReg = () => {
  // 移动端下跳转的类型
  store.commit('app/changeRouterType', 'push')
  router.push('/register')
}
</script>

<template>
  <div class="relative h-screen bg-white dark:bg-zinc-800 text-center xl:bg-zinc-200">
    <!-- 头部图片 -->
    <header-vue></header-vue>
    <!-- 表单区 -->
    <div
      class="block px-3 mt-4 dark:bg-zinc-800 xl:bg-white xl:w-[388px] xl:dark:bg-zinc-900 xl:m-auto xl:mt-8 xl:py-4 xl:rounded-sm xl:shadow-lg">
      <h3 class="hidden mb-2 font-semibold text-base text-main dark:text-zinc-300 xl:block">账号登录</h3>
      <!-- 表单 -->
      <VeeForm @submit="onLoginHandler">
        <!-- 用户名 -->
        <VeeField
          v-model="loginForm.username"
          class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
          type="text"
          name="username"
          placeholder="用户名"
          autocomplete="on"
          :rules="validateUsername" />
        <VeeErrorMessage
          class="text-sm text-red-600 block mt-0.5 text-left"
          name="username">
        </VeeErrorMessage>
        <!-- 密码 -->
        <VeeField
          v-model="loginForm.password"
          class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
          type="password"
          name="password"
          placeholder="密码"
          autocomplete="on"
          :rules="validatePassword" />
        <VeeErrorMessage
          class="text-sm text-red-600 block mt-0.5 text-left"
          name="password">
        </VeeErrorMessage>
        <!-- 跳转按钮 -->
        <div class="pt-1 pb-3 leading-[0px] text-right">
          <a
            class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300 cursor-pointer"
            @click="onToReg"
            >去注册</a
          >
        </div>
        <!-- 登录按钮 -->
        <m-button
          class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800"
          :is-active-anim="false"
          :loading="loading"
          >登录
        </m-button>
      </VeeForm>
      <!-- 第三方登录 -->
      <div class="flex justify-around mt-4">
        <!-- QQ -->
        <qq-login-vue></qq-login-vue>
        <!-- 微信登录 -->
        <weixin-login-vue></weixin-login-vue>
      </div>
    </div>
    <SliderCaptchaVue
      v-if="isSliderCaptchaVisible"
      @close="isSliderCaptchaVisible = false"
      @success="onCaptchaSuccess"></SliderCaptchaVue>
  </div>
</template>

<style scoped lang="scss"></style>
