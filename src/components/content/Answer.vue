<!--
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-27 14:39:35
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2024-01-02 17:24:46
 * @FilePath: \智能工作助手\src\components\content\Answer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="relative">
    <div class="bg-[#353942] px-65px py-30px" :id="'sse' + props.index" ref="contentRef"></div>
    <div :class="props.index === count && 'bg-[#1AFF5E] z-99 absolute w-[3px] h-[100%] z-99 left-0 bottom-0'">
    </div>
    <div :class="props.index === count && 'w-[4.5%] bg-gradient-to-r from-[#1aff5e40] absolute h-[100%] z-99 left-0 bottom-0'">
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: String,
  index: Number,
  count: Number
})
import { ref, watch, nextTick } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 引入高亮样式
const contentRef = ref();
watch(
  () => props.data,
  (newX) => {
    nextTick(() => {
      init(newX)
    })
  },
  { immediate: true }
)

const markData = ref('')
const init = (data) => {
  markData.value = marked.parse(data);
  // 获取dom节点
  const wrapper = document.querySelector('#sse' + props.index)
  wrapper.innerHTML = markData.value;
  nextTick(() => {
    hljs.highlightAll()
    copyDom()
  })
}

const copyDom = () => {
  const articleContent = contentRef
  // 遍历内容节点
  articleContent.value.childNodes.forEach((e, index) => {
    // 每个代码块标签添加复制按钮
    if (e.nodeName === 'PRE') {
      const copyButton = document.createElement('span')
      copyButton.setAttribute('class', 'btn-pre-copy')
      copyButton.innerHTML = '复制'
      copyButton.onclick = () => {
        const copyData = e.firstChild.innerText
        copyToClipboard(copyData)
        copyButton.innerHTML = '复制成功'
        setTimeout(() => {
          copyButton.innerHTML = '复制'
        }, 1000)
      }
      // 将节点加入pre标签下
      e.appendChild(copyButton)
      e.style.position = 'relative';
    }
  })
}

// 复制到剪贴板
const copyToClipboard = (content) => {
  if (window.clipboardData) {
    window.clipboardData.setData('text', content)
  } else {
    ; (content => {
      document.oncopy = e => {
        e.clipboardData.setData('text', content)
        e.preventDefault()
        document.oncopy = null
      }
    })(content)
    document.execCommand('Copy')
  }
}


</script>
<style >
.btn-pre-copy {
  position: absolute;
  right: 0;
  top: 0;
  color: #eee;
  padding: 5px 10px;
  cursor: pointer;
}
</style>