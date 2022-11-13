import { defineConfig, UserConfigExport, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// jsx支持
import vueJsx from '@vitejs/plugin-vue-jsx'
// path 模块是 node.js 内置的 不支持ts 需要安装@types/node
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import zipPack from 'vite-plugin-zip-pack'
// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
// 组件按需引入
import Components from 'unplugin-vue-components/vite'
// element-plus解析器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// icon图标自动引入
import Icons from 'unplugin-icons/vite'
// icon图标解析器
import IconsResolver from 'unplugin-icons/resolver'

/**
 * 根据环境变量设置输出目录
 * @param mode 环境变量
 * @returns
 */
function handleOutDirByMode(mode) {
  console.log('环境', mode)
  return 'dist'
}

// https://vitejs.dev/config/
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const isBuild = command === 'build'
  return defineConfig({
    plugins: [
      vue(),
      vueJsx({
        include: /\.(jsx|tsx)/
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `
      }),
      zipPack({
        inDir: './dist',
        outDir: './',
        outFileName: 'dist.zip'
      }),
      AutoImport({
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver()
          // 自动导入图标组件
          // IconsResolver({
          //   prefix: 'Icon'
          // })
        ],
        // 自动导入 Vue vue-router pinia相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'pinia'],
        // 生成上面自动导入的api对应的eslint globals文件
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
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
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/style/mixin.scss";
          @import "@/style/variables.scss";
          `
        }
      }
    },
    server: {
      host: '0.0.0.0'
    },
    build: {
      sourcemap: true,
      outDir: handleOutDirByMode(mode),
      cssCodeSplit: false, // 禁用 CSS 代码拆分,将整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      brotliSize: false, // 关闭打包计算
      target: 'esnext',
      // minify: "esbuild", // 混淆器，terser构建后文件体积更小 ,esbuild默认打包格式
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
