<template>
  <Row>
    <Col span="24">
      <!--当workFlowType=1表示是辅助流程，显示辅助流程信息--> 
      <Row v-if="workFlowInfo.workFlowType == '1'">
        <Col span="24">     
          <Row class="margin-bottom-20">
            <Col span="24">
              <h5 class="title"><span><Icon type="document-text"></Icon>辅助流程信息</span></h5>
              <Form :label-width="130">
                <Row>
                  <Col span="12">
                    <FormItem label="辅助流程名称：">{{workFlowSupport.supportName}}</FormItem>
                  </Col> 
                  <Col span="12">
                    <FormItem label="期限说明：">{{workFlowSupport.limitDesc}}</FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="数量：">{{workFlowSupport.supportNum}}</FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="流程期限：">{{workFlowSupport.supportTime}}</FormItem>
                  </Col>                            
                </Row>
                <Row>
                  <Col span="24">
                    <FormItem label="启动原因：">{{workFlowSupport.reason}}</FormItem>
                  </Col>
                </Row>        
              </Form>                                 
            </Col>
          </Row>
          
          <!--当supportType=1表示是缴费辅助流程，显示收费项信息-->
          <Row v-if="workFlowSupport.supportType == '1'" class="margin-bottom-20">
            <Col span="24">
              <h5 class="title"><span><Icon type="social-usd"></Icon>收费项信息</span></h5>
              <div class="ivu-table-wrapper margin-bottom-20">
                <div class="ivu-table ivu-table-border"> 
                  <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                      <colgroup>
                        <col width="20%">
                        <col width="20%">
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                      </colgroup> 
                      <thead>
                        <tr>
                          <th><div class="ivu-table-cell">收费项名称</div></th>
                          <th><div class="ivu-table-cell">凭证号</div></th>
                          <th><div class="ivu-table-cell">单位</div></th>
                          <th><div class="ivu-table-cell">单价(比率)</div></th>
                          <th><div class="ivu-table-cell">数量(项目总额)</div></th>
                          <th><div class="ivu-table-cell">金额</div></th>
                        </tr>
                      </thead>
                    </table>
                  </div> 
                  <div class="ivu-table-body">
                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                      <colgroup>
                        <col width="20%">
                        <col width="20%">
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                      </colgroup> 
                      <tbody class="ivu-table-tbody">
                        <template v-for="item in viewTableList">
                          <tr class="ivu-table-row">
                            <td><div class="ivu-table-cell">{{item.chargeName}}</div></td>
                            <td><div class="ivu-table-cell">{{item.voucherNo}}</div></td>
                            <td><div class="ivu-table-cell">{{item.unit}}</div></td>
                            <td><div class="ivu-table-cell">{{item.unitPrice}}</div></td>
                            <td><div class="ivu-table-cell">{{item.count}}</div></td>
                            <td><div class="ivu-table-cell">{{item.receivableIncome}}</div></td>
                          </tr> 
                        </template>
                        <tr class="ivu-table-row">
                          <td><div class="ivu-table-cell">合计金额：</div></td>
                          <td><div class="ivu-table-cell">{{workFlowCharge.totalMoney}}</div></td>
                          <td><div class="ivu-table-cell">合计大写：</div></td>
                          <td colspan="3"><div class="ivu-table-cell center red">{{workFlowCharge.totalMoneyCn}}</div></td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>  
                </div>
              </div>                      
            </Col>
          </Row> 
        </Col>
      </Row>

      <!--根据isSupportProcess的布尔值控制是否可以再启动辅助流程-->
      <Row v-if="tacheInfo.isSupportProcess == 'true'">
        <Col span="24">
          <h5 class="title">
            <span><Icon type="wrench"></Icon>启动辅助流程</span>
            <strong class="red">（注：一个办件同一环节相同辅助流程只能启动一次，辅助流程循环嵌套启动。）</strong>
          </h5>
          <Form ref="processData" :model="processData" :label-width="130">
            <Row>
              <Col span="24">
                <Row>
                  <Col span="12">
                    <FormItem 
                      label="辅助流程名称：" 
                      prop="supportId"
                      :rules="[{required: true, message: '请选择辅助流程名称', trigger: 'change'}]">
                      <Select v-model="processData.supportId" placeholder="请选择辅助流程名称" @on-change="selectSupportType(processData.supportId)">
                        <template v-for="item in auxiliaryData">
                          <Option :value="item.id" :key="item.id">{{item.supportName}}</Option>
                        </template>
                      </Select>
                    </FormItem>
                  </Col> 
                  <Col span="12">
                    <FormItem label="期限说明：">
                      <Input v-model="processData.limitDesc" placeholder="请输入期限说明"></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="数量：">
                      <InputNumber :min="0" v-model="processData.supportNum" placeholder="请输入数量"></InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="流程期限：">
                      <InputNumber :min="0" v-model="processData.supportTime" placeholder="请输入流程期限"></InputNumber>
                    </FormItem>
                  </Col>                            
                </Row>
                <Row>
                  <Col span="24">
                    <FormItem label="启动原因：">
                      <Input v-model="processData.reason" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入启动原因"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>

            <!--supportType=1表示在辅助流程名称中选择的是缴费流程，则显示收费项信息-->
            <Row v-show="chargeList" style="margin-top:20px;">              
              <Col span="24">
                <h5 class="title"><span><Icon type="social-usd"></Icon>收费项信息</span></h5>
                <div class="ivu-table-wrapper charge">
                  <div class="ivu-table ivu-table-border"> 
                    <div class="ivu-table-header">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <colgroup>
                          <col width="30%">
                          <col width="25%">
                          <col width="15%">
                          <col width="15%">
                          <col width="15%">
                        </colgroup> 
                        <thead>
                          <tr>
                            <th><div class="ivu-table-cell">收费项名称</div></th>
                            <th><div class="ivu-table-cell">凭证号</div></th>
                            <th><div class="ivu-table-cell">单位(比率)</div></th>
                            <th><div class="ivu-table-cell">单价</div></th>
                            <th><div class="ivu-table-cell">数量(项目总额)</div></th>
                          </tr>
                        </thead>
                      </table>
                    </div> 
                    <div class="ivu-table-body">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%">
                        <colgroup>
                          <col width="30%">
                          <col width="25%">
                          <col width="15%">
                          <col width="15%">
                          <col width="15%">
                        </colgroup> 
                        <tbody class="ivu-table-tbody">
                          <template v-for="(item, index) in TableList">
                            <tr class="ivu-table-row">
                              <td><div class="ivu-table-cell">{{item.chargeName}}</div></td>
                              <td><div class="ivu-table-cell">{{item.voucherNo}}</div></td>
                              <td><div class="ivu-table-cell">{{item.unit}}</div></td>
                              <td><div class="ivu-table-cell">{{item.unitPrice}}</div></td>
                              <td>
                                <div class="ivu-table-cell">
                                  <FormItem>
                                    <InputNumber :min="0" v-model="item.chargeCount" placeholder="请输入数量"></InputNumber>
                                  </FormItem>
                                </div>
                              </td>
                            </tr>                            
                          </template>  
                        </tbody>
                      </table>
                    </div>
                    <div class="ivu-table-tip" v-show="noChargeData">
                      <table cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                          <tr>
                            <td>抱歉，暂无数据！</td>
                          </tr>
                        </tbody>
                      </table>
                    </div> 
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col span="24">
                <FormItem>
                  <Button type="primary" @click="handleSubmit">启动</Button>
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
                            <Button type="primary" @click="handleStart" style="margin-left: 8px">确定</Button>
                          </span> 
                          <span v-else>
                            <Button type="primary" @click="submitForm" style="margin-left: 8px">确定</Button>
                          </span>
                        </FormItem>                
                      </div>
                    </Form>
                  </Modal> 
                </FormItem>
              </Col>
            </Row>
          </Form>                                                
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script>
export default {
  props: ["tacheInfo", "workFlowInfo", "workFlowSupport", "workFlowCharge"],
  data () {
    return {
      chargeList: false,   //收费项信息是否显示
      auditModal: false,   //下一环节弹窗
      showNextUserSelect: false,  //根据条件判断是否显示选人框
      tacheList: [],              //下一环节数据
      tacheSubList: [],           //提交下一环节数据
      isShowNextUserSelect: '',   //0不显示下一环节选人框，1显示下一环节选人框
      isParallelGateway: '',      //是否入/出并联环节，0否，1是
      tacheData: {
        auditorId: [],            //所选中的下一环节处理人Id
      },
      auxiliaryData: [],   //辅助流程名称下拉框数据
      auxiliaryEle: [],    
      processData: {      
        supportId: '',     //辅助流程名称Id
        supportType: '',   //辅助流程类型
        workFlowKey: '',   //辅助流程名称下拉框中workFlowKey值
        limitDesc: '',     //期限说明
        supportNum: 0,     //新增form表单中的数量
        supportTime: 0,    //流程期限
        reason: '',        //启动原因 
      },
      TableList: [],       //收费项列表数据
      chargeTableList: [], //收费项Id和chargeCount值的集合
      noChargeData: false,
      viewTableList: [],   //查看辅助流程收费项列表数据
    }
  },
  methods: {
    //获取/查看辅助流程收费项列表数据
    getChargeList(){
      this.viewTableList = this.workFlowCharge.chargeReceivableList;
    },
    //获取辅助流程名称下拉框数据
    getAuxiliaryList(){
      axios.post("/cgaSupportExecution/queryAvailableSupportWorkflowList.do", {caseId:this.$route.query.caseId, mainNodeId:this.workFlowInfo.mainNodeId})
      .then(data=>{
        this.auxiliaryData = data.obj;
      })
    },
    //选择辅助流程下拉框时由当前选中项的id过滤出对应的supportType
    selectSupportType(supportId){
      this.processData.supportId = supportId;
      this.auxiliaryEle = this.auxiliaryData.filter(item => this.processData.supportId.indexOf(item.id)!== -1);
      this.processData.supportType = this.auxiliaryEle.map(item => item.supportType);
      this.processData.workFlowKey = this.auxiliaryEle.map(item => item.workFlowKey);
      //当supportType=1时显示收费项信息列表
      if(this.processData.supportType == '1'){
        //获取收费项列表数据
        axios.post("/cgaProjectChargeItem/queryListByProjectId.do", {projectId:this.$route.query.projectId})
        .then(data=>{
          //显示收费项信息块
          this.chargeList = true;
          if(data.obj && data.obj.length > 0){
            //这里是为了把列表中返回的chargeCount值由字符串转成Number类型
            this.TableList = data.obj.map(item => {
              return Object.assign({}, item, {chargeCount: Number(item.chargeCount)})
            });
          }else{
            this.noChargeData = true;
            this.$Message.error('启动缴费流程失败，原因：无收费项信息！');
          }
        })
      }else{
        this.chargeList = false;
      }
    },
    //启动辅助流程
    handleSubmit(){
      this.$emit('loadingShow');
      this.$refs.processData.validate((valid) => {
        if (valid) {
          //验证通过先检测能否启动辅助流程
          axios.post("/cgaSupportExecution/checkSupportForStart.do", {caseId:this.$route.query.caseId, supportId:this.processData.supportId, mainNodeId:this.workFlowInfo.mainNodeId, supportType:this.processData.supportType.toString()})
          .then(data=>{
            if(data.status == '200' && data.success == true){
              //如果能启动辅助流程，则需要查询下一环节处理人(workFlowKey是辅助流程名称下拉框中返回的值)
              axios.post("/cgaCase/querySecondTaskCandidateList.do", {workFlowKey:this.processData.workFlowKey.toString()})
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
            }else{
              this.$Message.error(data.msg);
            }
            this.$emit('loadingHide');
          }).catch(error=>{
            this.$emit('loadingHide');
          });           
        } else {
          this.$Message.error('表单验证失败！');
        }
      })
    },
    //保存并开启辅助流程    
    submitForm(){
      this.$emit('loadingShow');
      //下一环节
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
      //若supportType=1则是缴费辅助流程，则还需要传收费项列表中的id和chargeCount值的集合
      this.chargeTableList = this.TableList.map(item =>{
        return {
          id: item.id,
          chargeCount: item.chargeCount
        }
      });  
      axios.post("/cgaSupportExecution/saveSupportForStart.do", {caseId:this.$route.query.caseId, supportId:this.processData.supportId, mainNodeId:this.workFlowInfo.mainNodeId, mainTacheName:this.workFlowInfo.mainTacheName, supportType:this.processData.supportType.toString(), isParallelGateway:this.isParallelGateway, nextUsers:this.nextUsers, limitDesc:this.processData.limitDesc, supportNum:this.processData.supportNum, supportTime:this.processData.supportTime, reason:this.processData.reason, chargeList:JSON.stringify(this.chargeTableList)})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          this.auditModal = false;
          this.$Message.success('办件辅助流程开启成功！');
          if(this.processData.supportType == '1'){ 
            //如果是缴费流程需要跳转到打印页面且接口会返回id值
            this.$router.push({path: './print', query:{w04ID:data.obj.w04ID, inCurrentPage:this.$route.query.inCurrentPage}}); 
          }else{
            //否则跳转到工作待办列表页
            this.$router.push({path: '../index'}); 
          }
        }else{
          this.$Message.error('办件辅助流程开启失败！');
          this.auditModal = true;
          return false; 
        }
        this.$emit('loadingHide');
      }).catch(error=>{
        this.$emit('loadingHide');
      });   
    },
    //保存并开启辅助流程（有下一环节处理人多选下拉框项，为必填）
    handleStart(){
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
            this.submitForm();
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
    }
  }
}
</script>

<style lang="scss">
.ivu-input-number{
  width: 100%;
}
.charge{
  .ivu-table th:last-child{
    text-align: center;
  }
  .ivu-form-item{
    margin-bottom: 0!important;
   .ivu-form-item-content{
      margin-left: 0!important;
    }
  } 
}
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