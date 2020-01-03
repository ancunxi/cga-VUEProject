<template>
  <div>
    <div class="problemTable" style="margin-bottom:30px;">
      <h5><Icon type="android-star"></Icon>政策法规</h5>
      <ul class="list">
        <template v-for="(item, index) in cgaProjectFoundationList">
          <li  v-if="item.content==undefined">
            {{index}}. {{item.categoryName}}
          </li>
          <li v-else>
            <Tooltip placement="bottom">
              {{index}}. {{item.categoryName}}
              <div slot="content">
                {{item.content}}
              </div>
            </Tooltip>
          </li>
        </template>
      </ul>
    </div> 
    <div class="page">
      <Page :total="total1" :current="currentPage1" :page-size="pageSize1" show-total show-sizer show-elevator @on-change="pageChange1" @on-page-size-change="pagesizeChange1"></Page>
    </div>
  </div>
</template>

<script>
export default{
  data(){
    return{
      noData: false,
      cgaProjectFoundationList: [],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total1: 0,
      currentPage1: 1, 
      pageSize1: 10 
    }
  },
  created(){
    //列表
    this.getList();
    //this.$watch('$route.fullPath', this.getList); 
  },
  methods:{
    //根据页码或每页显示多少条获取列表数据
    getList(){
      //查询常见问题信息
      axios.post("/cgaCaseRegist/queryProjectFoundationListByPage.do",{projectId:this.$route.query.projectId,
        currentPage:parseInt(this.$route.query.currentPage1) || 1,pageSize:parseInt(this.$route.query.pageSize1) || 10})
      .then(data=>{
        this.total1 = parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage1= parseInt(this.$route.query.currentPage1) || 1;
        this.pageSize1= parseInt(this.$route.query.pageSize1) || 10;
        this.cgaProjectFoundationList=data.obj.records;
      });       
    },
    pageChange1(data){
      this.currentPage1 = data;
      Object.assign(this.queryData,this.$route.query, {currentPage1:data});
      this.refreshRouter();
      this.getList();
    },
    pagesizeChange1(data){
      this.pageSize1 = data;
      Object.assign(this.queryData, this.$route.query, {pageSize1:data});
      this.refreshRouter();
      this.getList();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },    
  }
}
</script>