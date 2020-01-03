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
      <Col span="20" offset="4" class='layout-menu-right'>
        <div class="layout-content-main">
          <breadcrumb-view></breadcrumb-view>
          <router-view></router-view>
        </div>
      </Col>
      <!-- /Page Content -->
    </Row>

    <div class="tipfloat waitMessage layout-ceiling-main" >
      <p class="tipfloat_bt waitMessage" >
        <span class="fl waitMessage" >您有{{waitTotal}}条办件待处理</span>
        <a class="fr close waitMessage" @click="tankuan"><img src="../assets/img/close.png"></a>
      </p>
      <div class="ranklist waitMessage">
        <div v-for="(item, index) in waitList" v-if='index<3' class="xx_nrong waitMessage" @click="toWaitDeal(item)">
          {{index+1 }}:&nbsp;{{ item.projectName }}
        </div>
        <div class="waitMessage waitPage">
          &nbsp;&nbsp;&nbsp;详情进入工作待办查看&nbsp;&nbsp;
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vBreadcrumb from '../components/breadcrumb.vue';
export default {
  components: {
    'header-view': vHeader,
    'sidebar-view': vSidebar,
    'breadcrumb-view': vBreadcrumb
  },
  data(){
    return {
      waitList: [],
      waitTotal:0,
      waitModuleUrl:""
    }
  },
  created(){
    axios.post("/cgaCase/queryTodoCaseListByPage.do", this.queryData)
      .then(data => {
        this.waitList = data.obj.records || [];
        this.waitTotal = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
      }).catch(error => {
      this.$Message.error("查询待办件失败！")
    })
    axios.post("/cgaSysModule/queryList.do")
      .then(data => {
        var model = data.obj[0].children.filter(function (message) {
          return message.moduleName.indexOf("业务流程")>-1;
        });
        var  modelMessage=null;
        if(model!=null){
          modelMessage = model[0].children.filter(function (modelMsg) {
            return modelMsg.moduleName.indexOf("工作待办")>-1;
          });
        }
        if(modelMessage!==null){
          this.waitModuleUrl = modelMessage[0].moduleId;
        }
      });
  },
  beforeCreate(){
    axios.post("/sys/sysDept/queryDeptTreeList.do")
    .then(data => {
      //实施机关部门树
      this.$store.state.deptTreeData = data.obj;
    })
  },
  methods:{
    tankuan(){
      $(".tipfloat").animate({height:"hide"},800);
    },
    toWaitDeal(item){
      this.$router.push({
        path: '/case/process/wait/detail/index',
        query: {
          moduleId: this.waitModuleUrl,
          projectId: item.projectId,
          id: item.id,
          caseId: item.caseId,
          workFlowType: item.workFlowType,
          businessId: item.businessId,
          deputyType: item.deputyType,
          taskId: item.taskId,
          taskDefinitionKey: item.taskDefinitionKey,
          projectNo: item.projectNo,
          cardNumber: item.cardNumber,
          inCurrentPage:1,
          isShowDeleteButton:false
        }
      })
    }
  }
}
</script>
