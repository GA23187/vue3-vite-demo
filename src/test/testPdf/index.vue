<template>
  <div>
    <button @click="open">window.open直接打开</button>

    <div class="d-f">
      <div class="left">
        <h1>File</h1>
        <PdfViewer :pdf-url="pdfUrl"></PdfViewer>
      </div>
      <div class="right">
        <h1>Base64</h1>
        <vue-pdf-embed :source="pdfOptions.source" :page="pdfOptions.pageNum" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PdfViewer from './component/index.vue'
import VuePdfEmbed from 'vue-pdf-embed'

const pdfUrl = ref('http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf')
const pdfOptions = reactive({
  source: '/signed.pdf',
  pageNum: 1,
  numPages: 0, // 总页数
  scale: 1 // 缩放比例
})

const open = () => {
  window.open('/signed.pdf', '_blank')
}
</script>
<style scoped lang="scss">
.d-f {
  display: flex;
}
.left,
.right {
  flex: 1;
}
</style>
