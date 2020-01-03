<!-- 申请材料 添加 -->
<template>
  <div class="layout-content">
    <Row>
      <template v-for="item in exampleDataList">
        <Col span="4" class="view">
          <input type="checkbox" v-model='checkboxModel' :value='item.fileId'/>
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../../assets/img/icon_file_png.png">
            <img v-if="/^.+\.jpg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpg.png">
            <img v-if="/^.+\.jpeg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpeg.png">
            <img v-if="/^.+\.gif$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_gif.png">  
            <img v-if="/^.+\.bmp$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_bmp.png">          
            <img v-if="/^.+\.pdf$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_pdf.png">
            <img v-if="/^.+\.doc$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_doc.png">
            <img v-if="/^.+\.docx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_docx.png">
            <img v-if="/^.+\.ppt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_ppt.png">
            <img v-if="/^.+\.txt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_txt.png">
            <img v-if="/^.+\.xls$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xls.png">
            <img v-if="/^.+\.xlsx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xlsx.png">
            <p :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>
            
            <div class="uploadHoverBtn">
              <Button type="success" size="small" style="margin-bottom:3px; margin-top:20px;" @click="previews(item.fileId,item.fileName,item.fileType)">预览</Button>
            </div>            
          </a>          
        </Col>  

      </template>
      <Col span="24" v-if='exampleDataList == ""'>暂无数据</Col> 
    </Row>
    <Row class="center">
      <Col span="24">
        <Button type="primary" v-on:click='applicationAdd'>确定</Button>
        <router-link :to="{path:'../index', query:{moduleId:$route.query.moduleId, caseId:$route.query.caseId, projectId:$route.query.projectId, cardNumber:$route.query.cardNumber}}"><Button style="margin-left:8px;">取消</Button>    </router-link>

           
      </Col>
    </Row>  

    <!--start  预览-->
    <ul id="applicationTemadd" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-show="previewsModal"  >
          <div class="viewer-canvas viewer-invisible">
              <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
          </div>
          <div class="viewer-button viewer-close " data-action="mix"></div>
    </div>
    <!--end  预览-->

  </div>
</template>

<script>
require('../../../../../assets/js/viewer.min.js');
require('../../../../../assets/js/jquery.min.js');

export default{
  data(){
    return{
      exampleDataList: [],

      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      //勾选
      checkboxModel:[]
    }
  },
  created(){
    this.apiH = window.config.api;
    this.exampleList();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    exampleList(){
      this.checkboxModel = [];
      //查询申请人历史标准资料办件材料列表
      //cardNumber 证件号码或统一社会信用代码
      //materialId 事项资料ID
      axios.post("/cgaCaseMaterial/queryHistoryStandardMaterialFileList.do", {materialId:this.$route.query.materialId,cardNumber:this.$route.query.cardNumber})
      .then(data=>{
        if(data.success){
          this.exampleDataList = data.obj || [];
        }else{
          this.$Message.error(data.msg);
        }
      });
    },
    //预览
    previews(id,name,type){
      this.viewFileId = id;
      if(/^.+\.png$/.test(name+type) == false && /^.+\.jpg$/.test(name+type) == false && /^.+\.bmp$/.test(name+type) == false){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('applicationTemadd'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#applicationTemadd img').click();
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

    applicationAdd(){
      //添加历史资料办件材料记录
      //caseId 办件流水号
      //materialId 事项资料ID
      //fileIds  附件IDS  fileIds  附件IDS，例如uuid1,uuid2
      var t=this.checkboxModel||[];
      if(t.length==0){
        this.$Message.error('未勾选任何材料，不能进行添加！');
      }else{
        var fileIds=this.checkboxModel.join();
        axios.post("/cgaCaseMaterial/addHistoryCaseMaterialFile.do", {caseId:this.$route.query.caseId,materialId:this.$route.query.materialId,fileIds:fileIds})
        .then(data=>{
           if(data.success){
              this.$Message.success('添加成功！');
              this.$router.push({path:'../index', query:{moduleId:this.$route.query.moduleId, caseId:this.$route.query.caseId, projectId:this.$route.query.projectId, cardNumber:this.$route.query.cardNumber}})

           }else{
              this.$Message.error('添加失败！');
           }
          
        });
      }
    },
    
  }
}
</script>

<style lang="scss">
.view {
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea {
    position: relative;
    display: block;
    img {
      display: block;
    }
    .uploadHoverBtn {
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      width: 80px;
      height: 80px;
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
    }
    &:hover .uploadHoverBtn {
      display: block;
    }  
  }
  p {
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
    color: #1c2438;    
  }  
}
</style>



