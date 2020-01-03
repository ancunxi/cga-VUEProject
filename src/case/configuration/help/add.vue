<template>
  <div class="layout-content">	
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>添加帮办信息</span></h5>
    <Row>
      <Col span="22" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">          
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="领导：" prop="leaderId">
                <Select v-model="formValidate.leaderId" placeholder="请选择领导名称：">
                  <template v-for="item in userData">
                    <Option :value="item.userId" :key="item.userId">{{ item.userName }}</Option>
                  </template> 
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="12" :xs="24">
              <FormItem label="帮办人：" prop="deputyId">
                <Select v-model="formValidate.deputyId" placeholder="请选择帮办人名称：">
                  <template v-for="item in userData">
                    <Option :value="item.userId" :key="item.userId">{{ item.userName }}</Option>
                  </template>
                </Select>
              </FormItem>
            </Col>           
          </Row> 
          <Row>
            <Col span="24">
              <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button style="margin-left:8px;" @click="gobacks">返回</Button>
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
      userData: [],
      formValidate: {
        leaderId: '',
        deputyId: ''   
      },
      ruleValidate: {
        leaderId: [
          { required: true, message: '请选择领导名称', trigger: 'change' }
        ],
        deputyId: [
          { required: true, message: '请选择帮办人名称', trigger: 'change' }
        ]                                           
      }  
    }
  },
  created(){ 
    //获取下拉框数据 
    axios.post("/cgaDeputy/findUserByAll.do")
    .then(data=>{
      this.userData = data.obj;
    })  
  },  
  methods: {
  	gobacks(){
  		this.$router.push({path: 'index',query: {moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}})
  	},
    //登记完成提交信息
    handleSubmit(name) {
    	
      this.$refs[name].validate((valid) => {
        if (valid) {
        	if(this.formValidate.deputyId==this.formValidate.leaderId){
	    		 this.$Modal.error({
	             title: '温馨提示',
	             content: '帮办人和领导不能相同，请重新选择。。'
	          });
	          return false;
    	     }
        	axios.post("/cgaDeputy/distrintCgaDeputyByName.do",{deputyId:this.formValidate.deputyId,leaderId:this.formValidate.leaderId})
              .then(data=>{
            if(data.obj >0 && data.obj !=null){
               this.$Modal.error({
	             title: '温馨提示',
	             content: '已存在相同的帮办人和领导，请重新选择。。'
	              });
	              return false; 
	          }	else{
				          	   this.$Modal.info({
						            title: '温馨提示',
						            content: '所有必填项已验证通过，请确认是否提交？',
						            onOk: () => {
						              axios.post("/cgaDeputy/save.do",{deputyId:this.formValidate.deputyId,leaderId:this.formValidate.leaderId})
						              .then(data=>{
						                this.$Message.success('添加成功！');
						                this.$router.push({path:'index',query:{currentPage:this.$route.query.inCurrentPage}});
						              });
						            }
						          });
	          }
        	});
        	
      
        }
      })
    } 
  }       
}
</script>


