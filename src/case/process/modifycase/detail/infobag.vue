<template>
  <div>
    <Row>
      <Col span="24">
        <!--申请材料--> 
		    <Row class="margin-bottom-40">
		      <Col span="24">
		        <h5 class="title"><span><Icon type="ios-list"></Icon>申请材料</span></h5>
		        <template>
		          <table-data
		            :projectApplyType="projectApplyType"
		            :userCardNumber="userCardNumber">
		          </table-data>                    
		        </template>
		      </Col>
		    </Row>
        <!--特殊材料-->
        <!--接收父组件传递的数据由isSpecialfile字段控制特殊情况材料模块是否显示-->
        <Row class="margin-bottom-40">
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
                      <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button> 
                    </div>            
                  </a>
                  <p :title="item.fileName + item.fileType" class="uploadName">{{item.fileName + item.fileType}}</p>          
                </Col>    
              </template> 
              <!--上传之前-->         
               <Col span="4" style="margin-top:10px;">          
                <img src="../../../../assets/img/upload.png" v-on:click='specialModalFun'>
              </Col>          
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
      	  <Button type="primary"  @click="handleComplete" >保存</Button>
        <router-link to="../index" style="margin-left:8px;"><Button >返回</Button></router-link>
        
      </Col>
    </Row> 

   
    <Modal
      v-model="specialModal"
      title="上传特殊情况材料"
      width="600"
      :footer-hide="true"
      :mask-closable="false">
      <special-modal 
        @specialCancel='handleCloseSpecialModal' 
        @specialSubmit='handleSubmitSpecialData'
        ref='specialChild'>
      </special-modal>
    </Modal>  
  </div>
</template>

<script>
import dataRow from './table-data.vue';
import specialModal from './special/index.vue';   //特殊情况材料上传
import cgaCaseMaterialBag from './cgamaterialbag.vue';
import relatedRow from './table-related.vue';
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
    projectApplyType:'',
		userCardNumber:'',
  }, 
   
  components: {
    'special-modal': specialModal,
    'cgamaterial-table':cgaCaseMaterialBag,
    'table-data': dataRow,
  },
  data () {
    return {
      specialData: [],//特殊情况材料列表数据
      specialModal:false   //特殊情况材料上传 modal框
    }
  },
  created(){
    //渲染特殊情况材料列表
    this.getSpecial();
  },
  methods: {
    
    //根据办件流水号获取特殊情况材料列表数据
    getSpecial(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj;      
      }); 
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
            this.getSpecial();            
          })
        }
      })      
    },
    submitForm(){
      return new Promise((resolve) => {
        this.$refs.caseInfo.validate((valid) => {
          this.$refs.relatedPersonInfo.validate((valid2) => {
            if (valid && valid2) {
              this.$Modal.confirm({
                title: '温馨提示',
                content: '所有必填项已验证通过，请确认是否提交？',
                onOk: () => {
                  this.$emit('loadingShow');
                  axios.post("/cgaCaseRegist/saveRegistForNext.do", {
                  	 caseId: this.$route.query.caseId,
                    ...this.caseInfo,
                    ...this.relatedPersonInfo,
                   
                    //申报渠道06代表窗口
                    applySource: '06',
                  })
                  .then(data=>{
                    if(data.status !== '200') {
                      resolve(0)
                      this.$Message.error(data.msg);
                      return false
                    }
                    resolve(data)
                  }).catch(error=>{
                    this.$emit('loadingHide');
                  }); 
                },
                onCancel: () => {
                  resolve(0)
                }
              })         
            }else {
              this.$Message.error('表单验证失败！');
              resolve(0)
            }
          })
        })
      })
    },
    //点击特殊情况材料添加弹出 样例modal  清空之前填写数据
    specialModalFun(){
        this.specialModal  = true;
        this.$refs.specialChild.handleReset();      
        this.handleReset(); 
    },
    //提交上传特殊情况材料，成功后需要关闭弹窗，重新渲染特殊情况材料数据
    handleSubmitSpecialData(){
      this.specialModal = false;
      this.getSpecial();
    },
    //父组件绑定自定义事件:关闭上传特殊情况材料的弹窗
    handleCloseSpecialModal(){
      this.specialModal = false;
    },

    //点击关联人添加弹出 样例modal  清空之前填写数据
    relatedModalFun(){
        this.relatedModal  = true;
        this.$refs.relatedChild.clearData();      
    },
    //预览
    previews(id,type){
      this.$emit('previewsFun',id,type);
    },
    handleComplete() {
  		this.$emit('complete');
  	}
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