import { defineConfig, UserConfigExport, ConfigEnv } from "vite";
import vue from "@vitejs/plugin-vue";
// jsx支持
import vueJsx from "@vitejs/plugin-vue-jsx";
// path 模块是 node.js 内置的 不支持ts 需要安装@types/node
import { resolve } from "path";
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const isBuild = command === "build";
  return defineConfig({
    plugins: [
      vue(),
      vueJsx({
        include: /\.(jsx|tsx)/,
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: "mock",
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `,
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/style/mixin.scss";
          @import "@/style/variables.scss";
          `,
        },
      },
    },
    server: {
      host: "0.0.0.0",
    },
  });
};
