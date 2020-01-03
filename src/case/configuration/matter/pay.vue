<template>
  <div class="layout-content">
    <div class="layout-list" style="top:114px;">
      <h5 class="title margin-bottom-10"><span><i class="ivu-icon ivu-icon-ionic"></i>收费项配置</span></h5>
      <Form> 
        <Row :gutter="16">
          <Col :lg="8" :xs="13">
           	<FormItem>
              <Input placeholder="收费项名称" v-model="chargeName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem>
              <Button type="primary" @click="handleSearch">查询</Button>
              <Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
              <Button type="info" @click="formSubmit()" style="margin-left:8px;">添加</Button>
              <Button @click="backSubmit()" style="margin-left:8px;">返回</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table border :columns="Columns" :data="TableList"></Table> 
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>     
    </div>
  </div>
</template>
          
<script>
export default {
  data () {
    return {
    	//弹窗
    	chargeName :'',
      deptTree: false,
      projectId:'',
      Columns: [
        {
          title: '收费项名称',
          key: 'chargeName',
          width: '25%'
        },
        {
          title: '单位',
          key: 'unit',
          width: '10%'
        },
        {
          title: '单价',
          key: 'unitPrice',
          width: '15%'
        },
        {
          title: '收费类别',
          key: 'chargeType',
          width: '15%'
        },        
        {
          title: '凭证号',
          key: 'voucherNo',
          width: '15%'
        },
        {
          title: '操作',
          key: 'action',
          width: '20%',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  icon: 'edit'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({path:'./payedit',query:{rowId:params.row.id,projectId:this.$route.query.projectId,inCurrentPage:this.currentPage}})
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  icon: 'trash-b'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                		this.$Modal.confirm({
  				            title: '温馨提示',
  				            content: '是否确定删除该信息',
                      cancelText: '取消',
                      okText:"确定",
  				            onOk: () => { 
                  	    axios.post("/cgaProjectChargeItem/delete.do",{id:params.row.id})
  								      .then(data=>{
  								      	this.getList(); 
                          this.$watch('$route.fullPath', this.getList); 
                           this.$Message.success('删除成功！');
  								      }); 
  						        }
  						      }); 
                  }
                }
              }, '删除')
            ]);
          }
        }
      ],
      TableList: [],
	     //分页
      queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10	      
    }
  },
  created(){
    //列表及分页
    this.getList(); 
    this.$watch('$route.fullPath', this.getList);   
    this.projectId = this.$route.query.projectId;
  },
  methods: {
  	formSubmit(){
  		this.$router.push({path:'add',query:{projectId:this.$route.query.projectId,inCurrentPage:this.currentPage}})
  	},
  	backSubmit(){
  	 this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,themeName:this.$route.query.themeName,themeId:this.$route.query.themeId,deptName:this.$route.query.deptName,currentPage:this.$route.query.inCurrentPage,projectNo:this.$route.query.projectNo,projectName:this.$route.query.projectName,deptId:this.$route.query.deptId,themeActiveData:this.$route.query.themeActiveData}})
  	},
    //获取Table表格数据
    getList(){
      axios.post("/cgaProjectChargeItem/queryListByPage.do",{projectId:this.$route.query.projectId,chargeName:this.chargeName,currentPage:this.$route.query.currentPage,pageSize:this.$route.query.pageSize})
      .then(data=>{
        this.TableList = data.obj.records || [];        
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        this.pageSize= parseInt(this.$route.query.pageSize) || 10;
      });      
    },
    pageChange(data){
      this.currentPage = data;
      Object.assign(this.queryData, {currentPage:data});
      this.refreshRouter();
    },
    pageSizeChange(data){
      this.pageSize = data;
      Object.assign(this.queryData, {pageSize:data});
      this.refreshRouter();
    },
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },
    //根据查询条件获取列表数据
    handleSearch(){
      Object.assign(this.queryData, {currentPage:1, chargeName:this.chargeName});
      this.refreshRouter();     
    },
    //重置按钮
    handleReset(){
      this.chargeName = '';
      Object.assign(this.queryData, {
        currentPage: 1,
        pageSize: 10,
        projectId: this.$route.query.projectId
      });
      this.refreshRouter();
    }         
  }  
}
</script>