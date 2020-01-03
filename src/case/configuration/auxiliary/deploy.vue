<template>
  <div class="layout-content">
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>绑定辅助流程配置</span></h5>
    <Row>
      <Col span="22" push="1">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">     
        	<Row>
            <Col :lg="12" :xs="24">
              <FormItem label="辅助流程名称：" prop="supportName">
                <Input v-model="formValidate.supportName" readonly="readonly" placeholder="辅助流程名称："></Input>
              </FormItem>
            </Col>
          </Row>        
          <Row>
            <Col :lg="12" :xs="17">
              <FormItem label="绑定流程：">
                <Select v-model="formValidate.workFlowKey" :title="workFlowKeyTitle" placeholder="请选择工作流类型" filterable>
                  <template v-for="item in workflowList">
                    <Option :key="item.key" :value="item.key">
                      <div style="width:100%;overflow:hidden;" :title='item.name' @click="workFlowKeyChange(item.name)">{{item.name}}</div>
                    </Option>
                  </template>
                </Select>         
              </FormItem>
            </Col>    
            <Col :lg="10" :xs="7">
              <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left:10px;">绑定</Button>
              <Button @click="gobacks" style="margin-left:8px;">返回</Button>
            </Col>
          </Row>
          <Row>
            <div class="workflowContent">
              <img v-if='formValidate.workFlowKey' v-bind:src="workFlowPath +'/process/taskPropertiesImg.do?key='+ formValidate.workFlowKey">
            </div>
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
      workFlowPath: window.config.workflowUrl,
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
      //工作流列表
      workflowList:[],
      workFlowKeyTitle: '',
      formValidate: {
        workFlowKey: '',
        supportName: '',
        description: '',
        supportType: [],
        isUse: '',
        id:''
      },
      ruleValidate: {
        supportName: [
          { required: true, message: '请填写辅助流程名称', trigger: 'blur' }
        ], 
        supportType: [
          { required: true, message: '请选择辅助流程类型', trigger: 'blur' }
        ],   
      }
    }
  },
  created(){
    //查询工作流数据列表
    axios.post("/cgaSupportWorkflow/queryWorkFlowInfo.do")
    .then(data=>{
      this.workflowList = data.obj; 
    });
	  axios.post("/cgaSupportWorkflow/findInfoById.do",{id:this.$route.query.id})
    .then(data=>{ 
      this.formValidate = data.obj;
      this.supportType= data.obj.supportType;
      this.workFlowKeyTitle = this.workflowList.filter(item =>{
        return this.formValidate.workFlowKey == item.key
      })[0].name;
    });   
  }, 
   methods: {
   	gobacks(){
  		this.$router.push({path: 'index', query: {moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}})
  	},
    workFlowKeyChange(){
      this.workFlowKeyTitle = name;
    },
    //登记完成提交信息
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Modal.info({
            title: '温馨提示',
            content: '所有必填项已验证通过，请确认是否提交？',
            onOk: () => {
              axios.post("/cgaSupportWorkflow/save.do",{workFlowKey:this.formValidate.workFlowKey,id:this.$route.query.id,supportName:this.formValidate.supportName,isuse:this.formValidate.isUse,description:this.formValidate.description,supportType:this.formValidate.supportType})
              .then(data=>{
                this.$Message.success('添加成功！');
                this.$router.push({path:'index',query:{currentPage:this.$route.query.inCurrentPage}});
              });
            }
          });
        }
      })
    } 
  }
}
</script>













































