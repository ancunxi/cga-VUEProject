<template>
  <ul :class="name + '-ul ' + name + '-ul-' + level"
   v-if="treedata">
    <li v-for="(item, i) in treedata" :class="{
      [name + '-li']: true,
      [name + '-li-' + level]: true,
      [name + '-li-showchild']: item.showChild,
      [name + '-li-haschild']: item.children,
      [name + '-li-nochild']: !item.children,
      [name + '-li-current']: current(item)
    }" v-on:click="toggleNode(item, $event)">
      <slot :node="item" :index="i" :level="level" :parents="treedata" :component="_self"></slot>
      <template v-if="!toggle && item.children">
        <i class="ivu-icon" :class="{'ivu-icon-chevron-right': item.children && !item.showChild, 'ivu-icon-chevron-down': item.showChild}" v-if="item.children"></i>
      </template>
      <tree :name="name" :treedata="item.children" :current="current" :level="level+1" :toggle="toggle" v-if="item.children">
        <template slot-scope="props">
          <slot :node="props.node" :index="props.index" :level="props.level" :parents="props.parents" :component="_self"></slot>
        </template>
      </tree>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'tree',
  props: {
    name: {
      type: String,
      default: 'tree'
    },//名称
    treedata: Array,//树数据
    current: {
      type: Function,
      default: () => false,
    },//检测高亮的方法
    toggle: Boolean,//是否显示展开关闭按钮，默认显示
    level: {
      type: Number,
      default: 1
    }
  },
  methods:{
    toggleNode(node, e){
      this.$set(node, 'showChild', !node.showChild);
      e.stopPropagation();     
    }
  }
}
</script>


