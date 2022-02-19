/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_ENV: string; // 环境
  readonly VITE_OUTPUT_DIR: string; // 打包目录
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
