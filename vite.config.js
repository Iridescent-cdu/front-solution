import path, { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹,process.cwd()指node命令执行的地址
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': join(__dirname, '/src'),
    },
  },
  server: {
    proxy: {
      // 代理所有/api的请求
      '/api': {
        target: 'https://api.imooc-front.lgdsunday.club/',
        changeOrigin: true,
      },
    },
  },
})
