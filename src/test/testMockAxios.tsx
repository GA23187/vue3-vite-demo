import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  setup() {
    const data = ref({})
    console.log(data)
    const a = 1
    fetch('/basic-api/getUserInfo')
      .then((res) => {
        console.log('测试mock数据', res)
        // data.value = res.data;
      })
      .catch((err) => {
        console.log('请求失败数据', err)
      })
    return () => {
      return (
        <div>
          <pre>{JSON.stringify(data.value)}</pre>
        </div>
      )
    }
  }
})
