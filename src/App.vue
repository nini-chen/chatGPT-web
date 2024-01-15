<!--
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-27 14:39:35
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-29 15:26:21
 * @FilePath: \wj_GTP\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { onMounted } from 'vue';
import * as dd from 'dingtalk-jsapi';
import { message } from 'ant-design-vue';

onMounted(() => {
  if (dd) {
    dd.biz.navigation.setTitle({
      title: '智能工作助手', //控制标题文本，空字符串表示显示默认文本
      onFail: function(err) { }
    });
    message.config({
      top: `400px`,
      duration: 2,
      maxCount: 3,
    });
  }
})
</script>

<template>
  <div>
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </div>
</template>


