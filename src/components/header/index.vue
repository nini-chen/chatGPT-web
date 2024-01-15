<template>
  <div class="leading-11 color-[#fff]">
    <div class="flex items-center h-70px px-10px">
      <div class="min-w-[500px] flex">
        <div class="text-white mx-20px flex  items-center">
          <div i-material-symbols:account-circle class="h-10 w-10 m-r-10px"></div><span class="text-2xl w-[100%]">
            {{ userInfo.name }}</span>
        </div>
        <div class="flex bg-[#1F2022] h-40px leading-40px mr-30px">
          <div class="px-10px flex items-center cursor-pointer hover:color-[#4096ff]"
            :class="version === 1 && 'bg-[#6b6e74] font-semibold'" @click="switchVersion(1)">
            <div i-material-symbols:navigation :class="version === 1 && 'color-[#00FF5E]'"></div>普通版
          </div>
          <div class="px-10px items-center cursor-pointer hover:color-[#4096ff]"
            :class="version === 2 && 'bg-[#6b6e74] font-semibold'" @click="switchVersion(2)">
            <img src="../../assets/images/horn.png" v-if="version === 2" />
            <img src="../../assets/images/horn_d.png" v-else />
            旗舰版
          </div>
        </div>
        <!-- 新建对话 -->
        <a-popconfirm :icon="false" placement="bottomLeft" ok-text="确定" cancel-text="取消" @confirm="createWindow">
          <template #title>
            <div class="pb-10px">新建对话</div>
            <a-input class="w-[296px] mb-10px" size="large" :maxlength="15" v-model:value="name" :bordered="false"
              placeholder="请输入对话名称" />
          </template>
          <a-button ghost class="mx-20px" size="large"><template #icon>
              <PlusOutlined />
            </template>对话</a-button>
        </a-popconfirm>
      </div>

      <div class="items-center color-[#fff]  flex  w-[70%]">
        <!-- <div i-ph:caret-left-light class="w-[50px] z-10" @click="scrollLeft"></div> -->
        <ul class="flex list-none justify-start overflow-auto scrollbar_d scrollbar1 p-l-0 m-0 pr-6%"
          v-if="windowListStore.sessionList.length">
          <li class=" group  w-[100%]  rounded flex items-center  cursor-pointer mr-10px hover:bg-[#2b2e32a3] pl-10px"
            v-for="item in windowListStore.sessionList"
            :class="item.talk_id === windowkeyStore.select && 'bg-[#353942] mr-20px px-10px hover:bg-[#353942]'"
            @click="checkedWindow(item.talk_id)" :key="item.talk_id">
            <img src="../../assets/images/session.png" class="w-24px h-24px mr-10px m-r-5px" />
            <span class="min-w-[50px] max-w-[100px]] hover:color-[#4096ff] text-left truncate ...">
              {{ item.talk_name }}
            </span>

            <div i-ri:edit-line class=" hover:color-[#4096ff] w-[18px]  m-l-5px
            h-[18px] z-10 right-20px top-3px
            hidden gropup-hover:block group-hover:animate-pulse group-hover:block" @click.stop="editSession(item)">
            </div>
            <div i-material-symbols-light:delete-outline class=" hover:color-[#4096ff]  m-l-5px
             w-[20px] h-[20px] z-10 right-0 top-3px 
            hidden gropup-hover:block  group-hover:block" @click.stop="closeSession(item)">
            </div>
            <!-- <div i-material-symbols:edit-square-outline class=" hover:color-[#4096ff] w-[30px] 
            h-[30px] z-10 right-20px top-3px
            hidden gropup-hover:block group-hover:animate-pulse group-hover:block" @click.stop="editSession(item)">
            </div> -->
          </li>
        </ul>
        <!-- <div i-solar:alt-arrow-right-linear class="w-[50px]" @click="scrollRight"></div> -->
      </div>

    </div>
    <div class="flex bg-[#23262E] text-white justify-between px-30px leading-48px">
      <div>连续对话<a-switch v-model:checked="checked" class="ml-15px" @change="emits('continuitySwitch', checked)" /></div>
      <div class="flex">
        <div class="mx-20px flex items-center cursor-pointer hover:color-[#4096ff]" @click="emits('clear')">
          <div class="m-r-10px" i-tdesign:clear-formatting></div>清屏
        </div>
        <div class="mx-20px flex items-center cursor-pointer hover:color-[#4096ff]" v-if="isAdmin"
          @click="emits('setting', 3.5)">
          <div class="m-r-10px" i-gis:globe-o></div>线路管理
        </div>
        <div class="mx-20px flex items-center cursor-pointer hover:color-[#4096ff]" v-if="isAdmin"
          @click="emits('setting', 4)">
          <div class="m-r-10px" i-gis:globe-o></div>线路管理4.0
        </div>
        <div class="mx-20px flex items-center cursor-pointer hover:color-[#4096ff]" @click="erroeReport">
          <div class="m-r-10px" i-material-symbols-light:work-alert-outline></div>异常上报
        </div>
      </div>
    </div>

  </div>
  <a-modal v-model:open="open" class="none_model" title="提示" @ok="handleOk" ok-text="确定" :cancel-text="false">
    <p>{{ modalText }}</p>
  </a-modal>
</template>
<script setup>
const props = defineProps({
  userInfo: {
    type: Object,
    default: { name: '' }
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue'
import { createWindowApi, errorReport } from '../../api/system/index'
import { useWindowkeyStore, useSessionWindowStore, useUnionId } from '../../store/index'

const name = ref('')
const modalText = ref('')
const open = ref(false)
const checked = ref(true);
const version = ref(1)
const emits = defineEmits(['editWindow', 'closeWindow', 'setting', 'switchWindow', 'getWindowList', 'switchVersion', 'clear', 'continuitySwitch'])
const windowkeyStore = useWindowkeyStore()
const windowListStore = useSessionWindowStore()
const unionIdStore = useUnionId()
const activeTab = ref(0)
const content = ref(null)
const wParams = ref({
  talk_name: '',
  union_id: '',
  act: 'add_cate'
})
const errorParams = ref({
  union_id: '',
  act: 'report'
})


// watch(activeTab, () => {
//   if (content.value) {
//     content.value.scrollTop = 0;
//   }
// });

// 创建窗口
const createWindow = function() {
  if (!name.value.trim()) {
    message.warning('请输入聊天窗口名称')
    return
  }
  wParams.value.talk_name = name.value
  wParams.value.union_id = unionIdStore.union_id
  if (windowListStore.sessionList.length + 1 > 10) {
    modalText.value = '已超出创建聊天窗口限制'
    name.value = ''
    open.value = true;
    return
  }

  createWindowApi(wParams).then(res => {
    if (res.data.success) {
      message.success('创建成功')
      emits('getWindowList')
    } else {
      message.error(res.data.message)
    }

  })
  setTimeout(() => {
    name.value = ''
  }, 100);
}
// 滚动
const xScroll = () => {
  console.log('---滚动')
}
// 选中会话窗口
const checkedWindow = (key) => {
  windowkeyStore.switchTab(key)
  emits('switchWindow', key)
}
const editSession = (item) => {
  emits('editWindow', item)
}

const closeSession = (item) => {
  emits('closeWindow', item)
}
// 切换版本
const switchVersion = (current) => {
  version.value = current
  emits('switchVersion', current)
}
// 异常上报
const erroeReport = () => {
  errorParams.value.union_id = unionIdStore.union_id
  errorReport(errorParams).then(res => {
    if (res.data.success) {
      modalText.value = '上报成功！请在10秒后刷新页面即可生效。'
      open.value = true;
    } else {
      message.error('操作异常，请联系管理员')
    }
  })
}
const scrollLeft = () => {
  if (windowkeyStore.select < windowListStore.sessionList.length - 1) {
    activeTab.value++
  }
}
const scrollRight = () => {
  if (windowkeyStore.select > 0) {
    activeTab.value--
  }
}
const handleOk = () => {
  open.value = false;

};
defineExpose({
  xScroll
})
</script>
<style>
:where(.css-dev-only-do-not-override-1ugq3w3).ant-switch {
  background-color: #5a5a5a;
}

.ant-radio-button-wrapper {
  color: #ffffff8a;
  background-color: #1F2022;
  border-color: #1F2022;
}

.ant-radio-button-wrapper:hover {
  background-color: #1F2022;
  border-color: #1F2022;
  color: #fff
}

.ant-radio-group-solid .ant-radio-button-wrapper-checked:hover {
  background-color: #1F2022;
  border-color: #1F2022;
  color: #fff
}

.ant-radio-group-solid :where(.css-dev-only-do-not-override-1qb1s0s).ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff;
  background-color: #353942;
  border-color: #353942;
}

.ant-popconfirm .ant-popconfirm-message {
  color: #fff;
}

.ant-popover .ant-input {
  color: #fff;
  background-color: #23262E;

}

.ant-popover .ant-popover-inner {

  background-color: #575D6A;
}

.ant-popover {
  --antd-arrow-background-color: #575D6A
}

.ant-popover .ant-btn-default {
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}

:where(.css-dev-only-do-not-override-1qb1s0s).ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td {
  background-color: #353942;
}

.ant-empty-description {
  color: #fff;
}

.ant-input::placeholder {
  color: #eeeeeeaf;
}
</style>