<template>
  <!-- vue3页面 -->
  <div class="about-wrap">
    <h1>测试树结构</h1>
    <div class="content_wrap">
      <!-- 这里的class="ztree"必须要写的 显示不出 -->
      <div class="left">
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, reactive, nextTick } from 'vue'
// import $ from "jquery";
// console.log("###", $);
// debugger;

let newCount = 1
let trees: any = $.fn
// 增加子节点
const add = (e: any) => {
  var zTree = trees.zTree.getZTreeObj('treeDemo'),
    isParent = e.data.isParent,
    nodes = zTree.getSelectedNodes(),
    treeNode = nodes[0]
  if (treeNode) {
    treeNode = zTree.addNodes(treeNode, {
      id: 100 + newCount,
      pId: treeNode.id,
      isParent: isParent,
      name: 'new node' + newCount++
    })
  } else {
    treeNode = zTree.addNodes(null, {
      id: 100 + newCount,
      pId: 0,
      isParent: isParent,
      name: 'new node' + newCount++
    })
  }
  if (treeNode) {
    zTree.editName(treeNode[0])
  } else {
    alert('叶子节点被锁定，无法增加子节点')
  }
}
// 删除子节点
const remove = (e: any) => {
  var zTree = trees.zTree.getZTreeObj('treeDemo'),
    nodes = zTree.getSelectedNodes(),
    treeNode = nodes[0]
  if (nodes.length == 0) {
    alert('请先选择一个节点')
    return
  }
  var callbackFlag = $('#callbackTrigger').attr('checked')
  zTree.removeNode(treeNode, callbackFlag)
}
const setting = {
  edit: {
    enable: true,
    // 显示删除按钮
    showRemoveBtn: true,
    // 显示更改名称按钮
    showRenameBtn: true
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  view: {
    showLine: false
  },
  callback: {}
}
// 数据格式 可以是这样并列的 也可以是json嵌套的那种
const zNodes = [
  { id: 1, pId: 0, name: '父节点 1', open: true },
  { id: 11, pId: 1, name: '叶子节点 1-1' },
  { id: 12, pId: 1, name: '叶子节点 1-2' },
  { id: 13, pId: 1, name: '叶子节点 1-3' },
  { id: 2, pId: 0, name: '父节点 2', open: true },
  { id: 21, pId: 2, name: '叶子节点 2-1' },
  { id: 22, pId: 2, name: '叶子节点 2-2' },
  { id: 23, pId: 2, name: '叶子节点 2-3' },
  { id: 3, pId: 0, name: '父节点 3', open: true },
  { id: 31, pId: 3, name: '叶子节点 3-1' },
  { id: 32, pId: 3, name: '叶子节点 3-2' },
  { id: 33, pId: 3, name: '叶子节点 3-3' }
]

onMounted(() => {
  nextTick(() => {
    let tree: any = $.fn
    tree.zTree.init($('#treeDemo'), setting, zNodes)
  })
})
</script>

<style lang="scss" scoped>
//这里就是写的树的样式了 自己随意改
// @import '../../public/css/demo.css';
// @import "../../public/css/zTreeStyle.css";
</style>
