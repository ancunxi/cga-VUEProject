<template>
  <div class="layout-content">
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>新增流程配置</span></h5>
    <Row>
      <Col span="22" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">     
        	<Row>
            <Col :lg="12" :xs="24">
              <FormItem label="辅助流程名称：" prop="supportName">
                <Input v-model="formValidate.supportName" placeholder="辅助流程名称"></Input>
              </FormItem>
            </Col>
          </Row>    
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="辅助流程类型：" prop="supportType">
                <Select v-model="formValidate.supportType" placeholder="请选择辅助流程类型" prop="supportType" >
                  <Option v-for="item in typeData" :value="item.value" :key="item.value">{{ item.name }}</Option> 
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="是否可用：" prop="isUse">
                <Radio-group v-model="formValidate.isUse">
                  <Radio label="0">是</Radio>
                  <Radio label="1">否</Radio>
                </Radio-group>
              </FormItem>
            </Col> 
          </Row>
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="描述：" prop="description">
                <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入描述"></Input>
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
export default {
  data () {
    return {
      typeData: [
        {
          name: '常规辅助流程',
          value: "0"
        },
        {
          name: '缴费辅助流程',
          value: "1"
        }
      ],
      formValidate: {
        supportName: '',
        description: '',
        supportType: [],
        isUse: '',
        id: '',
        description: ''
      },
      ruleValidate: {
        supportName: [
          { required: true, message: '不能为空同时辅助流程名称不能超出30个字节',max:30,  trigger: 'blur' }
        ], 
        supportType: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],   
        isUse: [
          { required: true, message: '请选择是否使用', trigger: 'change' }
        ],
        description: [
          { message: '描述不能大于200个字符',max: 200, trigger: 'blur' }
        ]   
      }
    }
  },
  methods: {
    gobacks(){
  		this.$router.push({path: 'index', query: {moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}})
  	},
     //登记完成提交信息
    handleSubmit(name) {    	 
    	axios.post("/cgaSupportWorkflow/distrintWorkflowByName.do",{supportName:this.formValidate.supportName})
      .then(data=>{
        if(data.obj >0 && data.obj !=null){
          this.$Modal.error({
            title: '温馨提示',
            content: '辅助流程名称重复，请重新输入！'
          });
          return false; 
        }else{
  	      this.$refs[name].validate((valid) => {
		        if (valid) {		
        	    var exp =   /^[a-zA-Z0-9_\u4e00-\u9fa5\“\”\-\/\、]+$/;						
			    	  if(exp.test(this.formValidate.supportName)){
			    	 	  this.$Modal.info({
			            title: '温馨提示',
			            content: '所有必填项已验证通过，请确认是否提交？',
			            onOk: () => {  
             			  axios.post("/cgaSupportWorkflow/save.do",{id:this.$route.query.id,supportName:this.formValidate.supportName,isUse:this.formValidate.isUse,description:this.formValidate.description,supportType:this.formValidate.supportType})
			              .then(data=>{
			                this.$Message.success('添加成功！');
                      this.$router.push({path:'index',query:{currentPage:this.$route.query.inCurrentPage}});
			              });
			            }
			          });      
			    	 	 }else{
		    	 	 		this.$Modal.error({
			            title: '温馨提示',
			            content: '该辅助流程名称有无效字符，请重新输入！'
						    });
						    return false;
			    	 	}
		        }
		      })
        }
      });
    } 
  }
}
</script>












































