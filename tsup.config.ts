import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],  // 產出 ESM & CJS
  dts: true,               // 生成 .d.ts 型別定義
  splitting: false,
  sourcemap: true,
  clean: true,
});