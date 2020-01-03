<template>
  <div class="layout-content">
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>事项配置信息</span></h5>
    <Row>
      <Col span="22" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">     
          <Row>
            <Col span="12">
	            <Form :label-width="130" prop="isSpecialfile">
	             	<FormItem label="是否显示特殊情况:">
				        <i-switch v-model="formValidate.isSpecialfile" size="large">
			            <span slot="open">是</span>
			            <span slot="close">否</span>
				        </i-switch>
				      </FormItem>
	            </Form>
	          </Col>
            <Col span="12">
	            <Form :label-width="130" prop="isRelatedperson">
	             	<FormItem label="是否显示关联人:">
					        <i-switch v-model="formValidate.isRelatedperson" size="large">
				            <span slot="open">是</span>
				            <span slot="close">否</span>
					        </i-switch>
					      </FormItem>
	            </Form>
		        </Col>  
          </Row>
          
       <Row :style="distributeBorder">
			      <Col span="12">
	            <Form :label-width="130" prop="isDistribute">
	             	<FormItem label="是否分发:">
					        <i-switch v-model="formValidate.isDistribute" size="large" @on-change="changeBorder">
				            <span slot="open">是</span>
				            <span slot="close">否</span>
					        </i-switch>
					      </FormItem>
	            </Form>
		       </Col> 

		        <Col span="12" v-if="formValidate.isDistribute">
	            <Form :label-width="130" prop="legalPersonPath">
		             	<FormItem label="分发法人办件url:">
						         <Input placeholder="分发法人办件url" v-model="formValidate.legalPersonPath" style="width:80%;"></Input>
						      </FormItem>
	            </Form>
		        </Col>
		         <Col span="12" v-if="formValidate.isDistribute">
	            <Form :label-width="130" prop="naturalPersonPath">
		             	<FormItem label="分发自然人办件url:">
						         <Input placeholder="分发自然人办件url" v-model="formValidate.naturalPersonPath" style="width:80%;"></Input>
						      </FormItem>
	            </Form>
		        </Col>
		         <Col span="12" v-if="formValidate.isDistribute">
	            <Form :label-width="130" prop="repairPath">
		             	<FormItem label="分发补齐补证办件url:">
						         <Input placeholder="分发补齐补证办件url" v-model="formValidate.repairPath" style="width:80%;"></Input>
						     </FormItem>
	            </Form>
		        </Col>
	        </Row>

	        <Row class="saveMsg">
			      <Col span="24" class="center">
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
export default {
  data () {
    return {
      P_isRelatedperson:'',
      P_isSpecialfile:'',
      P_isDistribute:'',
      isDistribute:'',
      legalPersonPath:'',
      naturalPersonPath:'',
      repairPath:'',
      formValidate: {
        isSpecialfile: '',
        isRelatedperson: '',
        id: '',
        isDistribute:'',
        legalPersonPath:'',
        naturalPersonPath:'',
        repairPath:''
      },
      ruleValidate: {
        isSpecialfile: [
          { required: true, message: '请选择是否显示特殊情况', trigger: 'blur' }
        ], 
        isRelatedperson: [
          { required: true, message: '请选择是否显示关联人', trigger: 'blur' }
        ],   
      },
			distributeBorder:{
				border:"1px solid #ccc",
				paddingTop:"20px"
			}
    }
  },
  created(){
    axios.post("/cgaProjectControl/findInfoById.do",{id:this.$route.query.projectId})
    .then(data=>{    
    	if (data.obj.isSpecialfile != "999"  && data !=null) {
  		  this.formValidate = data.obj;
  		  if (this.formValidate.isRelatedperson=="0") {
  		 	  this.formValidate.isRelatedperson=true;
  		  } else{
  		 	  this.formValidate.isRelatedperson=false;
  		  }
  		  if (this.formValidate.isSpecialfile=="0") {
  		 	  this.formValidate.isSpecialfile=true;
  		  } else{
  		 	  this.formValidate.isSpecialfile=false;
  		  }
  		  if (this.formValidate.isDistribute=="0") {
  		 	  this.formValidate.isDistribute=true;
  		  } else{
  		 	  this.formValidate.isDistribute=false;
  		  }
				if(!this.formValidate.isDistribute){
					this.distributeBorder = '';
				}
    	}  
    });
  }, 
  methods: {
		changeBorder(data){
			if(data){
				this.distributeBorder = {border:"1px solid #ccc",paddingTop:"20px"};
			}else{
				this.distributeBorder = '';
			}
		},  	
  	gobacks(){
  	 this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,themeName:this.$route.query.themeName,themeId:this.$route.query.themeId,deptName:this.$route.query.deptName,currentPage:this.$route.query.inCurrentPage,projectNo:this.$route.query.projectNo,projectName:this.$route.query.projectName,deptId:this.$route.query.deptId,themeActiveData:this.$route.query.themeActiveData}})
  	},
    //登记完成提交信息  
    handleSubmit(name) {
    	this.P_isRelatedperson = this.formValidate.isRelatedperson;
	  	if (this.P_isRelatedperson ==true) {
  	  	this.P_isRelatedperson=0;
	  	} else{
	  		this.P_isRelatedperson=1;
	  	}
	  	this.P_isSpecialfile = this.formValidate.isSpecialfile;
	  	if (this.P_isSpecialfile ==true) {
	  	  this.P_isSpecialfile=0;
	  	} else{
	  		this.P_isSpecialfile=1;
	  	}
	  	this.P_isDistribute = this.formValidate.isDistribute;
	  	if (this.P_isDistribute ==true) {
	  	  this.P_isDistribute=0;
	  	} else{
	  		this.P_isDistribute=1;
	  	}
	  	this.$Modal.confirm({
        title: '温馨提示',
        content: '所有必填项已验证通过，请确认是否提交？',
        onOk: () => { 
  		  	axios.post("/cgaProjectControl/updateCgaProjectByKey.do",{id:this.$route.query.projectId,isSpecialfile:this.P_isSpecialfile,isRelatedperson:this.P_isRelatedperson,isDistribute:this.P_isDistribute,legalPersonPath:this.formValidate.legalPersonPath,naturalPersonPath:this.formValidate.naturalPersonPath,repairPath:this.formValidate.repairPath}) 
  	      .then(data=>{
  	       if(data.status == '200' && data.success == true){
							this.$Message.success("保存成功！");
									this.$router.push({path:'./index', query:{themeName:this.$route.query.themeName, themeId:this.$route.query.themeId, deptName:this.$route.query.deptName, currentPage:this.$route.query.inCurrentPage, projectNo:this.$route.query.projectNo, projectName:this.$route.query.projectName, deptId:this.$route.query.deptId, themeActiveData:this.$route.query.themeActiveData}})
						}else{
							this.$Message.error(data.msg);
						}
  	      });
        } 
      });  
	  	// axios.post("/cgaProject/updateCgaProjectByKey.do",{id:this.$route.query.projectId,isSpecialfile:this.P_isSpecialfile,isRelatedperson:this.P_isRelatedperson})
			// .then(data=>{
			// 	if(data.status == '200' && data.success == true){
			// 		this.$Modal.info({
			// 			title: '提示',
			// 			content: '保存成功！',
			// 			onOk: () => { 
			// 				this.$router.push({path:'./index', query:{themeName:this.$route.query.themeName, themeId:this.$route.query.themeId, deptName:this.$route.query.deptName, currentPage:this.$route.query.inCurrentPage, projectNo:this.$route.query.projectNo, projectName:this.$route.query.projectName, deptId:this.$route.query.deptId, themeActiveData:this.$route.query.themeActiveData}})
			// 			} 
			// 		});
			// 	}else{
			// 		this.$Message.error(data.msg);
			// 	}
			// });	 
    } 
  }
}
</script>
<style scoped>
	.saveMsg{
		margin-top: 20px;
	}
</style>














































