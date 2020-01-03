<template>
  <Row>
    <Col span="24">
      <Table border :columns="Columns" :data="TableList"></Table>
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </Col>
  </Row>
</template>

<script>
export default{
  data(){
    return{
      Columns: [
        {
          title: '关联人姓名',
          key: 'relatedPersonName',
          width: '15%'
        },
        {
          title: '关联人类型',
          key: 'relatedPersonTypeName',
          width: '15%'
        },
        {
          title: '证件类型',
          key: 'cardTypeName',
          width: '15%'
        },
        {
          title: '证件号码',
          key: 'cardNumber',
          width: '22%'
        },
        {
          title: '手机号码',
          key: 'mobile',
          width: '18%'
        }                   
        // {
        //   title: '操作',
        //   key: 'action',
        //   width: '15%',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('div', [              
        //       h('Button', {
        //         props: {
        //           type: 'error',
        //           size: 'small',
        //           icon: 'trash-a'
        //         },
        //         on: {
        //           click: () => {
        //             this.remove(params)
        //           }
        //         }
        //       }, '删除')                          
        //     ]);
        //   }
        // }
      ],
      TableList: [],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10, 
    }
  },
  created(){
    //申请材料列表及分页
    this.getList(); 
    // this.$watch('$route.fullPath', this.getList); 
  },
  methods: {
    getList(){
      axios.post("/cgaCaseRelatedPerson/queryRelatedPersonListByPage.do", {caseId:this.$route.query.caseId,currentPage:this.currentPage, pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        // this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        // this.pageSize= parseInt(this.$route.query.pageSize) || 10;
      });      
    },
    pageChange(data){
      this.currentPage = data;
      // Object.assign(this.queryData, {currentPage:data});
      // this.refreshRouter();
      this.getList(); 
    },
    pageSizeChange(data){
      this.pageSize = data;
      // Object.assign(this.queryData, {pageSize:data});
      // this.refreshRouter();
      this.getList(); 
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },
    // //删除关联人信息
    // remove(params) {  
    //   this.$Modal.confirm({
    //     title: '提示',
    //     content: '确定要删除吗？',
    //     onOk:()=>{
    //       axios.post("/cgaCaseRelatedPerson/deleteRelatedPerson.do", {id:params.row.id})
    //       .then(data=>{
    //         //this.TableList.splice(params.index, 1);
    //         this.$Message.success('删除成功');
    //         this.getList();            
    //       })
    //     }
    //   })
    // }                
  }
}
</script>