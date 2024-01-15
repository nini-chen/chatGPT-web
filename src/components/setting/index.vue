<!--
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-29 15:18:27
 * @FilePath: \gtp\src\components\setting\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <a-modal :open="visible" @cancel="handleCancel" ok-text="添加新路线" :title="'3.5版KEY配置信息'" @ok="handleSubmit"
    :width="'1000px'">
    <a-table :columns="columns" :data-source="list" class="mt-30px">


      <template #flag="{ text: flag }">
        <span>
          <a-tag class="bg-[#575D6A] border-none" :class="tag === '1' ? 'color-[#3AFF73]' : 'color-[#FFEC57]'"
            v-for="tag in flag" :key="tag">
            {{ tag === '1' ? '已启用' : '未启用' }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a v-if="record.flag === '0'" color="#00A7FF" @click="handleOpen(record.key)">启用</a>
          <a-divider type="vertical" />
          <a color="#FF7676" @click="handleDelect(record.key)">删除</a>
        </span>
      </template>
    </a-table>
    <a-form :model="form" :label-col="labelCol" labelAlign="left" ref="formRef" :wrapper-col="wrapperCol"
      class="m-t-30px">
      <a-form-item label="线路名称：" name="pname">
        <a-input color='#fff' class="h-40px" placeholder="请输入线路名称" v-model:value="form.pname" />
      </a-form-item>
      <a-form-item label="查询Key：" name="pname">
        <a-input color='#fff' class="h-40px" placeholder="请输入查询Key" v-model:value="form.pkey" />
      </a-form-item>
      <a-form-item label="接口地址：" name="pname">
        <a-input color='#fff' class="h-40px" placeholder="请输入接口地址" v-model:value="form.purl" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
const props = defineProps({
  visible: Boolean,
  list: Array
})
import { ref } from 'vue';
import { useSetupStore } from '../../store/index'

const labelCol = ref({ span: 2 });
const wrapperCol = ref({ span: 22 });
const formRef = ref();
const setupStore = useSetupStore()
const columns = [
  {
    title: '线路名称',
    dataIndex: 'name',
    key: 'name',
    width: 200
  }, {
    title: 'key/接口',
    dataIndex: 'url',
    key: 'url',
    customRender: (record) => {
      const keyUrl = `${record.record.key}\n${record.record.url}`;
      return keyUrl;
    },
    width: 500
  },
  {
    title: '状态',
    key: 'flag',
    dataIndex: 'flag',
    slots: { customRender: 'flag' },
    width: 100
  }, {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    width: 200
  },]
const form = ref({
  code: '',
  pname: '',
  pkey: '',
  purl: '',
  action: 'save'
})


const emits = defineEmits(['cancel', 'ok', 'delect', 'open'])

const handleCancel = () => {
  emits('cancel')
}
const handleSubmit = () => {
  form.value.code = setupStore.code

  emits('ok', form)
}
const handleDelect = (key) => {
  emits('delect', key)
}
const handleOpen = (key) => {
  emits('open', key)
}
const resetForm = () => {
  // formRef.value.resetFields();
  form.value = {
    code: setupStore.code,
    pname: '',
    pkey: '',
    purl: '',
    action: 'save'
  }
}
defineExpose({
  resetForm
})
</script>
<style>
.ant-table-pagination.ant-pagination {
  display: none;
}

.ant-table::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.ant-table::-webkit-scrollbar {
  width: 5px;
}

.ant-table::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #353942;
}

.ant-table::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: #848484;
  border: 1px solid #848484;
}

.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody>tr:last-child>td {
  border-bottom: transparent
}
</style>