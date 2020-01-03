<template>
  <div class="layout-content">
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="view">
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../../assets/img/icon_file_png.png">
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
              <Button type="success" size="small" @click="previews(item.fileId,item.fileType)" style="margin-bottom:3px;">预览</Button>
              <Button type="primary" size="small" style="margin-bottom:3px;" @click="reNameShow(item.id)">重命名</Button>
              <Button type="error" size="small" @click="delConfirm(item.id,item.fileId)">删除</Button>
            </div>            
          </a>
            <p :title="item.fileName + item.fileType" v-if='reloadNameShowId!=item.id' style="text-align: left;padding-left:10px">{{item.fileName + item.fileType}}</p>
            <input type="text" name="请输入名称" v-focus="true" style="margin-top:3px; margin-bottom:3px; display:block; width:80px; height:20px" v-model='reloadName'  v-if='reloadNameShowId==item.id' @blur="reNameFun(item.id)">        
        </Col>    
      </template>
    </Row>
	<!--
    <Row class="center">
      <Col span="24">
        <router-link :to="{path:'../index', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber}}"><Button>返回</Button></router-link>         
	  </Col>
    </Row>-->

    <!--start  预览-->
    <ul id="dowebok8" style="display: none;">
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
	  materialId:'',
      materialData: [],   //材料列表数据
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      reloadName:'', //重命名
      reloadNameShowId:'',//
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
    //this.fileList();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods: {
    fileList(materialId){
	  this.materialId=materialId;
      axios.post("/cgaCaseMaterial/queryCaseMaterialFileList.do", {caseId:this.$route.query.caseId, materialId:materialId})
      .then(data=>{
        this.materialData = data.obj;
      })
    },

    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok8'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok8 img').click();
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
        this.fileList(this.materialId);
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
            this.fileList(this.materialId);
          })
        },
        onCancel: () => {
          this.$Message.info('点击了取消');
        }
      });
    },
  
  },
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
      //line-height: 80px;
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