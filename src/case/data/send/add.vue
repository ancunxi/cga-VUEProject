<template>
  <div class="layout-content">
    <Row>
      <Col span="22" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="条码号：" prop="caseBarcode">
                <Input placeholder="条码号"  class="caseBarcode" v-model="formValidate.caseBarcode" @on-blur="loadCaseInfo"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="条码号批量更新：">
                <div class="ivu-select-selection" style="height:auto;">
                  <span class="ivu-tag-text"  style="display:inline-block; height:24px;" v-if="caseBarcodeBatch.length == 0"> </span>
                  <div class="ivu-tag ivu-tag-checked" v-for="item in caseBarcodeBatch">
                    <span class="ivu-tag-text">{{item}}</span>
                    <span @click="deleteArr(item)"><Icon type="ios-close-empty"></Icon></span>
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
		      <Row>
  				  <Col :lg="12" :xs="24">
              <FormItem label="办件流水号："><span style='font-weight:bold'>{{formValidate.caseId}}</span></FormItem>
            </Col>
          </Row>
		      <Row>
  			    <Col :lg="12" :xs="24">
              <FormItem label="流转类型："><span style='font-weight:bold'>{{this.formValidate.dealTypeName}}</span></FormItem>
            </Col>
          </Row>
		      <Row>
  			    <Col :lg="12" :xs="24">
              <FormItem label="审批事项：">
                <span style='font-weight:bold'>{{formValidate.projectName}}</span>
              </FormItem>
            </Col>
          </Row>
		      <Row>
            <Col span="24">
              <FormItem label="处理意见：" prop="description">
                <Input placeholder="请输入处理意见" v-model="formValidate.description" type="textarea":rows="4"></Input>
              </FormItem>
            </Col>
          </Row>
	        <Row>
  		      <Col span="24">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button @click="goBack" style="margin-left:8px;">返回</Button>
              </FormItem>
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
require('../../../assets/js/jquery.min.js');

export default {
  data () {
    return {
      loadingModal:false, //loading框
      caseBarcodeBatch:[],
      formValidate: {
        caseId: '',
        dealType: '',
        dealTypeName: '',
        projectName: '',
        caseBarcode: '',
        description: '',
      },
      isAdd:false, //是否新增出件
      ruleValidate: {
        caseBarcode: [
          { required: true, message: '条码号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.formValidate.dealType = this.$route.query.dealType;
    if(this.formValidate.dealType=="01"){
      this.formValidate.dealTypeName = "出件";
    }else if(this.formValidate.dealType=="02"){
      this.formValidate.dealTypeName = "签收";
    }else if(this.formValidate.dealType=="03"){
      this.formValidate.dealTypeName = "查阅";
    }

    setTimeout(()=>{
      $('.caseBarcode').find('input').focus();
    },500)
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
    loadCaseInfo(){

      if(this.formValidate.caseBarcode == ''){
        return false;
      }
      if(this.caseBarcodeBatch.indexOf(this.formValidate.caseBarcode) != -1){
        this.$Message.info('条码重复添加!');
        return false;
      }
      let char
      if(this.formValidate.caseBarcode.charAt(0) == 's' || this.formValidate.caseBarcode.charAt(0) == 'S'){
        char = this.formValidate.caseBarcode.substring(1);
      }else{
        char = this.formValidate.caseBarcode;
      }
      axios.post("/cgaMaterialbagTache/findCaseInfoByBarCode.do", {caseBarcode:char})
      .then(data=>{
        if(data.success){
          this.formValidate.caseId = data.obj.caseId;
          this.formValidate.projectName = data.obj.projectName;
          this.isAdd = true;
          this.caseBarcodeBatch.push(data.obj.caseId);
          this.caseBarcodeBatch=this.uniqueArr(this.caseBarcodeBatch);//去除重复
        }else{
          //this.$Message.error(data.msg);
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid && this.isAdd) {
          this.loadingModal = true;
          axios.post("/cgaMaterialbagTache/save.do", {
            caseId:this.formValidate.caseId,
            caseBarcode:this.formValidate.caseBarcode,
            dealType:this.formValidate.dealType,
            description:this.formValidate.description,
            caseBarcodeBatch:this.caseBarcodeBatch.join(),
          })
          .then(data=>{
            this.$Message.success('保存成功!');
            this.goBack();
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
    goBack(){
      this.$router.push({path:this.$route.query.backPage,query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
    }
  }
}
</script>



