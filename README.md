# vue3+vite 测试 demo

[TOC]

## 随便写点

参考：https://github.com/ynzy/vite-vue3-template

## ✅ 配置 ip 访问项目

- vite 启动后出现 “ Network: use --host to expose ”

```js
vite v2.3.7 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose
```

- 是因为 IP 没有做配置，所以不能从 IP 启动，需要在 vite.config.js 做相应配置：
  在 vite.config.js 中添加 server.host 为 0.0.0.0

```js
export default defineConfig({
  plugins: [vue()],
  // 在文件中添加以下内容
  server: {
    host: '0.0.0.0'
  }
})
```

- 重新启动后显示

```js
vite v2.3.7 dev server running at:

  > Local:    http://localhost:3000/
  > Network:  http://192.168.199.127:3000/
```

## <span id="env">✅ 配置多环境变量 </span>

- 文档：https://cn.vitejs.dev/guide/env-and-mode.html

* 在生产环境，会把 import.meta.env 的值转换成对应真正的值

1. 添加环境变量文件，每个文件写入配置，**定义 env 环境变量前面必须加 VITE\_**

- `.env.development`

```js
# must start with VITE_
VITE_ENV = 'development'
VITE_OUTPUT_DIR = 'dev'
```

- `.env.production`

```js
# must start with VITE_
VITE_ENV = 'production'
VITE_OUTPUT_DIR = 'dist'
```

- `.env.test`

```js
# must start with VITE_
VITE_ENV = 'test'
VITE_OUTPUT_DIR = 'test'
```

2. 修改 scripts 命令

- `--mode` 用来识别我们的环境

```js
"dev": "vite --mode development",
"test": "vite --mode test",
"prod": "vite --mode production",
```

3. 在项目中访问

```js
console.log(import.meta.env)
```

4. typescript 智能提示

- 修改 `src/env.d.ts` 文件，如果没有创建一个

```js
/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_ENV: string; // 环境
  readonly VITE_OUTPUT_DIR: string; // 打包目录
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## <span id="alias">✅ 配置 alias 别名 </span>

- 文档：https://cn.vitejs.dev/config/#resolve-alias
- 修改 vite.config.ts 配置

```js
// 这里还需要依赖下面的操作
import { resolve } from 'path'

resolve: {
    alias: {
      "@": resolve(__dirname, 'src'),
    },
  },
```

## <span id="node">✅ 识别 nodejs 内置模块 </span>

- path 模块是 node.js 内置的功能，但是 node.js 本身并不支持 typescript，所以直接在 typescript 项目里使用是不行的
- 解决方法：安装@types/node

```js
pnpn i -D @types/node
```

- 在 vite.config.js 中使用

```js
import { resolve } from 'path'
```

## <span id="router">✅ Vue-router4 </span>

- 文档：https://next.router.vuejs.org/zh/installation.html
- composition-api 使用：https://next.router.vuejs.org/zh/guide/advanced/composition-api.html

### 1. 安装依赖

```ts
pnpm install vue-router@4
```

### 2. 配置路由 api

- 在 src 目录下，新建 router 文件夹，并在文件夹内创建
  - index.ts 管理路由 api
  - router.config.ts 管理路由信息
- 在 src 目录下，新建 views 文件夹,新建 home.vue 与 layout 文件夹存放具体的页面

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './router.config'

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```ts
// router/router.config.ts
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
        component: () => import('@/views/home.vue'),
        meta: { title: '首页', keepAlive: false, showTab: true }
      }
    ]
  }
]
```

### 3. main 中引入 router

```ts
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
// 引入全局样式
import '@/styles/index.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### 4. 修改 App.vue 添加 home.vue 与 layout 配置 router-view

```ts
// src/app.vue
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
console.log('查看全局环境',import.meta.env);
</script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

```vue
// src/views/home.vue
<template>
  <div>首页</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    return {}
  }
})
</script>
<style scoped></style>
```

```ts
// src/views/layouts/index.vue
<script setup lang='ts'>
import { useRoute } from 'vue-router';

    const route = useRoute()
    console.log(route.meta);

</script>
<template>
    <div class="layout-content">
        <keep-alive v-if="route.meta.keepAlive">
            <router-view></router-view>
        </keep-alive>
        <router-view v-else></router-view>
    </div>
</template>
<style scoped>

</style>
```

### 5.为后续做准备

- 修改下 layout/index.vue 文件 页面添加跳转链接

  ```vue
  <script setup lang="ts">
  import { useRoute } from 'vue-router'

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
    </div>
    <div class="layout-content">
      <keep-alive v-if="route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
  </template>
  <style scoped></style>
  ```

- 修改路由文件添加对应路由

  ```ts
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
          component: () => import('@/views/Home.vue'),
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
        }
      ]
    }
  ]
  ```

- 在`tsconfig.json`文件中 compilerOptions 添加如下配置 去除 vscode 红色下划线,让 ts 认识`别名`(并不影响编译)

  ```
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "#/*": ["types/*"]
      }
  ```

## <span id="tsx">✅ 集成 Tsx </span>

- 文档：https://cn.vitejs.dev/guide/features.html#jsx

1. 安装依赖

```js
pnpm i -D @vitejs/plugin-vue-jsx
```

2. 修改 vite.config.ts 配置

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      include: /\.(jsx|tsx)/
    })
  ],
  server: {
    host: '0.0.0.0'
  }
})
```

3.测试

```tsx
// src/test/tsx/demo.tsx

import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return () => {
      return <div>hello tsx</div>
    }
  }
})
```

## <span id="sass">✅ 引入 Sass 处理样式 </span>

- 文档：https://cn.vitejs.dev/guide/features.html#css-pre-processors

1. 安装依赖
   使用`dart-sass`, 安装速度比较快，大概率不会出现安装不成功

```js
pnpm i -D sass
```

2. 使用
   每个页面自己对应的样式都写在自己的 .vue 文件之中 `scoped` 它顾名思义给 css 加了一个域的概念。

```html
<style lang="scss">
  /* global styles */
</style>

<style lang="scss" scoped>
  /* local styles */
</style>
```

### vite 识别 sass 全局变量

- 文档：https://cn.vitejs.dev/config/#css-preprocessoroptions

* vite.config.js 添加配置

```js
css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/mixin.scss";
          @import "@/styles/variables.scss";
          `,
      },
    },
  },
```

- 测试

  ```vue
  // src/test/testScss/globalVar.vue
  <template>
    <div>
      <h1>测试scss全局变量</h1>
      <div class="f">
        <div class="s">dddddddddddddddddddddddd</div>
      </div>
    </div>
  </template>
  <style scoped lang="scss">
  .f {
    @include flexbox;
  }
  </style>
  ```

### css modules

- 目前测试只有在 tsx 中可以正常使用，vue-template 中可以导入在 js 中使用，`<template>` 中还不知道怎么使用
- 定义一个 `*.module.scss` 或者 `*.module.css` 文件
- 在 tsx 中使用
- 测试文件

```js
// src/test/testCssModel.tsx
import { defineComponent } from 'vue'
import classes from '@/styles/test.module.scss'
export default defineComponent({
  setup() {
    console.log(classes)
    return () => {
      return <div class={`root  ${classes.moduleClass}`}>测试css-modules</div>
    }
  }
})
```

## <span id="static">✅ 静态资源使用 </span>

- 文档：https://cn.vitejs.dev/guide/features.html#static-assets

```js
// src/test/testStatic/index.vue
<template>
  <div>
    <h1>测试静态资源使用</h1>
    <!-- <img src="@/assets/images/图片.jpg" alt=""> -->
    <img src="@/assets/images/lemon.jpg" />
  </div>
</template>
<script setup lang="ts">
import img from "@/assets/images/图片.png"; // 返回图片资源路径
import demo from "../tsx/demo.tsx?url"; // 显式加载资源为一个 URL
import test from "./test?raw"; // 以字符串形式加载资源
import Worker from "./worker?worker"; // 如果是计算量很大的代码，可以使用 worker ，开启新的线程加载，与主线程通信
import jsonText from "./jsonText.json"; // 读取 json 文件
// import { getImage } from '@/utils';
console.log("静态图片--", img);
console.log("显式加载资源的url--", demo);
console.log("以字符串形式加载资源--", `类型${typeof test}`, test);
console.log("读取json--", jsonText);

const worker = new Worker();
worker.onmessage = function (e) {
  console.log("worker监听---", e);
};
</script>
<style lang="scss" scoped></style>

```

### 动态引入图片

- 文档：https://cn.vitejs.dev/guide/assets.html#the-public-directory
- 参考链接：https://juejin.cn/post/7030698018609315871

- 使用`new URL` 和 `import.meta.url`时的问题
  - `import.meta.url` 获取到的是当前页面完整 url 地址
  - `new URL` 中必须填写**相对路径**
  - 打包不支持中文路径，暂时没解决`[vite:asset-import-meta-url] ENOENT: no such file or directory, open '/Users/zhangyong/code/oneself/template/vite-vue3-h5-template/src/assets/images/png/\u5E74\u7EC8\u603B\u7ED3.png'`

```js
const imgUrl = new URL('../../assets/images/png/pp.png', import.meta.url).href
// import.meta.url 获取到的地址：http://192.168.31.172:3000/src/test/testStatic/index.vue?import&t=1645278739188
// 拼接后的地址：http://192.168.31.172:3000/src/assets/images/png/pp.png
```

## <span id="pinia">✅ Pinia 状态管理 </span>

- 文档：https://pinia.vuejs.org/
- 参考资料：https://juejin.cn/post/7049196967770980389
- Pinia 的特点：
  - 完整的 typescript 的支持；
  - 足够轻量，压缩后的体积只有 1.6kb;
  - 去除 mutations，只有 state，getters，actions（这是我最喜欢的一个特点）；
  - actions 支持同步和异步；
  - 没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；
  - 无需手动添加 store，store 一旦创建便会自动添加；

### 安装依赖

```js
pnpm i pinia
```

### 创建 Store

- 新建 src/store 目录并在其下面创建 index.ts，导出 store

```js
// src/store/index.ts

import { createPinia } from 'pinia'

const store = createPinia()

export default store
```

### 在 main.ts 中引入并使用

```ts
// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

const app = createApp(App)
app.use(store)
```

### 定义 State

- 在 src/store 下面创建一个 user.ts

```ts
//src/store/app.ts
import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      config: 'app'
    }
  },
  actions: {
    setData(data: any) {
      console.log(data)
      this.config = data
    }
  }
})
```

```ts
//src/store/user.ts

import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: '张三',
      age: 18
    }
  },
  getters: {
    fullName: (state) => {
      return state.name + '丰'
    }
  },
  actions: {
    updateState(data: any) {
      this.$state = data
      this.updateAppConfig()
    },
    updateAppConfig() {
      const appStore = useAppStore()
      appStore.setData('app-update')
    }
  }
})
```

### 获取/更新 State

```vue
// src/test/testMockAxios.tsx

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
const userStore = useUserStore()
const appStore = useAppStore()
console.log(appStore.config)
console.log(userStore)
console.log(userStore.name)
const name = computed(() => userStore.name)
const { age } = storeToRefs(userStore)

const updateUserState = () => {
  const { name, age } = userStore.$state
  userStore.updateState({
    name: name + 1,
    age: age + 1
  })
}
</script>
<template>
  <div>姓名：{{ name }}</div>
  <div>年龄：{{ age }}</div>
  <div>计算的名字：{{ userStore.fullName }}</div>
  <div>app的config: {{ appStore.config }}</div>
  <button @click="updateUserState">更新数据</button>
</template>

<style lang="scss" scoped></style>
```

### 数据持久化

- 文档：https://github.com/prazdevs/pinia-plugin-persistedstate

* 插件 pinia-plugin-persistedstate 可以辅助实现数据持久化功能。
* 数据默认存在 sessionStorage 里，并且会以 store 的 id 作为 key。

* 安装依赖

```ts
pnpm i pinia-plugin-persistedstate
```

- 在 store/index 引用并使用插件

```ts
// src/store/index.ts

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)
export default store
```

- 在对应的 store 里开启 persist 即可

```ts
export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      name: '张三'
    }
  },

  // 开启数据缓存
  persist: {
    key: 'user',
    storage: sessionStorage, // 数据存储位置，默认为 localStorage
    paths: ['name'], // 用于部分持久化状态的点表示法路径数组，表示不会持久化任何状态（默认为并保留整个状态）
    overwrite: true
  }
})
```

## <span id="prettier">✅ Eslint + Prettier 统一开发规范 </span>

### 1. 安装依赖

```js
pnpm i -D eslint eslint-plugin-vue prettier @vue/eslint-config-prettier @vue/eslint-config-typescript @rushstack/eslint-patch
```

### 2. 编写相关文件

- .eslintrc.js

```js
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  env: {
    'vue/setup-compiler-macros': true
  },
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  }
}
```

- .prettierc.js

> 使用 vscode 中的 prettierc 插件无法读取到配置文件名为`.prettierc.js `
>
> 在控制台发现 No local configuration (i.e. .prettierrc or .editorconfig) detected, falling back to VS Code configuration
>
> 需要换成`.prettierrc`

```js
module.exports = {
  // 定制格式化要求
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json'
      }
    }
  ],
  printWidth: 100, // 一行最多 100 字符
  tabWidth: 2, // 使用 4 个空格缩进
  semi: false, // 行尾需要有分号
  singleQuote: true, // 使用单引号而不是双引号
  useTabs: false, // 用制表符而不是空格缩进行
  quoteProps: 'as-needed', // 仅在需要时在对象属性两边添加引号
  jsxSingleQuote: false, // 在 JSX 中使用单引号而不是双引号
  trailingComma: 'none', // 末尾不需要逗号
  bracketSpacing: true, // 大括号内的首尾需要空格
  bracketSameLine: false, // 将多行 HTML（HTML、JSX、Vue、Angular）元素反尖括号需要换行
  arrowParens: 'always', // 箭头函数，只有一个参数的时候，也需要括号 avoid
  rangeStart: 0, // 每个文件格式化的范围是开头-结束
  rangeEnd: Infinity, // 每个文件格式化的范围是文件的全部内容
  requirePragma: false, // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  proseWrap: 'preserve', // 使用默认的折行标准 always
  htmlWhitespaceSensitivity: 'css', // 根据显示样式决定 html 要不要折行
  vueIndentScriptAndStyle: false, //（默认值）对于 .vue 文件，不缩进 <script> 和 <style> 里的内容
  endOfLine: 'lf', // 换行符使用 lf 在Linux和macOS以及git存储库内部通用\n
  embeddedLanguageFormatting: 'auto' //（默认值）允许自动格式化内嵌的代码块
}
```

- .vscode/settings.json

```js
{
    "editor.formatOnSave": true, // 每次保存的时候自动格式化
    "editor.formatOnPaste": true, // 自动格式化粘贴内容
    "editor.tabCompletion": "on", // tab 自动补全
    "editor.codeActionsOnSave": { // 保存时使用 ESLint 修复可修复错误
        "source.fixAll": true,
        "source.fixAll.eslint": true, // 保存时使用 ESLint 修复可修复错误
        // "source.fixAll.stylelint": true
    },
    // 文件设置
    "files.eol": "\n", // 默认行尾字符。 git全局配置 git config --global core.autocrlf false
    // eslint 设置
    "eslint.alwaysShowStatus": true, // 总是在 VSCode 显示 ESLint 的状态
    "eslint.probe": [ // eslint 校验的语言类型 - 新版
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact",
        "html",
        "vue",
        "markdown",
        "tsx"
    ],
}
```

## <span id="mock">✅ 使用 Mock 数据 </span>

- 文档：https://github.com/vbenjs/vite-plugin-mock
- mock 数据目前测试，在开发环境 XHR 和 fetch 都生效，生产环境只能使用 XHR 类型请求库调用，fetch 不生效

### 1. 安装依赖

```js
pnpm i -D vite-plugin-mock
# 如果不使用mockjs,则不需要安装 mockjs 相关依赖
pnpm i mockjs
pnpm i -D @types/mockjs
```

### 2. 生产环境 相关封装

```ts
// mock/_createProductionServer.ts
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

const modules = import.meta.globEager('./**/*.ts')

const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return
  }
  mockModules.push(...modules[key].default)
})

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
```

```ts
// mock/_util.ts
// Interface data format used to return a unified format

import { Recordable } from 'vite-plugin-mock'

export function resultSuccess<T = Recordable>(result: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: 'success'
  }
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {}
) {
  const pageData = pagination(page, pageSize, list)

  return {
    ...resultSuccess({
      items: pageData,
      total: list.length
    }),
    message
  }
}

export function resultError(message = 'Request failed', { code = -1, result = null } = {}) {
  return {
    code,
    result,
    message,
    type: 'error'
  }
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  const ret =
    offset + Number(pageSize) >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + Number(pageSize))
  return ret
}

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}
```

```ts
// mock/sys/user  和src同级
import { MockMethod } from 'vite-plugin-mock'
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util'

export default [
  {
    url: '/basic-api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      console.log('----请求了getUserInfo---')

      return resultSuccess({
        name: '章三',
        age: 40,
        sex: '男'
      })
    }
  }
] as MockMethod[]
```

### 3. 修改 vite.config.ts 配置

```ts
import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const isBuild = command === 'build'
  return defineConfig({
    plugins: [
      viteMockServe({
        ignore: /^_/, // 正则匹配忽略的文件
        mockPath: 'mock', // 设置mock.ts 文件的存储文件夹
        localEnabled: true, // 设置是否启用本地 xxx.ts 文件，不要在生产环境中打开它.设置为 false 将禁用 mock 功能
        prodEnabled: true, // 设置生产环境是否启用 mock 功能
        watchFiles: true, // 设置是否监视mockPath对应的文件夹内文件中的更改
        // 代码注入
        injectCode: ` 
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `
      })
    ]
  })
}
```

### 4. 修改 tsconfig.josn

- include 字段添加`mock/**/*.ts`

## <span id="husky">✅ husky + lint-staged 提交校验 </span>

### 1. 安装依赖

```js
pnpm i -D husky lint-staged
```

### 2. 添加脚本命令

需要 npm 版本 7.x

```js
运行npm set-script prepare "husky install"  // 会在package.json/scripts 中添加 "prepare": "husky install"，也可以手动的在 package.json/scripts 中添加 "prepare": "husky install" 命令

运行npm run prepare  //  初始化husky,将 git hooks 钩子交由.husky执行， 会在根目录创建 .husky 文件夹

运行npx husky add .husky/pre-commit "npx lint-staged" //会在.husky文件夹下生成pre-commit脚本，这个脚本会在执行git commit之前执行npx lint-staged 指令
```

### 3. 创建 .lintstagedrc.json

```json
{
  "**/*.{js,ts,tsx,jsx,vue,scss,css}": [
    "prettier --write \"src/**/*.ts\" \"src/**/*.vue\"",
    "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix"
  ]
}
```

### 4.添加 script

```
"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
    "lint:lint-staged": "lint-staged",
```

## 打包配置

```ts
function handleOutDirByMode(mode) {
  console.log('环境', mode)
  return 'dist'
}
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const isBuild = command === 'build'
  return defineConfig({
    //伪代码...,
    build: {
      sourcemap: true,
      outDir: handleOutDirByMode(mode),
      cssCodeSplit: false, // 禁用 CSS 代码拆分,将整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      brotliSize: false, // 关闭打包计算
      target: 'esnext',
      // minify: 'esbuild', // 混淆器，terser构建后文件体积更小 ,esbuild默认打包格式
      //小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
      assetsInlineLimit: 4096,
      assetsDir: 'static/img/', // 静态资源目录
      // rollup 打包配置
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      },
      // 压缩配置
      terserOptions: {
        compress: {
          drop_console: false, // 生产环境移除console
          drop_debugger: true // 生产环境移除debugger
        }
      }
    }
  })
}
```

## axios 配置

## zTree 使用

> 需求场景：需要支持树节点的前端搜索，同时搜出来的节点数可能会比较多，使用 element-plus 的 tree 组件会出现明显的卡顿问题。

插件地址：https://treejs.cn/v3/main.php#_zTreeInfo

### 1.安装

```
 npm i @ztree/ztree_v3
 pnpm add @ztree/ztree_v3
```

### 2.引入

- 引入 ztree

  ```javascript
  // 根据使用情况按需引入 注意顺序
  import '@ztree/ztree_v3/js/jquery-1.4.4.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.core.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.excheck.min.js'
  import '@ztree/ztree_v3/js/jquery.ztree.exedit.min.js'
  import '@ztree/ztree_v3/css/metroStyle/metroStyle.css'
  import '@ztree/ztree_v3/css/zTreeStyle/zTreeStyle.css'
  ```

- ztree 是使用的 jq 来操作的所以后续的操作需要使用`$`,为了让 ts 认识引入

  ```
  npm install @types/jquery -D
  ```

  并修改`.eslintrc.js`

  ```
    env: {
      ...
      jquery: true
    },
  ```

  

- 不用网上教程说的安装下 jq，因为其实 ztreev3 版已经单独把 jq 给集成了，只需要按上面引入就行。

  - 但是如果觉得为了这个功能把 jq 引入进来增加了打包体积可以通过 cdn 引入，结合打包器的一些配置，
  - 会发现 window 下有`$`了，如果你不想把 jq 引入到项目中同时又想使用呢? 好像不行额，这个 ztree 就是基于 jq 的。

### 3.使用

#### 样式修改

- 遗留问题 节点鼠标选中复制不上

#### 增删改查

- 搜索高亮

## pnpm

- 升级 pnpm7 后，删除 node_modules 后 `pnpm i` 出现提示

  ```
  ERR_PNPM_PEER_DEP_ISSUES  Unmet peer dependencies
  └─┬ vite-plugin-mock 2.9.6
    └─┬ @rollup/plugin-node-resolve 13.1.3
      ├── ✕ missing peer rollup@^2.42.0
      └─┬ @rollup/pluginutils 3.1.0
        └── ✕ missing peer rollup@^1.20.0||^2.0.0
  Peer dependencies that should be installed:
    rollup@">=2.42.0 <3.0.0"
  hint: If you want peer dependencies to be automatically installed, add "auto-install-peers=true" to an .npmrc file a
  t the root of your project.
  hint: If you don't want pnpm to fail on peer dependency issues, add "strict-peer-dependencies=false" to an .npmrc fi
  le at the root of your project.
  ```
