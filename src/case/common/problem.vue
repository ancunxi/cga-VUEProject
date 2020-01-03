<template>
  <Row>
    <Col span="24">
      <Form>
        <Row>
          <Col span="12">
            <FormItem>
              <Input v-model="infoTitle" placeholder="请输入问题描述"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem>
              <Button type="primary" @click="handleSearch" style="margin-left:10px;">查询</Button>
              <Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>  
            </FormItem>         
          </Col>
        </Row>
      </Form>
      <Collapse v-model="value1"  class="margin-bottom-10">
        <template v-for="(item, index) in problemData">
          <Panel :name="''+index">
            {{item.infoTitle}}
            <p slot="content">{{item.answer}}</p>
          </Panel>          
        </template>
      </Collapse>
      <Page :total="total" :current="currentPage" :page-size="pageSize" size="small" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>     
    </Col> 
    <!--返回按钮-->
    <Col span="24" class="margin-bottom-10 center" v-if="showFlag=='1'">
      <router-link :to="$route.query.path" style="margin-left:8px;" v-if="$route.query.path != ''"><Button type="primary">返回</Button></router-link>
      <router-link to="../index" style="margin-left:8px;" v-else><Button type="primary">返回</Button></router-link>
    </Col>
  </Row>
</template>

<script>
export default {
  props: {
    showFlag: {//控制返回按钮的显示或隐藏
      type: String,
      default: ''
    }
  }, 
  data () {
    return {
      infoTitle: '',
      value1: '1',
      //常见问题列表
      problemData: [],
      //分页
      //queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10,        
    }
  },
  created(){
    //列表及分页 
    //this.$watch('$route.fullPath', this.getList); 
  },
  methods: {
    //根据事项编码查询常见问题列表及分页
    getList(){
      axios.post("/cgaCaseRegist/queryCagProblemInfoListByPage.do", {projectNo:this.$route.query.projectNo, currentPage:this.currentPage, pageSize:this.pageSize,infoTitle:this.infoTitle})
      .then(data=>{
        this.problemData = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        // this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        // this.pageSize= parseInt(this.$route.query.pageSize) || 10;      
      })      
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
    // refreshRouter(){
    //   //更新路由
    //   this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    // },
    //根据问题描述查询列表
    handleSearch(){
      this.currentPage = 1;
      this.getList();

      // Object.assign(this.queryData, {moduleId:this.$route.query.moduleId, currentPage:1, infoTitle:this.infoTitle});
      // this.refreshRouter();      

    },
    //重置按钮
    handleReset(){
      this.infoTitle = '';
      this.currentPage = 1,
      this.pageSize = 10,
      // Object.assign(this.queryData, {
      //   currentPage: 1,
      //   pageSize: 10,
      //   moduleId: this.$route.query.moduleId, 
      //   infoTitle: ''
      // });
      // this.refreshRouter();
      this.getList();
    }
  }
}
</script>



