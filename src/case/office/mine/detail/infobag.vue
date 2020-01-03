<template>
  <div>
    <Row>
      <Col span="24">

        <!--申请材料-->
        <Row class="margin-bottom-40">
          <Col span="24">
            <h5 class="title"><span><Icon type="ios-list"></Icon>申请材料</span></h5>
            <Row class="apply-material">
              <template v-for="item in materialData">
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
                    </a>
                    <p :title="item.materialName" class="uploadName">{{item.materialName}}</p>
                    <div>
                      <router-link :to="{path:'./application/sample', query:{materialId:item.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:tabsName}}" v-if="item.exampleNum > '0'"><Button type="info" size="small">样例</Button></router-link>
                      <router-link :to="{path:'./application/view', query:{materialId:item.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:tabsName}}" v-if="item.uploadNum > '0'"><Button type="success" size="small">查看</Button></router-link>
                    </div>
                  </div>
                </Col>
              </template>
            </Row>                   
          </Col>
        </Row>

        <!--特殊材料-->
        <!--接收父组件传递的数据由isSpecialfile字段控制特殊情况材料模块是否显示-->
        <Row v-if="this.isShowData.isSpecialfile === '0'" class="margin-bottom-40">
          <Col span="24">
            <h5 class="title">
              <span><Icon type="images"></Icon>特殊情况材料</span>
            </h5>
            <Row class="special">
              <!--上传之后-->
              <template v-for="item in specialData">
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
                    <div class="uploadHoverBtn">
                      <Button type="success" size="small" class="margin-bottom-10" @click="previews(item.fileId,item.fileType)">预览</Button>
                      <!-- <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button> -->
                    </div>            
                  </a>
                  <p :title="item.fileName + item.fileType" class="uploadName">{{item.fileName + item.fileType}}</p>          
                </Col>    
              </template> 
              <!--上传之前-->         
              <!-- <Col span="4" style="margin-top:10px;">          
                <img src="../../../../assets/img/upload.png" v-on:click='specialModalFun'>
              </Col>  -->         
            </Row>                          
          </Col>
        </Row> 
        
        <!--资料签收列表-->
        <template>
          <cgamaterial-table></cgamaterial-table>
        </template>
      </Col>
    </Row>

    <Row class="margin-bottom-10 center">
      <Col span="24">
        <Button @click="gobacks" style="margin-left:8px;">返回</Button>
        <!-- <router-link to="../index" style="margin-left:8px;"><Button type="primary">返回</Button></router-link> -->
      </Col>
    </Row> 

    <Modal
      v-model="specialModal"
      title="特殊情况材料上传"
      width="850"
      class-name="ivu-modal-style no-modal-footer"
      :mask-closable="false"
      ok-text="关闭">
      <special-modal ref='specialChild'></special-modal>             
    </Modal> 
  </div>
</template>

<script>
import specialModal from './special/index.vue';   //特殊情况材料上传
import cgaCaseMaterialBag from './cgamaterialbag.vue';
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
    'special-modal': specialModal,
    'cgamaterial-table':cgaCaseMaterialBag,
  },
  data () {
    return {
      materialData: [],
      exampleNum: '',   //样例数量
      uploadNum: '',    //查看数量
      specialData: [],//特殊情况材料列表数据
      specialModal:false   //特殊情况材料上传 modal框
    }
  },
  created(){
    //渲染申请材料列表
    this.getMaterial();
    //渲染特殊情况材料列表
    this.getSpecial();
  },
  methods: {
    gobacks(){
      this.$router.push({path: '../index',query: {currentPage:this.$route.query.inCurrentPage}})
    },
    //*************************start 高拍仪获取身份证信息、上传照片**************************************//
    // //读取身份证信息
    // Idcard(){
    //   Idcard0();
    //   this.userData.cardNumber = document.getElementById('Text6').value;
    //   this.inquiryMessage();
    // },
    // //根据身份证号查询个人信息
    // inquiryMessage(){
    //   axios.post("/cgaCaseRegist/queryCitizenByCardNumber.do", {cardNumber:this.userData.cardNumber})
    //   .then(data=>{
             
    //   }); 
    // },
    //拍照
    // userPhoto(){
    //   opendeviceCarmera(2);  //摄像头  1身份证    2 头像
    //   //显示高拍仪
    //   document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
    //   document.getElementById('carmerayw').classList.add('carmerayw');
    //   //清空之前的值  （仅需清理文件名）
    //   document.getElementById('CarmeraPhotoName').value = '';
    //   // document.getElementById('Base64Text').value;  //照片编码
    // },
    // carmeraFun(){
    //   let abase64 = document.getElementById('Base64Text').value;   //图片编码
    //   let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
    //   let _this = this;
    //   //Base64文件上传(HDFS)
    //   axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
    //   .then(data=>{
    //     //添加办件图像记录信息
    //     axios.post("/cgaCaseRegist/addCaseStaff.do", {caseId:this.$route.query.caseId, applyFileId:data.obj.id})
    //     .then(data0=>{
    //       this.$Message.success('头像上传成功');
    //     }); 
    //   }); 
    // },
    //*************************end 高拍仪获取身份证信息、上传照片****************************//
    //查询指定办件的筛选资料列表
    getMaterial(){
      axios.post("/cgaCaseMaterial/queryCaseGuideMaterialListByPage.do", {caseId:this.$route.query.caseId, pageSize: 100})
      .then(data=>{
        this.materialData = data.obj.records || [];
        //样例
        this.exampleNum = data.obj.records.map(item => item.exampleNum);
        //查看
        this.uploadNum = data.obj.records.map(item => item.uploadNum);       
      }); 
    },
    // //上传申请材料
    // uploadMaterial(caseId, materialId){
    //   let self = this;
    //   var formData = new FormData($( "#uploadForm" )[0]);
    //   $.ajax({  
    //     url: window.config.api + '/attachment/uploadFile.do',  
    //     type: 'POST',  
    //     data: formData,
    //     async: false,  
    //     cache: false,  
    //     contentType: false,  
    //     processData: false, 
    //     success: function (data) {  
    //       self.fileId = data.obj.id;
    //       self.fileName = data.obj.fileName; 
    //       self.fileType = data.obj.fileType;            
    //       self.$Message.success('上传成功！'); 
    //       //新增办件材料记录
    //       axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
    //       .then(data=>{
    //         self.getMaterial();
    //       });
    //     },
    //     error: function (err) { 
    //       self.$Message.error('上传失败！');
    //     }
    //   });  
    // },
    //根据办件流水号获取特殊情况材料列表数据
    getSpecial(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj;      
      }); 
    },

    // //删除已上传的特殊情况材料
    // delConfirm(id, fileId){
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '确定要删除吗？',
    //     onOk:()=>{
    //       axios.post("/cgaSpecialFile/deleteSpecialFile.do", {id:id, fileId:fileId})
    //       .then(data=>{
    //         this.$Message.success(data.msg);
    //         this.getSpecial();            
    //       })
    //     }
    //   })      
    // },

    // //点击特殊情况材料添加弹出 样例modal  清空之前填写数据
    // specialModalFun(){
    //     this.specialModal  = true;
    //     this.$refs.specialChild.clearData();      
    // },

    // //点击关联人添加弹出 样例modal  清空之前填写数据
    // relatedModalFun(){
    //     this.relatedModal  = true;
    //     this.$refs.relatedChild.clearData();      
    // },
    //预览
    previews(id,type){
      this.$emit('previewsFun',id,type);
    },
  }
}
</script>

<style lang="scss">
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
.apply-material{
  padding: 10px 10px 30px;
  border: 1px dashed #e9eaec;
  .plate{
    position: relative;
    width: 85px;
    //height: 80px;
    text-align: center;
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
}
.special{
  padding: 10px;
  border: 1px dashed #e9eaec;
  .view{
    text-align: center;
    margin: 10px 0;
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
        padding: 10px; 
        text-align: center;    
        border-radius: 3px;
        background: rgba(0,0,0,0.5);
      }
      &:hover .uploadHoverBtn{
        display: block;
      }  
    } 
  }  
}
.no-modal-footer .ivu-modal-footer{
  display: none;
}
</style>