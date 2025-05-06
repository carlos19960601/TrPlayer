import os from "os";
import path from "path";
import { defineConfig } from 'vite';
import { viteStaticCopy } from "vite-plugin-static-copy";
import { external } from "./vite.base.config";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      fileName: () => '[name].js',
      formats: ["es"]
    },
    rollupOptions: {
      external: [
        ...external,
      ]
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: `lib/whisper/${process.env.PACKAGE_OS_ARCH || os.arch()
            }/${os.platform()}/*`,
          dest: "lib/whisper",
        },
        {
          src: "src/main/db/migrations/*",
          dest: "migrations"
        }
      ]
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@main": path.resolve(__dirname, "./src/main"),
      "@commands": path.resolve(__dirname, "./src/commands"),
    }
  }
});
