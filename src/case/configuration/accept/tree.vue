<template>
  <ul class="ivu-tree-children">
    <template v-for="(item, index) in treedata">
      <li :class="{'show-child': item.showChild}" @click="handleCallback($event,item)">
        <a href="javascript:;">
          <i class="ivu-icon" :class="{'ivu-icon-arrow-right-b': item.childrenList && !item.showChild, 'ivu-icon-arrow-down-b': item.showChild}" @click="clickToggle($event,item)"></i>
          <span class="text" :class="{'active': activedata.indexOf(item.id)!==-1, 'userdisabled':usabledeptids.indexOf(item.id)==-1, 'detdisabled':det==item.id}" :title="item.name">{{item.name}}</span>
        </a>  
        <tree-view 
          :treedata="item.childrenList" 
          :activedata="activedata" 
          :vm="vm"
          :usabledeptids='usabledeptids'
          :det="det">
        </tree-view>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'tree-view',
  props: {
    treedata: Array,
    activedata: Array,
    vm: Object,
    usabledeptids: Array,
    det: String
  },  
  methods: {
    clickToggle(e,item){
      //只处理有子菜单的项
      if(item.childrenList){
        this.$set(item, 'showChild', !item.showChild);
      }
      e.stopPropagation();
    },
    handleCallback(e,item){
      if(this.det==item.id || this.usabledeptids.indexOf(item.id)==-1){
        this.$Message.error('没有该部门权限！')
        e.stopPropagation();
        return false;      
      }
      this.vm.$emit('handleCallback', item);
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
.detdisabled, .userdisabled{
  color: #e3e3e3;
}
</style>
