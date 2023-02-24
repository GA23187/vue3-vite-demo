<script setup lang="ts">
// import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.meta)
</script>
<template>
  <div class="layout-tabbar">
    <router-link to="/">首页</router-link>
    <router-link to="/tsx">测试tsx</router-link>
    <router-link to="/globalVar">测试scss全局变量</router-link>
    <router-link to="/cssModel">测试css-model</router-link>
    <router-link to="/static">测试静态资源</router-link>
    <router-link to="/pinia">测试pinia</router-link>
    <router-link to="/mockAxios">测试mock-axios</router-link>
    <router-link to="/zTreeDemo">测试zTree</router-link>
    <router-link to="/echarts">测试echarts</router-link>
    <router-link to="/editor">测试editor</router-link>
    <router-link to="/execl">测试execl</router-link>
    <router-link to="/axios">测试axios</router-link>
    <router-link to="/pdf">测试pdf</router-link>
  </div>
  <div class="layout-content">
    <keep-alive v-if="route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </div>
</template>
<style lang="scss" scoped>
.layout-tabbar {
  a {
    display: inline-block;
    margin: 10px;
    padding: 5px;
    color: #000;
    background: rgb(0, 225, 255);
  }
}
.layout-content {
  height: calc(100% - 46px);
}
</style>
