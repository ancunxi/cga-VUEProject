<template>
  <ul class="ivu-tree-children">
    <template v-for="(item, index) in treedata">
      <li :class="{'show-child': item.showChild}">
        <a href="javascript:;" :class="{'active': activedata == item.id}">
          <i class="ivu-icon" :class="{'ivu-icon-arrow-down-b': item.childrenList && item.showChild, 'ivu-icon-arrow-right-b': !item.showChild}" @click="clickToggle($event,item)"  v-if='item.childrenList'></i>
          <div class="radio">
              <label class="no-padding-left">
                  <input :name="'guideName'+item.parentId" class="gname colored-blue" type="radio" :oid='item.id'  v-if="item.guideType==1" :checked='ugids.indexOf(item.guideId) != -1'>
                  <input name="guideName" class="gname colored-blue" type="radio"  :oid='item.id'  v-if="item.guideType==2" :checked='ugids.indexOf(item.guideId) != -1'>
              </label>
              <!-- <span class="text" :title="item.guideName" @click="handleCallback($event,item)">{{item.guideName}}</span> -->
              <span class="text" :title="item.guideName">{{item.guideName}}</span>
          </div>  
         
        </a>
        <tree-view 
          :treedata="item.childrenList" 
          :ugids="ugids"
          :activedata="activedata" 
          :vm="vm"
          :hasadd="hasadd" 
          :hasedit="hasedit" 
          :hasdel="hasdel"
        >
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
    ugids:Array,
    activedata: String,
    vm: Object,
    hasadd: Boolean,
    hasedit: Boolean,
    hasdel: Boolean,
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
      this.vm.$emit('handleCallback', item);
      e.stopPropagation();
    },
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
    display:inline-block;
    color: #657180;
    .ivu-icon{
      display: inline-block;
      width: 20px;
      line-height: 20px;
      text-align: right;
    }
    .text{
      display: inline-block;
      line-height: 20px;
      padding: 5px 10px;
      &.active{
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        background: #eaf4fe;        
      }
    }
    .radio{
      display: inline-block;
      margin: 0;
      .text{
        font-size: 13px;
        position: relative;
        z-index: 11;
        display: inline-block;
        margin: 0;
        line-height: 20px;
        min-height: 18px;
        min-width: 18px;
        font-weight: normal;
      }
    }
    .handle{
      display: inline-block;
      margin-left: 20px;
      i{
        margin-right:5px;
      }
    }
    &.active{
      width: 100%;
      background: #d5e8fc;
    }    
  }  
}
</style>
