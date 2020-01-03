<template>
  <ul class="ivu-tree-children">
    <template v-for="(item, index) in treedata">
      <li :class="{'show-child': item.showChild}" @click="handleCallback0($event,item)">
        <a href="javascript:;">
          <i class="ivu-icon" :class="{'ivu-icon-arrow-right-b': item.childrenList && !item.showChild, 'ivu-icon-arrow-down-b': item.showChild}" @click="clickToggle($event,item)"></i>
          <span class="text" :class="{'active': activedata.indexOf(item.id)!==-1}" :title="item.name">{{item.name}}</span>
        </a>  
        <Tree 
          :treedata="item.childList" 
          :activedata="activedata" 
          :vm="vm">
        </Tree>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    treedata: Array,
    activedata: Array,
    vm: Object
  },  
  methods: {
    clickToggle(e,item){
      //只处理有子菜单的项
      if(item.childrenList){
        this.$set(item, 'showChild', !item.showChild);
      }
      e.stopPropagation();
    },
    handleCallback0(e,item){
      this.vm.$emit('handleCallback0', item);
      e.stopPropagation();
    }
  }
}
</script>

<style lang="scss">
.ivu-tree-children>li{
  &>ul{
    display: none;
    padding-left: 20px;
  }
  &.show-child>ul{
    display: block;
  }
  a{
    display: inline-block;
    height: 24px;
    line-height: 24px;
    margin-bottom: 2px;
    color: #657180;
    .ivu-icon{
      display: inline-block;
      width: 24px;
      line-height: 24px;
      text-align: center;
    }
    .text{
      display: inline-block;
      line-height: 20px;
      padding: 2px 4px;
      margin-left: -3px;
      border-radius: 3px;
      &.active{
        background: #d5e8fc;        
      }
    }
  }  
}
</style>
