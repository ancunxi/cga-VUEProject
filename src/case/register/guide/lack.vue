<template>
  <div class="layout-content">
    <div class="mPrint">
      <Row>
        <Col span="24">
          <h3 class="guide-title">{{egsProjectInfo1.projectName}}</h3>
          <h5 class="guide-subtitle">
            <span>事项类型：<strong class="red">{{egsProjectInfo1.projectTypeName}}</strong></span>
            <span>所需资料种类数量：<strong class="red">{{trueMaterialsCount1}}</strong></span>
            <span>是否收费：<strong class="red">{{isChargeName1}}</strong></span>
          </h5>
        </Col>
      </Row>
      <Row class="margin-bottom-20">
        <Col span="12">
          <Row>
            <Col span="24">
              <h5 class="tbTit">所需材料</h5>
              <needMaterialInfo-view></needMaterialInfo-view>
            </Col>
          </Row>       
        </Col>
        <Col offset="1" span="11">
          <Row>
            <Col span="24">
              <h5 class="tbTit">缺失材料</h5>
              <noNeedMaterialInfo-view></noNeedMaterialInfo-view>
            </Col>
          </Row>       
        </Col>
      </Row>
    </div>
    <Row class="center">
      <Col span="24">
        <Button type="success" @click="print1">打印</Button>
        <router-link to="../window/index" style="margin-left:8px;"><Button>返回</Button></router-link>
      </Col>
    </Row> 

    <!--打印模板div-->
    <div id="printTemplateHtmlDiv" v-html="printTemplateHtml" align="center" v-show="false"></div>
  </div>
</template>

<script>
require('../../../assets/js/jquery.min.js');
import needMaterialInfo from './lack_MaterialPage/selectedMaterialsInfo.vue';
import noNeedMaterialInfo from './lack_MaterialPage/noSelectedMaterialsInfo.vue';
export default{
  components: {
    'needMaterialInfo-view':needMaterialInfo,
    'noNeedMaterialInfo-view':noNeedMaterialInfo
  },
  data(){
    return{
      //页面初始化数据
      egsProjectInfo1:{},
      isChargeName1:'',
      trueMaterialsCount1:'',
      
      arr:[],//当前缺少材料id集合
      arr1:[],//所需材料id集合
      printTemplateHtml:''//打印模板
    }
  },
  created(){
    axios.post("/cgaCaseRegist/getCgaCaseGuideBaseInfo.do",{guideIds:this.$route.query.guideIds,projectId:this.$route.query.projectId,
      projectNo:this.$route.query.projectNo})
    .then(data=>{
      if(!data.success){
        //返回错误状态                    
        return false;
      }
      this.egsProjectInfo1 = data.obj.egsProjectInfo || {};
      this.isChargeName1 = data.obj.isCharge==0?"收费":"不收费";
      this.trueMaterialsCount1=data.obj.trueMaterialsCount;

      //查出模板html
      this.queryTemplateHtml(this.egsProjectInfo1.projectName,this.egsProjectInfo1.projectTypeName,this.isChargeName1);
    });
  },
  methods: {
    queryTemplateHtml(projectName,projectTypeName,isChargeName1){
      this.arr1=this.$route.query.allSelectedMids||[];
      this.arr=this.$route.query.noSelectedMids||[];
      axios.post("/cgaDocumentPrint/queryProjectGuideMaterialsTemplate.do",{wordName:'w05',projectName:projectName,projectTypeName:projectTypeName,
      isCharge:isChargeName1,allSelectedMids:this.arr1.join(),noSelectedMids:this.arr.join()})
      .then(data=>{
        if(!data.success){
          //返回错误状态                    
          return false;
        }
        this.printTemplateHtml = data.obj.HTML;
      });
    },
    print1(){
      var newWindow=window.open("打印窗口","_blank");
      var tpHtml = $("#printTemplateHtmlDiv").html();
      newWindow.document.write(tpHtml);
      newWindow.document.close();
      newWindow.onload = function(){
        newWindow.print();
        newWindow.close();
      }
      // setTimeout(function(){
      //   newWindow.print();
      //   newWindow.close();
      // },300);
    }
  }
} 
</script>

<style lang="scss">
.guide-title{
  margin-bottom: 15px;
  text-align: center;
}
.guide-subtitle{
  padding-bottom: 15px;
  margin-bottom: 40px;
  text-align: center;
  border-bottom: 1px solid #dddee1;
  span{
    margin-right: 50px;
    &:last-child{
      margin-right: 0;
    }
  }
}
.tbTit{
  margin-bottom: 5px;
  padding-left: 5px;
  font-weight: bold!important;
}
</style>