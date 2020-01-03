<template>
  <div class="layout-content">
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="view">
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../assets/img/icon_file_png.png">
            <img v-if="/^.+\.jpg$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_jpg.png">
            <img v-if="/^.+\.jpeg$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_jpeg.png">
            <img v-if="/^.+\.gif$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_gif.png">   
            <img v-if="/^.+\.bmp$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_bmp.png">          
            <img v-if="/^.+\.pdf$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_pdf.png">
            <img v-if="/^.+\.doc$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_doc.png">
            <img v-if="/^.+\.docx$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_docx.png">
            <img v-if="/^.+\.ppt$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_ppt.png">
            <img v-if="/^.+\.txt$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_txt.png">
            <img v-if="/^.+\.xls$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_xls.png">
            <img v-if="/^.+\.xlsx$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_xlsx.png">
            <p :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>
            <div class="uploadHoverBtn">
              <Button type="success" size="small" style="margin-bottom:3px;" @click="previews(item.fileId,item.fileType)">预览</Button>
              <!-- <Button type="primary" size="small" style="margin-bottom:3px;">重命名</Button>
              <Button type="error" size="small" @click="delConfirm">删除</Button> -->
            </div>            
          </a>          
        </Col>    
      </template>
    </Row>  
    <Row class="center">
      <Col span="24">
        <router-link :to="{path:'index', query:{id:this.$route.query.id, caseId:this.$route.query.caseId, workFlowType:this.$route.query.workFlowType, businessId:this.$route.query.businessId, deputyType:this.$route.query.deputyType, projectId:this.$route.query.projectId, projectNo:this.$route.query.projectNo, tacheInfo:this.$route.query.tacheInfo,inCurrentPage:this.$route.query.inCurrentPage,cardNumber:this.$route.query.cardNumber,taskId:this.$route.query.taskId,taskDefinitionKey:this.$route.query.taskDefinitionKey}}"><Button>返回</Button></router-link>         
      </Col>
    </Row>    

    <!--start  预览-->
    <ul id="dowebok21" style="display: none;">
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
export default{
  data(){
    return{
      materialData: [],   //材料列表数据
      apiH:'',
      previewsModal:false,
      viewFileId:''  //文件id
    }
  },
  //根据办件流水号和事项资料ID查询查看材料的列表
  created(){
    this.apiH = window.config.api;
    axios.post("/cgaCaseTacheFile/queryList.do", {caseId:this.$route.query.caseId})
    .then(data=>{
      this.materialData = data.obj;
    })
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods: {
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok21'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok21 img').click();
          let _this = this;
          let timeImg = setInterval(function(){
              if($('.viewer-container img').attr('alt') != undefined){
                  clearInterval(timeImg);
                  $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
              }
          },300)
        })
        
      }
    } 
    // ,delConfirm(){
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '<p>确定删除吗？</p>',
    //     okText: '删除',
    //     onOk: () => {
    //       this.$Message.info('点击了确定');
    //     },
    //     onCancel: () => {
    //       this.$Message.info('点击了取消');
    //     }
    //   });
    // }
  }
}
</script>

<style lang="scss">
.view{
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea{
    position: relative;
    display: block;
    img{
      display: block;
    }
    p{
      width: 80px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; 
      color: #1c2438;    
    }
    .uploadHoverBtn{
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
    &:hover .uploadHoverBtn{
      display: block;
    }  
  }  
}
</style>