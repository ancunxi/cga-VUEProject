<!-- yw 201800605 -->
<!-- 业务流程  行政收费 -->
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
            <FormItem label="项目名称：">{{caseInfo.caseName}}</FormItem>
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
                      <td><div class="ivu-table-cell">{{item.CHARGE_NAME}}</div></td>
                      <td><div class="ivu-table-cell">{{item.VOUCHER_NO}}</div></td>
                      <td><div class="ivu-table-cell">{{item.UNIT}}</div></td>
                      <td><div class="ivu-table-cell">{{item.UNIT_PRICE}}</div></td>
                      <td>
                        <div class="ivu-table-cell">
                          <template v-if="$route.query.isCharge == 'yes'">
                             <span>{{item.count}}</span>
                          </template>
                         <template  v-if="$route.query.isCharge == 'no'">
                             <InputNumber :min="0" v-model="item.count" @on-change="changeItem(item)"></InputNumber>
                          </template>
                          <template  v-if="$route.query.isCharge == 'ok'">
                            <InputNumber :min="0" v-model="item.count" @on-change="changeItem(item)"></InputNumber>
                          </template>
                        </div>
                      </td>
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
    <Row class="margin-bottom-20 center">
      <Col span="24">
        <Button style="margin-left:8px; width:112px;"    disabled="disabled"  v-if="$route.query.isCharge == 'yes'" >核算</Button>
        <Button style="margin-left:8px; width:112px;"  type="primary" @click="checkTotalCharge"  v-if="$route.query.isCharge == 'no' || $route.query.isCharge == 'ok'">核算</Button>
        <Button style="margin-left:8px; width:112px;" type="primary" @click="printCharge">打印收费单</Button>
        <Button style="margin-left:8px; width:112px;"  disabled="disabled" v-if="$route.query.isCharge == 'yes' || $route.query.isCharge == 'ok'">已缴费</Button>
        <Button style="margin-left:8px; width:112px;" type="primary"  v-if="$route.query.isCharge == 'no'" @click="submit">已缴费</Button>
      	<Button style="margin-left:8px; width:112px;" type="primary" @click="gobacks">返回</Button>
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
      loadingModal:false,      //loading框
      //项目地址
      trueProjectAddress:'', 
      //通讯地址
      trueTxAddress:'',
      tips:false,
      caseInfo:{},             //办件详情  
      relatedPersonInfo:{},    //关联人详情
      chargeReceivableInfo:{}, //收费项详情

      w04ID:'',     //传递给打印通知单参数
      
      mapModal:false,   //百度地图
    }
  },
  created(){
    this.loadChargeCase();

  },
  methods:{
	getSub(par1,par2){
		var m = 0, s1 = par1.toString(), s2 = par2.toString();  
		  try {  
			m += s1.split(".")[1].length;  
		  }catch (e) {  
		  }  
		  try {  
			m += s2.split(".")[1].length;  
		  }catch (e) {  
		  }  
		  return parseFloat((Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(2)); 
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
  	gobacks(){
  		this.$router.push({path: '../index',query: {moduleId:this.$route.query.moduleId,currentPage:this.$route.query.currentPage, pageSize:this.$route.query.pageSize,isCharge:this.$route.query.isCharge}})
  	},

    //根据办件流水号查询缴费办件信息
    loadChargeCase(){
      axios.post("/cgaCaseChargeReceivable/queryCaseChargeByCaseId.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        if(data.success ==true && data.status == 200){
          //console.log(data)
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
        }else{
          this.$Message.error(data.msg);
        }
      });
    },
    checkTotalCharge(){
      let arr0 = this.chargeReceivableInfo.chargeReceivableList.map(item =>{
        return {
          id: item.ID,
          chargeCount: item.count
        }
      });
      let arr = JSON.stringify(arr0);
      
      //核算办件缴费金额
      axios.post("/cgaCaseChargeReceivable/accountingCaseCharge.do", {caseId:this.$route.query.caseId, chargeList:arr})
      .then(data=>{
        if(data.success ==true && data.status == 200){
          this.$Message.success("收费项信息已核算！");
          this.w04ID = data.obj.w04ID;
          this.loadChargeCase();
          this.$router.push({path: './index',query: {
              moduleId:this.$route.query.moduleId,
              caseId: this.$route.query.caseId,
              pageSize:this.$route.query.pageSize,
              currentPage:this.$route.query.currentPage,
              w04ID:this.w04ID,
              isCharge: 'no'
            }
          })
        }else{
          this.$Message.error(data.msg);
        }
      });
    },
    printCharge(){
      if(this.w04ID == '' && this.$route.query.w04ID != ''){
        this.w04ID = this.$route.query.w04ID;
      }
      
      if(this.w04ID == '' && this.$route.query.w04ID == ''){
        this.$Message.error('请点击核算按钮核对收费项信息！');
        return false;
      }
      
      this.$router.push({path: './print', query:{moduleId:this.$route.query.moduleId, w04ID:this.w04ID, caseId:this.$route.query.caseId,currentPage:this.$route.query.currentPage, pageSize:this.$route.query.pageSize,isCharge:this.$route.query.isCharge} });
    },
    //已缴费
    submit(){
      //行政收费--已收费按钮调用
      //新增本次缴费或退费记录
      axios.post("/cgaCaseChargeDetail/addChargeDetailInfo.do", {caseId:this.$route.query.caseId, factIncome:this.chargeReceivableInfo.totalMoney})
      .then(data=>{
        if(data.success ==true && data.status == 200){
          this.$Message.success("缴费操作成功！");
          this.gobacks();
        }else{
          this.$Message.error(data.msg);
        }
      });
    },
    
    
    changeItem(item){
      this.$set(item,'count',item.count);
      //this.$set(item,'receivableIncome',item.count*item.UNIT_PRICE);
		this.$set(item,'receivableIncome',this.getSub(item.count,item.UNIT_PRICE));
      //console.log(this.chargeReceivableInfo.chargeReceivableList)
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

<style scoped>
  .ivu-input-number{
    width:100%;
  }
</style>


  