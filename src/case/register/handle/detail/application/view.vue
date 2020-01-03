<template>
  <div class="layout-content">
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="view">
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="item.isPass === '1'" src="../../../../../assets/img/pass.png">
            <img v-else-if="item.isPass === '0'" src="../../../../../assets/img/Npass.png">
            <img v-else-if="item.isPass === '2'" src="../../../../../assets/img/falseMaterial.png">
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
            <p :title="item.fileName + item.fileType" v-if='reloadNameShowId!=item.id'>{{item.fileName + item.fileType}}</p>
            <input type="text" name="请输入名称" style="margin-top:3px; display:block; width:80px;" v-model='reloadName'  v-if='reloadNameShowId==item.id' @blur="reNameFun(item.id)">

            <div style="text-align:left;">
              <Button type="info" size="small" @click="falseMaterial(item.id)" v-if="item.isPass != '2'">虚假材料</Button>
              <Button type="success" size="small" @click="recoverMaterial(item.id)" v-if="item.isPass == '2'">恢复材料</Button>
            </div>

            <div class="uploadHoverBtn">
              <!-- <Button type="success" size="small" style="margin-bottom:3px; margin-top:8px;" @click="previews(item.id,item.fileId,item.fileName)">预览</Button> -->
              <router-link :to="{path:'viewExamine', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber, viewId:item.id, fileId:item.fileId, fileName:item.fileName, fileType:item.fileType,tabsName:$route.query.tabsName}}">
                <Button type="success" size="small" style="margin-bottom:3px; margin-top:8px;">预览</Button>
            </router-link>
             
              <Button type="primary" size="small" style="margin-bottom:3px; margin-top:8px;" @click="reNameShow(item.id)">重命名</Button>
              <!-- <Button type="error" size="small" @click="delConfirm(item.id,item.fileId)">删除</Button> -->
            </div>            
          </a>          
        </Col>    
      </template>
    </Row>
    <Row class="center">
      <Col span="24">
        <router-link :to="{path:'../index', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:$route.query.tabsName}}"><Button>返回</Button></router-link>         
      </Col>
    </Row>

    

    

  </div>
</template>

<script>
export default{
  components: {

  },
  data(){
    return{
      materialData: [],   //材料列表数据
      
      reloadName:'', //重命名
      reloadNameShowId:'',//

    }
  },
  //根据办件流水号和事项资料ID查询查看材料的列表
  created(){
    this.apiH = window.config.api;
    this.fileList();
  },
  
  methods: {
    fileList(){
      axios.post("/cgaCaseMaterial/queryCaseMaterialFileList.do", {caseId:this.$route.query.caseId, materialId:this.$route.query.materialId})
      .then(data=>{
        this.materialData = data.obj || [];
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
            this.fileList();
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
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
      a{
        height:auto;
        button{
          width:52px;         
        }
      }
      
    }
    &:hover .uploadHoverBtn{
      display: block;
    }  
  }  
}
</style>