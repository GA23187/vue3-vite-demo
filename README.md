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



## <span id="husky">✅ 引入element-plus</span>

### 1.安装

```
npm install element-plus
```

### 2.按需引入(自动导入)

```
npm install -D unplugin-vue-components unplugin-auto-import
```

[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)负责按需引入Vue/Vue Router等官方Api的插件,不需要手动编写`import {xxx} from vue`这样的代码。

[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components#readme)负责vue组件自动引入，就不需要注册引入这写操作了。

### 3.修改vite.config.ts文件

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
      // 顺带配置下vue vue-router pinia的api自动引入
      imports: ['vue', 'vue-router', 'pinia'],
      // 生成下eslint globels配置文件
      eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

###  4.修改tsconfig.json与eslintrc.js文件

让ts认识一下

```tsconfig.json
"include": [
    //...
    "auto-imports.d.ts",
    "components.d.ts"
  ],
```

让eslint认识一下

```eslintrc.js
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
const { globals } = require('./.eslintrc-auto-import.json')

module.exports = {
  // ...
  globals
}
```

### 5.全局配置(按需引入下)

```
<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
console.log(import.meta.env)
const elementConfig = reactive({
  size: 'small',
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

```

### 7.Icon 图标自动引入

1、安装 这一步也可以不进行，因为element-plus中的依赖有它

```
npm install @element-plus/icons-vue
```

2、使用 [unplugin-icons](https://github.com/antfu/unplugin-icons) 和 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 从 iconify 中自动导入任何图标集

```
npm i -D unplugin-icons
```

3、修改vite.config.ts文件

```typescript
// ...
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// icon图标自动引入
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const isBuild = command === 'build'
  return defineConfig({
    plugins: [
      // ...
      AutoImport({
        resolvers: [
          ...
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],
      ...
      }),
      Components({
        resolvers: [
          ...
          // 自动注册图标组件
          IconsResolver({
            // prefix: 'Icon', // default: 'I'
            enabledCollections: ['ep']
          })
        ]
      }),
      // 自动安装@iconify-json/ep
      Icons({
        autoInstall: true
      })
    ],
}
```

4、使用时无需import，在[官方图标集合](https://element-plus.gitee.io/zh-CN/component/icon.html#图标集合)中标识的图标名前追加前缀**IEp**即可使用

```
<IEpEdit/>
```

5、修改tsconfig.json文件  解决components.d.ts中自动添加的IEpEdit: typeof import('~icons/ep/edit')['default']提示找不到类型定义问题

```
   compilerOptions:{
    "types": ["unplugin-icons/types/vue"]
   } 
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

## ✅ axios 配置

### 1.安装

```
npm i axios
```

### 2.基本封装

### 3.TODO

自动重试 取消请求 取消重复请求



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



## echarts使用

### 1.安装

```
npm install echarts --save
```

### 2.引入

[按需引入](https://echarts.apache.org/handbook/zh/basics/import/#%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5-echarts-%E5%9B%BE%E8%A1%A8%E5%92%8C%E7%BB%84%E4%BB%B6)

```
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// 接下来的使用就跟之前一样，初始化图表，设置配置项
var myChart = echarts.init(document.getElementById('main'));
myChart.setOption({
  // ...
});
```

[在typescript中按需引入](https://echarts.apache.org/handbook/zh/basics/import/#在-typescript-中按需引入)

```
import * as echarts from 'echarts/core';
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  // 数据集组件
  DatasetComponent,
  DatasetComponentOption,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

const option: ECOption = {
  // ...
};
```

### 3.使用



### 世界地图实现

> 核心地图数据的获取
>
> 1.在网上找现成的
>
> 2.自定义编辑geojson.io](https://link.juejin.cn/?target=http%3A%2F%2Fgeojson.io%2F)

没有找到那种全国地区 并且还有城市的

#### 地图下钻

[vue + echarts实现中国地图省份下钻联动](https://juejin.cn/post/7082686310166560799)

[学会这招！地图随便下钻](https://juejin.cn/post/7154391888433250312)

https://juejin.cn/post/7085536087078076430

https://juejin.cn/post/7073404324587503630

https://juejin.cn/post/7029132275736395784

https://juejin.cn/post/6994606112775340039



#### 地图区域高亮

- Vue环境下用ECharts绘制中国地图，并实现拖动、缩放与各省份自动轮播高亮显示https://majinjian.blog.csdn.net/article/details/121823421
-  echarts 绘制中国地图后加气泡以及亮点https://github.com/ecomfe/echarts-for-weixin/issues/675
- echarts地图城市散点图https://blog.csdn.net/weixin_41187842/article/details/81261072



## 富文本编辑器

> 选型
>
> 1.[vue-quill](https://vueup.github.io/vue-quill/) vue3版本的
>
> 2.wangeditor

### 1.安装

 ```
npm install @vueup/vue-quill@latest --save
 ```

### 2.使用

- 全局组件方式

  ```
  import { createApp } from 'vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  
  const app = createApp()
  app.component('QuillEditor', QuillEditor)
  ```

- 单文件组件方式

  ```
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  
  export default {
    components: {
      QuillEditor
    }
  }
  ```

- 目前使用发现提供的`v-model`不好使，无法赋值，暂时使用其提供的实例方法来赋值与取值

  ```
  editorRef.value.setContents(delta)
  editorRef.value.getContents()
  ```




## 国际化i18n

### 1.安装

```
npm install vue-i18n -S
```

### 2.注册

- 创建`locales`文件夹，用于维护多语言,下面创建`lang`文件夹存放对应语言文件

  ```
  ├─.vscode
  ├─public
  └─src
      ├─assets
      ├─components
      └─locales //新建 
      ├─   └─lang
      ├─   	└─ 	en
      ├─      	├─index.ts
      ├─   	└─ 	zh
      ├─      	├─index.ts
      ├─ index.ts  
  ```

  ```
  // zh/index.ts
  export default {
    login: '登录',
    userName: '用户名',
    password: '密码'
  }
  ```

  ```
  // en/index.ts
  export default {
    login: 'login',
    userName: 'userName',
    password: 'password'
  }
  ```

  ```
  import en from './en'
  import zh from './zh'
  
  export default {
    en,
    zh
  }
  ```

  

  ```
  // index.ts
  import { createI18n } from 'vue-i18n'
  import messages from './lang'
  
  const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言
  const i18n = createI18n({
    locale: localStorage.getItem('lang') || language.split('-')[0] || 'en', // 首先从缓存里拿，没有的话就用浏览器语言，
    fallbackLocale: 'en', // 设置备用语言
    messages
  })
  
  export default i18n
  ```

- 最后在`main.ts`中引入使用

  ```
  import i18n from './locales'
  //...
  app.use(i18n)
  ```

### 3.使用

- 在`<template>`中

  要用到一个`$t()`的方法，或者使用`v-t`也行

  ```vue
  <div>
      {{`$t('login.userName')`}}
  </div>
  <div v-t="'login.password'"></div>
  复制代码
  ```

  关于`$t()`还有很多用法，可以动态传参等，具体参考官网](https://vue-i18n.intlify.dev/guide/advanced/composition.html)

- 在`<setup>`中

  ```
  <script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  
  const { t } = useI18n()
  
  console.log(t('login.useName'))
  </script>
  ```

  > 这里可以配置自动引入 可以减少`import { useI18n } from 'vue-i18n'`

- 在`普通ts文件`中

  引入自己创建的 i18n 对象即可。

  ```
  import i18n from '@/locales'
  const { locale, t } = i18n.global
  ```

- 切换语言

  `vue-i18n`提供了一个全局变量`locale`，直接修改即可

  ```
  <template>
  	<div class="menu">
      	<div class="menu-item" @click="changeLang('en')">English</div>
      	<div class="menu-item" @click="changeLang('zh')">中文</div>
      </div>
  </template>
  <script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { locale } = useI18n()
  
  const changeLang = (lang: string) => {
    locale.value = lang
    localStorage.setItem('lang', lang)
  }
  </script>
  ```

### 4.VSCode i18n Ally插件

> 方便翻译

- 安装完成后，会在目录下生成`.vscode/settings.json`文件(如果没有这个文件的话)，并自动添加其配置

  ```json
    "i18n-ally.localesPaths": ["src/locales/lang"]
    "i18n-ally.keystyle": "nested",
  "i18n-ally.enabledParsers": ["ts", "json"],
    "i18n-ally.sourceLanguage": "en",
    "i18n-ally.displayLanguage": "zh",
    "i18n-ally.enabledFrameworks": ["vue", "react"]
  ```
  
  其他配置可参考[文档](https://github.com/lokalise/i18n-ally/wiki/Configurations)
  
- 重启vscode,在右侧会出现i18n Ally的图标

- 发现没有翻译，打开vscode终端面板，切到i18n Ally发现出现如下错误

  ```
  🐛 ERROR: Error: connect ECONNREFUSED 127.0.0.1:7890
  Error: connect ECONNREFUSED 127.0.0.1:7890
  	at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1157:16)
  [object Object]
  ```

  和本机使用的Clash代理端口冲突了。

### 5.问题

1. `Uncaught SyntaxError: Not available in legacy mode`

   ```
   legacy:false
   ```

   https://blog.csdn.net/sinat_36728518/article/details/123661673

2. `You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with        boolean literals to get proper tree-shaking in the final bundle.`

   ```
    alias: {
       'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
     },
   ```

   https://segmentfault.com/a/1190000042062141

### 参考

- [vue3实现国际化](https://juejin.cn/post/7094916084838432781)
- [Vue国际化搭配 VSCode i18n Ally插件使用初体验](https://juejin.cn/post/7034344923247837198)



## 前端execl导入导出

> 1.xlsx
>
> `xlsx` 是前端最热门的 `Excel` 导出方案，又叫做 `SheetJS`，默认不支持修改 `Excel` 的样式。
>
> 若在工作业务需求上需要修改 `Excel` 的样式的话需要使用该作者的付费版本。或者使用 `xlsx-style`，但使用起来非常麻烦，需要修改 `node_modules` 源码，而且作者最近的提交的版本也在 6 年前，不建议使用。
>
> 2.exceljs(推荐)
>
> `exceljs` 是一款可导出，可读取的 `Excel` 操作工具，可以实现样式的修改以及 `Excel` 的高级功能，是非常值得推荐的一个处理 `Excel` 的库，并且有[中文文档](https://github.com/exceljs/exceljs/blob/master/README_zh.md)可以查阅。不过，看最近都没人维护了(2023/01/07)

### 1.安装

exceljs 同于写入 Excel，file-sever 用于保存到本地文件

```cmd
npm install exceljs file-saver
```

### 2.使用

#### 2.1导入

- 读取到文件流`workbook.xlsx.load(file.raw)`
- 提前工作表 `result.getWorksheet(1)`
- 遍历组合得到想要的数据



- [ExcelJS 在前端浏览器中读取 Excel 文件内容](https://github.com/Dream4ever/Knowledge-Base/issues/142#top)
- [ExcelJS 前端的excel导入导出](https://www.jianshu.com/p/fc96e22c4df1)

#### 2.2导出

TODO 

- [前端复杂表格一键导出看这篇就够了（附源码）](https://zhuanlan.zhihu.com/p/526658433)

### 3.参考

[这一定是前端导出Excel界的天花板！](https://mdnice.com/writing/87320eb3b53a4f83adcf6b53b416782e)



## vite集成https

目前由于vite版本是2，所以可以直接通过在启动时添加`--https`，以下操作是vite2以上环境下进行的。

> A valid certificate is needed when using `https`. In Vite v2, if no certificate was configured, a self-signed certificate was automatically created and cached. Since Vite v3, we recommend manually creating your certificates. If you still want to use the automatic generation from v2, this feature can be enabled back by adding [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) to the project plugins.
>
> 详情可见 https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation

直接修改启动命令为`"dev": "vite --mode development --https"`，启动后会是https开头的地址，但是打开页面后会提示：

```
127.0.0.1 使用了不受支持的协议。
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

###  方式一

#### 生成证书

- 使用mkcert 进行配置证书

  ```bash
  npm i mkcert -g
  ```

- 生成ca证书

  ```bash
  cd [project_folder] # 进入项目
  mkdir keys  # 新建文件夹存储证书相关
  cd keys
  mkcert create-ca [options] # options 参考npm 文档，可以直接使用默认值
  ```

- 根据ca证书生成cert证书

  详情见https://github.com/FiloSottile/mkcert

  ```bash
  # 如下设置domains
  mkcert create-cert --domains 127.0.0.1,localhost
  ```

- 安装证书

  双击ca.crt，在弹出的对话框中点击“安装证书，在弹出框中，选择“本地计算机”，点击"下一步"，在弹出框中，选择“将所有证书都放入下列存储（P）”，选择“浏览”；在弹出框中选择“受信任的根证书颁发机构”，点击“确定”。点击“下一步”。

  在随后的弹窗中点击确定，会提示“导入成功”，最后点击“确定”，再点击“确定”就可以了。

#### 使用证书

- 修改vite配置

  ```ts
  import path from 'path'
  import * as fs from 'fs'
  
  export default defineConfig({
    server: {
      https: {
        cert: fs.readFileSync(path.join(__dirname, 'keys/cert.crt')),
        key: fs.readFileSync(path.join(__dirname, 'keys/cert.key')),
      },
    },
  })
  ```

然后就可以了。

#### 参考

- [Vue本地开发集成https](https://zhuanlan.zhihu.com/p/591217700) 还有vue2的

### 方式二使用plugin-basic-ssl 插件

#### 安装

```
npm i -D @vitejs/plugin-basic-ssl
```

#### 使用

```
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
 plugins: [basicSsl()]
}
```

然后就可以了，不用修改其他的东西，但是第一次还是会有提示风险，方式一就没事。

#### 参考

https://github.com/vitejs/vite/issues/9311

## vite插件

### 压缩文件工具

#### vite-plugin-zip-file(vite3)

https://github.com/Ssis53/vite-plugin-zip

```
npm install vite-plugin-zip-file --save-dev
```

注意该插件peerDependencies的 vite版本是^3.0.7,目前项目vite版本是2.9.15，在nodev16版本下直接安装会报错

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: ga23ui@0.0.0
npm ERR! Found: vite@2.9.15
npm ERR! node_modules/vite
npm ERR!   dev vite@"^2.8.0" from the root project
npm ERR!
npm ERR! Could not resolve dependency:
npm ERR! peer vite@"^3.0.7" from vite-plugin-zip-file@1.0.2
npm ERR! node_modules/vite-plugin-zip-file
npm ERR!   dev vite-plugin-zip-file@"*" from the root project
npm ERR!
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

安装提示可以通过在后面加上`--legacy-peer-deps`解决，但是不太推荐，目前项目使用vite2暂不升级所以没有使用这个插件。

#### vite-plugin-zip-pack

https://github.com/7th-Cyborg/vite-plugin-zip-pack

```
npm i -D vite-plugin-zip-pack
```

使用

```
import zipPack from 'vite-plugin-zip-pack'

 plugins: [
      zipPack({
        inDir: './dist',
        outDir: './',
        outFileName: 'dist.zip'
      })
 ]
```



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

- 重新npm i后，其中`pinia-plugin-persistedstate`插件安装了最新版本，其中1.4.0版本移除了`overwrite `选项，导致ts提示错误。

  ​    https://github.com/prazdevs/pinia-plugin-persistedstate/blob/main/CHANGELOG.md#140-2022-03-06

## ❎一些问题❌

```
https://github.com/vitejs/vite/discussions/7574
使用vue-devtools 并调用了const { appContext } = getCurrentInstance()
```



git commit校验失败后，把修改的文件给删除了

```
$ git commit -m '添加execljs插件实现前端导入execl(TODO execl导出)'
[STARTED] Preparing lint-staged...
[SUCCESS] Preparing lint-staged...
[STARTED] Running tasks for staged files...
[STARTED] .lintstagedrc.json — 8 files
[STARTED] **/*.{js,ts,tsx,jsx,vue,scss,css} — 5 files
[STARTED] prettier --write "src/**/*.ts" "src/**/*.vue"
[SUCCESS] prettier --write "src/**/*.ts" "src/**/*.vue"
[STARTED] eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix
[FAILED] eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix [FAILED]
[FAILED] eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix [FAILED]
[SUCCESS] Running tasks for staged files...
[STARTED] Applying modifications from tasks...
[SKIPPED] Skipped because of errors from tasks.
[STARTED] Reverting to original state because of errors...
[FAILED] <stdin>:46: trailing whitespace.
[FAILED] TODO
[FAILED] warning: 1 line adds whitespace errors.
[FAILED] Unstaged changes after reset:
[FAILED] M      components.d.ts
[FAILED] error: Your local changes to the following files would be overwritten by merge:
[FAILED]        components.d.ts
[FAILED] Please commit your changes or stash them before you merge.
[FAILED] Aborting
[FAILED] Index was not unstashed.
[STARTED] Cleaning up temporary files...
[SKIPPED]
[SKIPPED]   × lint-staged failed due to a git error.

  × lint-staged failed due to a git error.
  Any lost modifications can be restored from a git stash:

    > git stash list
    stash@{0}: automatic lint-staged backup
    > git stash apply --index stash@{0}


× eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix:

E:\code\myProject\vue3-vite-demo\src\plugin\execl\index.js
   62:18  error  'datenum' is not defined            no-undef
  109:3   error  'setCoverBorder' is not defined     no-undef
  180:20  error  'getColumnMaxWidth' is not defined  no-undef
  187:3   error  'saveExcel' is not defined          no-undef

E:\code\myProject\vue3-vite-demo\src\test\testEcharts\index.vue
  9:24  warning  Forbidden non-null assertion  @typescript-eslint/no-non-null-assertion

✖ 5 problems (4 errors, 1 warning)

husky - pre-commit hook exited with code 1 (error)

```

