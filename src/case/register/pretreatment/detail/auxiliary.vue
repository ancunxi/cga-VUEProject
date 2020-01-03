<template>
  <Row>
    <Col span="24">
      <!--辅助流程-->
      <Row>
        <Col span="24">      
          <Row class="margin-bottom-20">
            <Col span="24">
              <h5 class="title"><span><Icon type="document-text"></Icon>辅助流程信息</span></h5>
              <Form :label-width="130">
                <Row>
                  <Col span="12">
                    <FormItem label="辅助流程名称：">缴费流程</FormItem>
                  </Col> 
                  <Col span="12">
                    <FormItem label="期限说明：">5个工作日</FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span="12">
                    <FormItem label="数量：">2</FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="流程期限：">5</FormItem>
                  </Col>                            
                </Row>
                <Row>
                  <Col span="24">
                    <FormItem label="启动原因：">需要前往收费窗口缴纳相关费用</FormItem>
                  </Col>
                </Row>        
              </Form>                                 
            </Col>
          </Row> 
          <Row class="margin-bottom-20">
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
                        <tr class="ivu-table-row">
                          <td><div class="ivu-table-cell">工本费</div></td>
                          <td><div class="ivu-table-cell">XXXXXXX001</div></td>
                          <td><div class="ivu-table-cell">件</div></td>
                          <td><div class="ivu-table-cell">5元/件</div></td>
                          <td><div class="ivu-table-cell">1</div></td>
                          <td><div class="ivu-table-cell">5.00</div></td>
                        </tr> 
                        <tr class="ivu-table-row">
                          <td><div class="ivu-table-cell">签卷费</div></td>
                          <td><div class="ivu-table-cell">XXXXXXX002</div></td>
                          <td><div class="ivu-table-cell">份</div></td>
                          <td><div class="ivu-table-cell">10元/份</div></td>
                          <td><div class="ivu-table-cell">2</div></td>
                          <td><div class="ivu-table-cell">10.00</div></td>
                        </tr>
                        <tr class="ivu-table-row">
                          <td><div class="ivu-table-cell">合计金额：</div></td>
                          <td><div class="ivu-table-cell">15.00</div></td>
                          <td><div class="ivu-table-cell">合计大写：</div></td>
                          <td colspan="3"><div class="ivu-table-cell center red">壹拾伍圆</div></td>
                        </tr>  
                      </tbody>
                    </table>
                  </div>
                  <div class="ivu-table-tip">
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
        </Col>
      </Row>           
      <!--主流程-->     
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
        <Row class="margin-bottom-20">
          <Col span="24">
            <h5 class="title">
              <span><Icon type="wrench"></Icon>启动辅助流程</span>
              <strong class="red">（注：一个办件同一环节相同辅助流程只能启动一次，辅助流程循环嵌套启动。）</strong>
            </h5>
            <Row>
              <Col span="12">
                <FormItem label="辅助流程名称：" prop="processName">
                  <Select v-model="formValidate.processName" placeholder="请选择辅助流程名称">
                    <Option value="1">缴费流程</Option>
                    <Option value="2">办件流程</Option>
                  </Select>
                </FormItem>
              </Col> 
              <Col span="12">
                <FormItem label="期限说明：">
                  <Input v-model="formValidate.termDesc" placeholder="请输入期限说明"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="数量：">
                  <InputNumber :max="10" :min="1" v-model="number"></InputNumber>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="流程期限：">
                  <Input v-model="formValidate.processTerm" placeholder="请输入流程期限"></Input>
                </FormItem>
              </Col>                            
            </Row>
            <Row>
              <Col span="24">
                <FormItem label="启动原因：">
                  <Input v-model="formValidate.reason" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入启动原因"></Input>
                </FormItem>
              </Col>
            </Row>        
            <Row>
              <Col span="24">
                <FormItem>
                  <Button type="primary" @click="handleSubmit('formValidate')">启动</Button>
                  <Modal
                    v-model="payModal"
                    title="缴费流程"
                    width="800"
                    class-name="ivu-modal-style"
                    :mask-closable="false"
                    @on-ok="okStart">
                    <div class="ivu-table-wrapper">
                      <div class="ivu-table ivu-table-border"> 
                        <div class="ivu-table-header">
                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <colgroup>
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                            </colgroup> 
                            <thead>
                              <tr>
                                <th><div class="ivu-table-cell">收费项名称</div></th>
                                <th><div class="ivu-table-cell">凭证号</div></th>
                                <th><div class="ivu-table-cell">单位</div></th>
                                <th><div class="ivu-table-cell">单价(比率)</div></th>
                                <th><div class="ivu-table-cell">数量(项目总额)</div></th>
                              </tr>
                            </thead>
                          </table>
                        </div> 
                        <div class="ivu-table-body">
                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                            <colgroup>
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                              <col width="20%">
                            </colgroup> 
                            <tbody class="ivu-table-tbody">
                              <tr class="ivu-table-row">
                                <td><div class="ivu-table-cell">工本费</div></td>
                                <td><div class="ivu-table-cell">XXXXXXX001</div></td>
                                <td><div class="ivu-table-cell">件</div></td>
                                <td><div class="ivu-table-cell">5元/件</div></td>
                                <td>
                                  <div class="ivu-table-cell">
                                    <Input placeholder="请输入数量"></Input>
                                  </div>
                                </td>
                              </tr> 
                              <tr class="ivu-table-row">
                                <td><div class="ivu-table-cell">签卷费</div></td>
                                <td><div class="ivu-table-cell">XXXXXXX002</div></td>
                                <td><div class="ivu-table-cell">份</div></td>
                                <td><div class="ivu-table-cell">10元/份</div></td>
                                <td>
                                  <div class="ivu-table-cell">
                                    <Input placeholder="请输入数量"></Input>
                                  </div>
                                </td>
                              </tr>  
                            </tbody>
                          </table>
                        </div>
                        <div class="ivu-table-tip">
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
                  </Modal>
                </FormItem>
              </Col>
            </Row>                                          
          </Col>
        </Row>        
      </Form>          
    </Col>
  </Row>
</template>

<script>
export default {
  data () {
    return {
      payModal: false,
      number: 1,
      formValidate: {
        processName: ''
      },
      ruleValidate: {
        processName: [
          { required: true, message: '请选择辅助流程名称', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.payModal = true; 
        } else {
          this.$Message.error('表单验证失败！');
        }
      })
    },
    okStart(){  
      this.$Message.info({
        content: '启动辅助流程成功！',
        onClose: ()=>{
          this.$router.push({path: './print'});
        }
      })    
    }
  }
}
</script>

<style lang="scss">
.ivu-input-number{
  width: 100%;
}
</style>