<template>
	<div class="layout-content">
	<Row class="margin-bottom-5">
      <template>
                <table-info></table-info>        
      </template>       
  	</Row>
   <Row class="margin-bottom-5">
  		<!--<h5 class="title"><span><Icon type="images"></Icon>申请材料</span></h5>-->
           
  <Tabs type="card" style=" margin-bottom: -100px;">
        <TabPane label="资料袋"> 
        	<template>
        		<h5 class="title"><span><Icon type="images"></Icon>申请材料</span></h5>
      	 <table-data></table-data>   
      </template> </TabPane>  
  </Tabs>
           
  </Row>
    <Row class="margin-bottom-1">
      <Col span="24">
        <h5 class="title">
          <span><Icon type="images"></Icon>特殊情况材料</span>
          <strong class="red">（注：此页签可自定义上传材料名称，如需上传资料收件页签以外的材料可由此处上传）</strong>
        </h5>
        <Row class="bordered-dashed-1">
          <!--上传之后-->
          <template v-for="item in specialData">
            <Col span="4" class="uploadArea">
              <a href="javascript:;" :title="item.fileName + item.fileType">
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
                <!--鼠标移动上去的效果-->
                <div class="uploadHoverBtn">
                  <Button type="success" size="small" class="margin-bottom-10" @click="previews(item.fileId,item.fileType)">预览</Button>
                  <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button>
                </div>            
              </a> 
              <p :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>         
            </Col>    
          </template> 
          <!--上传之前-->         
          <Col span="4" style="margin:10px;">          
            <router-link :to="{path:'special/index', query:{moduleId:this.$route.query.moduleId, projectId:this.$route.query.projectId, caseId:this.$route.query.caseId}}"><img src="../../../../assets/img/upload.png"></router-link>
          </Col>          
        </Row>                          
      </Col>
    </Row>  

    <Row class="center">
      <Col span="24">
      	<router-link :to="{path: '../index',query: {currentPage:this.$route.query.inCurrentPage,moduleId:this.$route.query.moduleId}}"><Button>返回</Button></router-link>
      </Col>
    </Row>

    <!--start  预览-->
    <ul id="dowebok3" style="display: none;">
      <li v-for="item in specialData" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
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
// require('../../../../assets/js/viewer.min.js');
import {Viewer} from '../../../../assets/js/viewer.js';
import dataRow from './table-data.vue';
import datainfo from './table-info.vue';
export default {
  components: {
    'table-data': dataRow,
    'table-info': datainfo
  },
  data () {
    return {
    	specialData: [],   //特殊情况材料列表数据
      imgMaterialData:[],  //图片材料列表数据
      //图片文档预览
      apiH: '',
      viewFileId: '',    //文件id
      previewsModal: false
    }
  },
  created(){
    this.apiH = window.config.api;
    //渲染特殊情况材料列表
    this.getSpecials();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    //根据办件流水号获取特殊情况材料列表数据
    getSpecials(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj;      
      }); 
    }, 
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp' && type != '.jpeg'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok3'), {
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
        $('#dowebok3 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok3 img').click();
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
    //删除已上传的特殊情况材料
    delConfirm(id, fileId){
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk:()=>{
          axios.post("/cgaSpecialFile/deleteSpecialFile.do", {id:id, fileId:fileId})
          .then(data=>{
            this.$Message.success(data.msg);
            this.getSpecials();            
          })
        }
      })      
    } 
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/viewer.css";
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
    text-align: center;    
    border-radius: 3px;
    background: rgba(0,0,0,0.5);
  }
  &:hover .uploadHoverBtn{
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
}
</style>