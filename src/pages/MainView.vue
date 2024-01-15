<template>
  <a-layout class="bg-[#141516] w-[100%] h-[100%]">
    <!-- 顶部固定 -->
    <a-layout-header class=" fixed w-[100%] "
      :style="{ background: '#141516', zIndex: 2, height: '125px', padding: '0px' }">
      <Header :isAdmin="isAdmin" ref="headerRef" @setting="openSetting" @editWindow="openEditModal" :userInfo="userInfo"
        @clear="clearMessage" @switchWindow="getHistory" @continuitySwitch="setContinuity" @getWindowList="getWindowList"
        @switchVersion="switchVersion" @closeWindow="closeWindow" />
    </a-layout-header>
    <!-- 内容区域 -->
    <a-layout-content class="overflow-hidden "
      :style="{ position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', background: '#141516', }">
      <div ref="messageRef" class="replay-content m-t-120px text-start color-[#fff] w-[100%] overflow-auto scrollbar1">
        <template v-for="(info, index) in messageList">
          <div v-if="info.title" class=" px-65px px-25px py-30px">{{ info.title }}</div>
          <Answer v-if="info.content" :index="(index + 1)" :data="info.content" :count="messageList.length"></Answer>

        </template>
      </div>
    </a-layout-content>
    <div class="bg-[#000]/40 m-t-120px text-start w-[100%] h-[72vh]" v-if="isLoading">
      <div class="absolute right-[50%] top-[50%]">
        <a-spin tip="加载中..." />
      </div>
    </div>
    <!-- 底部 -->
    <a-layout-footer class="footer_d"
      :style="{ position: 'fixed', zIndex: 9, bottom: '0px', width: '97%', margin: ' 0 20px', background: 'transparent', height: '' }">
      <!-- @pressEnter="sendProblem"  -->
      <a-textarea id="sendTextarea" :bordered="false" v-model:value="value2" :disabled="isInputing"
        :auto-size="{ minRows: 1, maxRows: 1 }"
        class="bg-[#34373E] color-[#ffffff] h-40px  hover:bg-[#34373E] py-25px scrollbar_text p-r-115px"
        placeholder="在此提问，按Ctrl+Entel发送" />
      <a-button v-if="!isSending" type="primary" id="sendBtn"
        class="mx-20px absolute right-50px bottom-40px flex items-center leading-30px z-10" size="large"
        @click="sendProblem" :disabled="isInputing">
        <div class="mr-10px" i-carbon:send-alt-filled></div>发送
      </a-button>
      <a-button type="primary" v-if="isSending" id="stopButton" danger
        class="mx-20px absolute right-50px bottom-40px flex items-center leading-30px z-10" size="large">
        <div class="mr-10px" i-carbon:send-alt-filled></div>中止
      </a-button>
    </a-layout-footer>
  </a-layout>

  <a-modal :open="editModalVisble" class="none_model" @cancel="editModalVisble = false" ok-text="保存" :title="'编辑名称'"
    @ok="editPost" :width="'500px'">
    <a-form :model="editForm" labelAlign="left" class="m-t-30px">
      <a-form-item label="名称：">
        <a-input color='#fff' :maxlength="15" class="h-40px" v-model:value="editForm.talk_name" />
      </a-form-item>
    </a-form>
  </a-modal>

  <setting-modal ref="lineRef" :visible="displayVisible" @open="openRowKey" :list="setkeyList" @delect="delectKey"
    @ok="sumbmitSetKey" @cancel="displayVisible = false"></setting-modal>
  <form-modal ref="FormLineRef" :visible="displayVisible2" @cancel="displayVisible2 = false" @ok="sumbmitSetKey4"
    :form="setkeyData"></form-modal>
</template>

<script  setup>
import { getUserInfoApi } from "../api/user/index";
import { getWindowApi, deleteSeesion, getHistorySessionApi, askQuestion, editSeesion } from "../api/system/index";
import { getSetkeyList, createSetkey, delectSetkey, updateSetkey } from '../api/setkey/index'
import Answer from '../components/content/Answer.vue';
import Header from '../components/header/index.vue'
import SettingModal from '../components/setting/index.vue'
import FormModal from '../components/form/index.vue'
import { ref, onMounted, createVNode } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { useWindowkeyStore, useSessionWindowStore, useUnionId, useSetupStore } from '../store/index'


const displayVisible = ref(false);
const displayVisible2 = ref(false);
const editModalVisble = ref(false);

const userInfo = ref({ name: '', union_id: '' })
const lineRef = ref()
const headerRef = ref()
const setkeyList = ref([])
const setkeyData = ref({ name: '', key: '', value: '' })
const isInputing = ref(false)
const isLoading = ref(false)

const value2 = ref('');
const messageList = ref([])
const windowkeyStore = useWindowkeyStore()
const windowListStore = useSessionWindowStore()
const unionIdStroe = useUnionId()
const setupStore = useSetupStore()
const isAdmin = ref(false)
const isSending = ref(false)
const sse = ref(null)
const askParmas = ref({
  message: '',
  context: '',
  union_id: '',
  talk_id: ''
})

const userParams = ref({
  code: '',
  state: 'STATE',
  act: 'get_login'
})
const windowParams = ref({
  code: '',
  state: 'STATE',
  act: 'get_cate'
})
const listParams = ref({
  code: '',
  action: 'list'
})
const delectParams = ref({
  code: '',
  pkey: '',
  action: ''
})
const historyParams = ref({
  union_id: '',
  talk_id: '',
  act: 'history'
})
const editForm = ref({
  union_id: '',
  talk_name: '',
  act: 'edit_cate',
  talk_id: '',
})
const delectWindowParams = ref({
  talk_id: '',
  union_id: '',
  act: 'del_cate'
})

const messageRef = ref('')



// 获取用户信息
const getUser = async () => {
  userParams.value.code = setupStore.code
  const res = await getUserInfoApi(userParams)
  const { data } = res
  if (data) {
    userInfo.value = data
    unionIdStroe.switchUnionId(data.union_id)
    getWindowList()
  } else {
    isLoading.value = false
  }

}

// 获取窗口列表
const getWindowList = () => {
  windowParams.value.code = setupStore.code
  getWindowApi(windowParams).then((res) => {
    if (res.data) {
      let selected = res.data[0].talk_id
      console.log(delectWindowParams.value.talk_id)
      console.log(windowkeyStore.select)
      // 删除当前的窗口，获取第一个
      if (delectWindowParams.value.talk_id == windowkeyStore.select) {
        // 永远获取第一个
        selected = res.data[0].talk_id
      }
      let row = res.data.find(o => o.talk_id === windowkeyStore.select)
      if (row) {
        selected = windowkeyStore.select
      }
      // if (!windowkeyStore.select) {
      //   let row = res.data.find(o => o.flag === '1')
      //   selected = row ? row.talk_id : '1'
      // }
      windowkeyStore.switchTab(selected)
      windowListStore.sessionList = res.data
      // headerRef.value.xScroll()
      getHistoryAll(selected)

    } else {
      isLoading.value = false
      message.error('获取窗口列表失败')
    }


  });

}


// 回答
const getConten = async () => {

  let url = setupStore.version === 1 ? '/stream.php' : '/stream4.php'
  const sse = new EventSource(import.meta.env.VITE_BASE_URL + url + '?union_id=' + unionIdStroe.union_id + '&talk_id=' + windowkeyStore.select)
  sse.value = sse
  let messageArray = setupStore.message.find(o => o.talk_id === windowkeyStore.select).data
  messageArray.push({ content: '' })
  // const list = []
  sse.onmessage = async (e) => {
    isLoading.value = false
    isSending.value = true
    let domStop = document.getElementById("stopButton")
    if (domStop) {
      domStop.addEventListener("click", function() {
        sse.close();
        isSending.value = false
        isInputing.value = false
      });
    }

    let data = ''
    // 处理收到的消息
    if (e.data === '[DONE]') {
      sse.close()
      isSending.value = false
      isInputing.value = false
      //   for (let i = 0; i < list.length; i++) {
      //     await new Promise(resolve => setTimeout(resolve, 50))
      //     // 处理收到的消息
      //     const last = messageArray.pop()
      //     const lastContent = last.content + list[i]
      //     messageArray.push({ content: lastContent })
      //     messageRef.value.scrollTo(0, messageRef.value.scrollHeight);

      //   }

      return
    }
    // 处理收到的消息
    data = JSON.parse(e.data).choices[0].delta.content
    if (data) {
      // list.push(data)
      const last = messageArray.pop()
      const lastContent = last.content + data
      messageArray.push({ content: lastContent, state: 'success' })
    }
    messageRef.value.scrollTo(0, messageRef.value.scrollHeight);
  }
  sse.onerror = (e) => {
    message.error('连接错误,请联系管理员')
    messageArray.push({ content: '', state: 'error' })
    isInputing.value = false
    isLoading.value = false
    sse.close()
    setTimeout(() => {
      messageRef.value.scrollTo(0, messageRef.value.scrollHeight);
    }, 200)
  };


}


// 发送--提问
const sendProblem = () => {
  if (!value2.value.trim()) {
    message.warning('\n请输入提问内容后再发送\n')
    value2.value = ''
    return
  }
  let context = []
  let messageArray = []
  let resultContent = []
  if (setupStore.message.length) {
    let row = setupStore.message.find(o => o.talk_id === windowkeyStore.select)
    if (row.data) messageArray = row.data
  }
  // 该逻辑只针对连续对话 提问时的入参数据处理   ---start
  if (messageArray && messageArray.length) {
    resultContent = messageArray.reduce((acc, item, index, array) => {
      if (!(item.title && item.content)) {
        if (item.title) {
          acc.push({ title: item.title, content: array[index + 1] && array[index + 1].content ? array[index + 1].content : null });
        }
        if (item.content && item.state === 'error') {
          acc.pop();
        }
      } else {
        acc.push(item)
      }
      return acc;
    }, []);
  }

  askParmas.value.message = value2.value
  askParmas.value.union_id = unionIdStroe.union_id
  askParmas.value.talk_id = windowkeyStore.select
  // 是否开启连续对话
  if (setupStore.continuity && resultContent.length) {
    for (let i = 0; i < resultContent.length; i++) {
      if (resultContent[i].title && resultContent[i].content) {
        context.push([resultContent[i].title, resultContent[i].content])
      }
    }
  }
  askParmas.value.context = JSON.stringify(context.splice(context.length - 3, context.length))
  // ----end
  // version  1 普通版 2 旗舰版
  let url = setupStore.version === 1 ? '/setsession.php' : '/setsession4.php'
  messageArray.push({ title: value2.value })
  value2.value = null
  askQuestion(url, askParmas).then(res => {

    isInputing.value = true
    isLoading.value = true
    messageRef.value.scrollTo(0, messageRef.value.scrollHeight);
    // 错误时关闭loading和按钮禁用
    if (!res.data.success) {
      // 去掉聚焦点 
      const btn = document.getElementById('sendBtn')


      btn.blur()
      message.error(res.data.errmsg ? res.data.errmsg : '操作失败，请联系管理员')
      isLoading.value = false
      isInputing.value = false
      value2.value = '  '
      return
    }
    getConten()

  })
}


// 切换版本
const switchVersion = (key) => {
  setupStore.switchV(key)
}
// 是否连续对话
const setContinuity = (val) => {
  setupStore.switchC(val)
}

// 获取配置信息列表
const openSetting = (val) => {
  listParams.value.action = val === 4 ? 'list4' : 'list'
  listParams.value.code = setupStore.code
  getSetkeyList(listParams).then(res => {
    if (res.data) {

      if (val === 4) {
        setkeyData.value = res.data.data
        displayVisible2.value = true
      } else {
        setkeyList.value = res.data.data
        displayVisible.value = true
      }
    }
  })
}

const ValidUrl = (urlString) => {
  var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
  if (reg.test(urlString)) {
    return true;
  } else {
    return false;
  }
}



// 新增配置信息
const sumbmitSetKey = (form) => {
  if (!form.value.pname.trim()) {
    return message.warning('请输入线路名称')
  }
  if (!form.value.pkey.trim()) {
    return message.warning('请输入查询Key')
  }
  if (!form.value.purl.trim()) {
    return message.warning('请输入接口地址')
  }
  if (!ValidUrl(form.value.purl)) {
    return message.warning('请输入正确的接口地址')
  }
  createSetkey(form).then(res => {
    if (res.status === 200) {
      message.success('添加成功！');
      lineRef.value.resetForm()
      openSetting()
    }
  })
}


// 编辑配置信息4.0
const sumbmitSetKey4 = (form) => {
  if (!form.value.pname.trim()) {
    return message.warning('请输入线路名称')
  }
  if (!form.value.pkey.trim()) {
    return message.warning('请输入查询Key')
  }
  if (!form.value.purl.trim()) {
    return message.warning('请输入接口地址')
  }
  if (!ValidUrl(form.value.purl)) {
    return message.warning('请输入正确的接口地址')
  }

  createSetkey(form).then(res => {
    if (res.status === 200) {
      message.success('保存成功！');
      displayVisible2.value = false
    } else {
      message.error(res.data.errmsg)
    }
  })
}

// 删除配置信息
const delectKey = (key) => {
  delectParams.value.code = setupStore.code
  delectParams.value.pkey = key
  delectParams.value.action = 'delete'
  delectSetkey(delectParams).then(res => {
    if (res.status === 200) {
      message.success('删除成功！');
      openSetting()
    } else {
      message.error(res.data.errmsg)
    }
  })
}

// 开启KEY
const openRowKey = (key) => {
  delectParams.value.code = setupStore.code
  delectParams.value.pkey = key
  delectParams.value.action = 'enable'
  updateSetkey(delectParams).then(res => {
    if (res.status === 200) {
      message.success('启动成功！');
      openSetting()
    } else {
      message.error(res.data.errmsg)
    }
  })
}

// 获取历史记录-查询会话信息列表
const getHistory = (ssid) => {
  let currentSession = setupStore.message.find(item => item.talk_id == ssid)
  messageList.value = []
  messageList.value = currentSession.data
  isLoading.value = false
  setTimeout(() => {
    messageRef.value.scrollTo(0, messageRef.value.scrollHeight);
  }, 20)
}

// 获取历史记录---全部
const getHistoryAll = async (selected) => {
  historyParams.value.union_id = unionIdStroe.union_id
  let session = windowListStore.sessionList

  for (let i = 0; i < session.length; i++) {
    historyParams.value.talk_id = session[i].talk_id
    await getHistorySessionApi(historyParams).then((res) => {
      if (res.data.success) {
        setupStore.setMessage({ talk_id: session[i].talk_id, data: res.data.data })
      } else {
        isLoading.value = false
        message.error(res.data.message)
      }
    });
  }
  getHistory(selected)
}

// 清屏
const clearMessage = () => {
  if (!isInputing.value) {
    setupStore.clear(windowkeyStore.select)
    setupStore.setMessage({ talk_id: windowkeyStore.select, data: [] })
    let currentSession = setupStore.message.find(item => item.talk_id == windowkeyStore.select)
    messageList.value = currentSession.data
  } else {
    message.warning('智能工作助手还在回答，请稍等')
  }
}

// 获取当前url的参数
const init = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  setupStore.setCode(code)
}
const openEditModal = (row) => {
  if (isInputing.value) {
    message.warning('智能工作助手还在回答，请稍等')
    return
  }
  editForm.value.talk_name = row.talk_name
  editForm.value.talk_id = row.talk_id

  editModalVisble.value = true
}

// 发送快捷键设置
const keyDown = () => {
  window.addEventListener("keydown", function(event) {
    // 监听 Ctrl + Enter 可全屏查看
    if (event.ctrlKey && event.keyCode == 13) {
      sendProblem()
    }
  });
}
const lineApiKey = ['list', 'list4']

// 提前查询线路管理--判断是否是管理员
const getPower = () => {
  listParams.value.code = setupStore.code
  lineApiKey.forEach(async (item) => {
    listParams.value.action = item
    await getSetkeyList(listParams).then((res) => {
      isAdmin.value = res.data.success
    });
  })
}
const editPost = () => {
  if (!editForm.value.talk_name.trim()) {
    message.warning('请输入名称')
    return
  }
  editForm.value.union_id = unionIdStroe.union_id
  editSeesion(editForm).then((res) => {
    if (res.data.success) {
      message.success('修改成功')
      editModalVisble.value = false
      getWindowList()
    } else {
      message.error(res.data.message)
    }
  })
}


// 
const closeWindow = (item) => {
  if (isInputing.value) {
    message.warning('智能工作助手还在回答，请稍等')
    return
  }
  delectWindowParams.value.talk_id = item.talk_id
  delectWindowParams.value.union_id = unionIdStroe.union_id
  Modal.confirm({
    title: '提示',
    content: '确认要删除"' + item.talk_name + '"对话窗口吗？',
    okText: '确认',
    cancelText: '取消',
    onOk() {
      if (windowListStore.sessionList.length == 1) {
        message.warning('至少保留一个对话窗口')
        return
      }
      deleteSeesion(delectWindowParams).then((res) => {
        if (res.data.success) {
          message.success('删除成功')
          getWindowList()
        } else {
          message.error(res.data.message)
        }
      })
    }
  });
}


onMounted(async () => {
  isLoading.value = true
  init()
  await getUser()
  keyDown()
  getPower()
  // const antbtn = document.getElementsByClassName('ant-btn')
  // antbtn.blur()
})


</script>

<style>
.ant-btn:not(:disabled):focus-visible,
.ant-switch:focus-visible,
button:focus,
button:focus-visible {
  outline: 2px solid transparent;
}

.ant-modal .ant-modal-content,
.ant-modal .ant-modal-title,
.ant-modal .ant-modal-close {
  background-color: #575D6A;
  color: #fff;
}



/* table */
.ant-input {
  background-color: #23262E;
  border: none;
}

.ant-form-item .ant-form-item-label>label {
  color: #fff;
}

.ant-table-tbody>tr>td {
  background-color: #353942;
  color: #fff;
  border-top: transparent
}

.ant-table-wrapper .ant-table-thead>tr>th {
  color: #fff;
  background-color: #353942;
  border-bottom: 1px solid #ffffff31
}

.ant-table-wrapper .ant-table-thead>tr>td:hover {
  background-color: #353942;
}

.ant-table-wrapper table {
  background: #353942;
  border-radius: 5px
}

.ant-table-wrapper .ant-table-thead>tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
  background-color: transparent
}

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody>tr>td {
  border-top: 1px solid transparent;
}

.ant-input-borderless,
.ant-input-borderless:hover,
.ant-input-borderless:focus,
.ant-input-borderless-focused,
.ant-input-borderless-disabled,
.ant-input-borderless[disabled] {
  background-color: #353942;
}

.ant-table-wrapper .ant-table-tbody>tr.ant-table-row:hover>td,
.ant-table-wrapper .ant-table-tbody>tr>td.ant-table-cell-row-hover,
.ant-table-wrapper .ant-table-tbody>tr.ant-table-row:hover>td,
.ant-table-wrapper .ant-table-tbody>tr>td.ant-table-cell-row-hover {
  background: #23262E;
}

:where(.css-dev-only-do-not-override-1qb1s0s).ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody>tr:last-child>td {
  border: none;

}

.scrollbar1::-webkit-scrollbar,
.scrollbar_text::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.scrollbar1::-webkit-scrollbar,
.scrollbar_text::-webkit-scrollbar {
  width: 5px;
}

.scrollbar1::-webkit-scrollbar-thumb,
.scrollbar_text::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #848484;
}

.scrollbar1::-webkit-scrollbar-track,
.scrollbar_text::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: #353942;
  border: 1px solid #353942;
}

.ant-btn-primary:disabled {
  background-color: #1677ff67;
  color: #fff;
}

.ant-form-horizontal .ant-form-item-label {
  line-height: 40px;
}

.ant-modal-confirm .ant-modal-confirm-body .ant-modal-confirm-title {
  color: #fff;
}

.ant-modal-confirm .ant-modal-confirm-body .ant-modal-confirm-title+.ant-modal-confirm-content {
  color: #fff;
}

.none_model .ant-modal-content .ant-btn-default {
  display: none;
}

.ant-message-notice-content {
  line-height: 50px;
}

/* 可用js优化 */
@media screen and (min-height: 320px) and (max-height: 500px) {
  .replay-content {
    height: 45vh;
  }
}

@media screen and (min-height: 500px) and (max-height: 600px) {
  .replay-content {
    height: 53vh;
  }
}

@media screen and (min-height: 600px) and (max-height: 750px) {
  .replay-content {
    height: 63vh;
  }
}

@media screen and (min-height: 750px) {
  .replay-content {
    height: 70vh;
    background: #141516;
  }
}
</style>