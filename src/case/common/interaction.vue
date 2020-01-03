<!-- 受审互动 -->
<template>
  <Row>
    <Col span="24">
      <Form ref="formValidate" :model="formValidate">
        <Row>
          <Col span="12">
            <FormItem
             :label-width="100" 
              label="互动内容：" 
              prop="content"
              :rules="{required: true, message: '互动内容不能为空', trigger: 'blur'}">
              <Input v-model="formValidate.content" placeholder="请输入互动内容"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem>
              <Button type="primary" @click="handleSubmit" style="margin-left:10px;">发布</Button>
            </FormItem>            
          </Col>
        </Row>
      </Form>
      <ul class="interaction-info">
        <template v-for="item in interactionData">
          <li>
            <p>
              <span class="person"><Icon type="person"></Icon>{{item.userName}}</span>
              <span class="time">{{item.caseCreateTime}}</span>
            </p>
            <p><Icon type="chatbox-working"></Icon>{{item.content}}</p>
          </li>          
        </template>               
      </ul>
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
    //控制返回按钮的显示或隐藏
    showFlag: {
      type: String,
    }
  }, 
  data () {
    return {
      //互动内容
      formValidate: {
        content: '', 
      },
      //受审互动列表
      interactionData: [], 
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
    //保存并发布受审互动内容
    handleSubmit () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          axios.post("/cgaCaseInteraction/save.do", {caseId:this.$route.query.caseId, content:this.formValidate.content})
          .then(data=>{
            this.$Message.success(data.msg);
            this.$refs.formValidate.resetFields();
            this.getList();
          })
        }
      })
    },
    //根据办件流水号查询受审互动列表及分页
    getList(){
      axios.post("/cgaCaseInteraction/queryListByPage.do", {caseId:this.$route.query.caseId, currentPage:this.currentPage, pageSize:this.pageSize})
      .then(data=>{
        this.interactionData = data.obj.records || [];
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
    // refreshRouter(){
    //   //更新路由
    //   this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    // }    
  }
}
</script>

<style lang="scss" scoped>
.interaction-info{
  background: #f8f8f9;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  li{
    padding: 15px 0; 
    border-bottom: 1px dashed #ddd;
    &:first-child{
      padding-top: 0;
    }
    &:last-child{
      padding-bottom: 0;
      border-bottom: 0;
    }    
    p{
      line-height: 24px;
      &:first-child{
        margin-bottom: 4px;
        color: #2d8cf0;
      }
      .ivu-icon{
        margin-right: 5px;
      }
      .time{
        float: right;
      }
    }
  }
}
</style>





