<template>
  <div class="layout-content">
    <Row>
      <Col span="24">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">          
          <Row>
            <Col span="12">
              <FormItem label="办件流水号："><span style='font-weight:bold'>{{formValidate.caseId}}</span></FormItem>
            </Col>
          </Row>
          <Row>
           <Col span="12">
            <FormItem label="流转类型："><span style='font-weight:bold'>{{this.formValidate.dealTypeName}}</span></FormItem>
           </Col>
          </Row>
          <Row>
           <Col span="12">
            <FormItem label="审批事项：">
              <span style='font-weight:bold'>{{formValidate.projectName}}</span>
            </FormItem>
           </Col>
          </Row>
          <Row>
           <Col span="12">
            <FormItem label="所处环节：">
              <span style='font-weight:bold'>{{formValidate.tacheName}}</span>
            </FormItem>
           </Col>
          </Row>
          <Row>
              <Col span="12">
                <FormItem label="领证人姓名：" prop="personName">
                   <Input placeholder="请输入领证人姓名" v-model="formValidate.personName" type="textarea":rows="1" @on-blur="checkedName"></Input>
                </FormItem>
              </Col>
          </Row>
		      <Row>
	            <Col span="12">
	              <FormItem label="领证人手机号：" prop="personMobile" :rules="[{required: true, message: '手机号码不能为空', trigger: 'blur'}]">
	                 <Input placeholder="请输入领证人手机号" v-model="formValidate.personMobile" type="textarea":rows="1" @on-blur="checkedMobile"></Input>
                   <div class="ivu-form-item-error-tip" v-show="tipMobile">手机号码格式不正确</div>
	              </FormItem>
	            </Col>
          </Row>
	        <Row class="center">
  		      <Col span="12">
              <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
              <Button @click="goBack">返回</Button>
  		      </Col>
	       </Row>
        </Form>                                        
      </Col>
    </Row>

    <!--loading框 Modal Templates-->
    <div class="dhx_modal_cover" v-if='loadingModal'></div>
    <div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
    <!--End loading框 Modal Templates-->
  </div>
</template>

<script>
var RegExp = require('../../../assets/js/validator.js');
export default {
  data () {
    return {
      loadingModal:false, //loading框
      formValidate: {
        caseId: '',
        dealType: '',
        dealTypeName: '',
        personName: '',
        personMobile: ''
      },
      ruleValidate: {
        personName: [
          { required: true, message: '领证人姓名', trigger: 'blur' }
        ]
      },
      tipMobile: false,       //手机号码错误提示信息
      tipName: false       //姓名错误提示信息
    }
  },
  created(){
    this.formValidate.dealType = this.$route.query.dealType;
    if(this.formValidate.dealType=="01"){
      this.formValidate.dealTypeName = "收证";
    }else if(this.formValidate.dealType=="02"){
      this.formValidate.dealTypeName = "发证";
    }
    this.formValidate.projectName = this.$route.query.projectName;
    this.formValidate.caseId = this.$route.query.caseId;
    this.formValidate.tacheName = "证照发放";
  },

  methods: {
    //js数组高效去重方法
    uniqueArr(arr) {
      var result = [], hash = {};
      for (var i = 0, elem; (elem = arr[i]) != null; i++) {
          if (!hash[elem]) {
              result.push(elem);
              hash[elem] = true;
          }
      }
      return result;
    },
    handleSubmit(name) {
      this.checkedName();

      this.$refs[name].validate((valid) => {
        if (valid && this.tipMobile == false && this.tipName == false) {
          this.loadingModal = true;
          axios.post("/cgaCaseLicenceSend/saveCaseLicenceSend.do", {
            caseId:this.formValidate.caseId,
            tacheName:this.formValidate.tacheName,
            personName:this.formValidate.personName,
            personMobile:this.formValidate.personMobile
          })
          .then(data=>{
            if(data.status == '200' && data.success == true){
              //this.$Message.success('保存成功!');
              //this.goBack();
              this.$router.push({path: './print', query:{
                moduleId: this.$route.query.moduleId,
                w06ID:data.obj.w06ID
                }}); 
            }

            this.loadingModal = false;
          }).catch(err=>{
            this.loadingModal = false;
          }); 
        } else {
          this.$Message.error('保存失败!');
        }
      })
    },
    deleteArr(item){
      for(var i=0;i<this.caseBarcodeBatch.length;i++){
        if(item==this.caseBarcodeBatch[i]){
          this.caseBarcodeBatch.splice(i,1);
        }
      }
    },
    checkedName(){
      if(this.formValidate.personName !== ''){
        if(!RegExp.rules.chinese1.test(this.formValidate.personName)){
          this.tipName = true;
          this.$Message.error({
                content: "姓名请输入中文！",
                duration: 2
            });
        }else{
          this.tipName = false;
        }
      }else{
        this.tipName = true;
      }
    },
    //手机号码
    checkedMobile(){
      //不为空时进行正则验证
      if(this.formValidate.personMobile !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.mobile.test(this.formValidate.personMobile)){
          this.tipMobile = true;
          return false
        }else{
          this.tipMobile = false; 
        }
      }else{
        this.tipMobile = false;
      }
    },
    goBack(){
      this.$router.push({path:'index2', query:{moduleId: this.$route.query.moduleId}});
    }
  }
}
</script>



