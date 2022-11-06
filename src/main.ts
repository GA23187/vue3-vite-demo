import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import zTree from '@/plugin/zTree/index'
import echarts from '@/plugin/echarts/index'
// 引入全局样式
import '@/style/index.scss'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(zTree)
app.use(echarts)
app.mount('#app')
