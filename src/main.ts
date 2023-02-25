import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locales'
import zTree from '@/plugin/zTree/index'
import echarts from '@/plugin/echarts/index'
import print from '@/plugin/print/index'
// 引入全局样式
import '@/style/index.scss'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(i18n)
app.use(zTree)
app.use(echarts)
app.use(print)
app.mount('#app')
