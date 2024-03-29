import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/HomeIndex.vue'),
        meta: { title: '首页', keepAlive: false, showTab: true }
      },
      {
        path: '/tsx',
        name: 'Tsx',
        component: () => import('@/test/tsx/demo'),
        meta: { title: '测试tsx', keepAlive: false, showTab: true }
      },
      {
        path: '/globalVar',
        name: 'globalVar',
        component: () => import('@/test/testScss/globalVar.vue'),
        meta: { title: '测试scss全局变量', keepAlive: false, showTab: true }
      },
      {
        path: '/cssModel',
        name: 'CssModel',
        component: () => import('@/test/testCssModel'),
        meta: { title: '测试css-model', keepAlive: false, showTab: true }
      },
      {
        path: '/static',
        name: 'Static',
        component: () => import('@/test/testStatic/index.vue'),
        meta: { title: '测试静态资源', keepAlive: false, showTab: true }
      },
      {
        path: '/pinia',
        name: 'Pinia',
        component: () => import('@/test/testPinia/index.vue'),
        meta: { title: '测试pinia', keepAlive: false, showTab: true }
      },
      {
        path: '/mockAxios',
        name: 'MockAxios',
        component: () => import('@/test/testMockAxios'),
        meta: { title: '测试mock-axios', keepAlive: false, showTab: true }
      },
      {
        path: '/zTreeDemo',
        name: 'zTreeDemo',
        component: () => import('@/test/zTreeDemo/index.vue'),
        meta: { title: '测试zTreeD', keepAlive: false, showTab: true }
      },
      {
        path: '/echarts',
        name: 'echarts',
        component: () => import('@/test/testEcharts/index.vue'),
        meta: { title: '测试echarts', keepAlive: false, showTab: true }
      },
      {
        path: '/editor',
        name: 'editor',
        component: () => import('@/views/layout/routerView.vue'),
        meta: { title: '测试Editor', keepAlive: false, showTab: true },
        redirect: '/editor/quill',
        children: [
          {
            path: '/editor/quill',
            name: 'quillEditor',
            component: () => import('@/test/testEditor/quill/index.vue'),
            meta: { title: '测试quillEditor', keepAlive: false, showTab: true }
          }
        ]
      },
      {
        path: '/execl',
        name: 'execl',
        component: () => import('@/test/testExecl/index.vue'),
        meta: { title: '测试execl', keepAlive: false, showTab: true }
      },
      {
        path: '/axios',
        name: 'axios',
        component: () => import('@/test/testAxios/index.vue'),
        meta: { title: '测试axios', keepAlive: false, showTab: true }
      },
      {
        path: '/pdf',
        name: 'pdf',
        component: () => import('@/test/testPdf/index.vue'),
        meta: { title: '预览pdf', keepAlive: false, showTab: true }
      },
      {
        path: '/print',
        name: 'print',
        component: () => import('@/test/testPrint/index.vue'),
        meta: { title: '测试print', keepAlive: false, showTab: true }
      },
      {
        path: '/waterMark',
        name: 'waterMark',
        component: () => import('@/test/testWaterMark/index.vue'),
        meta: { title: '测试水印', keepAlive: false, showTab: true }
      },
      {
        path: '/threejs',
        name: 'threejs',
        component: () => import('@/test/testThreejs/index.vue'),
        meta: { title: '测试threejs', keepAlive: false, showTab: true }
      }
    ]
  }
]
