<template>
  <tree name="slide-menu" :treedata="treeData" :current="currentFn">
    <template slot-scope="props">
      <span v-if="props.node.moduleUrl == '#'">
        <a href="javascript:;" class="type-name">{{props.node.moduleName}}</a>
      </span>
      <span v-else>
        <router-link :to="{path:props.node.moduleUrl, query:{moduleId:props.node.moduleId}}" class="type-name">{{props.node.moduleName}}</router-link>        
      </span>
    </template>
  </tree>
</template>

<script>
import tree from './menu.vue';
export default{
  components:{
    'tree': tree
  }, 
  data(){
    return{
      moduleId: this.$route.query.moduleId,
      treeData: [],
    }
  },
  watch: {
    ['$route.query.moduleId'](n, o) {
      this.moduleId = n
    }
  },  
  created(){
    axios.post("/cgaSysModule/queryList.do")
    .then(data => {
      data.obj[0].showChild = true;
      this.treeData = data.obj || [];
    });
  },
  methods: {
    currentFn(item){
      return item.moduleId === this.moduleId;
    }
  }  
}
</script>

<style lang="scss">
.slide-menu-ul .slide-menu-li {
  position: relative;
  width: 100%;
  color: #fff;
  &>ul {
    display: none;
  }
  &-showchild>ul {
    display: block;
  }
  &.slide-menu-li-current .type-name {
    background: #287ed7;
  }
  .type-name {
    display: block;
    color: #fff;  
  }
  .ivu-icon {
    position: absolute;
    right: 10px;
    top: 0;    
    display: inline-block;
    font-size: 18px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
  }
}

.slide-menu-ul.slide-menu-ul-1>.slide-menu-li.slide-menu-li-1 {
  .type-name {
    height: 44px;
    line-height: 44px;
    padding-left: 50px;
    font-size: 16px;
    // background: #2e3946;
  }
  .ivu-icon {
    width: 44px;
    height: 44px;
    line-height: 44px;
  }
}
.slide-menu-ul.slide-menu-ul-2>.slide-menu-li.slide-menu-li-2 .type-name {
  height: 40px;
  line-height: 40px;
  padding-left: 60px;
  font-size: 14px;
}
.slide-menu-ul.slide-menu-ul-3>.slide-menu-li.slide-menu-li-3 .type-name {
  height: 40px;
  line-height: 40px;
  padding-left: 70px;
  font-size: 13px;
}
</style>

