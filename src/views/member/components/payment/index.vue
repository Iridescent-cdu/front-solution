<script setup>
import pcPaymentVue from './pc-payment/index.vue'
import mobilePaymentVue from './mobile-payment/index.vue'
import { isMobileTerminal } from '@/utils/flexible'
defineProps({
  payData: Object,
})
</script>

<template>
  <div>
    <!-- PC端支付 -->
    <pc-payment-vue
      v-if="!isMobileTerminal"
      :pay-data="payData"></pc-payment-vue>
    <!-- 移动端支付 -->
    <mobile-payment-vue
      v-else
      :pay-data="payData"></mobile-payment-vue>
  </div>
</template>

<style scoped lang="scss"></style>
