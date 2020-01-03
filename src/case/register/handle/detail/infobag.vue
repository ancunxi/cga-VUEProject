<template>
 
<!--申请材料-->
<Row class="margin-bottom-60">
  <Col span="24">
    <h5 class="title"><span><Icon type="ios-list"></Icon>申请材料</span></h5>
    <Row class="apply-material">
      <template v-for="item in materialData" v-if="materialData != ''">
        <Col span="4" class="margin-bottom-40 h140">
          <div class="plate">
            <a href="javascript:;">
              <span v-if="item.uploadNum > '0'" class="number">{{item.uploadNum}}</span>
              <!--上传材料前的显示-->
              <span v-if="item.fileType == undefined">
                <img src="../../../../assets/img/icon_png_unknow.png">
              </span>
              <!--材料上传成功之后-->
              <span v-else>
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
              </span>
              <!--鼠标移动上去的效果-->
              <!-- <div class="uploadHoverBtn">
                <Row class="uploadLocalFile">
                  <Col span="24">
                    <Button size="small">上传</Button>
                    <form id="uploadForm" class="uploadForm">
                      <input type="hidden" name="folder" :value="'cga/' + $route.query.caseId">
                      <input type="hidden" name="source" value="1">
                      <input type="file" name="datafile" class="file" @change="uploadMaterial(item.caseId, item.materialId)">
                    </form>         
                  </Col>
                </Row>
                <Button size="small">高拍仪</Button>
                <router-link :to="{path:'./application/add', query:{materialId:item.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber}}">
                  <Button type="primary" size="small" class="rename">添加</Button>
                </router-link>
              </div> -->                
            </a>
            <p :title="item.materialName" class="uploadName">{{item.materialName}}</p>
            <div>
              <router-link :to="{path:'./application/sample', query:{materialId:item.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:tabsName}}" v-if="item.exampleNum > '0'"><Button type="info" size="small">样例</Button></router-link>
              <router-link :to="{path:'./application/view', query:{materialId:item.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:tabsName}}" v-if="item.uploadNum > '0'"><Button type="success" size="small">查看</Button></router-link>
            </div>
          </div>
        </Col>
      </template>
      <template  v-if="materialData == ''">
        <Col span="4" class="margin-bottom-40">
          <div class="plate">
            <a href="javascript:;">
              <span>
                <img src="../../../../assets/img/icon_png_unknow.png">
              </span>
              <p>暂无数据</p>
            </a>
          </div>
        </Col>
      </template>
    </Row>                   
  </Col>
</Row>

</template>

<script>
export default {
  props: {
    isShowData: {
      type: Object
    },
    current: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    tabsName:{
      type:String
    }
  }, 
  components: {

  },
  data () {
    return {
      materialData: [],
      exampleNum: '',   //样例数量
      uploadNum: '',    //查看数量
      specialModal:false   //特殊情况材料上传 modal框
    }
  },
  created(){
    //渲染申请材料列表
    this.getMaterial();
    
  },
  methods: {
    //*************************start 高拍仪获取身份证信息、上传照片**************************************//
    //读取身份证信息
    Idcard(){
      Idcard0();
      this.userData.cardNumber = document.getElementById('Text6').value;
      this.inquiryMessage();
    },
    //根据身份证号查询个人信息
    inquiryMessage(){
      axios.post("/cgaCaseRegist/queryCitizenByCardNumber.do", {cardNumber:this.userData.cardNumber})
      .then(data=>{
             
      }); 
    },
    //拍照
    userPhoto(){
      opendeviceCarmera(2);  //摄像头  1身份证    2 头像
      //显示高拍仪
      document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
      document.getElementById('carmerayw').classList.add('carmerayw');
      //清空之前的值  （仅需清理文件名）
      document.getElementById('CarmeraPhotoName').value = '';
      // document.getElementById('Base64Text').value;  //照片编码
    },
    carmeraFun(){
      let abase64 = document.getElementById('Base64Text').value;   //图片编码
      let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
      let _this = this;
      //Base64文件上传(HDFS)
      axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
      .then(data=>{
        //添加办件图像记录信息
        axios.post("/cgaCaseRegist/addCaseStaff.do", {caseId:this.$route.query.caseId, applyFileId:data.obj.id})
        .then(data0=>{
          this.$Message.success('头像上传成功');
        }); 
      }); 
    },
    //*************************end 高拍仪获取身份证信息、上传照片**************************************//
    //查询指定办件的筛选资料列表
    getMaterial(){
      axios.post("/cgaCaseMaterial/queryCaseGuideMaterialListByPage.do", {caseId:this.$route.query.caseId, pageSize: 100})
      .then(data=>{
        this.materialData = data.obj.records || [];
        if(data.obj.records != undefined && data.obj.records != ''){
          //样例
          this.exampleNum = data.obj.records.map(item => item.exampleNum);
          //查看
          this.uploadNum = data.obj.records.map(item => item.uploadNum);  
        }
             
      }); 
    },
    //上传申请材料
    uploadMaterial(caseId, materialId){
      let self = this;
      var formData = new FormData($( "#uploadForm" )[0]);
      $.ajax({  
        url: window.config.api + '/attachment/uploadFile.do',  
        type: 'POST',  
        data: formData,
        async: false,  
        cache: false,  
        contentType: false,  
        processData: false, 
        success: function (data) {  
          self.fileId = data.obj.id;
          self.fileName = data.obj.fileName; 
          self.fileType = data.obj.fileType;            
          self.$Message.success('上传成功！'); 
          //新增办件材料记录
          axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
          .then(data=>{
            self.getMaterial();
          });
        },
        error: function (err) { 
          self.$Message.error('上传失败！');
        }
      });  
    },
     
    //预览
    previews(id,type){
      this.$emit('previewsFun',id,type);
    },
  }
}
</script>

<style lang="scss">
.apply-material{
  padding: 10px 10px 50px;
  border: 1px dashed #e9eaec;
  .plate{
    position: relative;
    width: 85px;
    //height: 100px;
    text-align: center;
    a{
      .uploadHoverBtn{
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        width: 85px;
        height: 80px;
        text-align: center;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.5);
        button{
          margin: 1px 0;
        }       
      }
      &:hover .uploadHoverBtn{
        display: block;
      } 
      .number{
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 20px;
        height: 20px;
        text-align: center;
        background: #0000FF;
        border-radius: 50%;
        color: #fff;
        font-size: 12px;
      }
    }
    .uploadName{
      width: 85px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      margin-bottom: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #1c2438;
    }
  }
}
</style>