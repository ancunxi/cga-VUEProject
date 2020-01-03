<template>
  <div class="layout-content">
    <panel-view></panel-view>
    <div class="tabs">
      <Tabs type="card" value="tab1">
        <!--申请基本信息-->
        <TabPane label="申请基本信息" name="tab1">
          <tab1-view 
            :current="0" 
            :length="tabFormData.length + 1"
            :isShowData="isShowData"
            @previewsFun="previews" 
            @complete="handleComplete"
            ref="tabForm1">
          </tab1-view>
        </TabPane>
        
        <template v-if="tabFormLoad">
	        <TabPane label="资料袋">
	          <tab3-view 
	            :isShowData="isShowData"	            
	            :projectApplyType="this.$refs.tabForm1.caseInfo.applyObjectType"
		          :userCardNumber="this.$refs.tabForm1.relatedPersonInfo.cardNumber"
		          @complete="handleComplete"
		          @previewsFun="previews">
	          </tab3-view>
	        </TabPane>
        </template>
        
        <!--业务表单-->
        <template v-for="(item, index) in tabFormData">
          <TabPane :label="item.formName" :disabled="tabIndex==(index+1)?true:false">
            <tab2-view 
            	 :formReportFile ="item.formReportFile"
           	   :caseIds= "caseId"
               :current="index + 1" 
               :length="tabFormData.length + 1"
               @complete="handleComplete"
               ref="FineReportForm">
            </tab2-view>
          </TabPane>        
        </template>

        <template v-if="tabFormLoad">
          <TabPane :label="tab5Name" name="tab5">
            <tab5-view showFlag="'1'" ref='tab5view'></tab5-view>
          </TabPane>
          <TabPane :label="tab6Name">
            <tab6-view showFlag="'1'" ref="component4"></tab6-view>
          </TabPane>         
                              
          <!--右侧公共部分-->
          <TabPane :label="tab10Name">
            <rightTab1-view showFlag="'1'" ref="tab10view" @previewsFun="previews"></rightTab1-view>
          </TabPane>
          <TabPane :label="tabName3">
            <rightTab2-view showFlag="'1'" ref="component3"></rightTab2-view>
          </TabPane>          
          <TabPane :label="tabName2">
            <rightTab3-view showFlag="'1'" ref="component2"></rightTab3-view>
          </TabPane>
          <TabPane :label="tabName1">
            <rightTab4-view showFlag="'1'" :cardNumber="this.$refs.tabForm1.relatedPersonInfo.cardNumber" ref="component1"></rightTab4-view>
          </TabPane>          
        </template>
      </Tabs>      
    </div>
  
    <!--start  预览-->
    <ul id="dowebok9" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015000;" v-show="previewsModal">
      <div class="viewer-canvas viewer-invisible">
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
      </div>
      <div class="viewer-button viewer-close" data-action="mix"></div>
    </div>
    <!--end  预览-->
  </div>
</template>

<script>
require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');

import panel from '../../../common/panel.vue';//panel区
import tab1 from './info.vue';//申请基本信息
import tab2 from './form1.vue';//业务表单(帆软表单)
import tab3 from './infobag.vue';//资料袋
import tab5 from './log.vue';//流程日志
import tab6 from '../../../common/diagram.vue';//流程图
import rightTab1 from '../../../common/guide.vue';//办事指南
import rightTab2 from '../../../common/problem.vue';//常见问题
import rightTab3 from '../../../common/interaction.vue';//受审互动
import rightTab4 from '../../../common/review.vue';//历史审查
import opinion from '../../../common/opinion.vue';

export default {
  components: {
    'panel-view': panel,    
    'tab1-view': tab1,
    'tab2-view': tab2,
    'tab3-view': tab3,
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
    	caseInfo:'', 
      caseId:this.$route.query.caseId,
      isShowData: {},       //控制一些模块是否显示
      tabFormData: [],      //有业务表单且有表单明细信息
      tabIndex: 0,
      tabFormLoad: false,   //业务表单加载完成后在显示右侧页签  
      tabName1: (h) => {
        return h('div', [
          h('span', '历次审查'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component1.getList();
              }
            }
          })
        ])
      },
      tabName2: (h) => {
        return h('div', [
          h('span', '受审互动'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component2.getList();
              }
            }
          })
        ])
      },
      tabName3: (h) => {
        return h('div', [
          h('span', '常见问题'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component3.getList();
              }
            }
          })
        ])
      },
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
      tab6Name: (h) => {
        return h('div', [
          h('span', '流程图'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component4.getProcessInstanceId(this.$route.query.caseId);
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
      previewsModal:false
    }
  },
  created(){

    this.apiH = window.config.api;
    //控制业务表单是否显示以及显示数量
    axios.post("/cgaCase/queryCaseProjectControlInfo.do", {caseId:this.$route.query.caseId})
    .then(data=>{
      this.isShowData = data.obj;
      if(data.obj && data.obj.projectFormDetail && data.obj.projectFormDetail.length > 0){
        this.tabFormData = data.obj.projectFormDetail;
        
         this.caseInfo = this.userData; 
        this.tabFormLoad = true;
      }else{
        this.tabFormLoad = true;
      }
    });
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok9'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok9 img').click();
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
  }
}
</script>



