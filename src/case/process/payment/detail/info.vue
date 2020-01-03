<template>    
  <Form :label-width="130">
    <Row class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="document-text"></Icon>项目信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="申请类别：">{{caseInfo.applyObjectTypeName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="短信通知：">{{relatedPersonInfo.isSmsName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="发证方式：">{{caseInfo.issueTypeName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="项目名称：">{{caseInfo.projectName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="资料袋条码号：">{{caseInfo.caseBarcode}}</FormItem>
          </Col>                  
        </Row> 
        <Row>
          <Col span="24">
            <FormItem label="项目地址：">  
              {{this.trueProjectAddress}}
              <Icon v-if="this.trueProjectAddress!=undefined && this.trueProjectAddress!=''" type="location" title="地址定位"  @click.native="addressLocationXMDZFun"></Icon>
            </FormItem>
          </Col>  
        </Row>                                         
      </Col>
    </Row>

    <Row class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="person"></Icon>申请人信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="证件类型：">{{relatedPersonInfo.cardTypeName}}</FormItem>
          </Col>
          <Col span="16">
            <FormItem label="证件号码：">{{relatedPersonInfo.cardNumber}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="姓名：">
              {{relatedPersonInfo.relatedPersonName}}
              <Icon type="person" title="点击查看头像" v-if="this.relatedPersonInfo.applyFileId!=undefined && this.relatedPersonInfo.applyFileId!=''" @click.native="viewIcon"></Icon>
            </FormItem>
          </Col>                   
          <Col span="8">
            <FormItem label="性别：">{{relatedPersonInfo.sexName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="手机号码：">{{relatedPersonInfo.mobile}}</FormItem>
          </Col> 
        </Row> 
        <Row>                                   
          <Col span="8">
            <FormItem label="座机电话：">{{relatedPersonInfo.officeTel}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="邮政编码：">{{relatedPersonInfo.zipcode}}</FormItem>
          </Col>                  
          <Col span="8">
            <FormItem label="电子邮箱：">{{relatedPersonInfo.email}}</FormItem>
          </Col>                  
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="通讯地址：">  
              {{this.trueTxAddress}}
              <Icon v-if="this.trueTxAddress!=undefined && this.trueTxAddress!=''" type="location" title="地址定位"  @click.native="addressLocationTXDZFun"></Icon>
            </FormItem>
          </Col>  
        </Row>                                                          
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
                    <template>
                    <tr v-for="item in chargeReceivableInfo.chargeReceivableList" class="ivu-table-row">
                      <td><div class="ivu-table-cell">{{item.chargeName}}</div></td>
                      <td><div class="ivu-table-cell">{{item.voucherNo}}</div></td>
                      <td><div class="ivu-table-cell">{{item.unit}}</div></td>
                      <td><div class="ivu-table-cell">{{item.unitPrice}}元/{{item.unit}}</div></td>
                      <td><div class="ivu-table-cell">{{item.count}}</div></td>
                      <td><div class="ivu-table-cell"><b>{{item.receivableIncome}}</b></div></td>
                    </tr>
                    </template>
                    <tr class="ivu-table-row">
                      <td><div class="ivu-table-cell">合计金额：</div></td>
                      <td><div class="ivu-table-cell"><b>{{chargeReceivableInfo.totalMoney}}</b></div></td>
                      <td><div class="ivu-table-cell">合计大写：</div></td>
                      <td colspan="3"><div class="ivu-table-cell center red">{{chargeReceivableInfo.totalMoneyCn}}</div></td>
                    </tr>  
                  </tbody>
                </table>
              </div>
              <div class="ivu-table-tip" v-if="chargeReceivableInfo.chargeReceivableList==0">
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

    <Row class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="arrow-swap"></Icon>收退费记录</span></h5>
        <Row>
          <Col span="6">
            <FormItem label="应收款："><b>{{chargeReceivableInfo.totalMoney}}</b>元</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="实收款："><b>{{paymentTotalMoney}}</b>元</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="退款："><b>{{refundTotalMoney}}</b>元</FormItem>
          </Col>
          <Col span="6">
            <FormItem label="合计："><b>{{realMoney}}</b>元</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <Col span="20">
              <FormItem label="本次金额：">
                <InputNumber v-model="paymentMoney" placeholder="请输入金额" style="width:100%;"></InputNumber>
                <div class="ivu-form-item-error-tip" v-show="tips"></div>
              </FormItem>
            </Col>
            <Col span="4">
              <Button type="primary" style="margin-left:10px;" @click="addChargeDetailInfo">添加</Button>
            </Col> 
          </Col>
          <Col span="16">
            <p class="ma_info_red" style="padding-left:10px;">输入正数为缴费，输入负数为退费</p>
          </Col>                  
        </Row> 
        <Row>
          <Col span="12">
            <FormItem label="收款记录：">
              <Row style="border:1px solid #dddee1;height: 220px;overflow-y: auto;" >
                <template v-for="item in chargePaymentList">
                  <Col span="24">
                    {{item.chargeTime}} 缴费 <b>{{item.factIncome}}</b>元
                  </Col>
                </template>
              </Row>
            </FormItem>
          </Col>  
          <Col span="12">
            <FormItem label="退费记录："> 
              <Row style="border:1px solid #dddee1;height: 220px;overflow-y: auto;" >
                <template v-for="item in chargeRefundList">
                  <Col span="24">
                    {{item.chargeTime}} 退费 <b>{{item.factIncome}}</b>元
                  </Col>
                </template>
              </Row>   
            </FormItem>
          </Col> 
        </Row>                                         
      </Col>
    </Row> 

    <Row class="margin-bottom-20 center">
      <Col span="24">
      	<Button  style="margin-left:8px;"  @click="gobacks">返回</Button>
      </Col>
    </Row>
    
    <Modal
      v-model="mapModal"
      title="百度地图"
      width="1200"
      :mask-closable="false">
      <map-modal ref='mapChild'></map-modal>
      <div slot="footer"></div>            
    </Modal> 

    <!--loading框 Modal Templates-->
    <div class="dhx_modal_cover" v-if='loadingModal'></div>
    <div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
    <!--End loading框 Modal Templates--> 
  </Form>      
</template>

<script>
import mapModal from '../../../common/view/mapSearch.vue';    //地图

export default {
  components: {
    'map-modal': mapModal,
  },
  data () {
    return { 
      loadingModal:false, //loading框
      //项目地址
      trueProjectAddress:'', 
      //通讯地址
      trueTxAddress:'',
      tips:false,
      caseInfo:{},  //办件详情  
      relatedPersonInfo:{},//关联人详情
      chargeReceivableInfo:{},//收费项详情
      paymentTotalMoney:'',//实收金额
      refundTotalMoney:'',//实退金额
      realMoney:'',//合计
      chargePaymentList:{},//收款记录
      chargeRefundList:{},//退款记录
      paymentMoney:null, //本次缴费金额
      mapModal:false,   //百度地图
    }
  },
  created(){
    this.loadChargeCase();
    this.loadChargInfo();

  },
  methods:{
  	gobacks(){
  		this.$router.push({path: '../index',query: {currentPage:this.$route.query.inCurrentPage,moduleId:this.$route.query.moduleId}})
  	},
    //根据办件流水号查询缴费办件相关信息
    loadChargeCase(){
      axios.post("/cgaCaseChargeDetail/queryChargeCaseByCaseId.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        this.caseInfo = data.obj.caseInfo;
        this.relatedPersonInfo = data.obj.relatedPersonInfo;

        //项目地址
        var caseAreaCodeName1=this.caseInfo.caseAreaCodeName || '';
        var caseAddress1=this.caseInfo.caseAddress || '';
        this.trueProjectAddress=caseAreaCodeName1+caseAddress1;
        //通讯地址
        var areaCodeName1=this.relatedPersonInfo.areaCodeName || '';
        var address1=this.relatedPersonInfo.address || '';
        this.trueTxAddress=areaCodeName1+address1;
        
        this.chargeReceivableInfo = data.obj.chargeReceivableInfo;
      });
    },
    loadChargInfo(){
      axios.post("/cgaCaseChargeDetail/queryCaseChargeDetailInfo.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        this.paymentTotalMoney=data.obj.paymentTotalMoney;
        this.refundTotalMoney= data.obj.refundTotalMoney;
        this.realMoney = data.obj.realMoney;
        this.chargePaymentList = data.obj.chargePaymentList;
        this.chargeRefundList = data.obj.chargeRefundList;
      });
    },
    addChargeDetailInfo(){
      var reg = /^-[0-9]+(.[0-9]+)?|[0-9]+(.[0-9]+)?$/; //判断字符串是否为数字
      if (!reg.test(this.paymentMoney)) {
        this.tips=true;
        $("div[class=ivu-form-item-error-tip]").text("请输入正确的金额");
        // this.$Message.error('请输入正确的金额');
        this.paymentMoney = null;
        return false;
    　　}
      if(parseFloat(this.paymentMoney)==0){
        this.tips=true;
        $("div[class=ivu-form-item-error-tip]").text("缴费金额应大于或小于0元");
        // this.$Message.error('缴费金额应大于0元');
        this.paymentMoney = null;
        return false;
      }
      this.loadingModal = true;
      axios.post("/cgaCaseChargeDetail/addChargeDetailInfo.do", {caseId:this.$route.query.caseId,factIncome:this.paymentMoney})
      .then(data=>{
        this.loadChargInfo();
        this.paymentMoney = null;
        this.tips=false;

        this.loadingModal = false;
      }).catch(err=>{
        this.loadingModal = false;
      });  
    },
    viewIcon(){
      var fileId=this.relatedPersonInfo.applyFileId;
      var fileName="";
      if(fileId==undefined || fileId==''){
        this.$Message.error('该人员没上传头像！');
        return;
      }else{
        //根据附件id查询附件详细信息
        axios.post("/attachment/getAttachmentInfoById.do", {fileId:fileId})
        .then(data=>{
          fileName = data.obj.fileName || '';
          if(fileName!='' && fileName!=undefined){
            if(/^.+\.png$/.test(fileName) == false && /^.+\.jpg$/.test(fileName) == false){
               this.$emit('previewsFun',fileId,'.pdf');
            }else{
              this.$emit('previewsFun',fileId,'.jpg');
            }
          }else{
            this.$Message.error('该人员没上传头像！');
            return;
          }     
        });
      }
    },

    //项目地址
    addressLocationXMDZFun(){
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.trueProjectAddress,'');
    },
    //通讯地址
    addressLocationTXDZFun(){
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.trueTxAddress,'');
    },
  }
}
</script>


  