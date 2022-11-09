<script setup>
import { ErrorMessage as VeeErrorMessage, Field as VeeField, Form as VeeForm, defineRule } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref } from 'vue'
import headerVue from '../components/header.vue'
import { validateConfirmPassword, validatePassword, validateUsername } from '../validate'
import { LOGIN_TYPE_USERNAME } from '@/constants'

const store = useStore()
const router = useRouter()
const route = useRoute()
const regForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
})
const loading = ref(false)
/**
 * 定义规则
 */
defineRule('validateConfirmPassword', validateConfirmPassword)
/**
 * 注册
 */
const onRegHandler = async () => {
  loading.value = true
  try {
    const payload = {
      username: regForm.value.username,
      password: regForm.value.password,
    }
    // 注册
    await store.dispatch('user/register', {
      payload,
      ...route.query,
    })
    // 注册完成，触发登录
    await store.dispatch('user/login', {
      ...payload,
      loginType: LOGIN_TYPE_USERNAME,
    })
  } finally {
    loading.value = false
  }
  router.push('/')
}
/**
 * 跳转登录页
 */
const onToLogin = () => {
  // 移动端下跳转的类型
  store.commit('app/changeRouterType', 'push')
  router.push('/login')
}
</script>

<template>
  <div class="relative h-screen bg-white dark:bg-zinc-800 text-center xl:bg-zinc-200">
    <!-- 头部图片 -->
    <header-vue></header-vue>
    <!-- 表单区 -->
    <div
      class="block px-3 mt-4 dark:bg-zinc-800 xl:bg-white xl:w-[388px] xl:dark:bg-zinc-900 xl:m-auto xl:mt-8 xl:py-4 xl:rounded-sm xl:shadow-lg">
      <h3 class="hidden mb-2 font-semibold text-base text-main dark:text-zinc-300 xl:block">注册账号</h3>
      <!-- 表单 -->
      <VeeForm @submit="onRegHandler">
        <!-- 用户名 -->
        <VeeField
          v-model="regForm.username"
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
          v-model="regForm.password"
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
        <!-- 确认密码 -->
        <VeeField
          v-model="regForm.confirmPassword"
          class="dark:bg-zinc-800 dark:text-zinc-400 border-b-zinc-400 border-b w-full outline-0 pb-1 px-1 text-base focus:border-b-main xl:default:bg-zinc-900"
          type="password"
          name="confirmPassword"
          placeholder="确认密码"
          autocomplete="on"
          rules="validateConfirmPassword:@password" />
        <VeeErrorMessage
          class="text-sm text-red-600 block mt-0.5 text-left"
          name="confirmPassword">
        </VeeErrorMessage>
        <!-- 跳转按钮 -->
        <div class="pt-1 pb-3 leading-[0px] text-right">
          <a
            class="inline-block p-1 text-zinc-400 text-right dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300 cursor-pointer"
            @click="onToLogin"
            >去登录</a
          >
        </div>
        <!-- 注册协议 -->
        <div class="text-center">
          <a
            class="text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 text-sm duration-300"
            target="_blank"
            href="https://m.imooc.com/newfaq?id=89">
            注册即同意《慕课网注册协议》
          </a>
        </div>
        <!-- 注册按钮 -->
        <m-button
          class="w-full dark:bg-zinc-900 xl:dark:bg-zinc-800"
          :is-active-anim="false"
          :loading="loading"
          >立即注册
        </m-button>
      </VeeForm>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
