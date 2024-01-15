<!--
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-26 20:57:07
 * @FilePath: \gtp\src\components\setting\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <a-modal :open="visible" @cancel="handleCancel" ok-text="保存" :title="'4.0版KEY配置信息'" @ok="handleSubmit" :width="'650px'">
    <a-form :model="form" :label-col="labelCol" labelAlign="left" ref="formRef" :wrapper-col="wrapperCol"
      class="m-t-30px">
      <a-form-item label="线路名称：">
        <a-input color='#fff' class="h-40px" v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="查询Key：">
        <a-input color='#fff' class="h-40px" v-model:value="form.key" />
      </a-form-item>
      <a-form-item label="接口地址：">
        <a-input color='#fff' class="h-40px" v-model:value="form.url" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
const props = defineProps({
  visible: Boolean,
  form: Object
})
import { ref } from 'vue';
import { useSetupStore } from '../../store/index'

const labelCol = ref({ span: 4 });
const wrapperCol = ref({ span: 20 });
const formRef = ref();
const setupStore = useSetupStore()
const formUpdate = ref({
  code: '',
  pname: '',
  pkey: '',
  purl: '',
  action: 'save4'
})
const emits = defineEmits(['cancel', 'ok'])
const handleCancel = () => {
  emits('cancel')
}
const handleSubmit = () => {
  formUpdate.value.code = setupStore.code
  formUpdate.value.pname = props.form.name
  formUpdate.value.pkey = props.form.key
  formUpdate.value.purl = props.form.url
  emits('ok', formUpdate)
}
// const resetForm = () => {
//   form.value = {
//     code: setupStore.code,
//     pname: '',
//     pkey: '',
//     purl: '',
//     action: 'save'
//   }
// }
// defineExpose({
//   resetForm
// })
</script>