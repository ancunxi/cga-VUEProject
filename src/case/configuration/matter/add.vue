<template>
	<div class="layout-content">
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>添加收费项信息</span></h5>
		<Row>
			<Col span="22" push="1">
				<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
					<Row>
						<Col :lg="12" :xs="24">
							<FormItem label="收费项名称：" prop="chargeName">
								<Input v-model="formValidate.chargeName" placeholder="收费项名称" v-on:on-blur='checkChargeNames'></Input>
							</FormItem>
						</Col>
						<Col :lg="12" :xs="24">
							<FormItem label="单位：" prop="unit">
								<Input v-model="formValidate.unit" placeholder="单位"></Input>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col :lg="12" :xs="24">
							<FormItem label="单价 ：" prop="unitPrice">
								<InputNumber v-model="formValidate.unitPrice" :max="10000000" :min="0" 
								placeholder="单价" v-on:on-blur='checkUnitPrice'></InputNumber>
								<div class="ivu-form-item-error-tip" v-show="tipTwoDecimal">整数或小数点后不超过六位</div>
							</FormItem>
						</Col>
						<Col :lg="12" :xs="24">
							<FormItem label="收费类别 ：" prop="chargeType">
								<Input v-model="formValidate.chargeType" placeholder="收费类别"></Input>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col :lg="12" :xs="24">
							<FormItem label="收费项编码：" prop="voucherNo">
								<Input v-model="formValidate.voucherNo" placeholder="收费项编码"></Input>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="24">
							<FormItem>
								<Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
								<Button @click="gobacks" style="margin-left:8px;">返回</Button>
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Col>
		</Row>
	</div>
</template>

<script>
var RegExp = require('../../../assets/js/validator.js');
export default {
	data() {
		return {
			inchargeNames: '',
			formValidate: {
				voucherNo: '',
				unitPrice: 0,
				unit: '',
				chargeName: '',
				projectId: ''
			},
			ruleValidate: {
				voucherNo: [{
					required: true,
					message: '凭证号不能为空且长度不能超过20位',
					max: 20,
					trigger: 'blur'
				}],
				unit: [{
					required: true,
					message: '单位不能为空同时不能大于两位',
					max: 2,
					trigger: 'blur'
				}],
				unitPrice: [{
					required: true,
					message: '单价不能为空'
				}],
				chargeName: [{
					required: true,
					max:30,
					message: '不能为空,且不超过30个字符',
					trigger: 'blur'
				}]
			},
			tipTwoDecimal:false,  //单价条件
		}
	},
	created() {
		this.projectId = this.$route.query.projectId;
	},
	methods: {
	  gobacks(){
  		this.$router.push({path: 'pay',query: {projectId:this.$route.query.projectId, currentPage:this.$route.query.inCurrentPage}})
  	},
  	checkUnitPrice(){
  		//不为空时进行正则验证
	    if(this.formValidate.unitPrice != ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.sixDecimal.test(this.formValidate.unitPrice)){
          this.tipTwoDecimal = true;
          return false
        }else{
          this.tipTwoDecimal = false; 
        }
	    }else{
        this.tipTwoDecimal = false;
	    }
  	},
		checkChargeNames() {
			this.inchargeNames = this.formValidate.chargeName;
			var exp = /^[a-zA-Z0-9_\u4e00-\u9fa5\“\”\《\》\-\/\、]+$/;
			if(this.inchargeNames != null && this.inchargeNames != '') {
				axios.post("/cgaProjectChargeItem/distrintProjectChar.do", {
					chargeName: this.formValidate.chargeName,
					projectId: this.projectId
				})
				.then(data => {
					if(data.obj > 0 && data.obj != null) {
						this.$Modal.error({
							title: '温馨提示',
							content: '事项收费名称重复，请重新输入'
						});
						return false;
					} else if(!exp.test(this.formValidate.chargeName)) {
						this.$Modal.error({
							title: '温馨提示',
							content: '该事项收费名称有无效字符，请重新输入'
						});
					}
				});
			}
		},
		//登记完成提交信息
		handleSubmit(name) {
			this.checkUnitPrice();   //验证单价是否规范
			var exp = /^[a-zA-Z0-9_\u4e00-\u9fa5\“\”\《\》\-\/\、]+$/;
      var n= this.formValidate.unitPrice;
			this.$refs[name].validate((valid) => {
				if(valid && this.tipTwoDecimal==false) {
					axios.post("/cgaProjectChargeItem/distrintProjectChar.do", {
						chargeName: this.formValidate.chargeName,
						projectId: this.projectId
					})
					.then(data => {
						if(!RegExp.rules.sixDecimal.test(this.formValidate.unitPrice)){
		  			  this.$Modal.error({
								title: '温馨提示',
								content: '该单价只能有两位小数，请重新输入'
							});
							return false;
			  		}
						else if(data.obj > 0 && data.obj != null) {
							this.$Modal.error({
								title: '温馨提示',
								content: '事项收费名称重复，请重新输入'
							});
							return false;
						} else if(!exp.test(this.formValidate.chargeName)) {
							this.$Modal.error({
								title: '温馨提示',
								content: '该事项收费名称有无效字符，请重新输入'
							});
							return false;
						} else {
							this.$Modal.confirm({
								title: '温馨提示',
								content: '所有必填项已验证通过，请确认是否提交？',
								onOk: () => {
									axios.post("/cgaProjectChargeItem/save.do", {
										chargeType: this.formValidate.chargeType,
										voucherNo: this.formValidate.voucherNo,
										projectId: this.$route.query.projectId,
										chargeName: this.formValidate.chargeName,
										unit: this.formValidate.unit,
										unitPrice: this.formValidate.unitPrice
									})
									.then(data => {
										if(data.status == '200' && data.success == true){
		                  this.$Message.success('添加成功！');
											this.$router.push({
												path: './pay',
												query: {
													projectId: this.$route.query.projectId
												}
											})
		                }else{
		                  this.$Message.error(data.msg);
		                }
									});
								}
							});
						}
					});
				}else {
          this.$Message.error('验证失败！');
        }
			})
		}
	}
}
</script>

<style lang="scss">
	.ivu-input-number {
		width: 100%;
	}
</style>