<template>
  <Form ref="relatedData" :model="relatedData" :label-width="110">
    <div style="padding:20px 20px 0;">
      <Row>
        <Col span="12">
          <FormItem 
            label="关联人类型：" 
            prop="relatedPersonType"
            :rules="{required: true, message: '请选择关联人类型', trigger: 'change'}">
            <Select v-model="relatedData.relatedPersonType" placeholder="请选择关联人类型">
              <template v-for="item in relatedPersonData">
                <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
              </template>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem 
            label="姓名：" 
            prop="relatedPersonName"
            :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
            <Input v-model="relatedData.relatedPersonName" placeholder="请输入姓名"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem 
            label="手机号码：" 
            prop="mobile"
            :rules="{required: true, message: '电话号码不能为空', trigger: 'blur'}">
            <Input v-model="relatedData.mobile" placeholder="请输入手机号码" @on-blur="checkedMobile"></Input>
            <div class="ivu-form-item-error-tip" v-show="tipMobile">手机号码格式不正确</div>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem 
            label="性别：" 
            prop="sex"
            :rules="{required: true, message: '请选择性别', trigger: 'change'}">
            <RadioGroup v-model="relatedData.sex">
              <Radio label="01">男</Radio>
              <Radio label="02">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem 
            label="证件类型：" 
            prop="cardType"
            :rules="{required: true, message: '请选择证件类型', trigger: 'change'}">
            <Select v-model="relatedData.cardType" placeholder="请选择证件类型" @on-change="v=>{setCardOption(v)}">
              <template v-for="item in cardTypeData">
                <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
              </template>
            </Select>
          </FormItem>              
        </Col>
        <Col span="12">
          <FormItem 
            label="证件号码：" 
            prop="cardNumber"
            :rules="{required: true, message: '证件号码不能为空', trigger: 'blur'}">
            <Input v-model="relatedData.cardNumber" placeholder="请输入证件号码" @on-blur="checkedIdCard"></Input>
            <div class="ivu-form-item-error-tip" v-show="tipNumber" v-text="tipMsg"></div>
          </FormItem>
        </Col>
      </Row> 
      <Row>
        <Col span="12">
          <FormItem label="座机电话：">
            <Input v-model="relatedData.officeTel" placeholder="请输入座机电话" @on-blur="checkedTel"></Input>
            <div class="ivu-form-item-error-tip" v-show="tipTel">座机电话格式不正确</div>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="邮政编码：">
            <Input v-model="relatedData.zipcode" placeholder="请输入邮政编码" @on-blur="checkedZipcode"></Input>
            <div class="ivu-form-item-error-tip" v-show="tipZipcode">邮政编码格式不正确</div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem 
            label="电子邮箱："
            prop="email"
            :rules="{type: 'email', message: '电子邮箱格式不正确', trigger: 'blur'}">
            <Input v-model="relatedData.email" placeholder="请输入电子邮箱"></Input>
          </FormItem>
        </Col>
      </Row> 
      <Row>
        <Col span="12">
          <FormItem label="通讯地址：" class="areaInput">
            <Input v-model="relatedData.areaCodeName" placeholder="请选择所在地区" @on-focus="cityChooseFun()"></Input>
            <city-modal 
              ref='cityChildTXDZPRalted' 
              @cityChildFun='cityFunTXDZ'>
            </city-modal>
          </FormItem>
        </Col> 
        <Col span="1" class="line"><span>-</span></Col>
        <Col span="11">
          <FormItem class="no-margin-left">
            <Input v-model="relatedData.address" placeholder="请输入详细地址" icon="location" title="地址定位" v-on:on-click="addressLocationTXDZFun"></Input>
          </FormItem>
        </Col> 
      </Row>
    </div>
    <Row>
      <Col span="24" class="ivu-modal-btn">
        <FormItem>
          <Button type="text" @click="handleClose">取消</Button>
          <Button type="primary" @click="handleSubmit">确定</Button>
        </FormItem>
      </Col>
    </Row>  
  </Form> 
</template>

<script>
var RegExp = require('../../../../../assets/js/validator.js');

import cityModal from '../../../../common/cityChoose.vue';    //城市联动选择
export default {
  props:['projectApplyType'],
  components: {
    'city-modal': cityModal,
  },
  data () {
    return {
      relatedPersonData: [],   //关联人类型      
      cardTypeData: [],        //证件类型
      cardTypeDictId: '',      //证件类型当前选中的dictId值            
      relatedData: {
        relatedPersonType: '', 
        relatedPersonName: '',
        mobile: '',
        sex: '',
        cardType: '',
        cardNumber: '',
        officeTel: '',
        zipcode: '',
        email: '',
        areaCode: '',
        areaCodeName: '',
        address: ''
      },
      //正则表达式
      tipMobile: false,        //手机号码错误提示信息
      tipNumber: false,        //证件号码错误提示信息
      tipMsg: '',              //证件号码提示内容      
      tipTel: false,           //座机电话错误提示信息
      tipZipcode: false,       //邮政编码错误提示信息      
    }
  },
  created(){
    //获取数据字典下拉框数据
    axios.post("/cgaCaseRegist/getRegistAllDictInfo.do")
    .then(data=>{
      this.relatedPersonData = data.obj.relatedPersonTypeDict;
      this.cardTypeData = data.obj.cardTypeDict;
    });    
  },
  methods: {
    //*************************start 地址联动选择**************************************//
    cityChooseFun(){
      this.$refs.cityChildTXDZPRalted.loadAreaList();
    },
    cityFunTXDZ(code,name){
      this.relatedData.areaCode = code;
      this.relatedData.areaCodeName = name;
    },
    //*************************end 地址联动选择**************************************//
    //通讯地址
    addressLocationTXDZFun(){
      if(this.relatedData.areaCodeName=='' && this.relatedData.address == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.$emit('addressLocationRelatedFun',this.relatedData.areaCodeName,this.relatedData.address);
    },
    //手机号码
    checkedMobile(){
      //不为空时进行正则验证
      if(this.relatedData.mobile !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.mobile.test(this.relatedData.mobile)){
          this.tipMobile = true;
          return false
        }else{
          this.tipMobile = false; 
        }
      }else{
        this.tipMobile = false;
      }
    },
    //选择证件类型
    setCardOption(value){
      this.cardTypeDictId = value;
    },
    //证件号码
    checkedIdCard(){
      //不为空时进行正则验证
      if(this.relatedData.cardNumber !== ''){
        if(this.cardTypeDictId !== ''){
          //格式不正确时，显示错误提示信息
          switch(this.cardTypeDictId){
            //身份证、驾驶证
            case '01':
              if(!RegExp.rules.idCard.test(this.relatedData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '身份证号码格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //军官证
            case '02':
              if(!RegExp.rules.officer.test(this.relatedData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '军官证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //驾驶证
            case '03':
              if(!RegExp.rules.idCard.test(this.relatedData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '驾驶证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break; 
            //护照
            case '04':
              if(!RegExp.rules.passport1.test(this.relatedData.cardNumber) || !RegExp.rules.passport2.test(this.relatedData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '护照格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //港澳台证
            case '05':
              if(!RegExp.rules.hmtPass.test(this.relatedData.cardNumber)){
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
    //座机电话
    checkedTel(){
      //不为空时进行正则验证
      if(this.relatedData.officeTel !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.tel.test(this.relatedData.officeTel)){
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
      if(this.relatedData.zipcode !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.postcode.test(this.relatedData.zipcode)){
          this.tipZipcode = true;
          return false
        }else{
          this.tipZipcode = false; 
        }
      }else{
        this.tipZipcode = false; 
      }
    },

    //点击添加关联人信息出现弹窗时，先重置表单
    handleReset(){
      this.$refs.relatedData.resetFields();
      //下面是表单非必填项的置空
      this.relatedData.officeTel = '';
      this.relatedData.zipcode = '';
      this.relatedData.email = '';
      this.relatedData.areaCode = '';
      this.relatedData.areaCodeName = '';
      this.relatedData.address = '';      
    },    
    //新增办件关联人信息（新增时不传Id值）
    handleSubmit(){
      this.$refs.relatedData.validate((valid) => {
        if (valid) {
          axios.post("/cgaCaseRelatedPerson/saveRelatedPerson.do", {
            //添加关联人信息的表单数据
            ...this.relatedData,
            caseId:this.$route.query.caseId, 
            applyObjectType:this.projectApplyType
          })
          .then(data=>{
            if(data.status == '200' && data.success == true){
              this.$Message.success(data.msg);
              this.$emit('relatedSubmit');
            }else{
              this.$Message.error(data.msg);
            }
          })
        } else {
          this.$Message.error('提交失败！');
        }
      })
    },
    //子组件通过$emit触发父组件关闭弹窗的事件
    handleClose(){
      this.$emit('relatedCancel');
    }
  }
}
</script>

<style lang="scss">
  .no-margin-left.ivu-form-item> .ivu-form-item-content{
    margin-left: 0!important;
  }
</style>



