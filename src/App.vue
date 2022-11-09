<script setup></script>

<template>
  <div class="h-screen w-screen fixed top-0 left-0">
    <!-- <router-view></router-view> -->
    <m-transition-router-view
      :router-type="$store.getters.routerType"
      main-component-name="Home"></m-transition-router-view>
  </div>
</template>

<style scoped lang=""></style>
