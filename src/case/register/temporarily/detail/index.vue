<template>
  <div class="layout-content">
    <panel-view></panel-view>
    <div class="tabs">
      <Tabs type="card" v-model="tabIndex">
        <!--把父组件中的isShowData对象传到子组件中-->
        <TabPane :label="'申请基本信息'" :disabled='tabIndexA==0?false:true'>
          <tab1-view 
            :current="0" 
            :length="tabFormData.length + 1"
            :isShowData="isShowData"
            @next="handleNext" 
            @prev="handlePrev"
            @previewsFun="previews"
            @loadingShow="handleLoadingShow"
            @loadingHide="handleLoadingHide"
            @updateSpecilData="loadingSpecil"
            ref="tabForm1">
          </tab1-view>
        </TabPane>
        <template v-for="(item, index) in tabFormData">
          <TabPane :label="item.formName"  :disabled='(tabIndexA==index+1)?false:true'>
            <tab2-view 
              :current="index + 1" 
              :length="tabFormData.length + 1"
              :isShowData="isShowData"
              :formReportFile ="item.formReportFile"
              :caseId ="caseIds"
              @next="handleNext" 
              @prev="handlePrev"
              @complete="handleComplete" 
              @temporarily="handleTemporarily" 
              @correction="handleCorrection"
              @loadingShow="handleLoadingShow"
              @loadingHide="handleLoadingHide">
            </tab2-view>
          </TabPane>        
        </template>
        <!--右侧公共部分-->
        <template v-if="tabFormLoad">
          <!-- 办事指南 -->
          <TabPane :label="tabName1">
            <rightTab1-view ref="component1" @previewsFun="previews"></rightTab1-view>
          </TabPane> 
          <!-- 常见问题 -->
          <TabPane :label="tabName2">
            <rightTab2-view ref="component2"></rightTab2-view>
          </TabPane>  
          <!-- 受审互动 -->
          <TabPane :label="tabName3">
            <rightTab3-view ref="component3"></rightTab3-view>
          </TabPane>
          <!-- 历次审查  -->
          <TabPane :label="tabName4">
            <rightTab4-view :cardNumber="this.$refs.tabForm1.userData.cardNumber" ref="component4"></rightTab4-view>
          </TabPane>          
        </template>
      </Tabs> 
    </div>   


    <!--start  预览-->
    <ul id="dowebok31" style="display: none;">
      <li v-for="item in specialList" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
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
import panel from '../../../common/panel.vue';
import tab1 from './info.vue';
import tab2 from './form.vue';
import rightTab1 from '../../../common/guide.vue';
import rightTab2 from '../../../common/problem.vue';
import rightTab3 from '../../../common/interaction.vue';
import rightTab4 from '../../../common/review.vue';  
// require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');
import {Viewer} from '../../../../assets/js/viewer.js';
export default {
  components: {
    'panel-view': panel,
    'tab1-view': tab1,
    'tab2-view': tab2,
    'rightTab1-view': rightTab1,
    'rightTab2-view': rightTab2,
    'rightTab3-view': rightTab3,
    'rightTab4-view': rightTab4
  },
  data(){
    return{
      specialList:[],
      imgMaterialData:[],     
      loadingModal: false, //loading框

      isShowData: {},       //控制一些模块是否显示
      tabFormData: [],      //有业务表单且有表单明细信息
      tabIndex: 0,    //记录基本信息、表单激当前激活项
      tabIndexA: 0,    
      tabFormLoad: false,   //业务表单加载完成后在显示右侧页签 
      tabName1: (h) => {
        return h('div', [
          h('span', '办事指南'),
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
          h('span', '常见问题'),
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
          h('span', '受审互动'),
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
      tabName4: (h) => {
        return h('div', [
          h('span', '历次审查'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.$refs.component4.getList();
              }
            }
          })
        ])
      },
      
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
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
        this.tabFormLoad = true;
      }else{
        this.tabFormLoad = true;
      }
    });
    this.getSpecial();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods: {
    getSpecial(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialList = data.obj;      
      }); 
    },
    loadingSpecil(){
      this.getSpecial();
    },
    //下一步
    handleNext() {
      if(this.tabIndex >= this.tabFormData.length){return false;}
      this.tabIndex += 1;
      this.tabIndexA += 1;
    },
    //上一步
    handlePrev(){
      if(this.tabIndex <= 0){return false;} 
      this.tabIndex -= 1;
      this.tabIndexA -= 1;
    },    
    handleComplete(){
      //this.$emit('complete');
      //this.$refs.tabForm1.handleComplete();
    },
    handleTemporarily(){
      this.$refs.tabForm1.handleTemporarily();
    },
    handleCorrection(){
      this.$refs.tabForm1.handleCorrection();
    },  
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp' && type != '.jpeg'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok31'), {
          url: 'data-original'
        });
        this.imgMaterialData=this.specialList.filter(function(item){
          return (item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg')
        })
        let imgNum=0;
        for(let i=0;i<this.imgMaterialData.length;i++){
          if(this.imgMaterialData[i].fileId==id){
            imgNum = i
          }
        }
        $('#dowebok31 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok31 img').click();
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
.viewer-toolbar{
  width: 280px !important;
}

</style>


