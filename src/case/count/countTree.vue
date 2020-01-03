<template>
  <ul class="ivu-tree-children">
    <template v-for="(item, index) in treedata">
      <li :class="{'show-child': item.showChild}">
        <a href="javascript:;">
          <i class="ivu-icon" :class="{'ivu-icon-arrow-right-b': item.childrenList && !item.showChild, 'ivu-icon-arrow-down-b': item.showChild}" @click="clickToggle($event,item)"></i>
          <input name="checkbox" type="checkbox" v-if="ischeckbox" @click="handleCallback($event,item)" :checked="activeid.indexOf(item.id) != -1">
          <span class="text" :class="{'active': !ischeckbox && activedata.indexOf(item.id) !==-1, 'userdisabled':usabledeptids.indexOf(item.id)==-1}" :title="item.name" @click="handleCallbackOne($event,item)">{{item.name}}</span>
        </a>
        <tree-view 
          :usabledeptids = 'usabledeptids'
          :treedata="item.childrenList" 
          :activedata="activedata" 
          :vm="vm" 
          :ischeckbox="ischeckbox"
          :activeid="activeid">
        </tree-view>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'tree-view',
  props: {
      usabledeptids:Array,
      treedata: Array,
      activedata: Array,
      vm: Object,
      ischeckbox: Boolean,
      activeid: Array
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
      if(this.usabledeptids.indexOf(item.id)==-1){
        this.$Message.error('没有该部门权限')
        e.stopPropagation();
        return false;      
      }
      this.vm.$emit('handleCallback', item);
      e.stopPropagation();
    },
    handleCallbackOne(e,item){
      if(this.usabledeptids.indexOf(item.id)==-1){
        this.$Message.error('没有该部门权限')
        e.stopPropagation();
        return false;      
      }
      this.vm.$emit('handleCallbackOne', item.id);
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
    color: #657180;
    input[type="checkbox"]{
      display: inline-block;
      vertical-align: middle;
    }
    .ivu-icon{
      display: inline-block;
      width: 20px;
      line-height: 20px;
      text-align: center;
    }
    .text{
      display: inline-block;
      line-height: 20px;
      padding: 5px 10px 5px 5px;
      &.active{
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        background: #eaf4fe;        
      }
    }
  }  
}
.userdisabled{color: #e3e3e3;}
</style>
