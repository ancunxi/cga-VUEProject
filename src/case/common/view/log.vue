<!-- 流程日志 -->
<template>
<div>
  <Row class="margin-bottom-20">
    <Col span="24">
      <Table border :columns="Columns" :data="TableList"></Table>
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>   
    </Col>
  </Row> 
  <Row class="margin-bottom-10 center" v-if="showFlag=='1'">
    <Col span="24">
      <router-link :to="$route.query.path" style="margin-left:8px;" v-if="$route.query.path != ''"><Button type="primary">返回</Button></router-link>
      <router-link to="../index" style="margin-left:8px;" v-else><Button type="primary">返回</Button></router-link>
    </Col>
  </Row>
</div>
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
      Columns: [
        {
          title: '环节名称',
          key: 'tacheName',
          width: '8%'
        },
        {
          title: '流程类型',
          key: 'tacheTypeName',
          width: '10%'
        },
        {
          title: '流程名称',
          key: 'tacheName',
          width: '8%'
        },
        {
          title: '流程层级',
          key: 'flowLevel',
          width: '5%'
        },
        {
          title: '指定处理人',
          key: 'assignerNames',
          width: '9%'
        },                    
        {
          title: '实际处理人',
          key: 'operaterName',
          width: '8%'
        },
        {
          title: '所属机关',
          key: 'deptName',
          width: '9%'
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: '9%'
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: '9%'
        },
        {
          title: '处理结果',
          key: 'tacheStateName',
          width: '7%'
        },
        {
          title: '处理意见',
          key: 'tacheIdea',
          width: '8%',
          align: 'center',
          render: (h, params) => {
              return h('div', [
                  h('Button', {
                      props: {
                          type: 'primary',
                          size: 'small'
                      },
                      style: {
                          marginRight: '5px'
                      },
                      on: {
                          click: () => {
                              this.show(params.index)
                          }
                      }
                  }, '查看')
              ]);
          }
        },                    
        {
          title: '操作',
          key: 'action',
          width: '10%',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {
                      display: (params.row.uploadNum>0?'block':'none'),
                  },
                  on: {
                    click: () => {
                      this.$router.push({path:'./logview', query:{moduleId:this.$route.query.moduleId, projectId:this.$route.query.projectId, projectNo:this.$route.query.projectNo, caseId:this.$route.query.caseId, id:this.$route.query.id, cardNumber:this.$route.query.cardNumber}});
                    }
                  }
              }, ('查看附件('+ params.row.uploadNum + ')'))
            ]);
          } 
        }       
      ],
      TableList: [],

      //分页
      total: 0,
      currentPage: 1, 
      pageSize: 10 

    }
  },
  methods:{
    show (index) {
        this.$Modal.info({
            title: '处理意见',
            content: `${this.TableList[index]["tacheIdea"]}`
        })
    },
    //查询指定办件的环节过程记录日志(分页)
    getList(){
      axios.post("/cgaCaseTache/queryListByPage.do", {caseId:this.$route.query.caseId, currentPage:this.currentPage, pageSize:this.pageSize })
      .then(data=>{
        this.TableList = data.obj.records || [];
        for(let i = 0;i < this.TableList.length;i++){
           if(!this.TableList[i]["tacheIdea"]){
             this.$set(this.TableList[i],"tacheIdea","空")
           }
        }
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
      })   
    },
    pageChange(data){
      this.currentPage = data;
      this.getList(); 
    },
    pageSizeChange(data){
      this.pageSize = data;
      this.getList(); 
    },    
    
  }


}
</script>
