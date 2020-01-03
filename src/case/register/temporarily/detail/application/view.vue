<!-- 申请材料 查看 -->
<template>
  <div>
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="view">
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="item.isPass == '1'" src="../../../../../assets/img/pass.png">
            <img v-else-if="item.isPass == '0'" src="../../../../../assets/img/Npass.png">
            <img v-else-if="item.isPass == '2'" src="../../../../../assets/img/falseMaterial.png">
            <img v-else-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../../assets/img/icon_file_png.png">
            <img v-else-if="/^.+\.jpg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpg.png">
            <img v-else-if="/^.+\.jpeg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpeg.png">
            <img v-else-if="/^.+\.gif$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_gif.png"> 
            <img v-else-if="/^.+\.bmp$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_bmp.png">            
            <img v-else-if="/^.+\.pdf$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_pdf.png">
            <img v-else-if="/^.+\.doc$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_doc.png">
            <img v-else-if="/^.+\.docx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_docx.png">
            <img v-else-if="/^.+\.ppt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_ppt.png">
            <img v-else-if="/^.+\.txt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_txt.png">
            <img v-else-if="/^.+\.xls$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xls.png">
            <img v-else="/^.+\.xlsx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xlsx.png">
             <div class="uploadHoverBtn">
              <Button type="success" size="small" style="margin-bottom:3px;" @click="previews(item.fileId,item.fileType)">预览</Button>
              <Button type="primary" size="small" style="margin-bottom:3px;" @click="reNameShow(item.id)">重命名</Button>
              <Button type="error" size="small" @click="delConfirm(item.id,item.fileId)">删除</Button>
            </div>            
          </a> 
		  
			<p :title="item.fileName + item.fileType" v-if='reloadNameShowId!=item.id' style="text-align: left;padding-left:10px">{{item.fileName + item.fileType}}</p>
            <input type="text" name="请输入名称" v-focus="true" style="margin-top:3px; margin-bottom:3px; display:block; width:80px; height:20px" v-model='reloadName' v-if='reloadNameShowId==item.id' @blur="reNameFun(item.id)">

            <div style="text-align:left;">
              <Button type="info" size="small" @click="falseMaterial(item.id)" v-if="item.isPass != '2'">虚假材料</Button>
              <Button type="success" size="small" @click="recoverMaterial(item.id)" v-if="item.isPass == '2'">恢复材料</Button>
            </div>
			
        </Col>    
      </template>
    </Row> 

    <!--start  预览-->
    <ul id="dowebok30" style="display: none;">
      <li v-for="item in materialData" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
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
// require('../../../../../assets/js/viewer.min.js');
require('../../../../../assets/js/jquery.min.js');
import {Viewer} from '../../../../../assets/js/viewer.js';
export default{
  data(){
    return{
      materialData: [],   //材料列表数据
      imgMaterialData:[],  //图片材料列表数据
      materialId0:'',
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      reloadName:'', //重命名
      reloadNameShowId:'',
    }
  },
  directives: {
	  focus: {
		// 指令的定义
		inserted: function (el) {
		  el.focus()
		}
	  }
	},
  //根据办件流水号和事项资料ID查询查看材料的列表
  created(){
    this.apiH = window.config.api;
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods: {
    fileList(materialId){
      this.materialId0 = materialId || this.materialId0;
      axios.post("/cgaCaseMaterial/queryCaseMaterialFileList.do", {caseId:this.$route.query.caseId, materialId:this.materialId0})
      .then(data=>{
        this.materialData = data.obj;
      })
    },

    //材料置为虚假
    falseMaterial(viewId) {
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:viewId, isPass:'2'})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          this.$Message.success('材料置为虚假材料');
          this.fileList();
        }else{
          this.$Message.error(data.msg);
        }
      })
    },
    //材料恢复
    recoverMaterial(viewId) {
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:viewId, isPass:'1'})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          this.$Message.success('材料审核通过');
          this.fileList();
        }else{
          this.$Message.error(data.msg);
        }
      })
    },

    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok30'), {
          url: 'data-original'
        });
        this.imgMaterialData=this.materialData.filter(function(item){
          return (item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg')
        })
        let imgNum=0;
        for(let i=0;i<this.imgMaterialData.length;i++){
          if(this.imgMaterialData[i].fileId==id){
            imgNum = i
          }
        }
        $('#dowebok30 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok30 img').click();
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
    reNameShow(id){
      this.reloadNameShowId = id;
    },
    //重命名办件材料的材料名称
    reNameFun(id, name){
      this.reloadNameShowId = '';
      if(this.reloadName == ''){
        this.$Message.error('保存失败，重命名不能为空！');
        return false;
      }
      axios.post("/cgaCaseMaterial/renameFileName.do", {id:id, fileName:this.reloadName})
      .then(data=>{
        this.$Message.success(data.msg);
        this.reloadName = '';
        this.fileList();
      })
    },
    //删除办件材料记录
    delConfirm(id,fileId){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          axios.post("/cgaCaseMaterial/deleteCaseMaterialFile.do", {id:id, fileId:fileId})
          .then(data=>{
            this.$Message.success(data.msg);
            this.$emit('parentgetList');  //触发父组件更新
            this.fileList();
          })
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "../../../../../assets/css/viewer.css";
.viewer-toolbar{
  width: 280px !important;
}
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