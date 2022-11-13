<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

console.log(import.meta.env)
const elementConfig = reactive({
  size: 'default',
  zIndex: 3000,
  locale: zhCn
})
</script>

<template>
  <el-config-provider
    :size="elementConfig.size"
    :z-index="elementConfig.zIndex"
    :locale="elementConfig.locale"
  >
    <router-view />
  </el-config-provider>
</template>

<style>
#app {
  /* app.vue */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
