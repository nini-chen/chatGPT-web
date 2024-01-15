/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-18 15:09:05
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-25 23:38:57
 * @FilePath: \vite-project\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createApp
} from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router'
import 'virtual:uno.css';
import 'ant-design-vue/dist/reset.css';

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(router)
app.use(Antd)
app.use(pinia)

app.mount('#app')