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
      <Col span="20" offset="4" class="layout-menu-right" style='top:60px;'>
        <div class="layout-content" style="padding:10px 20px;">
          <Row :gutter="16">
            <Col :lg="17" :xs="24">
              <div class="bigTitle"><Icon type="paper-airplane"></Icon>快速通道</div>
              <ul class="module">
                <template v-for="(item, i) in menuData">
                  <li>
                    <span :class="'general general'+ i%7"></span>
                    <router-link :to="{path:item.menuUrl,query:{moduleId:item.quickId}}">
                      <div :class="'quick quick' + i%7">{{item.menuName}}</div>
                      <div class="desc" v-html="item.menuDesc"></div>
                    </router-link>
                    <a href="javascript:;" class="delBtn" @click="handleDel(item.userId, item.quickId)"><Icon type="trash-a"></Icon></a>
                  </li>
                </template>
              </ul>
              <div class="addBtn">
                <router-link to="./addquick" v-if="menuData.length < 7">
                  <Button type="primary" icon="plus-circled">添加快捷入口</Button>
                </router-link>
              </div>
            </Col>
            <Col :lg="7" :xs="24" style="margin-top:8px;">
              <div style="border:1px solid #dddee1;">
                <div class="reportTitle">办件状态统计</div>
                <div class="reportArea">
                  <!--饼图-->
                  <div id="pieChart1" style="height: 280px;"></div>
                </div>
                <div class="reportTitle">申报事项主题Top5</div>
                <div class="reportArea">
                  <!--饼图-->
                  <div id="pieChart2" style="height: 280px;"></div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
      <!-- /Page Content -->
	  <transition name="fade" mode="out-in">
		  <div class="ivu-notice" v-show="isShow" style="bottom: 0px; right: 0px;">
			<div class="ivu-notice-notice ivu-notice-notice-closable ivu-notice-notice-with-desc">
				<div class="ivu-notice-notice-content">
					<div class="ivu-notice-custom-content ivu-notice-with-normal  ivu-notice-with-desc">
						<div class="ivu-notice-title">消息通知</div>
							<ul class="module" style="line-height:20px">
							<template v-for="(item, i) in messageData">
							  <li>
								<router-link :to="{path:'case/message/message',query:{messageId:item.messageId}}">
								  <div style="font-size:14px;margin-left:15px;width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{i+1}}.&nbsp;{{item.messageTitle}}</div>
								</router-link>
							  </li>
							</template>
						  </ul>
					</div>
				</div>
				<div class=""><!----></div>
				<a href="javascript:;" class="ivu-notice-notice-close" @click="closeMessage"><i class="ivu-icon ivu-icon-ios-close-empty"></i></a><!---->
			</div>
		  </div>
		</transition>
    </Row>


    <div class="tipfloat waitMessage layout-ceiling-main" >
      <p class="tipfloat_bt waitMessage" >
        <span class="fl waitMessage" >您有{{waitTotal}}条办件待处理</span>
        <a class="fr close waitMessage" @click="tankuan"><img src="../assets/img/close.png"></a>
      </p>
      <div class="ranklist waitMessage">
        <div v-for="(item, index) in waitList" v-if='index<3' class="xx_nrong waitMessage" @click="toWaitDeal(item)">
          {{index +1}}:&nbsp;{{ item.projectName }}
        </div>
        <div class="waitMessage waitPage">
          &nbsp;&nbsp;&nbsp;详情进入工作待办查看&nbsp;&nbsp;
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import vHeader from './header.vue';
import vSidebar from './sidebar.vue';
var echarts = require('echarts');
export default{
  components: {
    'header-view': vHeader,
    'sidebar-view': vSidebar
  },
  data () {
    return {
      menuData: [],        //快捷入口列表数据
      pieChartData1: [],   //办件状态统计
      pieChartData2: [],    //申报事项主题
      messageData: [],     //我的未读消息前5条
      messageRecId:"",      //当前登录用户id
      messageSource:'系统',
      messageState:'0',
      isShow:false,
      waitModuleUrl:"",
      waitList: [],
      waitTotal:0
    }
  },
  created(){
    //从cospace跳转过来，token已存在，直接从路由中获取token
    if(window.location.hash.split('=')[0] == '#/?token'){
      let token = window.location.hash.split('=')[1];
      localStorage.setItem('token',token);
    }

  axios.post("/cgaCase/queryTodoCaseListByPage.do", this.queryData)
      .then(data => {
        this.waitList = data.obj.records || [];
        this.waitTotal = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
      }).catch(error => {
        this.$Message.error("查询待办件失败！")
    });

    axios.post("/cgaSysModule/queryList.do")
      .then(data => {
        var model = data.obj[0].children.filter(function (message) {
          return message.moduleName.indexOf("业务流程")>-1;
        });
        var modelMessage=null;
        if(model!=null){
          modelMessage = model[0].children.filter(function (modelMsg) {
            return modelMsg.moduleName.indexOf("工作待办")>-1;
          });
        }
        if(modelMessage!==null){
          this.waitModuleUrl = modelMessage[0].moduleId;
        }
      });



    //查询当前用户配置的全部快捷菜单列表
    this.getList();
  },
  mounted(){
	//获取当前用户未读信息前5条
	axios.post("/cgaSorMessage/queryListByPage.do", {messageSource:this.messageSource,currentPage:1,pageSize:5,messageState:this.messageState})
	.then(data => {
		this.messageData = data.obj.records || [];
		if(this.messageData !=null && this.messageData.length !=0 ){
			this.isShow = true;
		}
	});
	setTimeout(()=>{
		this.isShow = false;
	},10000);   //1s 即1000ms

    axios.post("/cgaSysLoginInfo/queryStatisticsInfo.do")
    .then(data=>{
      this.pieChartData1 = data.obj.caseAmountChartList || [];
      this.pieChartData2 = data.obj.projectThemeChartList || [];

      const pieData1 = this.pieChartData1.map(item =>{
        return{
          value: item.caseCount,
          name: item.caseStatus
        }
      });
      const pieDataName1 = this.pieChartData1.map(item =>{
        return item.caseStatus
      });
      //办件状态统计饼图
      let pieChart1 = echarts.init(document.getElementById('pieChart1'));
      pieChart1.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}件 ({d}%)"
        },
        color:['#4BB2FF','#FF6600','#339933','#9933CC'],
        series: [
          {
            name: '办件状态',
            type: 'pie',
            radius : '55%',
            center: ['50%', '45%'],
            data: pieData1
          }
        ]
      });

      const pieData2 = this.pieChartData2.map(item =>{
        return{
          value: item.caseCount,
          name: item.themeName
        }
      });
      const pieDataName2 = this.pieChartData2.map(item =>{
        return item.themeName
      });
      //申报事项主题统计饼图
      let pieChart2 = echarts.init(document.getElementById('pieChart2'));
      pieChart2.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}件 ({d}%)"
        },
        color:['#FF9933','#99CC00','#996600','#993366','#9933CC'],
        series: [
          {
            name: '申报事项主题',
            type: 'pie',
            radius : '55%',
            center: ['50%', '45%'],
            data: pieData2
          }
        ]
      });
	});
  },
  methods:{
    tankuan(){
      $(".tipfloat").animate({height:"hide"},800);
    },

    toWaitDeal(item){
      this.$router.push({
        path: '../case/process/wait/detail/index',
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
    },




	closeMessage(){
		this.isShow = false;
	},
    getList(){
      axios.post("/cgaQuickMenuConfig/queryAllQuickConfigList.do")
      .then(data=>{
        this.menuData = data.obj || [];
      });
    },
    handleDel(userId, quickId){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          axios.post("/cgaQuickMenuConfig/deleteQuickConfig.do", {userId:userId, quickId:quickId})
          .then(data=>{
            this.getList();
          })
        }
      });
    },
	cancelMessage(){
		this.messageModal = false;
	}
  }
}
</script>

<style lang="scss">
.layout-content {
  .bigTitle {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #495060;
    margin-bottom: 5px;
    i {
      margin-right: 10px;
    }
  }
  .module {
    li {
      overflow: hidden;
      position: relative;
      margin-bottom: 15px;
      background: #F0F0F0;
      .general {
        float: left;
        display: inline-block;
        height: 75px;
        width: 5px;
        &.general0 {
          background: #4BB2FF;
        }
        &.general1 {
          background: #006699;
        }
        &.general2 {
          background: #FF9933;
        }
        &.general3 {
          background: #99CC00;
        }
        &.general4 {
          background: #996600;
        }
        &.general5 {
          background: #0066CC;
        }
        &.general6 {
          background: #339933;
        }
      }
      .quick {
        float: left;
        width: 150px;
        height: 55px;
        line-height: 55px;
        border-radius: 3px;
        margin: 10px;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        &.quick0 {
          background: #4BB2FF;
        }
        &.quick1 {
          background: #006699;
        }
        &.quick2 {
          background: #FF9933;
        }
        &.quick3 {
          background: #99CC00;
        }
        &.quick4 {
          background: #996600;
        }
        &.quick5 {
          background: #0066CC;
        }
        &.quick6 {
          background: #339933;
        }
      }
      .desc {
        float: left;
        margin: 10px 0;
        color: #495060;
        .num {
          margin: 0 3px;
          font-size: 16px;
          font-weight: bold;
          color: #00f;
        }
      }
      .delBtn {
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 9;
        font-size: 28px;
        color: #DDDEE1;
        &:hover {
          color: #80848F;
        }
      }
    }
  }
  .addBtn {
    margin-left: 15px;
    i {
      font-size: 17px;
      vertical-align: middle;
      margin-top: -3px;
    }
    span {
      font-size: 15px;
    }
  }
  .reportTitle {
    height: 36px;
    line-height: 36px;
    margin: 10px;
    text-align: center;
    background: #F8F8F9;
    border: 1px solid #dddee1;
    font-size: 16px;
    font-weight: bold;
    color: #495060;
  }
}
</style>
