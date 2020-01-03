<template>
  <div class="layout-content">
    <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>流程配置</span></h5>
    <Row>
      <Col span="24">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">     
        	<Row>
            <Col :lg="8" :xs="24">       
              <FormItem label="事项名称：">{{projectName}}</FormItem>
            </Col>
            <Col :lg="8" :xs="12">
              <FormItem label="事项编码：">{{projectNo}}</FormItem>
            </Col>
            <Col :lg="8" :xs="12">
              <FormItem label="版本：">{{version}}</FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="10" :xs="17">
              <FormItem label="绑定流程：" prop="workFlowKey">
                <!-- <Select v-model="formValidate.workFlowKey" :title="workFlowKeyTitle" placeholder="请选择工作流类型">
                  <template v-for="item in workflowList">
                    <Option :key="item.key" :value="item.key">
                      <div style="width:100%;overflow:hidden;" :title='item.name' @click="workFlowKeyChange(item.name)">{{item.name}}</div>
                    </Option>
                  </template>
                </Select>   -->   
                <Select v-model="formValidate.workFlowKey" :title="workFlowKeyTitle" placeholder="请选择工作流类型" filterable @on-change="workFlowKeyChange" ref="selectKey">
                  <template v-for="item in workflowList">
                    <Option :key="item.key" :value="item.key" :title="item.name">{{item.name}}
                    </Option>
                  </template>
                </Select>         
              </FormItem>
            </Col>     
            <Col :lg="12" :xs="7">
              <Button type="primary" style="margin-left:10px" @click="handleSubmit('formValidate')">绑定</Button>
              <Button  style="margin-left:8px;"  @click="gobacks">返回</Button>
            </Col>
	        </Row>
          <Row> 
            <div class="workflowContent">
              <img v-if='workFlowPath' v-bind:src="workFlowPath +'/process/taskPropertiesImg.do?key='+ formValidate.workFlowKey + timeNum" >
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
      workFlowPath:window.config.workflowUrl,//流程图路径
      //工作流列表
      workflowList:[],
      workFlowKeyTitle: '',
      formValidate: {
        workFlowKey: ''
      },
      ruleValidate: {
        workFlowKey: [
          { required: true, message: '请填写辅助流程名称', trigger: 'blur' }
        ] 
      },
      timeNum:''
    }
  },
  created(){
    this.timeNum = '&' + new Date().getTime();
    this.projectName=  this.$route.query.projectName;      
    this.projectNo=  this.$route.query.projectNo; 
    this.projectId=  this.$route.query.projectId; 
    this.version=  this.$route.query.version; 
    this.projectNosByBack=  this.$route.query.projectNosByBack; 
    this.projectNamesByBack=  this.$route.query.projectNamesByBack; 
    
    
    //查询工作流数据列表
    axios.post("/cgaSupportWorkflow/queryWorkFlowInfo.do")
    .then(data=>{
      this.workflowList = data.obj;
      axios.post("/cgaProjectControl/findInfoById.do",{id:this.$route.query.projectId})
      .then(data=>{    
        if (data.obj.isSpecialfile != "999"  && data !=null) {
          this.formValidate.workFlowKey = data.obj.workFlowKey;
          this.workFlowKeyTitle = this.workflowList.filter(item =>{
                return this.formValidate.workFlowKey == item.key
          })[0].name;
        }  
      });
    }); 
  }, 
  methods: {
  	gobacks(){
  	 this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,themeName:this.$route.query.themeName,themeId:this.$route.query.themeId,deptName:this.$route.query.deptName,currentPage:this.$route.query.inCurrentPage,projectNo:this.$route.query.projectNosByBack,projectName:this.$route.query.projectNamesByBack,deptId:this.$route.query.deptId,themeActiveData:this.$route.query.themeActiveData}})
  	},
  	workFlowKeyChange(){
      this.workFlowKeyTitle = this.$refs.selectKey.query;
    },
    //登记完成提交信息
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Modal.info({
            title: '温馨提示',
            content: '所有必填项已验证通过，请确认是否提交？',
            onOk: () => {
              axios.post("/cgaProjectControl/updateCgaProjectByKey.do",{workFlowKey:this.formValidate.workFlowKey,id:this.$route.query.projectId})
              .then(data=>{
                this.$Message.success('添加成功！');
  	            this.$router.push({path:'./index',query:{themeName:this.$route.query.themeName,themeId:this.$route.query.themeId,deptName:this.$route.query.deptName,currentPage:this.$route.query.inCurrentPage,projectNo:this.$route.query.projectNosByBack,projectName:this.$route.query.projectNamesByBack,deptId:this.$route.query.deptId,themeActiveData:this.$route.query.themeActiveData}})
              });
            }
          });
        }
      })
    } 
  }
}
</script>












































