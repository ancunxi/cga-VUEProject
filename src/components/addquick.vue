<template>
  <div class="layout">
    <header-view></header-view>
    <Row type="flex">
      <!-- Page Sidebar -->
      <Col span="4" class="layout-menu-left">
        <sidebar-view></sidebar-view>
      </Col>
      <!-- /Page Sidebar -->
              
      <!-- Page Content -->
      <Col span="20" offset="4" class='layout-menu-right' style='top:64px;'>
        <div class="layout-content topContent" style="padding: 10px 60px;"> 
          <div class="bigTitle">快捷菜单</div>
          <Row class="clearfix">
            <template v-for="(item, i) in baseMenuData">
              <Col span="4">
                <p :class="'menu menu'+ i%15">{{item.menuName}}</p>
                <p class="checkBtn">
                  <input name="checkbox" type="checkbox" @click="handleCallback($event,item)" :checked="activeId.indexOf(item.id) != -1">
                </p> 
              </Col>
            </template>
          </Row>
          <Row class="center">
            <Col span="24">
              <Button type="primary" @click="handleAdd()">确定</Button>
              <router-link to="./" style="margin-left:8px;"><Button>取消</Button></router-link>
            </Col>
          </Row>  
        </div>
      </Col>
      <!-- /Page Content -->
    </Row> 
  </div>
</template>

<script>
import vHeader from './header.vue';
import vSidebar from './sidebar.vue';
export default{
  components: {
    'header-view': vHeader,
    'sidebar-view': vSidebar
  },
  data () {
    return {
      baseMenuData: [],        //快捷基础菜单列表数据
      menuArr: [],
      //所有选中项ID
      activeId:[],
    }
  },
  created(){
    //查询当前用户配置的全部快捷菜单列表
    this.getList(); 
  },
  methods:{
    getList(){
      axios.post("/cgaQuickMenuConfig/queryAllQuickBaseList.do", {})
      .then(data=>{
        this.baseMenuData = data.obj || [];    
      });
    },
    handleCallback(e,item){
      //处理选中项数据
      let idx = this.activeId.indexOf(item.id);      
      if(idx != -1){
        //此项之前已被选中 -> 将此项的所有数据从之前的数组删除
        this.activeId.splice(idx,1);
      }else{
        //此项之前未被选中 -> 将此项的所有数据添加到之前的数组中 -> 数组合并存在重复数据
        this.activeId.push(item.id);
      }       
      // e.stopPropagation();
    },
    handleAdd(){           
      if(this.activeId ==null ||this.activeId.length==0){
        this.$Message.error({
          duration: 6,
          content: '请至少选择一条事项进行操作'
        });
        return false;
      }      
      axios.post("/cgaQuickMenuConfig/addBatchQuickConfig.do",{quickIds:this.activeId.join()})
      .then(data=>{
        this.$router.push({path:'./',query:{}})
      }); 
    }
  }
} 
</script>

<style lang="scss">
.bigTitle{
  text-align: center;
  font-size: 30px;  
  font-weight: bold;
  color: #495060; 
  margin-bottom: 20px;
}
.menu{         
  line-height: 70px;     
  border-radius: 3px;
  text-align: center;
  font-size: 16px;  
  font-weight: bold;
  color: #fff;  
  margin: 10px;
  &.menu0{      
    background: #4BB2FF;
  }
  &.menu1{
    background: #006699;
  }
  &.menu2{
    background: #FF9933;
  }
  &.menu3{
    background: #99CC00;
  }
  &.menu4{
    background: #996600;
  }
  &.menu5{
    background: #0066CC;
  }
  &.menu6{
    background: #339933;
  }
  &.menu7{
    background: #993366;
  }
  &.menu8{
    background: #FF6600;
  }
  &.menu9{
    background: #66CC99;
  }
  &.menu10{
    background: #9933CC;
  }
  &.menu11{
    background: #009999;
  }
  &.menu12{
    background: #996699;
  }
  &.menu13{
    background: #33CC00;
  }
  &.menu14{
    background: #666633;
  }
} 
.checkBtn{
  text-align: center;
  margin: 0 10px 20px 10px;
} 
</style>