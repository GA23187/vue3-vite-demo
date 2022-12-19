<template>
  <el-button @click="getContent">获取内容</el-button>
  <el-button @click="setContent">设置内容</el-button>
  <el-button @click="setReadOnly">禁用内容</el-button>
  <QuillEditor
    ref="editorRef"
    :theme="theme"
    :toolbar="toolbar"
    :readOnly="readOnly"
    :v-model:content="editorContent"
    :contentType="contentType"
    @ready="readyHandle"
    @update:content="contentChangeHandle"
  />
</template>
<script setup lang="ts">
import { QuillEditor, Delta } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const editorRef = ref()
const theme = ref('snow')
const toolbar = ref('full')
const readOnly = ref(false)
const contentType = ref('delta') // "delta" | "html" | "text" 注意content与contentType类型一定要一致
const editorContent = ref<Delta>(new Delta([]))
// const editorContent = ref('')

const getContent = () => {
  theme.value = ''
  console.log(editorContent.value)
  console.log(editorRef.value.getContents(), '获取内容')
}
const setContent = () => {
  const delta = new Delta([
    {
      insert: '设置内容'
    }
  ])
  // editorContent.value.push({
  //   insert: 'xxxxxx'
  // })
  editorContent.value = delta
  console.log(editorContent.value)
}
const setReadOnly = () => {
  readOnly.value = true
  theme.value = ''
  toolbar.value = 'minimal'
}
const readyHandle = (e) => {
  console.log('readyHandle>>', e)
  console.log(editorRef.value, 'editorRef')
  console.log(editorRef.value.getQuill(), 'getQuill')
  const delta = new Delta([
    {
      insert: 'xxxxxx'
    },
    {
      insert: {
        image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAIAAAANYFjGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAVfSURBVEiJ7VZpbFRVFP7umzfLm7Uz085Mp+2ULnahK4K2GCsicUE0YXNBQaMhYYn4Q6KJxqiNiWhiYiJ/0EBM3AhqjGhcorEQwIKiTaAgtHSZdJ1pp5195r158+7xx1QkxJjwS37w3fPn5tx7zne/e+7JZUSE6w/C/03g33GD1rXgBq1rwQ1a1wLdKy8+R5oMgAnilQ7SFK4kKS8znciY7kqXJsd5Ls3VLM9luZqFIFy1F0A8eOrCoR2SK2ByBkjLKYnpvvfWamrGXt7GGANjAJRE6PieZWo64q67U81EuSoXLC8nxUT/IXl+WG8rcy/fdWXc8C975ciQaHZ6bntm6shbIF56x26jqyoz3T/+8x7ONRAnzjnXADI6K/2dWy3+VgD5bOz8J09bS5vycsLkDCQnz5w/uJ2IE9F474GxE+/XPfi6p/kBAOnwIACrtyEzF+x95y7inIgTceJc91p3tzJzPi/HTJ4mndFe4JQaPZYKHifino5tlJfjw0cpr7jbHspnYxM9b/K8DFoAGBGRmonGR3vdjfcKoik2cmJ+4Cc1G+WqAsDmbzXaveCaHJsq69jiqu1y163MpWbOfPRU+Nx3mpJKhwez0fHM7JCzqsPXssbo8KdCF0WTtyVx4TDLpTNjJx3NGwFocix24TAR2aruMHkaE0M9AASDRTBY1XTE17GVQABdHomx0/MXf8wr6djwcXfTA9Hh46LkUDNxnV7KRkaHv+8mIiURIlBs5CQR6c0uk7PCYClOhQbABKm42lHWOtX3pbN6efXKXWc+3QlBECCIUmk7EWWn+khTAETPfsZzsmh2u1o2AlBTYYD0Nh8Ao3ORNXCrLdBhC3TaKjvtlcvti5aXtG0oVCMTRJ7LJMZOV3TtJOKu+lXetvWi2SlKRWZPvcnuTYUHRckhuQKOwNKSptUE0on62nueL1l8D0Bqei4xeTZ09mtP/SoRgFTekQyeoLycnexjeikb6geDe+kWJhoB5BLTIOitXgDxoR7iGogKOgHEOY9d6iEiQdTbF3UKBvPiTfvVdAQgTU4KBslZ0wWAiIcz80JyxtO02l5xc15OBI+8C0Jeyf6xf1PrY/sEQUxMnktOX2CCvn7NyyIA0VZqLArI86PJ0WM8l1y4vuL6Qp2pqTAAg93HlVTo1H4QcdJAxLlGnBMREQdQfvtOUSpSYhOTJw+kpvsBzA0e4Zo6d+noQi1zTsSn+z7ztq0b/LZbTs4AKG5YFR3p1UsOm78lNva7llfrV79k8dy00Lek8lsBqMkpTU6IFndR07qFB8nz+fQcEdfbfEp8onBuUKHiAUAQDVZfU/X93a6G+wDkkjPx4K9aTmZA8+YD3vb1osleffcLbU9+TCBf+/rmR/dFBn6ePf+D3d8MUNmyR27Z/pXV12Dx1BDnlpKaqhU7ACz0G8m/JP7nV1ouC8C9ZDPTGf6Wapa4BsBgK83ODgDQGcy1D78PsMKCqzqWtbSpfdvhgS+eVdNRc0mdpqQAxIKnTM4KBtjKWkXJUVR5S0nj3aLZGZ84a/U1iibbxW9enfzjcyLKRkYmfjtY3vH4glpMZ5T8SwFYq1YY3TddTqOmQgRijOltXiU+CZChqJwJeiaIBbuqizLRyAQxExmRimsA6IzWxofe1RntwaN7iWAvbwcgmuyNG95OhQf0Zoeanj/xdtf4qQ/9SzYsXvsGJ+r/YvdY7wf/xLU3rDE4F5nLll6ZxlBU6V+xmzEd0xkcNSss/jZRKsJ/Qo5OaKpsLqktTC2e+uxcUM1EK7u2S67KyxoriZCjYonV11hct7K0fa2rtguAzmiJXOyp6HyC3fg0XwOuU1p/Ad4etF3X+BWFAAAAAElFTkSuQmCC'
      },
      attributes: {
        width: '100%'
      }
    }
  ])
  editorRef.value.setContents(delta)
}
const contentChangeHandle = (e) => {
  console.log('contentChangeHandle>>>>>>>>>', e)
}
</script>
<style scoped lang="scss"></style>
