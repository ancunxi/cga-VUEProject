<template>
  <div class="layout-content">
    <Row>
      <Col span="12" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="160">          
          <Row>
            <Col span="24">
              <FormItem label="特殊情况材料名称：" prop="fileName">
                <Input v-model="formValidate.fileName" placeholder="请输入特殊情况材料名称"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="特殊情况材料说明：">
                <Input v-model="formValidate.fileRemark" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入特殊情况材料说明"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="上传特殊情况材料：">                
                <Row>
                  <Col span="6" v-show="instrument">
                    <Button icon="monitor" @click='userPhoto'>高拍仪</Button>
                  </Col>                  
                  <Col span="18">
                    <!--上传之前-->
                    <Row v-if="uploadShow" class="uploadLocalFile">
                      <Col span="24">
                        <Button icon="ios-cloud-upload-outline">上传</Button>
                        <form id="uploadForm" class="uploadForm">
                          <input type="hidden" name="folder" :value="'cga/' + this.$route.query.caseId">
                          <input type="hidden" name="source" value="1">
                          <input type="file" name="datafile" class="file" @change="uploadSpecial" accept=".png,.jpg,.jpeg,.gif,.bmp,.pdf,.doc,.docx,.txt,.xls,.xlsx">
                        </form>         
                      </Col>
                    </Row>
                    <!--上传之后-->
                    <Row v-else class="uploadAfter">
                      <Col span="24">
                        <a href="javascript:;" class="uploadArea" :title="materialName">
                          <img v-if="/^.+\.png$/.test(materialName) == true" src="../../../../../assets/img/icon_file_png.png">
                          <img v-if="/^.+\.jpg$/.test(materialName) == true " src="../../../../../assets/img/icon_file_jpg.png">
                          <img v-if="/^.+\.jpeg$/.test(materialName) == true " src="../../../../../assets/img/icon_file_jpeg.png">
                          <img v-if="/^.+\.gif$/.test(materialName) == true " src="../../../../../assets/img/icon_file_gif.png"> 
                          <img v-if="/^.+\.bmp$/.test(materialName) == true " src="../../../../../assets/img/icon_file_bmp.png">           
                          <img v-if="/^.+\.pdf$/.test(materialName) == true " src="../../../../../assets/img/icon_file_pdf.png">
                          <img v-if="/^.+\.doc$/.test(materialName) == true " src="../../../../../assets/img/icon_file_doc.png">
                          <img v-if="/^.+\.docx$/.test(materialName) == true " src="../../../../../assets/img/icon_file_docx.png">
                          <img v-if="/^.+\.ppt$/.test(materialName) == true " src="../../../../../assets/img/icon_file_ppt.png">
                          <img v-if="/^.+\.txt$/.test(materialName) == true " src="../../../../../assets/img/icon_file_txt.png">
                          <img v-if="/^.+\.xls$/.test(materialName) == true " src="../../../../../assets/img/icon_file_xls.png">
                          <img v-if="/^.+\.xlsx$/.test(materialName) == true " src="../../../../../assets/img/icon_file_xlsx.png">            
                          <div class="uploadHoverBtn">
                            <Button type="success" size="small" @click="previews" >预览</Button>
                            <Button type="error" size="small" @click="delConfirm">删除</Button>
                          </div>            
                        </a>
                        <p :title="materialName" class="uploadName">{{materialName}}</p>
                      </Col>
                      <Col span="24" v-if="percent > 0" class="percent">
                        <Progress :percent="percent" hide-info></Progress>
                      </Col>
                    </Row>         
                  </Col>                         
                </Row>                
              </FormItem>              
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <router-link :to="{path:'../index', query:{moduleId:this.$route.query.moduleId, projectId:this.$route.query.projectId, caseId:this.$route.query.caseId}}" style="margin-left:8px;"><Button>取消</Button></router-link>
              </FormItem>
            </Col>
          </Row>  
        </Form>                                        
      </Col>
    </Row>

    <!--start  预览-->
    <ul id="dowebok4" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
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
export default {
  data () {
    return {
      instrument: true,     //高拍仪显示和隐藏
      uploadShow: true,     //材料上传前后的显示和隐藏
      percent: 0,           //进度条       
      formValidate: {
        fileName: '',       //特殊情况材料名称        
        fileRemark: '',     //特殊情况材料说明       
      },
      materialId: '',       //材料上传成功之后接口返回的Id
      materialName: '',     //材料上传成功之后接口返回的Name

      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      viewFileType:'',//文件类型
      previewsModal:false,
	  
      ruleValidate: {
        fileName: [
          { required: true, message: '特殊情况材料名称不能为空', trigger: 'blur' }
        ]
      }
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
  methods: {
	//高拍仪 拍照 上传特殊材料
    userPhoto(){
	showCarmeraWin(this.materialcarmeraFun); //打开高拍仪拍照上传窗口
    },
	 //高拍仪上传后回调方法
    materialcarmeraFun(attachmentId, originalName) {
	    let _this = this;
    	this.uploadShow = false;
        this.instrument = false;
        this.materialId = attachmentId;
        this.materialName = originalName+'.jpg';
        this.$Message.success('文件上传成功！');
    },
    //上传特殊情况材料
    uploadSpecial(){ 
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
          self.viewFileId = data.obj.id;
          self.viewFileType = data.obj.fileType; 
          //上传时间进度
          let fileTime = data.obj.uploadTime;
          fileTime<=1000 ? fileTime=1000 : fileTime=fileTime;
          let timer = null;
          timer = setInterval(function(){
            if(self.percent >= 100){
              clearInterval(timer);
              //上传按钮消失
              self.uploadShow = false;
              self.materialId = data.obj.id;
              self.materialName = data.obj.fileName;              
              self.$Message.success('上传成功！');
              //上传成功之后高拍仪按钮消失
              self.instrument = false;
              self.percent = 0;                              
            }
            else{
              self.percent += 100/parseInt(fileTime/1000);
            }
          },1000);          
        },
        error: function (err) { 
          self.$Message.error('上传失败！');
        }
      });  
    },
    delConfirm () {
      var fileId = this.viewFileId;
      var self = this;
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          axios.post("/attachment/deleteAttachment.do", {fileId:fileId})
          .then(data=>{ 
            if(data.success){
              self.viewFileId = '';
              self.viewFileType = '';
              //上传按钮消失
              self.uploadShow = true;
              self.materialId = '';
              self.materialName = '';    
              //上传成功之后高拍仪按钮消失
              self.instrument = true;
              self.percent = 0;  
              self.$Message.success('删除成功！');      
            }          
          })
        }
      });
    }, 
    //新增特殊情况材料信息并保存   
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
        	if(this.materialId==null ||this.materialId==""){
        		this.$Modal.info({
							title: '温馨提示',
							content: '提交之前请点击上传或高拍仪按钮完成特殊情况材料上传'});
        		 return false;
        	}
          axios.post("/cgaSpecialFile/addSpecialFile.do", {caseId:this.$route.query.caseId, fileId:this.materialId, fileName:this.formValidate.fileName, fileRemark:this.formValidate.fileRemark})
          .then(data=>{
            this.$Message.success(data.msg);
            this.$router.push({path:'../index', query:{moduleId:this.$route.query.moduleId, projectId:this.$route.query.projectId, caseId:this.$route.query.caseId}});
          })          
        }
      })
    },
    //预览
    previews(){
      var id = this.viewFileId;
      var type = this.viewFileType;
      // this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok4'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok4 img').click();
          let _this = this;
          let timeImg = setInterval(function(){
            if($('.viewer-container img').attr('alt') != undefined){
              clearInterval(timeImg);
              $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + id);
            }
          },300)
        })
        
      }
    } 
  }
}
</script>

<style lang="scss">
.uploadAfter{
  padding: 5px;
  border: 1px dashed #dddee1; 
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
      //padding: 4px 10px; 
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
    }
    &:hover .uploadHoverBtn{
      display: block;
    }  
  }
  .uploadName{
    width: 80px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; 
    color: #1c2438;    
  }  
  .percent{width: 80px;}
}
</style>
