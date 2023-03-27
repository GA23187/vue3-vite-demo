<template>
  <el-button @click="rotationHandle">旋转</el-button>
  <div ref="wrapRef"></div>
</template>
<script setup lang="ts">
import Threejs from './threejs'

const wrapRef = ref()
const threejs = ref<Threejs>()
onMounted(() => {
  threejs.value = new Threejs(wrapRef.value)
})

const rotationHandle = () => {
  if (threejs.value && threejs.value.phoneMesh) {
    // threejs.value.phoneMesh.rotation.x = Math.PI / 4
    threejs.value.phoneMesh.rotation.y = Math.PI / 4
  }
}
</script>
<style scoped lang="scss"></style>
