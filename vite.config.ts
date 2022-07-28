import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vue-router'],
      dts: "src/auto-import.d.ts",
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
      ],
    }),

  ],

  base: './', // 设置打包路径
  server: {
    port: 3000, // 设置服务启动端口号
    open: false, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    host: '0.0.0.0',

    // 设置代理，根据我们项目实际情况配置
    proxy: {
      '/dev': {
        target: 'http://192.168.32.91:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/dev', '')
      },
      '/mock': {
        target: 'http://42.194.209.27:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/mock', '')
      },
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 设置 `@` 指向 `src` 目录
      '@C': resolve(__dirname, 'src/components'), 
      '@H': resolve(__dirname, 'src/hooks'), 
      '@A': resolve(__dirname, 'src/api'), 
    }
  },
  css: {
    //css预处理
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./public/style/global.scss";'
      }
    }
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    //指定生成静态资源的存放路径
    assetsDir: "/",

    rollupOptions: {
      //打包目录区分优化
      output: {
        chunkFileNames: "static/[name]-[hash].js",
        entryFileNames: "static/[name]-[hash].js",
        assetFileNames: "static/[name]-[hash].[ext]",
      },
    },
  },
})

