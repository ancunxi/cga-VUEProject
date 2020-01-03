<template>
  <div class="basicInfo">    
    <Form ref="caseInfo" :model="caseInfo" :label-width="130">
      <Row class="margin-bottom-20">
        <Col span="24">
          <h5 class="title"><span><Icon type="document-text"></Icon>项目信息</span></h5>
          <Row>
            <!-- <Col span="6">
              <FormItem label="申请类别：">
                <RadioGroup v-model="caseInfo.applyObjectType" @on-change="handleReset">
                  <Radio :label="0">个人</Radio>
                  <Radio :label="1">企业</Radio>
                </RadioGroup>
              </FormItem>
            </Col> -->
            <Col span="6">
              <FormItem label="申请类别：">{{caseInfo.applyObjectTypeName}}</FormItem>
            </Col>
            <Col span="6">
              <FormItem label="短信通知：">
                <RadioGroup v-model="caseInfo.isSms">
                  <Radio :label="'0'">是</Radio>
                  <Radio :label="'1'">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="发证方式：">
                <RadioGroup v-model="caseInfo.issueType">
                  <template v-for="item in issueTypeData">
                    <Radio :label="item.dictId">{{item.dictName}}</Radio>
                  </template>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem 
                label="项目名称：" 
                prop="caseName"
                :rules="[{required: true, message: '项目名称不能为空', trigger: 'blur'}]">
                <Input v-model="caseInfo.caseName" placeholder="请输入项目名称" @on-blur="checkedCaseName"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipName">项目名称首尾不能有空格</div>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="办件流转街道：">
                <Input v-model="assignDeptName" class='areaInput' placeholder="请选择办件流转街道" @on-focus="deptChooseFun"></Input>
                <dept-choose 
                  ref='streetDeptChild' 
                  @streetDeptChildFun='streetDeptChildFun'>
                </dept-choose>
              </FormItem>
            </Col>  
          </Row>           
          <Row>
            <Col span="12">
              <FormItem label="项目地址：">
                <Input v-model="caseInfo.caseAreaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('XMDZ')"></Input>
                <city-modal 
                  ref='cityChildXMDZ' 
                  @cityChildFun='cityFunXMDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="caseInfo.caseAddress" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationXMDZFun"></Input>
              </FormItem>
            </Col> 
          </Row>  
          <Row>
            <Col span="12">
              <FormItem label="资料袋条码号：">{{caseInfo.caseBarcode}}</FormItem>
            </Col>      
          </Row>                                       
        </Col>
      </Row>
    </Form>

    <!--根据申请类别值控制申请人信息和申请企业信息模块是否显示-->
    <Form ref="relatedPersonInfo" :model="relatedPersonInfo" :label-width="140">
      <Row v-if="caseInfo.applyObjectType=='0'" class="margin-bottom-20">
        <Col span="24">
          <h5 class="title"><span><Icon type="person"></Icon>申请人信息</span></h5>
          <Row>
            <Col span="8">
              <FormItem 
                label="证件类型：" 
                prop="cardType"
                :rules="[{required: true, message: '请选择证件类型', trigger: 'change'}]">
                <Select v-model="relatedPersonInfo.cardType" placeholder="请选择证件类型" @on-change="v=>{setCardOption(v)}">
                  <template v-for="item in cardTypeData">
                    <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col span="15">
              <FormItem 
                label="证件号码：" 
                prop="cardNumber"
                :rules="[{required: true, message: '证件号码不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.cardNumber" placeholder="请输入证件号码" @on-blur="checkedIdCard"></Input>
                <i class="ivu-icon ivu-icon-card" @click="Idcard" v-show="idCardIcon" style="position:absolute; top:2px; right:0;"></i>
                <div class="ivu-form-item-error-tip" v-show="tipNumber" v-text="tipMsg"></div>
              </FormItem>
            </Col>
            <Col span="1">
              <span style="display:inline-block; margin:6px; height:33px;" >
                <Icon type="alert-circled" color="#ed3f14" size="20" title="该证件号曾出现虚假材料记录，请认真审核材料" v-if="relatedPersonInfo.falseMaterialNum != 0"/>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span="8">
              <FormItem 
                label="申请人姓名：" 
                prop="relatedPersonName"
                :rules="[{required: true, message: '申请人姓名不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.relatedPersonName" placeholder="请输入姓名" icon="camera" title="申请人拍照" v-on:on-click="userPhoto"></Input>
              </FormItem>
            </Col>                   
            <Col span="8">
              <FormItem 
                label="性别："
                prop="sex"
                :rules="[{required: true, message: '请选择性别', trigger: 'change'}]">
                <RadioGroup v-model="relatedPersonInfo.sex">
                  <template v-for="item in sexData">
                    <Radio :label="item.id">{{item.name}}</Radio>
                  </template>
                </RadioGroup>             
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem 
                label="手机号码：" 
                prop="mobile"
                :rules="[{required: true, message: '手机号码不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.mobile" placeholder="请输入手机号码" @on-blur="checkedMobile"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipMobile">手机号码格式不正确</div>     
              </FormItem>
            </Col> 
          </Row> 
          <Row>                                   
            <Col span="8">
              <FormItem label="座机电话：">
                <Input v-model="relatedPersonInfo.officeTel" placeholder="请输入座机电话" @on-blur="checkedTel"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipTel">座机电话格式不正确</div>                
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="邮政编码：">
                <Input v-model="relatedPersonInfo.zipcode" placeholder="请输入邮政编码" @on-blur="checkedZipcode"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipZipcode">邮政编码格式不正确</div>
              </FormItem>
            </Col>                  
            <Col span="8">
              <FormItem 
                label="电子邮箱："
                prop="email"
                :rules="{type: 'email', message: '电子邮箱格式不正确', trigger: 'blur'}">
                <Input v-model="relatedPersonInfo.email" placeholder="请输入电子邮箱"></Input>   
              </FormItem>
            </Col>                  
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="通讯地址：">
                <Input v-model="relatedPersonInfo.areaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('TXDZP')"></Input>
                <city-modal  
                  ref='cityChildTXDZP'  
                  @cityChildFun='cityFunTXDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="relatedPersonInfo.address" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationTXDZFun"></Input>
              </FormItem>
            </Col> 
          </Row>                                                          
        </Col>
      </Row>

      <Row v-else class="margin-bottom-20">
        <Col span="24">
          <h5 class="title"><span><Icon type="home"></Icon>申请企业信息</span></h5>
          <Row>
            <Col span="8">
              <FormItem 
                label="企业类型：" 
                prop="cardType"
                :rules="[{required: true, message: '请选择企业类型', trigger: 'change'}]">
                <Select v-model="relatedPersonInfo.cardType" placeholder="请选择企业类型" @on-change="v=>{setCompanyOption(v)}">
                  <template v-for="item in companyTypeData">
                    <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem 
                label="统一社会信用代码：" 
                prop="cardNumber"
                :rules="[{required: true, max: 30, message: '不能为空且长度不超过30位', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.cardNumber" @on-blur="inquiryCompanyInfo" placeholder="请输入统一社会信用代码"></Input>
              </FormItem>
            </Col>
            <Col span="1">
              <span style="display:inline-block; margin:6px; height:33px;" >
                <Icon type="alert-circled" color="#ed3f14" size="20" title="该证件号曾出现虚假材料记录，请认真审核材料" v-if="relatedPersonInfo.falseMaterialNum != 0"/>
              </span>
            </Col>
            <Col span="8">
              <FormItem 
                label="经办人姓名：" 
                prop="relatedPersonName"
                :rules="[{required: true, message: '经办人姓名不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.relatedPersonName" placeholder="请输入经办人姓名" icon="camera" title="经办人拍照" v-on:on-click="userPhoto"></Input>
              </FormItem>
            </Col>
          <!-- </Row>
          <Row> -->
            <Col span="16">
              <FormItem 
                label="企业名称：" 
                prop="ename"
                :rules="[{required: true, message: '企业名称不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.ename" placeholder="请输入企业名称"></Input>
              </FormItem>
            </Col> 
            <Col span="8">
              <FormItem 
                label="经办人电话：" 
                prop="mobile"
                :rules="[{required: true, message: '经办人电话不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.mobile" placeholder="请输入经办人电话" @on-blur="checkedMobile"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipMobile">经办人电话格式不正确</div>
              </FormItem>
            </Col>                  
          <!-- </Row> 
          <Row>  -->                                  
            <Col span="8">
              <FormItem label="营业执照号：">
                <Input v-model="relatedPersonInfo.licenseNumber" placeholder="请输入营业执照号"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem 
                label="法人代表：" 
                prop="keyman"
                :rules="[{required: true, message: '法人代表不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.keyman" placeholder="请输入法人代表"></Input>
              </FormItem>
            </Col>                  
            <Col span="8">
              <FormItem 
                label="法人身份证号：" 
                prop="keymanIdcard"
                :rules="[{required: true, message: '法人身份证号不能为空', trigger: 'blur'}]">
                <Input v-model="relatedPersonInfo.keymanIdcard" placeholder="请输入法人身份证号" @on-blur="checkedKeymanIdcard"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipKeymanNumber">法人身份证号格式不正确</div>
              </FormItem>
            </Col>                  
          <!-- </Row>
          <Row> -->                                   
            <Col span="8">
              <FormItem label="邮政编码：">
                <Input v-model="relatedPersonInfo.zipcode" placeholder="请输入邮政编码" @on-blur="checkedZipcode"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipZipcode">邮政编码格式不正确</div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="企业电话：">
                <Input v-model="relatedPersonInfo.officeTel" placeholder="请输入企业电话" @on-blur="checkedTel"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipTel">企业电话格式不正确</div>
              </FormItem>
            </Col>                                    
          <!-- </Row>              
          <Row> -->
            <Col span="12">
              <FormItem label="通讯地址：">
                <Input v-model="relatedPersonInfo.areaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('TXDZC')"></Input>
                <city-modal  
                  ref='cityChildTXDZC'  
                  @cityChildFun='cityFunTXDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="relatedPersonInfo.address" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationTXDZFun"></Input>
              </FormItem>
            </Col> 
          </Row>                                                           
        </Col>
      </Row>
    </Form>

    <!--接收父组件传递的数据由isRelatedperson字段控制关联人模块是否显示-->
    <Row v-if="isShowData.isRelatedperson === '0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title" style="overflow:hidden;">
          <span><Icon type="person-stalker"></Icon>关联人</span>
          <strong class="red">（注：若该事项没有代办人，此步骤可跳过！）</strong>
          <Button type="success" icon="plus-round" @click="handleResetRelatedData" class="fr">添加</Button>
        </h5>
        <template>
          <table-related ref='loadRelatedTableList'></table-related>          
        </template>
      </Col>
    </Row> 

    <Modal
      v-model="relatedModal"
      title="添加关联人信息"
      width="800"
      class-name="ivu-modal-style no-modal-footer"
      :mask-closable="false">
      <!--父组件绑定自定义事件-->
      <related-modal
        ref='relatedChild' 
        :projectApplyType="caseInfo.applyObjectType"
        @relatedSubmit='handleSubmitRelatedData' 
        @relatedCancel='handleCloseRelatedModal'
        @addressLocationRelatedFun='addressLocationRelatedFunP'>
      </related-modal>  
    </Modal>   

    <Modal
      v-model="mapModal"
      title="百度地图"
      width="1200"
      class-name="ivu-modal-style"
      :mask-closable="false">
      <map-modal ref='mapChild'></map-modal>
      <div slot="footer"></div>
    </Modal> 
  </div>       
</template>

<script>
var RegExp = require('../../../../assets/js/validator.js');
require('../../../../assets/js/jquery.min.js');


import relatedRow from './table-related.vue';
import relatedModal from './related/index.vue';   
import cityModal from '../../../common/cityChoose.vue';      //城市联动选择
import mapModal from '../../../common/view/mapSearch.vue';   //地图
import deptChoose from '../../../common/streetDeptChoose.vue';      //街道业务部门选择
export default {
  props: {
    caseInfoP: {
      type: Object
    },
    relatedPersonInfoP: {
      type: Object
    },
    isShowData: {
      type: Object
    },
  }, 
  components: {
    'table-related': relatedRow,
    'related-modal': relatedModal,    
    'city-modal': cityModal,
    'map-modal': mapModal,
    'dept-choose':deptChoose,
  },
  data () {
    return {
     
      issueTypeData: [],       //发证方式
      //性别（这里需要注意！）
      sexData: [
        {
          id: '01',
          name: '男'
        },
        {
          id: '02',
          name: '女'
        },        
      ],             
      cardTypeData: [],        //证件类型
      cardTypeDictId: '',      //证件类型当前选中的dictId值      
      companyTypeData: [],     //企业类型
      companyTypeDictId: '',   //企业类型当前选中的dictId值
      //项目信息块
      caseInfo: {
        applyObjectType: '0',  //申请类别
        isSms: '1',            //短信通知
        issueType: '01',       //发证方式
        caseName: '',          //项目名称
        assignDeptId: '',      //办件流转街道Id
        caseAreaCode: '',      //项目所在地区code
        caseAreaCodeName: '',  //项目所在地区
        caseAddress: '',       //项目所在地区详细地址
      },

      //个人信息或企业信息块
      relatedPersonInfo: {
        cardType: '',          //证件类型、企业类型
        cardNumber: '',        //证件号码、统一社会信用代码
        relatedPersonName: '', //申请人姓名、经办人姓名
        sex: '',               //性别
        mobile: '',            //手机号码、经办人电话
        officeTel: '',         //座机电话、企业电话
        zipcode: '',           //邮政编码
        email: '',             //电子邮箱
        areaCode: '',          //通讯所在地区code
        areaCodeName: '',      //通讯所在地区
        address: '',           //通讯详细地址
        ename: '',             //企业名称
        licenseNumber: '',     //营业执照
        keyman: '',            //法人代表
        keymanIdcard: '',      //法人身份证号
        falseMaterialNum: 0,   //虚假材料数
      },
     
      relatedModal: false,     //关联人 modal框
      nextAudit: false,        //下一环节审核人 是否显示
      mapModal: false,         //百度地图
      //正则表达式
      tipName: false,          //项目名称错误提示消息      
      tipNumber: false,        //证件号码错误提示信息
      tipMsg: '',              //证件号码提示内容
      tipKeymanNumber: false,  //法人身份证号错误提示信息
      tipMobile: false,        //手机号码错误提示信息
      tipTel: false,           //座机电话错误提示信息
      tipZipcode: false,       //邮政编码错误提示信息
      idCardIcon: false,       //控制证件号码读卡图标是否显示
			assignDeptName:'',			 //街道业务部门名称
    }
  },
  watch:{
    //用于监听父组件传递数据并实时改变子组件对应参数
    caseInfoP:function (val){
      //this.caseInfo = val;
      this.caseInfo = Object.assign({}, this.caseInfo, val);
    },
    relatedPersonInfoP:function (val){
      //this.relatedPersonInfo = val;
      this.relatedPersonInfo = Object.assign({}, this.relatedPersonInfo,val);
      this.caseInfo.isSms = this.relatedPersonInfo.isSms;
    }
    // isShowDataP:function (val){
    //   this.isShowData = val;
    // }
  },
  created(){
    //获取数据字典下拉框数据
    axios.post("/cgaCaseRegist/getRegistAllDictInfo.do")
    .then(data=>{
      this.issueTypeData = data.obj.issueTypeDict;
      this.cardTypeData = data.obj.cardTypeDict;
      this.companyTypeData = data.obj.companyTypeDict;
    });
    //进入后获取 项目信息/申请人信息 部分
    //this.caseDetailSearch();
  },
  mounted(){
    //**********************start 高拍仪获取身份证信息、上传照片*************************//
    let _this = this;
    $("#CarmeraUpload").on("click",function(){
      if(localStorage.getItem('carmeraType') == 'carmeraFun'){
        let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
        if(aname == ''){
          alert('请输入文件名！');
          return false;
        }
        //关闭高拍仪
        document.getElementById('carmerayw_cover').classList.remove('carmerayw_cover');
        document.getElementById('carmerayw').classList.remove('carmerayw');
        _this.carmeraFun();
      }      
    }) 
    //*************************end 高拍仪获取身份证信息、上传照片*************************//
  },
  methods: {
    //*************************start 高拍仪获取身份证信息、上传照片***********************//
    //读取身份证信息
    Idcard(){
      Idcard0();
      this.relatedPersonInfo.cardNumber = document.getElementById('Text6').value;
      this.relatedPersonInfo.relatedPersonName = document.getElementById('Text1').value;
      this.relatedPersonInfo.sex = document.getElementById('Text2').value=='男'?'01':'02';
      this.inquiryPersonInfo();
    },
    //选择证件类型
    setCardOption(value){
      this.cardTypeDictId = value;
      //01表示身份证类型，需要显示读卡icon
      if(this.cardTypeDictId == '01'){
        this.idCardIcon = true;
      }else{
        this.idCardIcon = false;
        return false
      }
    },    
    //根据身份证号查询申请人信息
    inquiryPersonInfo(){
      //证件类型是身份证并且证件号码不为空时
      if(this.cardTypeDictId == '01' && this.relatedPersonInfo.cardNumber !== ''){
        axios.post("/cgaCaseRegist/queryCitizenByCardNumber.do", {cardNumber:this.relatedPersonInfo.cardNumber})
        .then(data=>{
          if(data.status == '200' && data.success == true){
            //申请类别
            this.caseInfo.applyObjectType = data.obj.applyObjectType || '';
            //短信通知
            this.caseInfo.isSms = data.obj.isSms || ''; 
            //证件类型
            this.relatedPersonInfo.cardType = data.obj.cardType || '';
            //申请人姓名
            this.relatedPersonInfo.relatedPersonName = data.obj.relatedPersonName || '';
            //性别
            this.relatedPersonInfo.sex = data.obj.sex || '';          
            //手机号码
            this.relatedPersonInfo.mobile = data.obj.mobile || ''; 
            //座机电话
            this.relatedPersonInfo.officeTel = data.obj.officeTel || '';
            //邮政编码
            this.relatedPersonInfo.zipcode = data.obj.zipcode || '';
            //电子邮箱
            this.relatedPersonInfo.email = data.obj.email || '';
            //通讯地址code
            this.relatedPersonInfo.areaCode = data.obj.areaCode || '';
            //通讯地址
            this.relatedPersonInfo.areaCodeName = data.obj.areaCodeName || '';
            //通讯详细地址
            this.relatedPersonInfo.address = data.obj.address || '';
            //虚假材料数
            this.relatedPersonInfo.falseMaterialNum = data.obj.falseMaterialNum || 0;

            var $error = $('.ivu-form-item-error');
            if(this.relatedPersonInfo.relatedPersonName !== '' || this.relatedPersonInfo.sex !== '' || this.relatedPersonInfo.mobile !== ''){
              $error.find('.ivu-form-item-error-tip').hide();
              $error.find('.ivu-input').css('border','1px solid #dddee1');
              $error.find('.ivu-icon').css('color','#80848f');
            }            
          }else{
            this.$Message.error(data.msg);
          }
        });
      }
    },
    //证件号码
    checkedIdCard(){
      //不为空时进行正则验证
      if(this.relatedPersonInfo.cardNumber !== ''){
        if(this.cardTypeDictId !== ''){
          //格式不正确时，显示错误提示信息
          switch(this.cardTypeDictId){
            //身份证、驾驶证
            case '01':
              if(!RegExp.rules.idCard.test(this.relatedPersonInfo.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '身份证号码格式不正确';
                return false
              }else{
                this.tipNumber = false;
                this.inquiryPersonInfo();
              } 
              break;
            //军官证
            case '02':
              if(!RegExp.rules.officer.test(this.relatedPersonInfo.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '军官证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //驾驶证
            case '03':
              if(!RegExp.rules.idCard.test(this.relatedPersonInfo.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '驾驶证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break; 
            //护照
            case '04':
              if(!RegExp.rules.passport1.test(this.relatedPersonInfo.cardNumber) || !RegExp.rules.passport2.test(this.relatedPersonInfo.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '护照格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //港澳台证
            case '05':
              if(!RegExp.rules.hmtPass.test(this.relatedPersonInfo.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '港澳台证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            default:
              this.tipNumber = false;                                   
          }          
        }else{
          this.$Message.info('请先选择证件类型！');
        }
      }else{
        this.tipNumber = false;  
      }       
    },
    //项目名称
    checkedCaseName(){
      //不为空时进行正则验证
      if(this.caseInfo.caseName !== ''){
        //格式不正确时，显示错误提示信息
        if(/^\s+|\s+$/g.test(this.caseInfo.caseName)){
          this.tipName = true;
          return false
        }else{
          this.tipName = false; 
        }
      }else{
        this.tipName = false;
      }
    },    
    //手机号码
    checkedMobile(){
      //不为空时进行正则验证
      if(this.relatedPersonInfo.mobile !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.mobile.test(this.relatedPersonInfo.mobile)){
          this.tipMobile = true;
          return false
        }else{
          this.tipMobile = false; 
        }
      }else{
        this.tipMobile = false;
      }
    },
    //座机电话
    checkedTel(){
      //不为空时进行正则验证
      if(this.relatedPersonInfo.officeTel !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.tel.test(this.relatedPersonInfo.officeTel)){
          this.tipTel = true;
          return false
        }else{
          this.tipTel = false; 
        }
      }else{
        this.tipTel = false; 
      }
    },
    //邮政编码
    checkedZipcode(){
      //不为空时进行正则验证
      if(this.relatedPersonInfo.zipcode !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.postcode.test(this.relatedPersonInfo.zipcode)){
          this.tipZipcode = true;
          return false
        }else{
          this.tipZipcode = false; 
        }
      }else{
        this.tipZipcode = false; 
      }
    },
    //选择企业类型  
    setCompanyOption(value){
      this.companyTypeDictId = value;
    },          
    //根据统一社会信用代码查询企业信息
    inquiryCompanyInfo(){
      if(this.companyTypeDictId == '01' && this.relatedPersonInfo.cardNumber !== ''){
        axios.post("/cgaCaseRegist/queryCorpByCardNumber.do", {cardNumber:this.relatedPersonInfo.cardNumber})
        .then(data=>{
          if(data.status == '200' && data.success == true){
            //申请类别
            this.caseInfo.applyObjectType = data.obj.applyObjectType || '';
            //短信通知
            this.caseInfo.isSms = data.obj.isSms || '';          
            //企业类型
            this.relatedPersonInfo.cardType = data.obj.cardType || '';
            //统一社会信用代码
            this.relatedPersonInfo.cardNumber = data.obj.cardNumber || ''; 
            //经办人姓名
            this.relatedPersonInfo.relatedPersonName = data.obj.relatedPersonName || ''; 
            //企业名称
            this.relatedPersonInfo.ename = data.obj.ename || '';
            //经办人电话
            this.relatedPersonInfo.mobile = data.obj.mobile || '';
            //营业执照号
            this.relatedPersonInfo.licenseNumber = data.obj.licenseNumber || '';
            //法人代表
            this.relatedPersonInfo.keyman = data.obj.keyman || '';
            //法人身份证号
            this.relatedPersonInfo.keymanIdcard = data.obj.keymanIdcard || '';  
            //邮政编码
            this.relatedPersonInfo.zipcode = data.obj.zipcode || '';
            //企业电话
            this.relatedPersonInfo.officeTel = data.obj.officeTel || ''; 
            //通讯地址code
            this.relatedPersonInfo.areaCode = data.obj.areaCode || '';
            //通讯地址
            this.relatedPersonInfo.areaCodeName = data.obj.areaCodeName || '';
            //通讯详细地址
            this.relatedPersonInfo.address = data.obj.address || ''; 
            //虚假材料数
            this.relatedPersonInfo.falseMaterialNum = data.obj.falseMaterialNum || 0; 

            var $error = $('.ivu-form-item-error');
            if(this.relatedPersonInfo.relatedPersonName !== '' || this.relatedPersonInfo.ename !== '' || this.relatedPersonInfo.mobile !== '' || this.relatedPersonInfo.keyman !== '' || this.relatedPersonInfo.keymanIdcard !== ''){
              $error.find('.ivu-form-item-error-tip').hide();
              $error.find('.ivu-input').css('border','1px solid #dddee1');
              $error.find('.ivu-icon').css('color','#80848f');
            }             
          }else{
            this.$Message.error(data.msg);
          }
        });
      } 
    }, 
    //法人身份证号
    checkedKeymanIdcard(){
      //不为空时进行正则验证
      if(this.relatedPersonInfo.keymanIdcard !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.idCard.test(this.relatedPersonInfo.keymanIdcard)){
          this.tipKeymanNumber = true;
          return false
        }else{
          this.tipKeymanNumber = false;
        } 
      }else{
        this.tipKeymanNumber = false;
      }        
    },

    //拍照
    userPhoto(){
      localStorage.setItem("carmeraType","carmeraFun");
      opendeviceCarmera(2);  //摄像头  1身份证    2 头像
      //显示高拍仪
      document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
      document.getElementById('carmerayw').classList.add('carmerayw');
      //清空之前的值  （仅需清理文件名）
      document.getElementById('CarmeraPhotoName').value = '';
      // document.getElementById('Base64Text').value;  //照片编码
    },
    carmeraFun(){
      let abase64 = document.getElementById('Base64Text').value;   //图片编码
      let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
      let _this = this;
      //Base64文件上传(HDFS)
      axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
      .then(data=>{
        //添加办件图像记录信息
        if(!data.success){
          //返回错误状态  
          this.$Message.error('头像上传失败');                  
          return false;
        }
        axios.post("/cgaCaseRegist/addCaseStaff.do", {caseId:this.$route.query.caseId, applyFileId:data.obj.id})
        .then(data0=>{
          if(!data0.success){
            //返回错误状态  
            this.$Message.error('头像上传失败');                  
            return false;
          }
          this.$Message.success('头像上传成功');
        }); 
      }); 
    },
    //*************************end 高拍仪获取身份证信息、上传照片**********************//
		//街道或业务部门选择
    deptChooseFun(){
    	this.$refs.streetDeptChild.loadDeptList();
   	},
   	streetDeptChildFun(assignDeptId,assignDeptName){
   		this.caseInfo.assignDeptId = assignDeptId;
   		this.assignDeptName = assignDeptName;
   	},
    //*************************start 地址联动选择**************************************//
    cityChooseFun(addressName){
      if(addressName == 'XMDZ'){
          this.$refs.cityChildXMDZ.loadAreaList(addressName);
      }else if(addressName == 'TXDZP'){
          this.$refs.cityChildTXDZP.loadAreaList(addressName);
      }else{
        this.$refs.cityChildTXDZC.loadAreaList(addressName);
      } 
    },
    cityFunXMDZ(code,name){
      this.caseInfo.caseAreaCode = code;
      this.caseInfo.caseAreaCodeName = name;
    },
    cityFunTXDZ(code,name){
      this.relatedPersonInfo.areaCode = code;
      this.relatedPersonInfo.areaCodeName = name;
    },
    //*************************end 地址联动选择**************************************//

    //*************************start 百度地图**************************************//
    //项目地址
    addressLocationXMDZFun(){
      if(this.caseInfo.caseAreaCodeName=='' && this.caseInfo.caseAddress == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.caseInfo.caseAreaCodeName,this.caseInfo.caseAddress);
    },
    //通讯地址
    addressLocationTXDZFun(){
      if(this.relatedPersonInfo.areaCodeName=='' && this.relatedPersonInfo.address == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.relatedPersonInfo.areaCodeName,this.relatedPersonInfo.address);
    },
    addressLocationRelatedFunP(areaCodeName,address){
      if(areaCodeName=='' && address == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(areaCodeName,address);
    },
    //*************************end 百度地图**************************************//

    //查询我的办件（或机关办件）的办件详情信息  
    caseDetailSearch(){
      // axios.post("/cgaCase/queryMyCaseInfoByCaseId.do", {caseId: this.$route.query.caseId})
      // .then(data=>{
      //   this.caseInfo = Object.assign({}, this.caseInfo, data.obj.caseInfo);
      //   this.relatedPersonInfo = Object.assign({}, this.relatedPersonInfo, data.obj.relatedPersonInfo);
      // }); 
    }, 

    //切换个人信息和企业信息时对relatedPersonInfo这个表单进行重置
    handleReset(){
      this.$refs.relatedPersonInfo.resetFields();
      this.relatedPersonInfo.officeTel = '';
      this.relatedPersonInfo.zipcode = '';
      this.relatedPersonInfo.areaCodeName = '';
      this.relatedPersonInfo.address = '';
      this.relatedPersonInfo.falseMaterialNum = 0;      
      //清空正则错误提示信息
      this.tipMobile = false;
      this.tipZipcode = false;
      this.tipTel = false;      
    }, 

    //预览
    previews(id,type){
      this.$emit('previewsFun',id,type);
    },    
    
    /********************start 关联人模块 *******sssss*************/    
    //点击添加关联人信息弹窗，先清空之前填写的数据
    handleResetRelatedData(){
      this.relatedModal = true;
      this.$refs.relatedChild.handleReset();      
    },
    //提交关联人信息，成功后需要关闭弹窗，重新渲染关联人列表数据
    handleSubmitRelatedData(){
      this.relatedModal = false;
      this.$refs.loadRelatedTableList.getList();  
    },
    //父组件绑定自定义事件:关闭添加关联人信息的弹窗
    handleCloseRelatedModal(){
      this.relatedModal  = false;
    },
    /********************star 关联人模块t ********************/    

    //----------------以上为数据获取，以下为数据提交----------------------------//

    //验证表单必填项
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
                    ...this.caseInfo,
                    ...this.relatedPersonInfo,
                    caseId: this.$route.query.caseId,
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
    
    handleComplete(){
      this.submitForm().then(res => {
        if(res !== 0) {
          this.$Message.success('登记完成！'); 
        }else{
          
        }       
      })      
    }, 
    //点暂予登记或需补正按钮，保存成功的数据会流转到暂予登记处理或补正件处理模块的列表页（数据由接口提供），页面需要跳转到窗口登记模块的列表页 
    handleTemporarily(){
      this.submitForm().then(res => {
        if(res !== 0) {
          axios.post("/cgaCaseRegist/doTempOrSupplementRegist.do", {caseId:this.$route.query.caseId, caseState:'14'})
          .then(data=>{
            this.$emit('loadingHide');
            this.$Message.success('暂予登记成功！');
            this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
          }).catch(error=>{
            this.$emit('loadingHide');
          }); 
        }else{
          this.$emit('loadingHide');
        }
      })      
    },
     
  }
}
</script>

<style lang="scss">
.all-btns>.ivu-form>.ivu-form-item>.ivu-form-item-content{
  text-align: center;
  margin-left: 0!important;
}
/*****modal*****/
.no-modal-footer{
  .ivu-modal-body{
    padding: 0;
    .ivu-modal-btn{
      border-top: 1px solid #e9eaec;
      padding: 12px 18px;
      text-align: right;
      .ivu-form-item{
        margin-bottom: 0;
        padding-right: 0;
      }
    } 
  } 
  .ivu-modal-footer{
    display: none;
  }
}
</style>

  