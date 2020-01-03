<template>
  <div>
    <div class="ivu-table-wrapper">
      <div class="ivu-table ivu-table-border"> 
        <div class="ivu-table-header">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <colgroup>
              <col width="15%">
              <col width="34%">
              <col width="18%">
            </colgroup> 
            <thead>
              <tr>
                <th><div class="ivu-table-cell">序号</div></th>
                <th><div class="ivu-table-cell">资料名称</div></th>
                <th><div class="ivu-table-cell">资料类型</div></th> 
              </tr>
            </thead>
          </table>
        </div> 
        <div class="ivu-table-body">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <colgroup>
              <col width="15%">
              <col width="34%">
              <col width="18%">
            </colgroup> 
            <tbody class="ivu-table-tbody">           
              <tr class="ivu-table-row" v-for="(item, index) in selectedMaterialList">
                <td><div class="ivu-table-cell">{{index+1}}</div></td>
                <td><div class="ivu-table-cell">{{item.materialName}}</div></td>
                <td><div class="ivu-table-cell">{{item.materialTypeName}}</div></td>
              </tr>                                               
            </tbody>
          </table>
        </div> 
      </div>
    </div>
            
    <div class="page">
      <Page :total="total5" :current="currentPage5" :page-size="pageSize5" show-total show-sizer show-elevator @on-change="pageChange5" @on-page-size-change="pagesizeChange5"></Page>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      selectedMaterialList:[],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total5: 0,
      currentPage5: 1, 
      pageSize5: 10,
      arr1:[]
    }
  },
  created(){
    this.getList1();
  },   
  methods: {
    getList1(){
      this.arr1=this.$route.query.allSelectedMids||[];
      //查询常见问题信息
      axios.post("/cgaProjectGuide/queryEgsMaterialInfoByParamsPage.do",{materialIds:this.arr1.join(),currentPage:parseInt(this.$route.query.currentPage5) || 1,pageSize:parseInt(this.$route.query.pageSize5) || 10})
      .then(data=>{
        this.total5= parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage5= parseInt(this.$route.query.currentPage5) || 1;
        this.pageSize5= parseInt(this.$route.query.pageSize5) || 10;
        this.selectedMaterialList=data.obj.records;
      });       
    },
    pageChange5(data){
      this.currentPage5 = data;
      Object.assign(this.queryData, this.$route.query, {currentPage5:data});
      this.refreshRouter();
      this.getList1();
    },
    pagesizeChange5(data){
      this.pageSize5 = data;
      Object.assign(this.queryData, this.$route.query, {pageSize5:data});
      this.refreshRouter();
      this.getList1();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    }
  }
}
</script>