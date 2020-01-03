<template>
  <div>
    <div class="problemTable" style="margin-bottom:30px;">
    <h5><Icon type="android-star"></Icon>常见问题</h5>
    <ul class="list">
      <template v-for="(item, index) in cgaProjectProblemList">
      	<li v-if="item.answer==undefined">
      		   {{index}}. {{item.infoTitle}}
      	</li>
        <li v-else>
          <Tooltip placement="bottom">
          	 {{index}}. {{item.infoTitle}}
            <div slot="content">
              {{item.answer}}
            </div>
          </Tooltip>
        </li>
      </template>
    </ul>
    </div> 
    <div class="page">
      <Page :total="total2" :current="currentPage2" :page-size="pageSize2" show-total show-sizer show-elevator @on-change="pageChange2" @on-page-size-change="pagesizeChange2"></Page>
    </div>
  </div>
</template>

<script>
export default{
  data(){
    return{
      noData: false,
      cgaProjectProblemList: [],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total2: 0,
      currentPage2: 1, 
      pageSize2: 10 
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
      axios.post("/cgaCaseRegist/queryCagProblemInfoListByPage.do",{projectNo:this.$route.query.projectNo,
        currentPage:parseInt(this.$route.query.currentPage2) || 1,pageSize:parseInt(this.$route.query.pageSize2) || 10})
      .then(data=>{
        this.total2= parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage2= parseInt(this.$route.query.currentPage2) || 1;
        this.pageSize2= parseInt(this.$route.query.pageSize2) || 10;
        this.cgaProjectProblemList=data.obj.records;
      });       
    },
    pageChange2(data){
      this.queryData =  this.$route.query;
      this.currentPage2 = data;
      Object.assign(this.queryData, this.$route.query, {currentPage2:data});
      this.refreshRouter();
      this.getList();
    },
    pagesizeChange2(data){
      this.queryData =  this.$route.query;
      this.pageSize2 = data;
      Object.assign(this.queryData, this.$route.query, {pageSize2:data});
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