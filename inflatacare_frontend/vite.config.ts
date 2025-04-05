import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {NodeGlobalsPolyfillPlugin} from '@esbuild-plugins/node-globals-polyfill'
import {NodeModulesPolyfillPlugin} from "@esbuild-plugins/node-modules-polyfill";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true
                }),
                NodeModulesPolyfillPlugin()
            ]
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    }
})