/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-26 08:41:53
 * @FilePath: \gtp\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  server: {
    host: '0.0.0.0'
  },
  define: {
    'process.env': process.env
  }
})