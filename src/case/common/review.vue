<!-- 历次审查  -->
<template>  
  <Row>
    <Col span="24" id='reviewYW'>    
      <Table border :columns="Columns" :data="TableList" @on-expand="rowExpand"></Table>
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> 
    </Col>
    <!--返回按钮-->
    <Col span="24" class="margin-bottom-10 center" v-if="showFlag=='1'">
      <router-link :to="$route.query.path" style="margin-left:8px;" v-if="$route.query.path != ''"><Button type="primary">返回</Button></router-link>
      <router-link to="../index" style="margin-left:8px;" v-else><Button type="primary">返回</Button></router-link>
    </Col>
  </Row>
</template>

<script>
import expandRow from './table-expand.vue';
require('../../assets/js/jquery.min.js');
export default { 
  components: {expandRow},
  props:["cardNumber","showFlag"],
  data () {
    return {
      //列表区
      Columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '办件流水号',
          key: 'caseId'
        },
        {
          title: '项目名称',
          key: 'projectName'
        },
        {
          title: '事项名称',
          key: 'caseName'
        },
        {
          title: '受理时间',
          key: 'acceptTime'
        },
        {
          title: '办理状态',
          key: 'applyObjectTypeName'
        }       
      ],
      TableList: [],
      //分页
      // queryData: Object.assign({}, this.$route.query), 
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
    //根据cardNumber和caseId获取Table表格数据
    getList(){
      // if(this.$route.query.cardNumber==null || this.$route.query.cardNumber==""){
      //   this.cardNumberParam = this.cardNumber;
      // }else{
      //   this.cardNumberParam = this.$route.query.cardNumber;
      // }
      if(this.cardNumber==null || this.cardNumber==""){
        return false;
      }
      axios.post("/cgaCaseRegist/queryCgaInfoByCardNumberPage.do",{caseId:this.$route.query.caseId,cardNumber:this.cardNumber, currentPage:this.currentPage, pageSize:this.pageSize })
      .then(data=>{        
        this.TableList = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        // this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        // this.pageSize= parseInt(this.$route.query.pageSize) || 10;
      });      
    },
    pageChange(data){
      this.currentPage = data;
      //Object.assign(this.queryData, {currentPage:data});
      //this.refreshRouter();
      this.getList();
    },
    pageSizeChange(data){
      this.pageSize = data;
      //Object.assign(this.queryData, {pageSize:data});
      //this.refreshRouter();
      this.getList();
    },    
    // refreshRouter(){
    //   //更新路由
    //   this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    // },
    rowExpand(row,status){
      //展开或收起某一行时触发   row：当前行的数据  status：当前的状态
      if(status){
        let index0 = "";
        let caseId0 = "";
        this.TableList.filter((currentValue,index,arr)=>{
          if(currentValue.caseId == row.caseId){
            index0 = index;
            caseId0 = row.caseId;
            return false;
          }
        })
        this.projectData1(caseId0,index0);
      }
    },
    projectData1(caseId0,index0){
      //根据cardNumber和caseId获取Table表格数据
      axios.post("/cgaCaseTache/queryList.do",{caseId:caseId0})
      .then(data=>{  
        let oHtml = '';
        let length = data.obj.length - 1;
        for(let i = 0; i <= length; i++){
          oHtml += 
            '<tr>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].tacheName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].tacheTypeName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].tacheName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].flowLevel) +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].operaterName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].deptName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].startTime||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].endTime||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].tacheStateName||'') +'</div>'+
              '</td>'+
              '<td>'+
                '<div class="ivu-table-cell">'+(data.obj[i].tacheIdea||'') +'</div>'+
              '</td>'+
            '</tr>';  
        }
        $('#reviewYW .ivu-table-row').eq(index0).next('tr').find('tbody').html(oHtml);
        $('#reviewYW .ivu-table-row').eq(index0).next('tr').find('.ivu-table').css({'height':'auto'});
      });      
    },
  }
}
</script>






