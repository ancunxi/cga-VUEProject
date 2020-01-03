<template>
  <div class="opinion-area">
    <div class="opinion-icon"><img src="../../assets/img/expand.png"></div>
    <div class="opinion-content">
      <Form ref="opinionData" :model="opinionData">
        <Row style="border:1px solid #dddee1; padding:10px; margin-bottom:10px;">
          <Col span="4">
            <p><b>流程类型：</b> {{workFlowInfo.workFlowTypeDesc}}</p>
            <p><b>环节名称：</b> {{tacheInfo.tacheName}}</p>
            <p><b>环节天数：</b> {{tacheInfo.tacheDays}}天</p>
            <p><b>指定处理人：</b> {{tacheInfo.assignerNames}}</p>
          </Col>
          <Col span="12" offset="1">
            <Row class="uploadLocalFile">
              <Col span="24">
                <span style="color:#2b85e4;"><Icon type="paperclip"></Icon> 添加附件</span>
                <form id="tacheUploadForm" class="uploadForm" style="display:inline-block; width:100%; height:20px;">
                  <input type="hidden" name="folder" :value="'cga/' + this.$route.query.caseId">
                  <input type="hidden" name="source" value="1">
                  <input type="file" name="datafile" class="file" @change="uploadFile" style="display:inline-block; width:100%; height:20px;" accept=".png,.jpg,.jpeg,.gif,.bmp,.pdf,.doc,.docx,.txt,.xls,.xlsx">
                </form>
              </Col>
            </Row>
            <Row class='opinion-uploadBox'>
              <template v-for='(item, index) in uploadFileList'>
                <Col span="24">
                  <Icon type="paperclip"></Icon>
                  <span>{{item.fileName}}</span>
                  <a href="javascript:;" class="red" @click='delUploadFile(index,item.id,item.tacheId)'>删除</a>
                </Col>
              </template>
            </Row>
            <FormItem
              class="margin-bottom-10 opinionDataBox"
              prop="tacheIdea"
              :rules="{required: true, message: '环节处理意见不能为空', trigger: 'blur'}">
              <Input type="textarea" :autosize="{minRows:3,maxRows:3}" placeholder="请输入环节处理意见，150个字符以内" v-model='opinionData.tacheIdea' :maxlength="opinionNum"></Input>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <Row>
              <Col span="24">
                <Input placeholder="添加常用意见" class="common-opinion" v-model='opinion'></Input>
                <Button type="primary" size="small" style="margin-left:5px;" @click='addOpinion'>添加</Button>
              </Col>
              <Col span="24" class="opinionBox" style="border:1px solid #dddee1; padding:5px; margin-top:5px;">
                <div class="system-opinion">
                  <span  v-for='(item, index) in opinionListSys'>
                    <a href="javascript:;" @dblclick='dblOpinion(item.opinionDesc)'>{{item.opinionDesc}}</a>
                    <i class="ivu-breadcrumb-item-separator">|</i>
                  </span>
                </div>
                <div class="self-opinion">
                  <template v-for='(item, index) in opinionList'>
                    <a href="javascript:;">
                      <span @dblclick='dblOpinion(item.opinionDesc)'>{{item.opinionDesc}}</span>
                      <i class="ivu-icon ivu-icon-android-cancel" @click='delOpinion(item.id)'></i>
                    </a>
                  </template>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="center">
          <Col span="24">
            <FormItem>
              <!--工作待办isModifyCase（允许编辑办件信息[true:允许; false:不允许]）控制是否编辑-->
              <Button type="info" v-if="isModifyCase == true" @click="handleComplete">登记完成</Button>

              <!--测试-->
              <Dropdown trigger="click" placement="top" class="opinion-button" style="margin-left:8px;">
                  <Button type="primary">
                    {{tacheInfo.tacheName}}
                    <Icon type="arrow-up-b"></Icon>
                  </Button>
                  <DropdownMenu slot="list" >
                    <template v-for="item in tacheInfo.nextTransitions">
                      <DropdownItem>
                        <span @click="handleNextTaskCandidateList(item.conditionText,item.name)" style="width: 100%;display: inline-block">{{item.name}}</span>
                      </DropdownItem>
                    </template>
                  </DropdownMenu>
              </Dropdown>
          
              <Button  style="margin-left:8px;"  @click="gobacks">返回</Button>

              <!--环节处理-->
              <Modal
                v-model="nextTaskModal"
                width="520"
                class-name="ivu-modal-style opinion-modal"
                :mask-closable="false">
                <p slot="header"><span>{{tacheInfo.tacheName}}：{{clickBtnName}}</span></p>
                <Form ref="tacheData" :model="tacheData" :label-width="130">
                  <template v-for="(item, index) in tacheList">
                    <div class="ivu-modal-form">
                      <FormItem label="下一环节名称：">{{item.tacheName}}</FormItem>
                      
                      <!--以下条件都满足时显示‘下一环节处理人’这一项内容-->
                      <template v-if="showNextUserSelect
                        && item.candidateList
                        && item.candidateList.length > 0 ">
                        <FormItem label="下一环节处理人："
                          prop="auditorId"
                          :rules="[{required:true, type:'array', min:1, message:'请选择下一环节处理人', trigger:'change'}]">
                          <Select v-model="tacheData.auditorId[index]" multiple placeholder="请选择下一环节处理人">
                            <template v-for="subItem in item.candidateList">
                              <Option :value="subItem.userId" :key="subItem.userId">{{ subItem.userName }}</Option>
                            </template>
                          </Select>
                        </FormItem>
                      </template>

                    </div>
                  </template>
                </Form>
                <div slot="footer">
                  <Button type="text" @click="handleAgreeReset">取消</Button>
                  <span v-if="showNextUserSelect">
                    <Button type="primary" @click="saveAgree" :loading="saveLoading" style="margin-left: 8px">确定</Button>
                  </span>
                  <span v-else>
                    <Button type="primary" @click="submitAgreeForm" :loading="submitLoading" style="margin-left: 8px">确定</Button>
                  </span>
                </div>
              </Modal>
  
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  </div>
</template>

<script>
require('../../assets/js/jquery.min.js');
export default {
  //父组件向子组件传递基本信息页签详情数据
  props: {
    workFlowInfo: {
      type: Object
    },
    tacheInfo: {
      type: Object
    },
    conditionText: Array,
    isModifyCase: [String, Boolean],
  },
  data () {
    return {
      saveLoading:false,
      submitLoading:false,
      opinionNum:150,            //处理意见限制的字数
      opinionData: {
        tacheIdea: '',            //环节处理意见
      },
      uploadFileList: [],         //上传文件列表
      opinion: '',                //添加意见
      opinionList: [],            //添加意见列表
      opinionListSys:[],          //系统意见表
      nextTaskModal: false,       //下一环节弹窗
      conditionValue: '',         //点击按钮 conditionValue
      showNextUserSelect: false,  //根据条件判断是否显示选人框

      clickBtnName: '',           //点击按钮名称
      tacheList: [],              //下一环节数据
      tacheSubList: [],           //提交下一环节数据
      isShowNextUserSelect: '',   //0不显示下一环节选人框，1显示下一环节选人框
      isParallelGateway: '',      //是否入/出并联环节，0否，1是
      tacheData: {
        auditorId: [],            //所选中的下一环节处理人Id
      }
    }
  },
  created(){
    this.allOpinionList();//查询全部常用意见（含系统和个人意见）
    var self = this;
    setTimeout(function(){self.loadFileList()}, 1000 )
  },
  mounted(){
    this.run();
  },
  methods: {
    //登记完成操作
    handleComplete(){
      this.$emit('complete');
    }, 
  	gobacks(){
  		this.$router.push({path: '../index',query: {currentPage:this.$route.query.inCurrentPage,moduleId:this.$route.query.moduleId}})
  	},
  	
    //刷新环节附件列表
    loadFileList(){
      axios.post("/cgaCaseTacheFile/queryList.do", {caseId:this.$route.query.caseId,tacheId:this.tacheInfo.id}).then(data=>{
          if(data.success){
            var records = data.obj || [];
            for(var i=0;i<records.length;i++){
              var record = records[i];
              var tache = {};
              tache.fileName=record.fileName;   //附件名称
              tache.tacheId=record.id;          //环节附件ID
              tache.id=record.fileId;           //附件ID
              this.uploadFileList.push(tache);
            }
          }
      });
    },

    //点击环节处理区域按钮的操作（备注：conditionValue:0,1,2...）
    /*先查询待办件下一环节信息及候选人列表  根据 
        isShowNextUserSelect表示是否显示下一环节选人框[0:否; 1:是]
        isParallelGateway表示是否入/出并联环节[0:否; 1:是]
      查询待办办件相关信息
        isCounterSign（是否会签环节[0:非会签环节; 1:会签环节]）
        isLastCounterSigner（是否最后会签人[0:否; 1:是]）
      判断是否显示下一环节处理人
    */
    handleNextTaskCandidateList(num,btnName){
      this.conditionValue = num;
      this.clickBtnName = btnName;
      //console.log(num)
      this.$refs.opinionData.validate((valid) => {
        if (valid) {
          axios.post("/cgaCase/queryNextTaskCandidateList.do", {businessId:this.tacheInfo.businessId, taskDefinitionKey:this.$route.query.taskDefinitionKey, conditionValue:num})
          .then(data=>{
            this.$emit('loadingHide');

            if(data.status == '200' && data.success == true){
              //显示下一环节弹窗
              this.nextTaskModal = true;
              
              //下一环节数据
              this.tacheList = data.obj;
              //注意：需要设置数组的长度
              for (var i = 0; i < this.tacheList.length; i++) {
                this.tacheData.auditorId.push([]);
              }

              //是否显示下一环节选人框  [0:否; 1:是]
              //this.isShowNextUserSelect = data.obj.map(item => item.isShowNextUserSelect)[0].toString();
              this.isShowNextUserSelect = data.obj[0].isShowNextUserSelect;
              
              //表示是否入/出并联环节[0:否; 1:是]
              //this.isParallelGateway = data.obj.map(item => item.isParallelGateway)[0].toString();
              this.isParallelGateway = data.obj[0].isParallelGateway;
              if(this.isShowNextUserSelect=='1') {
                //先判断是不是会签环节
                if(this.tacheInfo.isCounterSign=='1') {
                  if(this.tacheInfo.isLastCounterSigner=='1') { //会签环节，且为最后会签人
                    //显示下一环节选人框
                    this.showNextUserSelect = true;
                  } else {
                    //不出现下一环节选人框
                    this.showNextUserSelect = false;
                  }
                } else {  //非会签环节
                  if(this.isParallelGateway=='0') { //非入/出并联环节
                    //显示下一环节选人框
                    this.showNextUserSelect = true;
                  } else {
                    //不出现下一环节选人框
                    this.showNextUserSelect = false;
                  }
                }
              } else {
                //不出现下一环节选人框
                this.showNextUserSelect = false;
              }
              // if(this.isShowNextUserSelect=='1'&&(this.isParallelGateway=='0' || (this.tacheInfo.isCounterSign=='1' && this.tacheInfo.isLastCounterSigner=='1') )){
              //   //显示下一环节选人框
              //   this.showNextUserSelect = true;
              // }else{
              //   //不出现下一环节选人框
              //   this.showNextUserSelect = false;
              // }
   
            }else{
              this.$Message.error(data.msg);
              return false
            }
          }).catch(error=>{
            this.$emit('loadingHide');
          })
        }else {
          this.$Message.error('表单验证失败！');
        }
      })
    },
    
    //点击同意按钮显示下一环节弹窗，如果没有下一环节处理人项时，可直接保存并提交数据
    submitAgreeForm(){
      this.submitLoading = true;
      let isParallelGateway = this.isParallelGateway;
      //如果是会签环节  将是否入/出并联环节 设为否（0）
      if(this.tacheInfo.isCounterSign=='1'){
        isParallelGateway = '0';
      }
      this.$emit('loadingShow');
      let nextUsers = '';
      if(this.showNextUserSelect){
        this.tacheSubList = this.tacheList.map(item =>{
          return {
            taskDefinitionKey: item.taskDefinitionKey,
            userIds: this.tacheData.auditorId.toString()
          }
        });
        this.nextUsers = JSON.stringify(this.tacheSubList);
      }
      //console.log(this.nextUsers)
      axios.post("/cgaCase/execTaskForTache.do", {id:this.$route.query.id, caseId:this.$route.query.caseId, workFlowType:this.$route.query.workFlowType, businessId:this.$route.query.businessId, deputyType:this.$route.query.deputyType, tacheId:this.tacheInfo.id, taskId:this.$route.query.taskId, taskDefinitionKey:this.$route.query.taskDefinitionKey, isParallelGateway:isParallelGateway, conditionValue:this.conditionValue,conditionName:this.clickBtnName, tacheIdea:this.opinionData.tacheIdea, nextUsers:this.nextUsers})
      .then(data=>{
        this.$emit('loadingHide');

        if(data.status == '200' && data.success == true){
          this.saveLoading = false;
          this.submitLoading = false;
          this.nextTaskModal = false;
          this.$Message.success(data.msg);
          this.$router.push({path: '../../wait/index',query:{currentPage:this.$route.query.inCurrentPage}});
        }else{
          this.saveLoading = false;
          this.submitLoading = false;
          this.$Message.error(data.msg);
          this.nextTaskModal = true;
          return false;
        }
      }).catch(error=>{
        this.$emit('loadingHide');
      });
    },

    //点击同意按钮显示下一环节弹窗，如果有下一环节处理人项时，需要先验证再保存并提交数据
    saveAgree(){
      this.saveLoading = true;
      this.$refs.tacheData.validate((valid) => {
        if (valid) {     
          let key = false;
          //注意：需要设置数组的长度
          for (var i = 0; i < this.tacheList.length; i++) {
            console.log(this.tacheData.auditorId[i][0])  
            if(this.tacheData.auditorId[i][0] == undefined){
              key = true;
              break;
            }
          }

          if(!key){
            this.submitAgreeForm();
          }else{
            this.$Message.error({
                content: '请选择下一环节处理人',
                duration: 5
            });
          }
        }
      })      
    },

    //点取消按钮清空数据并关闭弹窗
    handleAgreeReset(){
      this.$refs.tacheData.resetFields();
      this.nextTaskModal = false;
    },
    
    //查询全部常用意见（含系统和个人意见）
    allOpinionList(){
      axios.post("/cgaCaseOpinion/queryAllOpinionList.do", {})
      .then(data=>{
        this.opinionListSys = data.obj.filter((item)=>item.opinionType == '0') || [];
        this.opinionList = data.obj.filter((item)=>item.opinionType == '1') || [];
      })
    },
    //添加个人常用意见
    addOpinion(){
      if(this.opinion == ''){
        this.$Message.error('个人意见为空!');
        return false;
      }
      axios.post("/cgaCaseOpinion/addOption.do", {opinionDesc:this.opinion})
      .then(data=>{
        this.$Message.success('个人意见添加成功!');
        this.opinion = '';
        this.allOpinionList();
      })
    },
    //删除个人常用意见
    delOpinion(id){
      axios.post("/cgaCaseOpinion/deleteOption.do", {id:id})
      .then(data=>{
        this.$Message.success('个人意见删除成功!');
        this.allOpinionList();
      })
    },
    //双击环节处理意见
    dblOpinion(item){
      if(this.opinionData.tacheIdea == ''){
        this.opinionData.tacheIdea = item;
      }else{
        this.opinionData.tacheIdea += '，'+item;
      }
    },

    //上传附件
    uploadFile(){
      let self = this;
      var formData = new FormData($( "#tacheUploadForm" )[0]);
      if($("#tacheUploadForm input[name=datafile]").val()==null || $("#tacheUploadForm input[name=datafile]").val()==""){
        return;
      }
      $.ajax({
        url: window.config.api + '/attachment/uploadFile.do',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
          if(data.success){
            var fileObj = data.obj;
            var caseId = self.$route.query.caseId;
            var tacheId = self.tacheInfo.id;
            var tacheName= self.tacheInfo.tacheName;
            axios.post("/cgaCaseTacheFile/addCaseTacheFile.do", {caseId:caseId,tacheId:tacheId,tacheName:tacheName,fileId:fileObj.id})
            .then(axiosData=>{
              if(axiosData.success){
                data.obj.tacheId = axiosData.obj.id;
                self.uploadFileList.push(data.obj);
                self.$Message.success("上传成功");
              }else{
                self.$Message.error('上传失败！');
              }
            })
          }else{
            self.$Message.error('上传失败！');
          }
        },
        error: function (err) {
          self.$Message.error('上传失败！');
        }
      });
    },
    delUploadFile(index, fileId,tacheId){
      this.uploadFileList.splice(index, 1);
      //删除证照样例
      axios.post("/attachment/deleteAttachment.do", {fileId:fileId})
      .then(data=>{
        if(data.success){
          axios.post("/cgaCaseTacheFile/deleteCaseTacheFile.do", {id:tacheId,fileId:fileId})
          .then(tacheData=>{
            this.$Message.success(tacheData.msg);
          });
        }

      })
    },
    //意见处理框动画效果
    run(){
      let ma = $('.opinion-area')[0];
      let side = $('.opinion-icon');
      let content = $('.opinion-content')[0];
      let toggle = true;
      side.on('click',function(){
        let timer = null;
        let timerd = null;
        if(toggle == true){
          timer = setInterval(function(){
            let seep = ma.offsetHeight/4 + 1;
            if(ma.offsetHeight <= 1){
              ma.style.height = 0;
              toggle = false;
              clearInterval(timer);
            }else{
              ma.style.height = ma.offsetHeight - seep + 'px';
            }
          },50);
          side.removeClass('back_active');
          side.addClass('go_active');
        }else{
          timerd = setInterval(function(){
            let seep = (238 - ma.offsetHeight)/4 + 1;
            if(ma.offsetHeight >= 237){
              ma.style.height = 238 + 'px';
              toggle = true;
              clearInterval(timerd);
            }else{
              ma.style.height = ma.offsetHeight + seep + 'px';
            }
          },50);
          side.removeClass('go_active');
          side.addClass('back_active');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
//start animate-------
.go_active{animation: goed 1s forwards;}
.back_active{animation: backed 1s forwards;}
@keyframes goed{
  0%{transform: rotate(0deg);}
  100%{transform: rotate(180deg);}
}
@keyframes backed{
  1%{transform: rotate(180deg);}
  100%{transform: rotate(0deg);}
}
//end animate-------

.opinion-area{
  position: fixed;
  left: 16.66666667%;
  bottom: 0;
  width: 83.33333333%;
  background: #f3f3f3;
  .opinion-icon{
    position: fixed;
    width: 40px;
    height: 40px;
    margin-top: -40px;
    left: 56.66666667%;
    margin-left: -20px;
    cursor: pointer;
  }
  .opinion-content{
    padding: 10px 10px 0;
    .opinion-uploadBox{
       max-height:38px;
       overflow:auto;
    }
    .common-opinion{
      width: 80%;
      &>.ivu-input{
        height: 28px;
      }
    }
    .opinionBox{
      border:1px solid #dddee1;
      padding:5px;
      margin-top:5px;
      .system-opinion{
        a{
          color: #000;
        }
        a:hover{
          color: #2b85e4;
        }
        &>span:last-child .ivu-breadcrumb-item-separator{
          display: none;
        }
      }
      .self-opinion{
        margin-top: 5px;
        height:70px;
        overflow:auto;
        a{
          display: block;
          overflow: hidden;
          height: 20px;
          line-height: 20px;
          span{
            float: left;
            display: inline-block;
            height: 16px;
            line-height: 16px;
            padding: 2px 5px;
            color: #495060;
          }
          &:hover span{
            color: #2b85e4;
          }
          i{
            float: left;
            margin-left: 5px;
            padding: 2px 5px;
            font-size: 16px;
            display: none;
          }
          &:hover i{
            display: block;
            color: #df5138;
          }
        }
      }
    }
    .ivu-form-item-required .ivu-form-item-content:before{
      content: '*';
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
    .opinionDataBox .ivu-input-wrapper{
      width: 98%;
    }
    .ivu-icon-paperclip{
      padding-left: 5px;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    }
  }
}
/***环节处理区***/
.opinion-modal{
  .ivu-modal-body{
    padding: 0;
    .ivu-form{
      .ivu-modal-form>.ivu-form-item{
        padding: 0 20px;
        &:first-child{
          padding-top: 24px;
        }
      }
      .ivu-modal-btn{
        border-top: 1px solid #e9eaec;
        padding: 12px 18px;
        text-align: right;
        .ivu-form-item{
          margin-bottom: 0;
        }
      }   
    }
  }
}

</style>
