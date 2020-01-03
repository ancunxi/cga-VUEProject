<template>
	<Row>
    <Col span="24" class="margin-bottom-10">
      <h5 class="title" style="overflow:hidden;">
        <span><Icon type="ios-list"></Icon>资料袋信息</span>
        <i class="fr">
          <!-- <Button type="info" v-on:click="specialModalFun('02')">快速签收</Button>
          <Button type="info" style="margin-left:8px;" v-on:click="specialModalFun('03')">快速查阅</Button> -->  
        </i>
      </h5>
    </Col>
    <Col span="24">
      <Table border :columns="Columns" :data="TableList"></Table>
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> 
    </Col>
  </Row>
</template>

<script>
export default{
  data () {
    return {
      Columns: [
        {
          title: '环节名称',
          key: 'tacheName',
          width: '13%'
        },
        {
          title: '操作人',
          key: 'userName',
          width: '9%'
        },
        {
          title: '所属机关',
          key: 'deptName',
          width: '25%'
        },
        {
          title: '操作时间',
          key: 'operateTime',
          width: '18%'
        },
        {
          title: '处理类型',
          key: 'dealTypeName',
          width: '15%'
        },                    
        {
          title: '处理意见',
          key: 'description',
          width: '20%'
        },
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
    //渲染特殊情况材料列表
    this.getList();
    // this.$watch('$route.fullPath', this.getList); 
  },
  methods: {
    getList(){
      axios.post("/cgaMaterialbagTache/queryListByPage.do", {caseId:this.$route.query.caseId,currentPage:this.currentPage, pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records;
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
    //弹出资料签收弹出框
    specialModalFun(type){
      // let caseBarcodeList;
      // caseBarcodeList = this.TableList.map(item =>{
      //   return item.caseBarcode;
      // })

      //新增资料袋流转记录信息  
      axios.post("/cgaMaterialbagTache/save.do", {
          caseId:this.$route.query.caseId,
          //caseBarcodeBatch: caseBarcodeList.join(","),
          caseBarcodeBatch: this.$route.query.caseId,
          dealType:type,
          description:''
	    }).then(data=>{
          if(data.status == '200' && data.success == true){
            this.$Message.success('保存成功!');
            this.getList();
          }else{
            this.$Message.error(data.msg);
          }
        });
    }
  }
}
</script>