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
              <tr class="ivu-table-row" v-for="(item, index) in noSelectedMaterialList">
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
      <Page :total="total4" :current="currentPage4" :page-size="pageSize4" show-total show-sizer show-elevator @on-change="pageChange4" @on-page-size-change="pagesizeChange4"></Page>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      noSelectedMaterialList:[],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total4: 0,
      currentPage4: 1, 
      pageSize4: 10,
      arr:[]
    }
  },
  created(){
    this.getList();
  },   
  methods: {
    getList(){
      this.arr=this.$route.query.noSelectedMids||[];
      //查询常见问题信息
      axios.post("/cgaProjectGuide/queryEgsMaterialInfoByParamsPage.do",{materialIds:this.arr.join(),currentPage:parseInt(this.$route.query.currentPage4) || 1,pageSize:parseInt(this.$route.query.pageSize4) || 10})
      .then(data=>{
        this.total4= parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage4= parseInt(this.$route.query.currentPage4) || 1;
        this.pageSize4= parseInt(this.$route.query.pageSize4) || 10;
        this.noSelectedMaterialList=data.obj.records;
      });       
    },
    pageChange4(data){
      this.currentPage4 = data;
      Object.assign(this.queryData, this.$route.query, {currentPage4:data});
      this.refreshRouter();
      this.getList();
    },
    pagesizeChange4(data){
      this.pageSize4 = data;
      Object.assign(this.queryData, this.$route.query, {pageSize4:data});
      this.refreshRouter();
      this.getList();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    }
  }
}
</script>