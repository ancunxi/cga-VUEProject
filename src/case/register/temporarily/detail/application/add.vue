<!-- 申请材料 添加 -->
<template>
  <!-- <div class="layout-content"> -->
  <div>
    <Row>
      <template v-for="item in exampleDataList">
        <Col span="4" class="view">
          <input type="checkbox" v-model='checkboxModel' :value='item.fileId' />
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
            <div class="uploadHoverBtn">
              <Button type="success" size="small" style="margin-bottom:3px; margin-top:20px;" @click="previews(item.fileId,item.fileName,item.fileType)">预览</Button>
            </div>            
          </a>
          <p :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>
        </Col>    
      </template>
      <Col span="24" v-if='exampleDataList == ""' style="padding:15px; text-align:center; font-size:14px; font-weight:700; color:#ed3f14;">暂无数据</Col>
      <Col span="24" class="ivu-modal-btn">
        <Button type="text" @click='applicationCancel'>取消</Button>
        <Button type="primary" @click='applicationAdd' style="margin-left:8px;">确定</Button>
      </Col>
    </Row>

    <!--start  预览-->
    <ul id="applicationTemadd" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-show="previewsModal">
      <div class="viewer-canvas viewer-invisible">
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
      </div>
      <div class="viewer-button viewer-close" data-action="mix"></div>
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
      materialId:'', //事项资料ID
      //图片文档预览
      apiH: '',
      viewFileId: '',  //文件id
      previewsModal: false,
      //勾选
      checkboxModel:[]
    }
  },
  created(){
    this.apiH = window.config.api;
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    exampleList(materialId){
      this.checkboxModel = [];
      this.materialId = materialId;
      //查询申请人历史标准资料办件材料列表
      //cardNumber 证件号码或统一社会信用代码
      //materialId 事项资料ID
      axios.post("/cgaCaseMaterial/queryHistoryStandardMaterialFileList.do", {materialId:materialId,cardNumber:this.$route.query.cardNumber})
      .then(data=>{
        this.exampleDataList = data.obj || [];
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
        axios.post("/cgaCaseMaterial/addHistoryCaseMaterialFile.do", {caseId:this.$route.query.caseId,materialId:this.materialId,fileIds:fileIds})
        .then(data=>{
          if(data.success){
            this.$Message.success('添加成功！');
            this.$emit('applicationAdd');
          }else{
            this.$Message.error('添加失败！');
          }
        });
      }
    },
    applicationCancel(){
      this.$emit('applicationCancel');
    }
  }
}
</script>




