<template>
  <div class="layout-content">
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="example">
          <a href="javascript:;" class="uploadArea" :title="item.exampleName">
            <img v-if="/^.+\.png$/.test(item.exampleName) == true" src="../../../../../assets/img/icon_file_png.png">
            <img v-if="/^.+\.jpg$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_jpg.png">
            <img v-if="/^.+\.jpeg$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_jpeg.png">
            <img v-if="/^.+\.gif$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_gif.png">  
            <img v-if="/^.+\.bmp$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_bmp.png">          
            <img v-if="/^.+\.pdf$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_pdf.png">
            <img v-if="/^.+\.doc$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_doc.png">
            <img v-if="/^.+\.docx$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_docx.png">
            <img v-if="/^.+\.ppt$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_ppt.png">
            <img v-if="/^.+\.txt$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_txt.png">
            <img v-if="/^.+\.xls$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_xls.png">
            <img v-if="/^.+\.xlsx$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_xlsx.png">
            <p :title="item.exampleName">{{item.exampleName}}</p>
            <div class="uploadHoverBtn">
              <Button type="success" size="small" @click="previews(item.fileId,item.exampleName)" style="margin-top:28px;">预览</Button>
            </div>            
          </a>          
        </Col>    
      </template>
    </Row>    
   <Row class="center">
      <Col span="24">
        <router-link :to="{path:'../index', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber}}"><Button>返回</Button></router-link>         
      </Col>
    </Row>

    <!--start  预览-->
    <ul id="dowebok7" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-if="previewsModal">
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
      materialData: [],

      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
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
      //根据事项资料Id查询指定事项资料的样例列表
      axios.post("/cgaProject/queryProjectExampleList.do", {materialId:this.$route.query.materialId})
      .then(data=>{
        this.materialData = data.obj;
      });
    },
    //预览
    previews(id,name){
      this.viewFileId = id;
      if(/^.+\.png$/.test(name) == false && /^.+\.jpg$/.test(name) == false && /^.+\.bmp$/.test(name) == false){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok7'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok7 img').click();
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
  }
}
</script>

<style lang="scss">
.example{
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea{
    position: relative;
    display: block;
    img{
      display: block;
    }
    .uploadHoverBtn{
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      width: 80px;
      height: 80px;
      //line-height: 80px;
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
    }
    &:hover .uploadHoverBtn{
      display: block;
    }  
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
}
</style>




