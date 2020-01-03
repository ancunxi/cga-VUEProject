<template>
  <Row>
    <Col span="24">   
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-border"> 
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <colgroup>
                <col width="10%">
                <col width="19%">
                <col width="7%">
                <col width="7%">
                <col width="7%">
                <col width="8%">
                <col width="42%">
              </colgroup> 
              <thead>
                <tr>
                  <th><div class="ivu-table-cell">资料编号</div></th>
                  <th><div class="ivu-table-cell">资料名称</div></th>
                  <th><div class="ivu-table-cell">资料类型</div></th>
                  <th><div class="ivu-table-cell">原件要求</div></th>
                  <th><div class="ivu-table-cell">是否必需</div></th>
                  <th><div class="ivu-table-cell">办结后补交</div></th>
                  <th><div class="ivu-table-cell">操作</div></th>
                </tr>
              </thead>
            </table>
          </div> 
          <div class="ivu-table-body">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <colgroup>
                <col width="10%">
                <col width="19%">
                <col width="7%">
                <col width="7%">
                <col width="7%">
                <col width="8%">
                <col width="42%">
              </colgroup> 
              <tbody class="ivu-table-tbody">
                <template v-for="item in TableList">
                  <tr class="ivu-table-row">
                    <td><div class="ivu-table-cell ellipsis">
                       <Icon v-if="item.isPickupPaper==0" type="checkmark-circled" size="18" color="#19be6b" title="材料已接收"></Icon>
                       <span :title="item.proDocId">{{item.proDocId}}</span>
                    </div></td>
                    <td><div class="ivu-table-cell ellipsis"><span :title="item.materialName">{{item.materialName}}</span></div></td>
                    <td><div class="ivu-table-cell">{{item.materialTypeName}}</div></td>
                    <td><div class="ivu-table-cell">{{item.isDeclareName}}</div></td>
                    <td><div class="ivu-table-cell">{{item.isOriginalName}}</div></td>
                    <td><div class="ivu-table-cell">{{item.isFinishSubmitName}}</div></td>
                    <td>
                      <div class="ivu-table-cell">
                        <Button type="info" icon="document" size="small" :disabled='item.exampleNum>0?false:true' @click='sampleModalFun(item.caseId,item.materialId,item.exampleNum)'>样例</Button>

                        <Button type="primary" icon="eye" size="small" :disabled='item.uploadNum>0?false:true' @click='viewModalFun(item.caseId,item.materialId,item.uploadNum)'>查看（{{item.uploadNum}}）</Button>

                        <Button type="success" icon="checkmark-circled" size="small" @click="doPickupPaper(item.id,'0')" v-if="!item.isPickupPaper || item.isPickupPaper==1">接收</Button>
                        <Button type="warning" icon="close-circled" size="small" @click="doPickupPaper(item.id,'1')" v-if="item.isPickupPaper==0">取消接收</Button>

                        <!--上传-->
                        <Row class="uploadLocalFile">
                          <Col span="24">
                            <Button icon="ios-cloud-upload-outline" size="small">上传</Button>
                            <form :id="item.id" class="uploadForm" style="width:58px;height:24px;">
                              <input type="hidden" name="folder" :value="'cga/' + $route.query.caseId">
                              <input type="hidden" name="source" value="1">
                              <input type="file" name="datafile" class="file" @change="uploadMaterial(item.id, item.caseId, item.materialId)" style="width:58px;height:24px;" accept=".png,.jpg,.jpeg,.gif,.bmp,.pdf,.doc,.docx,.txt,.xls,.xlsx">
                            </form>         
                          </Col>
                        </Row>
                        <Button icon="monitor" size="small" @click='userPhoto(item.caseId, item.materialId)'>高拍仪</Button>
                        <Button type="info" icon="plus-round" size="small" @click='addModalFun(item.caseId, item.materialId, userCardNumber)'>添加</Button>
                      </div>
                    </td>
                  </tr>              
                </template>   
              </tbody>
            </table>
          </div>        
        </div>
      </div> 
      <Page :total="total1" :current="currentPage1" :page-size="pageSize1" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </Col>

    <Modal
      v-model="exampleModal"
      title="样例"
      width="850"
      class-name="ivu-modal-style"
      :mask-closable="false">
      <sample-modal ref='sampleChild'></sample-modal>  
    </Modal>

    <Modal
      v-model="viewModal"
      title="查看"
      width="850"
      class-name="ivu-modal-style"
      :mask-closable="false">
      <view-modal ref='viewChild' @parentgetList='getList'></view-modal> 
    </Modal> 

    <Modal
      v-model="addModal"
      title="添加"
      width="850"
      class-name="ivu-modal-style no-modal-footer"
      :mask-closable="false">
      <add-modal ref='addChild' 
        @applicationAdd='applicationAddP' 
        @applicationCancel='applicationCancelP'>
      </add-modal> 
    </Modal> 
  </Row>     
</template>

<script>
require('../../../../assets/js/jquery.min.js');
import sampleModal from './application/sample.vue';   //申请材料》样例
import viewModal from './application/view.vue';   //申请材料》查看
import addModal from './application/add.vue';   //申请材料》添加
export default{
  props: ["projectApplyType", "userCardNumber"],  
  components: {
    'sample-modal': sampleModal,
    'view-modal': viewModal,
    'add-modal': addModal,
  },
  data(){
    return{
      TableList: [],
      //分页
      total1: 0,
      currentPage1: 1, 
      pageSize1: 10,
      fileId: '',             //材料Id
      fileName: '',           //材料名称
      //高拍仪当前点击项        
      caseId: '', 
      materialId: '',
      exampleModal: false,    //申请材料 查看样例 modal框
      viewModal: false,       //申请材料  查看 modal框
      addModal: false,        //申请材料  添加 modal框
    }
  },
  created(){
    //申请材料列表及分页
    this.getList(); 
  },
  mounted(){
    //*************************start 高拍仪获取身份证信息、上传照片**************************************//
    let _this = this;
    $("#CarmeraUpload").on("click",function(){
      if(localStorage.getItem('carmeraType') == 'materialcarmeraFun'){
        let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
        if(aname == ''){
         alert('请输入文件名！');
          return false;
        }
        //关闭高拍仪
        document.getElementById('carmerayw_cover').classList.remove('carmerayw_cover');
        document.getElementById('carmerayw').classList.remove('carmerayw');
        _this.materialcarmeraFun(_this.caseId, _this.materialId);
      }
    })
    //*************************end 高拍仪获取身份证信息、上传照片**************************************//
  },
  methods: {
    getList(){
      axios.post("/cgaCaseMaterial/queryCaseGuideMaterialListByPage.do", {caseId:this.$route.query.caseId, currentPage:this.currentPage1, pageSize: this.pageSize1})
      .then(data=>{
        this.TableList = data.obj.records || [];
        this.total1 = parseInt(data.obj.total==undefined?0:data.obj.total);
      });      
    },
    pageChange(data){
      this.currentPage1 = data;
      this.getList();
    },
    pageSizeChange(data){
      this.pageSize1 = data;
      this.getList();
    },    
    
    //高拍仪 拍照 上传申请材料
//  userPhoto(caseId, materialId){
//    localStorage.setItem("carmeraType","materialcarmeraFun");
//    this.caseId = caseId;
//    this.materialId = materialId;
//    opendeviceCarmera(1);  //摄像头  1身份证    2 头像
//    //显示高拍仪
//    document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
//    document.getElementById('carmerayw').classList.add('carmerayw');
//    //清空之前的值  （仅需清理文件名）
//    document.getElementById('CarmeraPhotoName').value = '';
//    // document.getElementById('Base64Text').value;  //照片编码
//  },
//  materialcarmeraFun(caseId, materialId){
//    let abase64 = document.getElementById('Base64Text').value;   //图片编码
//    let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
//    let _this = this;
//    //Base64文件上传(HDFS)
//    axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
//    .then(data=>{
//      //新增办件材料记录
//      axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
//      .then(data=>{
//        this.$Message.success('上传成功');
//        this.getList();
//      });
//    }); 
//  },
    //打开高拍仪拍照窗口
    userPhoto(caseId, materialId) {
      //localStorage.setItem("carmeraType","materialcarmeraFun");
      this.caseId = caseId;
      this.materialId = materialId;
      showCarmeraWin(this.materialcarmeraFun); //打开高拍仪拍照上传窗口
    },
    //高拍仪上传后回调方法
    materialcarmeraFun(attachmentId, originalName) {
      //新增办件材料记录
      axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:attachmentId, caseId:this.caseId, materialId:this.materialId, fileName:originalName})
      .then(data=>{
        this.$Message.success('上传成功');
        this.getList();
      });
   },
    //纸质件接收或取消接收
    doPickupPaper(id, isPickupPaper){
        let self = this;
        axios.post("/cgaCaseMaterial/updateCaseGuideMaterialPickupPaper.do", {id:id, isPickupPaper:isPickupPaper})
        .then(data=>{
          self.getList();
        });
    },
    //上传申请材料
    uploadMaterial(id, caseId, materialId){
      let self = this;
      var formData = new FormData($( "#"+id )[0]);
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
          self.$Message.success('上传成功！'); 
          //新增办件材料记录
          axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
          .then(data=>{
            self.getList();
          });
        },
        error: function (err) { 
          self.$Message.error('上传失败！');
        }
      });  
    },
    //点击样例弹出 样例modal 
    sampleModalFun(caseId,materialId,exampleNum){
      if(exampleNum>0){
        this.exampleModal = true;
        this.$refs.sampleChild.exampleList(materialId);
      }
    },
    
    //点击查看弹出 样例modal 
    viewModalFun(caseId,materialId,uploadNum){
      if(uploadNum > 0){
        this.viewModal = true;
        this.$refs.viewChild.fileList(materialId);
      }      
    },

    //点击添加弹出 样例modal 
    addModalFun(caseId,materialId,userCardNumber){
      if(this.userCardNumber !== ''){
        this.addModal = true;
        this.$refs.addChild.exampleList(materialId,userCardNumber);
      }else{
        //根据申请类别给予不同的提示
        if(this.projectApplyType == '0'){
          this.$Message.info('请先输入证件号码！');
        }else{
          this.$Message.info('请先输入统一社会信用代码！');
        }
      }
    },
    //add 点击添加
    applicationAddP(){
      this.addModal = false;
      this.getList();
    },
    //add 点击取消
    applicationCancelP(){
      this.addModal = false;
    }
  }
}
</script>

<style lang="scss">
.uploadLocalFile{
  display: inline-block;
  vertical-align: middle;
  margin: 0 2px;  
}
.no-modal-footer .ivu-modal-footer{
  display: none;
}
table-border th {
  text-align: center;
}
</style>


