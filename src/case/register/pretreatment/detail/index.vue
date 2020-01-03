<template>
  <div class="layout-content">
    <panel-view></panel-view>
    <div class="tabs">
      <Tabs type="card" v-model="tabsName" @on-click="changeTabs">
        <TabPane label="申请基本信息" name="申请基本信息">
          <tab1-view 
            :isShowData="isShowData" 
            @previewsFun="previews" 
            ref="tabForm1"
            v-on:street="formChild">
          </tab1-view>
        </TabPane>
        
        <template v-for="(item, index) in tabFormData">
          <TabPane :label="item.formName" :name="item.formName">
            <tab3-view 
              :current="index + 1" 
              :length="tabFormData.length + 1"
              :isShowData="isShowData">
            </tab3-view>
          </TabPane>        
        </template>
        <TabPane label="资料袋" name="资料袋">
          <tab2-view  :isShowData="isShowData" :tabsName="tabsName"></tab2-view>
        </TabPane>
        <TabPane :label="tab5Name" name="tab5">
          <tab5-view ref='tab5view'></tab5-view>
        </TabPane>
                                    
        <!--右侧公共部分-->
        <template v-if="tabFormLoad">
          <TabPane :label="tab10Name" name="tab10">
            <tab10-view ref="tab10view" @previewsFun="previews"></tab10-view>
          </TabPane>
          <TabPane :label="tab9Name" name="tab9">
            <tab9-view ref="tab9view"></tab9-view>
          </TabPane>          
          <TabPane :label="tab8Name" name="tab8">
            <tab8-view ref="tab8view"></tab8-view>
          </TabPane>
          <TabPane :label="tab7Name" name="tab7">
            <tab7-view :cardNumber="this.$refs.tabForm1.userData.cardNumber" ref="tab7view"></tab7-view>
          </TabPane>   
        </template>      
      </Tabs> 
    </div>
    <opinion-view 
      :workFlowInfo="workFlowInfoData" 
      :tacheInfo="tacheInfoData"
      @loadingShow="handleLoadingShow"
      @loadingHide="handleLoadingHide"
      :assignDeptId="assignDeptId">
    </opinion-view>  

    <!--start  预览-->
    <ul id="dowebok26" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015000;" v-show="previewsModal">
      <div class="viewer-canvas viewer-invisible">
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
      </div>
      <div class="viewer-button viewer-close" data-action="mix"></div>
    </div>
    <!--end  预览-->

    <!--loading框 Modal Templates-->
    <div class="dhx_modal_cover" v-if='loadingModal'></div>
    <div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
    <!--End loading框 Modal Templates--> 
  </div>
</template>

<script>
require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');
import panel from '../../../common/panel.vue';   //头部基本信息
import tab1 from './info.vue';  //申请基本信息
import tab2 from './infobag.vue';  //资料袋
import tab3 from './form1.vue';  //表单
import tab5 from '../../../common/view/log.vue';  //流程日志
import tab7 from '../../../common/review.vue';  //历次审查
import tab8 from '../../../common/interaction.vue';  //受审互动
import tab9 from '../../../common/problem.vue';  //常见问题
import tab10 from '../../../common/guide.vue';  //办事指南
import opinion from './opinion.vue';  //意见处理框
export default {
  components: {
    'panel-view': panel,    
    'tab1-view': tab1,
    'tab2-view': tab2,
    'tab3-view': tab3,
    'tab5-view': tab5,
    'tab7-view': tab7,
    'tab8-view': tab8,
    'tab9-view': tab9,
    'tab10-view': tab10,
    'opinion-view': opinion     
  },
  data(){
    return{
      loadingModal: false, //loading框

      isShowData: {},       //控制一些模块是否显示
      tabFormData: [],      //有业务表单且有表单明细信息
      tabFormLoad: false,   //业务表单加载完成后在显示右侧页签
      tab5Name: (h) => {
        return h('div', [
          h('span', '流程日志'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab5view.getList();
              }
            }
          })
        ])
      },
      tab7Name: (h) => {
        return h('div', [
          h('span', '历次审查'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab7view.getList();
              }
            }
          })
        ])
      },
      tab8Name: (h) => {
        return h('div', [
          h('span', '受审互动'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab8view.getList();
              }
            }
          })
        ])
      },
      tab9Name: (h) => {
        return h('div', [
          h('span', '常见问题'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab9view.getList();
              }
            }
          })
        ])
      },
      tab10Name: (h) => {
        return h('div', [
          h('span', '办事指南'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab10view.getList();
              }
            }
          })
        ])
      },
      tabsName:"申请基本信息",
      //当前流程详情
      workFlowInfoData: {
        type: Object
      },
      //当前环节详情
      tacheInfoData: {
        type: Object
      },
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      assignDeptId:'',   //流转街道的Id
    }
  },
  created(){
    this.tabsName = this.$route.query.tabsName;
    this.apiH = window.config.api;
    //控制业务表单是否显示以及显示数量
    axios.post("/cgaCase/queryCaseProjectControlInfo.do", {caseId:this.$route.query.caseId})
    .then(data=>{
      this.isShowData = data.obj;
      if(data.obj && data.obj.projectFormDetail && data.obj.projectFormDetail.length > 0){
        this.tabFormData = data.obj.projectFormDetail;
      }
      this.tabFormLoad = true;
    });

    //查询意见处理区 流程环节信息
    axios.post("/cgaCase/queryNetCaseInfoByCaseId.do", {caseId:this.$route.query.caseId,moduleName:'网上预审'})
    .then(data=>{
      this.workFlowInfoData = data.obj.workFlowInfo;
      this.tacheInfoData = data.obj.tacheInfo;
    });
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    changeTabs(data){
      this.tabsName = data;
    },
   //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok26'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok26 img').click();
          let _this = this;
          let timeImg = setInterval(function(){
            if($('.viewer-container img').attr('alt') != undefined){
              clearInterval(timeImg);
              $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
            }
          },300)
        })
        
      }
    },
    handleLoadingShow(){
      this.loadingModal = true;
    },
    handleLoadingHide(){
      this.loadingModal = false;
    },
    formChild(value){
      this.assignDeptId=value;
    } 
  }
}
</script>



