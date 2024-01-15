/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2024-01-02 18:13:42
 * @FilePath: \gtp\src\store\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-26 10:03:22
 * @FilePath: \gtp\src\store\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// stores/counter.js
import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'
export const useSetupStore = defineStore(
  'setupStore',
  () => {
    const version = ref(1)
    const continuity = ref(true)
    const code = ref(false)
    const message = ref([])
    const setMessage = (arr) => {
      message.value.push(arr)
    }
    const clear = (ssid) => {
      let index = message.value.findIndex(v => v.talk_id === ssid);
      message.value.splice(index, 1);

    }
    const switchV = (key) => {
      version.value = key
    }
    const setCode = (key) => {
      code.value = key
    }
    const switchC = (key) => {
      continuity.value = key
    }
    return {
      continuity,
      version,
      switchV,
      switchC,
      setCode,
      code,
      setMessage,
      message,
      clear
    }
  },
)
export const useWindowkeyStore = defineStore(
  'windowStore',
  () => {
    const select = ref('1')
    const switchTab = (index) => {
      select.value = index
    }
    return {
      select,
      switchTab,
    }
  }, {
    persist: true,
  },
)
export const useUnionId = defineStore(
  'union_id',
  () => {
    const union_id = ref(null)
    const switchUnionId = (key) => {
      union_id.value = key
    }
    return {
      union_id,
      switchUnionId
    }
  }, {
    persist: true,
  },
)
export const useSessionWindowStore = defineStore(
  'windowListStore',
  () => {
    const sessionList = ref([{
      key: 1,
      name: '默认会话1'
    }])
    const creatSeeion = (obj) => {
      sessionList.value.push(obj)
    }
    return {
      sessionList,
      creatSeeion
    }
  }, {
    persist: true,
  },
)