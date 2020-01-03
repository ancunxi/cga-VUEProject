<template>
    <Row>
    <Col span="24">
      <Table :columns="expandColumns" :data="expandData" name="expandTable"></Table>       
    </Col>
  </Row>
</template>
<script>
export default {
  props: {
    row: Object,
    caseId:'',
	fineReportUrl:'',		//帆软报表服务器url地址
  } ,    
  data () {
    return {
      expandColumns: [
        {
          title: '照面表单名称',
          key: 'formName'
        },
        {
          title: '表单报表文件路径',
          key: 'formReportFile'
        },
        {
          title: '表单排序',
          key: 'isOrder'
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  icon: 'edit'
                },
                on: {
                  click: () => {
                    this.$router.push({path:'./form', query:{
                    	 cptUrl:params.row.formReportFile,
                         caseId:this.caseId,
						 fineReportUrl:this.fineReportUrl,
                         projectId:params.row.projectId}})
                  }
                }
              }, '打印')
            ]);
          }
        }        
      ],
      expandData: []
    }
  },
  created(){
  	this.caseId = this.row.caseId;
    this.loadExpandData();
  },
  methods:{
    loadExpandData(){
      if (this.row.projectId == null || this.row.projectId=="") {
        this.expandData = [];
        return;
      }
      axios.post("/cgaCaseLicenceFile/findProjectFormDetailList.do", {projectId:this.row.projectId,formType:"1"})
      .then(data=>{
        this.expandData = data.obj
		//如果列表数据不为空，则获取帆软照面信息录入表单url地址，以便传给子页面，子页面不用再单独去查询帆软服务器地址，
		//单独查询影响页面加载速度
		if(this.expandData.length>0){
			axios.post("/cgaSysLoginInfo/findInfoById.do")
			.then(data => {
				this.fineReportUrl=data.obj.frProjectUrl;
		  });
		}
      }); 
    }
  }
}
</script>