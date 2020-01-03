<template>
  <Row class="margin-bottom-20">
    <Col span="24">
      <Table border :columns="Columns" :data="TableList"></Table>
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>  
    </Col>
  </Row> 
</template>

<script>
export default {
  props: {
    tacheInfo: {
      type: Object
    },
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
          key: 'workflowName',
          width: '13%'
        },
        {
          title: '流程层级',
          key: 'flowLevel',
          width: '7%'
        },
        {
          title: '指定处理人',
          key: 'assignerNames',
          width: '6%'
        },                    
        {
          title: '实际处理人',
          key: 'operaterName',
          width: '6%'
        },
        {
          title: '所属机关',
          key: 'deptName',
          width: '9%'
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: '8%'
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: '8%'
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
                      this.$router.push({path:'./logreview',query:{
                      projectId:this.$route.query.projectId,
                      id:this.$route.query.id,
                      caseId:this.$route.query.caseId,
                      workFlowType:this.$route.query.workFlowType,
                      businessId:this.$route.query.businessId,
                      projectNo:this.$route.query.projectNo,
                      deputyType:this.$route.query.deputyType,
                      tacheInfo:this.tacheInfo,
                      taskDefinitionKey:this.$route.query.taskDefinitionKey,
                      taskId:this.$route.query.taskId,
                      cardNumber:this.$route.query.cardNumber,
                      inCurrentPage:this.$route.query.inCurrentPage
                    }});
                    }
                  }
              }, ('查看附件('+ params.row.uploadNum + ')'))
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
     // this.$watch('$route.fullPath', this.getList); 
  },
    //当鼠标悬浮在处理显示处理意见title的提示框，
  // updated(){
  //   let trArr=[];
  //   trArr=document.getElementsByTagName("tr");
  //   let opinionTrArr=[];
  //   let num=0;
  //   let TableListNum=0;
  //   TableListNum=this.TableList.length;
  //   for(let i=trArr.length-1;0<i;i--){
  //     if(trArr[i].className=="ivu-table-row"&&TableListNum>0){
  //       TableListNum--;
  //       opinionTrArr.push(trArr[i])
  //     }
  //   }
  //   for(let j=0;j<opinionTrArr.length;j++){
  //     opinionTrArr[j].childNodes[10].setAttribute('title',this.TableList[opinionTrArr.length-1-j].tacheIdea)
  //   }
  // },
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
        // this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        // this.pageSize= parseInt(this.$route.query.pageSize) || 10;
      })   
    },
    pageChange(data){
      this.currentPage = data;
      this.getList(); 
    },
    pageSizeChange(data){
      this.pageSize = data;
      this.getList(); 
    }   
  }
}
</script>
<style lang="scss">
  .ivu-table-cell{
    text-align: center;
  }
  .ivu-table td, .ivu-table th{
    text-align: center;
  }
</style>
