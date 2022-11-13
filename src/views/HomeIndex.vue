<template>
  <div>
    首页
    <el-button type="primary">Primary</el-button>
    <el-button type="primary">
      Upload<el-icon class="el-icon--right"><IEpUpload /></el-icon>
    </el-button>
    <el-button :icon="Search" circle />
    <el-icon :size="20">
      <IEpDelete />
    </el-icon>
    <EpEdit />
    <IEpEdit />
    <el-date-picker v-model="value1" type="date" placeholder="Pick a day" />
  </div>
</template>
<script lang="ts" setup>
// import icons from '@iconify-json/ep'
import { Search } from '@element-plus/icons-vue'

const value1 = ref('')
ElMessage.success('自动引入ElMessage')
</script>
<style lang="scss" scoped></style>
