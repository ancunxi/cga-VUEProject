<template>
  <Form>
    <FormItem>
      <!--有业务表单-->
      <span v-if="current > 0">
        <Button type="success" @click="handlePrev">上一步</Button>
      </span>

      <!--下面有业务表单时，点下一步只需要保存基本信息数据-->
      <!-- length  业务表单数量-->
      <span v-if="current < length-1 && length > 1">
        <Button type="primary" @click="handleNext" style="margin-left:8px;">下一步</Button>
      </span>
      
      <!--最后一步，点登记完成、暂予登记、需补正时都需要保存基本信息数据-->
      <span v-if="current === length - 1">
        <Button type="primary" @click="handleComplete" style="margin-left:8px;">登记完成</Button>
        <Button type="error" @click="handleUnpass" style="margin-left:8px;">不予登记</Button>
        <Button type="warning" @click="handleTemporarily" style="margin-left:8px;">暂存</Button>
      </span>

      <Button @click="deleteCase" style="margin-left:8px;">撤销返回</Button> 

      <!--不予登记-->  
      <Modal 
        v-model="unpassModal" 
        width="520" 
        class-name="ivu-modal-style audit-modal"
        :mask-closable="false">
        <p slot="header"><span>不予登记意见框</span></p>
        <div>
          <Form :label-width="20">
            <div style="text-align:center; padding: 10px 20px;">
              
              <FormItem :class="unpassTip?'ivu-form-item-error':''">
                <i style="position:absolute;left:-20px; top: 0; color: #ed3f14;">*</i>
                <Input v-model="unpassOpinion" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入处理意见"></Input>
                <div class="ivu-form-item-error-tip" v-show="unpassTip">请输入处理意见</div>
              </FormItem>
            </div>
             
            <div class="ivu-modal-btn">
              <FormItem>
                <Button type="text" @click="unpassCancel">取消</Button>
                <Button type="primary" @click="unpassSubmit" style="margin-left: 8px">确定</Button>
              </FormItem>                
            </div>               
          </Form>
        </div>
      </Modal>

      <!--下一环节弹窗-->
      <Modal 
        v-model="auditModal" 
        width="520" 
        class-name="ivu-modal-style audit-modal"
        :mask-closable="false">
        <p slot="header"><span>下一环节</span></p>
        <Form ref="tacheData" :model="tacheData" :label-width="130">
          <template v-for="(item, index) in tacheList">              
            <div class="ivu-modal-form">
              <FormItem label="下一环节名称：">{{item.tacheName}}</FormItem>
              <!--以下条件都满足时显示‘下一环节处理人’这一项内容-->
              <template v-if="showNextUserSelect && item.candidateList &&item.candidateList.length > 0 ">
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
          <div class="ivu-modal-btn">
            <FormItem>
              <Button type="text" @click="handleReset">取消</Button>
              <span v-if="showNextUserSelect">
                <Button type="primary" @click="haveSelectStart" style="margin-left: 8px">确定</Button>
              </span> 
              <span v-else>
                <Button type="primary" @click="noSelectStart" style="margin-left: 8px">确定</Button>
              </span>
            </FormItem>                
          </div>
        </Form>
      </Modal>                     
    </FormItem>
  </Form>
</template>

<script>
export default{
  props: {
    current: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    nextaudit: {
      type: Boolean
    }
  }, 
  data(){
    return{
      auditModal: false,          //下一环节弹窗
      unpassModal: false,         //不予登记弹窗
      unpassOpinion: '',          //不予登记意见框
      unpassTip: false,           //不予登记

      showNextUserSelect: false,  //根据条件判断是否显示选人框
      tacheList: [],              //下一环节数据
      tacheSubList: [],           //提交下一环节数据
      isShowNextUserSelect: '',   //0不显示下一环节选人框，1显示下一环节选人框
      isParallelGateway: '',      //是否入/出并联环节，0否，1是
      tacheData: {
        auditorId: [],            //所选中的下一环节处理人Id
      }
    }
  },  
  methods: {
    handleNext(){
      this.$emit('next');
    },
    handlePrev(){
      this.$emit('prev');
    },

    // 不予登记
    handleUnpass() {
      this.unpassModal = true;
      this.unpassOpinion = '';
    },
    unpassCancel() {
      this.unpassOpinion = '';
      this.unpassModal = false;
    },
    unpassSubmit() {
      if(this.unpassOpinion == ''){
        this.unpassTip = true;
        this.$Message.error('请输入处理意见');
        return false;
      }
      this.unpassTip = false;
      this.$emit('unpass');
    },
    unpassSubmit0() {
      this.$emit('loadingShow');
      axios.post("/cgaCase/modifyCgaCaseForRegister.do", {caseId:this.$route.query.caseId, tacheIdea:this.unpassOpinion})
      .then(data=>{
        this.$emit('loadingHide');
        if(data.status == '200' && data.success == true){
          this.$Message.success(data.msg);
          this.$router.push({path:'../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
          this.unpassModal = false;
        }else{
          this.$Message.error(data.msg);
        }
      }).catch(error=>{
        this.$emit('loadingHide');
      });
    },

    handleComplete0(assignId){
      this.$emit('loadingShow');
      //登记成功显示环节弹窗并获取下一环节数据
      axios.post("/cgaCase/querySecondTaskCandidateList.do", {projectId:this.$route.query.projectId, assignDeptId:assignId})
      .then(data=>{
        this.$emit('loadingHide'); 
        if(data.status == '200' && data.success == true){
          //显示下一环节弹窗
          this.auditModal = true; 
          //下一环节数据
          this.tacheList = data.obj;
          //注意：需要设置数组的长度
          for (var i = 0; i < this.tacheList.length; i++) {
            this.tacheData.auditorId.push([]);
          }
          this.isShowNextUserSelect = data.obj.map(item => item.isShowNextUserSelect)[0].toString();
          this.isParallelGateway = data.obj.map(item => item.isParallelGateway)[0].toString();
          if(this.isShowNextUserSelect=='1'&&this.isParallelGateway=='0'){
            //显示下一环节选人框
            this.showNextUserSelect = true;
          }else{
            //不出现下一环节选人框
            this.showNextUserSelect = false;
          }
        }else{
          this.$Message.error(data.msg);
          return false
        }
      }).catch(error=>{
        this.$emit('loadingHide');
      });        
    },
    //登记完成操作
    handleComplete(){
      this.$emit('complete');
    },
    handleTemporarily(){
      this.$emit('temporarily');
    },
    //点击登记完成按钮开启办件流程时，显示下一环节弹窗，如果没有下一环节处理人项时，可直接保存并提交数据
    noSelectStart(){
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
      axios.post("/cgaCaseRegist/doCaseRegisterFinish.do", {id:this.$route.query.id, caseId:this.$route.query.caseId, projectId:this.$route.query.projectId, isParallelGateway:this.isParallelGateway, nextUsers:this.nextUsers})
      .then(data=>{
        this.$emit('loadingHide');
        if(data.status == '200' && data.success == true){
          this.auditModal = false;
          this.$Message.success('办件开启成功！');
          this.$router.push({path: '../../print', query:{moduleId:this.$route.query.moduleId,w01ID:data.obj.w01ID,w02ID:data.obj.w02ID,inCurrentPage:this.$route.query.inCurrentPage}});
        }else{
          this.$Message.error('办件开启失败！');
          this.auditModal = true;
          return false;
        }
      }).catch(error=>{
        this.$emit('loadingHide');
      });     
    },
    //点击登记完成按钮开启办件流程时，显示下一环节弹窗，如果有下一环节处理人项时，需要先验证再保存并提交数据
    haveSelectStart(){
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
            this.noSelectStart();
          }else{
            this.$Message.error({
                content: '请选择下一环节处理人',
                duration: 5
            });
          }

        }
      })       
    },  
    handleReset(){
      this.$refs.tacheData.resetFields();
      this.auditModal = false;
    },
    //撤销返回操作
    deleteCase(){
      this.$Modal.confirm({
        title: '删除提示',
        content: '确定要撤销返回吗？',
        onOk: () => {
          this.$emit('loadingShow');
          axios.post("/cgaCaseRegist/doCancelRegist.do",{caseId:this.$route.query.caseId})
          .then(data=>{
            this.$emit('loadingHide');
            this.$Message.success(data.msg);
            this.$router.push({path:'../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}})
          }).catch(error=>{
            this.$emit('loadingHide');
          }); 
        }
      })
    }
  }
}
</script>

<style lang="scss">
.audit-modal{
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
  .ivu-modal-footer{
    display: none;
  }
}
</style>