<template>
  <div class="layout-content">
    <panel-view 
      :panelCaseInfo="caseInfoData" 
      :panelTacheInfo="tacheInfoData">
    </panel-view>
    <div class="tabs">
      <Tabs type="card">
        <TabPane label="申请基本信息">
          <template v-if="isModifyCase == false">
            <tab1-view
              :projectAddress="trueProjectAddress" 
              :txAddress="trueTxAddress"
              :caseInfo="caseInfoData" 
              :relatedPersonInfo="relatedPersonInfoData"
              :isShowData="isShowData" 
              @previewsFun="previews" 
              ref="tabForm1">
            </tab1-view>
          </template>
          <template  v-else>
            <tab1-edit-view
              :caseInfoP="caseInfoData" 
              :relatedPersonInfoP="relatedPersonInfoData"
              :isShowData="isShowData" 
              @previewsFun="previews" 
              ref="tabForm1">
            </tab1-edit-view>
          </template>
        </TabPane> 

        <TabPane :label="tabBagName">
          <tab2-view
            :relatedPersonCardNumber="relatedPersonInfoData.cardNumber" 
            :tacheInfo="tacheInfoData"
            :isShowData="isShowData"
            @previewsFun="previews"
            ref="tabBag">
          </tab2-view>
        </TabPane>          

        <!-- 表单 帆软 -->
        <template v-for="(item, index) in tabFormData">
          <TabPane :label="item.formName">
            <tab3-view 
              :current="index + 1" 
              :length="tabFormData.length + 1"
              :formReportFile ="item.formReportFile"
              :caseIds="caseIds_form"
              :isShowData="isShowData"
              :isModifyCase="isModifyCase"
              ref="FineReportForm">
            </tab3-view>
          </TabPane>        
        </template>    

        <!--备注：如果此流程是主流程时,还需要根据isSupportProcess的Boolean值，去控制辅助流程tab页签是否显示-->
        <template v-if="workFlowInfoData.workFlowType == '0' && tacheInfoData.isSupportProcess == 'true'">
          <TabPane :label="tabAuxiliaryName">
            <tab4-view 
              :tacheInfo="tacheInfoData"
              :workFlowInfo="workFlowInfoData"
              :workFlowSupport="workFlowSupportData"
              :workFlowCharge="workFlowChargeData"
              ref="tabAuxiliary">
            </tab4-view>
          </TabPane> 
        </template>

        <!--备注：如果此流程是辅助流程时，则辅助流程tab页签一定是显示的-->
        <template v-if="workFlowInfoData.workFlowType == '1'">
          <TabPane :label="tabAuxiliaryName">
            <tab4-view 
              :tacheInfo="tacheInfoData"
              :workFlowInfo="workFlowInfoData"
              :workFlowSupport="workFlowSupportData"
              :workFlowCharge="workFlowChargeData"
              ref="tabAuxiliary">
            </tab4-view>
          </TabPane> 
        </template>

        <template v-if="tabFormLoad">
          <TabPane :label="tab5Log">
            <tab5-view ref="tab5Log" :tacheInfo="tacheInfoData"></tab5-view>
          </TabPane>
          <TabPane :label="tabName6">
            <tab6-view ref="component4" :workFlowInfo="workFlowInfoData" :tacheInfo="tacheInfoData"></tab6-view>
          </TabPane>
          <!--右侧公共部分-->        
          <TabPane :label="tab10Name">
            <rightTab1-view ref="tab10view" @previewsFun="previews"></rightTab1-view>
          </TabPane>        
          <TabPane :label="tabProblemName">
            <rightTab2-view ref="tabProblem"></rightTab2-view>
          </TabPane>          
          <TabPane :label="tabInteractionName">
            <rightTab3-view ref="tabInteraction"></rightTab3-view>
          </TabPane>
          <TabPane :label="tabReviewName">
            <rightTab4-view 
              :cardNumber="this.$refs.tabForm1.relatedPersonInfo.cardNumber" 
              ref="tabReview">
            </rightTab4-view>
          </TabPane>          
        </template>
      </Tabs>      
    </div>
    <opinion-view 
      :workFlowInfo="workFlowInfoData" 
      :tacheInfo="tacheInfoData" 
      :conditionText="tacheInfoText"
      :isModifyCase="isModifyCase"
      @complete="handleComplete"
      @loadingShow="handleLoadingShow"
      @loadingHide="handleLoadingHide">      
    </opinion-view>  

    <!--start  预览-->
    <ul id="dowebok20" style="display: none;">
      <li v-for="item in specialData" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-show="previewsModal">
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
// require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');
import {Viewer} from '../../../../assets/js/viewer.js';

import panel from './panel.vue';//工作待办panel区比其他公用panel区多一项资料袋查阅的内容
import tab1 from './info.vue';
import tab1Edit from './info-edit.vue';
import tab2 from './infobag.vue';
import tab3 from './form.vue';
import tab4 from './auxiliary.vue';
import tab5 from './log.vue';
import tab6 from './diagram.vue';
import rightTab1 from '../../../common/guide.vue';
import rightTab2 from '../../../common/problem.vue';
import rightTab3 from '../../../common/interaction.vue';
import rightTab4 from '../../../common/review.vue';
import opinion from '../../../common/opinion.vue';
export default {
  components: {
    'panel-view': panel,    
    'tab1-view': tab1,
    'tab1-edit-view': tab1Edit,
    'tab2-view': tab2,
    'tab3-view': tab3,
    'tab4-view': tab4,
    'tab5-view': tab5,
    'tab6-view': tab6,
    'rightTab1-view': rightTab1,
    'rightTab2-view': rightTab2,
    'rightTab3-view': rightTab3,
    'rightTab4-view': rightTab4,
    'opinion-view': opinion     
  },
  data(){
    return{
      loadingModal: false, //loading框
      caseIds_form:this.$route.query.caseId,
      //办件详情
      caseInfoData: {},
      //申请人、申请企业详情
      relatedPersonInfoData: {},
      //项目地址
      trueProjectAddress:'',
      //通讯地址
      trueTxAddress:'',

      //当前流程详情
      workFlowInfoData: {},
      //当前流程下的supportExecution详情
      workFlowSupportData: {},
      //当前流程下的chargeReceivableInfo收费详情
      workFlowChargeData: {},
      //当前环节详情
      tacheInfoData: {},
      isModifyCase: false,  //控制申请基本信息是否可编辑
      tacheInfoText: [],
      isShowData: {},       //控制一些模块是否显示
      tabFormData: [],      //有业务表单且有表单明细信息
      tabFormLoad: false,   //业务表单加载完成后在显示右侧页签 

         
      // tabBagName: (h) => {
      //     return h('div',{style:{background:'red'}}, [
      //         h('div', {
      //             style: {
      //                 // width: '70px',
      //                 height: '31px',
      //                 display:'inline-block'
      //             },
      //             on: {
      //                 click: () => {
      //                   alert(1)
      //                     this.$refs.tabBag.getMaterialList();
      //                     this.$refs.tabBag.getSpecialList();
      //                 }
      //             }
      //         }, '资料袋')
      //     ]);
      // },
      tabBagName: (h) => {
        return h('div', [
          h('span', '资料袋'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tabBag.getMaterialList();
                this.$refs.tabBag.getSpecialList();
              }
            }
          })
        ])
      },      
      tabAuxiliaryName: (h) => {
        return h('div', [
          h('span', '辅助流程'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tabAuxiliary.getAuxiliaryList();
                this.$refs.tabAuxiliary.getChargeList();
              }
            }
          })
        ])
      },       
      tabReviewName: (h) => {
        return h('div', [
          h('span', '历次审查'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tabReview.getList();
              }
            }
          })
        ])
      },
      tab5Log: (h) => {
        return h('div', [
          h('span', '流程日志'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tab5Log.getList();
              }
            }
          })
        ])
      },
      tabInteractionName: (h) => {
        return h('div', [
          h('span', '受审互动'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tabInteraction.getList();
              }
            }
          })
        ])
      },
      tabProblemName: (h) => {
        return h('div', [
          h('span', '常见问题'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.tabProblem.getList();
              }
            }
          })
        ])
      },
      tabName6: (h) => {
        return h('div', [
          h('span', '流程图'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component4.getProcessInstanceId(this.$route.query.caseId,this.workFlowSupportData);
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
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      specialData:[],  //特殊情况材料
      imgMaterialData:[],  //图片材料列表数据
    }
  },
  created(){
    this.apiH = window.config.api;
    //查询工作待办办件相关信息
    axios.post("/cgaCase/queryTodoCaseInfoByCaseId.do", {id:this.$route.query.id, caseId:this.$route.query.caseId, workFlowType:this.$route.query.workFlowType, businessId:this.$route.query.businessId, deputyType:this.$route.query.deputyType, taskId:this.$route.query.taskId, taskDefinitionKey:this.$route.query.taskDefinitionKey})
    .then(data=>{
      if(data.status == '200' && data.success == true){
        this.isModifyCase = (data.obj.tacheInfo.isModifyCase=="false"||data.obj.tacheInfo.isModifyCase==false)?false:true;    //允许编辑办件信息

        setTimeout(()=>{   //延时用于对应页面节点显示，之后数据填充；否则无数据显示
          this.caseInfoData = data.obj.caseInfo || '';
          this.relatedPersonInfoData = data.obj.relatedPersonInfo || '';

          //项目地址
          var caseAreaCodeName1 = this.caseInfoData.caseAreaCodeName || '';
          var caseAddress1 = this.caseInfoData.caseAddress || '';
          this.trueProjectAddress = caseAreaCodeName1+caseAddress1;
          //通讯地址
          var areaCodeName1 = this.relatedPersonInfoData.areaCodeName || '';
          var address1 = this.relatedPersonInfoData.address || '';
          this.trueTxAddress = areaCodeName1+address1;

          this.tacheInfoData = data.obj.tacheInfo || '';
          

          this.tacheInfoText = data.obj.tacheInfo.nextTransitions.map(item => item.conditionText);
          this.workFlowInfoData = data.obj.workFlowInfo || '';
          this.workFlowSupportData = data.obj.workFlowInfo.supportExecution || '';        
          this.workFlowChargeData = data.obj.workFlowInfo.chargeReceivableInfo || '';
          //控制业务表单是否显示以及显示数量
          axios.post("/cgaCase/queryCaseProjectControlInfo.do", {caseId:this.$route.query.caseId})
          .then(data=>{
            this.isShowData = data.obj;
            if(data.obj && data.obj.projectFormDetail && data.obj.projectFormDetail.length > 0){
              this.tabFormData = data.obj.projectFormDetail;
              this.tabFormLoad = true;
            }else{
              this.tabFormLoad = true;
            }
          }); 
        },500)
      }else{
        this.$Message.error(data.msg);
      }
    })
    this.getSpecialList();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    getSpecialList(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj || [];
      }); 
    },
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok20'), {
          url: 'data-original'
        });
        this.imgMaterialData=this.specialData.filter(function(item){
          return (item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg')
        })
        let imgNum=0;
        for(let i=0;i<this.imgMaterialData.length;i++){
          if(this.imgMaterialData[i].fileId==id){
            imgNum = i
          }
        }
        $('#dowebok20 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok20 img').click();
        //   let _this = this;
        //   let timeImg = setInterval(function(){
        //     if($('.viewer-container img').attr('alt') != undefined){
        //       clearInterval(timeImg);
        //       $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
        //     }
        //   },300)
        // })
        
      }
    },
    //登记完成操作
    handleComplete(){
      //alert(this.$refs.FineReportForm.length)
      this.loadingModal = true;
      var Arr = [];
      let length = this.tabFormData.length || 0;
      let _this = this;
      for (var i = 0; i < length; i++) {
        (function(arg){
          setTimeout(()=>{ //帆软由于交互存在1000ms验证时间
            console.log(arg)
            _this.$refs.FineReportForm[arg].handleNext(arg); 
          },1500*arg);
        })(i)
      }
      setTimeout(()=>{
        this.loadingModal = false;
        for (var i = 0; i < length; i++) {
          Arr[i] = this.$refs.FineReportForm[i].pass;
        }
        if(Arr.join().indexOf("false") == -1){
          //触发info-edit的提交操作
          this.$refs.tabForm1.handleComplete();
        } 
      },1600*length);
    },
    handleLoadingShow(){
      this.loadingModal = true;
    },
    handleLoadingHide(){
      this.loadingModal = false;
    }  
  }
}
</script>
<style lang="scss">
    @import "../../../../assets/css/viewer.css";
    .ivu-modal-style{
      justify-content: flex-start !important;
    }
    .ivu-modal-content{
      margin-top: 50px;
    }
</style>


