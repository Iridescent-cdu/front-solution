<script setup>
import headerVue from './components/header/index.vue'
import mainVue from './components/main.vue'
import floatingVue from './components/floating.vue'
</script>

<template>
  <div class="h-screen">
    <header-vue class="h-header"></header-vue>
    <div class="h-main">
      <main-vue></main-vue>
    </div>
    <floating-vue class="fixed bottom-10 right-2"></floating-vue>
  </div>
</template>

<style scoped lang="scss"></style>
