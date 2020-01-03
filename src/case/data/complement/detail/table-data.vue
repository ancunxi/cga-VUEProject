<template>
  <Row>
    <Col span="24">   
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-border ivu-table-stripe"> 
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <colgroup>
              <col width="8%">
              <col width="28%">
              <col width="8%">
              <col width="7%">
              <col width="7%">
              <col width="8%">
              <col width="34%">
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
            <tbody class="ivu-table-tbody">
              <template v-for="item in TableList">
                <tr class="ivu-table-row">
                  <td>
                    <div class="ivu-table-cell ellipsis">
                      {{item.proDocId}}<Icon type="checkmark-circled" v-if="item.isPickupPaper==0" title="材料已接收" style="margin-left:5px;font-size:16px;color:#19be6b;cursor:pointer;"></Icon>
                    </div>
                  </td>
                  <td><div class="ivu-table-cell ellipsis" :title="item.materialName">{{item.materialName}}</div></td>
                  <td><div class="ivu-table-cell">{{item.materialTypeName}}</div></td>
                  <td><div class="ivu-table-cell">{{item.isDeclareName}}</div></td>
                  <td><div class="ivu-table-cell">{{item.isOriginalName}}</div></td>
                  <td><div class="ivu-table-cell">{{item.isFinishSubmitName}}</div></td>
                  <td>
                    <div class="ivu-table-cell">
                      <router-link :to="{path:'./application/sample', query:{moduleId:$route.query.moduleId, caseId:item.caseId, materialId:item.materialId, projectId:$route.query.projectId, cardNumber:$route.query.cardNumber}}" >
                        <Button type="info" icon="document" size="small" :disabled="item.exampleNum>0?false:true">样例</Button>
                      </router-link>
                      <router-link :to="{path:'application/view', query:{moduleId:$route.query.moduleId, caseId:item.caseId, materialId:item.materialId, projectId:$route.query.projectId, cardNumber:$route.query.cardNumber,isShowDeleteButton:$route.query.isShowDeleteButton}}"><Button type="primary" icon="eye" size="small" :disabled='item.uploadNum>0?false:true'>查看（{{item.uploadNum}}）</Button></router-link>
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
                      <router-link :to="{path:'./application/add', query:{moduleId:$route.query.moduleId, materialId:item.materialId, caseId:item.caseId, projectId:$route.query.projectId, cardNumber:$route.query.cardNumber}}"><Button type="info" icon="plus-round" size="small">添加</Button></router-link>
                    </div>
                  </td>
                </tr>              
              </template>   
            </tbody>
          </table>       
        </div>
      </div> 
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </Col>
  </Row>     
</template>

<script>
require('../../../../assets/js/jquery.min.js');
export default{
  data(){
    return{
      TableList: [],
      //分页
      //queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10,
      fileId: '',       //材料Id
      fileName: '',     //材料名称

      //高拍仪当前点击项  
      caseId:'', 
      materialId:'',
    }
  },
  created(){
    //申请材料列表及分页
    this.getList(); 
    // this.$watch('$route.fullPath', this.getList); 
  },
  mounted(){
    //*************************start 高拍仪获取身份证信息、上传照片**************************************//
    // let _this = this;
    // $("#CarmeraUpload").on("click",function(){
    //   if(localStorage.getItem('carmeraType') == 'materialcarmeraFun'){
    //     let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
    //     if(aname == ''){
    //      alert('请输入文件名！');
    //       return false;
    //     }
    //     //关闭高拍仪
    //     document.getElementById('carmerayw_cover').classList.remove('carmerayw_cover');
    //     document.getElementById('carmerayw').classList.remove('carmerayw');
    //     _this.materialcarmeraFun(_this.caseId, _this.materialId);
    //   }
    // })
    //*************************end 高拍仪获取身份证信息、上传照片**************************************//
  },
  methods: {
    getList(){
      axios.post("/cgaCaseMaterial/queryCaseGuideMaterialListByPage.do", {caseId:this.$route.query.caseId,currentPage:this.currentPage,pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
      });      
    },
    pageChange(data){
      this.currentPage = data;
      this.getList();
    },
    pageSizeChange(data){
      this.pageSize = data;
      this.getList();
    },

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

      // let abase64 = document.getElementById('Base64Text').value;   //图片编码
      // let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
      // let _this = this;
      // //Base64文件上传(HDFS)
      // axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
      // .then(data=>{
      //   //新增办件材料记录
      //   axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
      //   .then(data=>{
      //     this.$Message.success('上传成功');
      //     this.getList();
      //   });
      // }); 
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
    }    
  }
}
</script>

<style lang="scss">
.uploadLocalFile {
  display: inline-block;
  vertical-align: middle;
  margin: 0 2px;
}
</style>


