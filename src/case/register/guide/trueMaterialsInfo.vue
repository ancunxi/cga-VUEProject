<template>
  <div>
    <h5 class="need">
      <span>所需材料</span>
      <Button type="primary" @click="selectedModalFun" class="fr">已选向导</Button>
    </h5>
    <Modal 
      v-model="selectedModal" 
      class-name="ivu-modal-style" 
      :mask-closable="false">
      <p slot="header">查看已选向导</p>
      <div>
        <selectedProblemTree-view :oldtreedata='oldTreeData' :usablegids='usablegids' :vm="vm"></selectedProblemTree-view>
      </div>
      <div slot="footer">
        <Button type="primary" @click="close">关闭</Button>
      </div>
    </Modal>


    <div class="ivu-table-wrapper">
      <div class="ivu-table ivu-table-border"> 
        <div class="ivu-table-header">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <colgroup>
              <col width="15%">
              <col width="34%">
              <col width="18%">
              <col width="13%">
              <col width="20%">
            </colgroup> 
            <thead>
              <tr>
                <th>
                <div class="ivu-table-cell">
                  <span>序号</span>
                  <!-- <input type="checkbox" v-model='checked' @click='checkedAll'>
                  全选
                  </input> -->
                </div>
                </th>
                <th><div class="ivu-table-cell">资料名称</div></th>
                <th><div class="ivu-table-cell">资料类型</div></th>
                <th><div class="ivu-table-cell">原件</div></th>
                <th><div class="ivu-table-cell">审核提示</div></th>
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
              <col width="13%">
              <col width="20%">
            </colgroup> 
            <tbody class="ivu-table-tbody">           
              <tr class="ivu-table-row" v-for="(item, index) in trueMaterialsList">
                <td>
                  <div class="ivu-table-cell">
                    <!-- <input type="checkbox" v-model='checkboxModel' :value='item.materialId' /> -->
                    {{index+1}}
                  </div>
                </td>
                <td><div class="ivu-table-cell">{{item.materialName}}</div></td>
                <td><div class="ivu-table-cell">{{item.materialTypeName}}</div></td>
                <td><div class="ivu-table-cell">{{item.isOriginalName}}</div></td>
                <td>
                  <div class="ivu-table-cell">
                    <Tooltip placement="bottom">
                      <Button>审核提示</Button>
                      <div slot="content">
                        <p>{{item.description}}</p>
                      </div>
                    </Tooltip> 
                  </div>
                </td>
              </tr>                                               
            </tbody>
          </table>
        </div> 
      </div>
    </div>
            
    <div class="page">
      <Page :total="total3" :current="currentPage3" :page-size="pageSize3" show-total show-sizer show-elevator @on-change="pageChange3" @on-page-size-change="pagesizeChange3"></Page>
    </div>
  </div>
</template>

<script>
require('../../../assets/js/jquery.min.js');
import selectedProblemTree from './selectedProblemTree.vue';
export default{
  components: {
    'selectedProblemTree-view':selectedProblemTree
  },
  props: {
      usablegids: Array,
  },
  data(){
    return{
      selectedModal: false,
      trueMaterialsList: [],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total3: 0,
      currentPage3: 1, 
      pageSize3: 10,
      //勾选
      checkboxModel:[],
      checked:false,
      //原树数据
      oldTreeData:[],
      vm:'',
    }
  },
  created(){
    this.vm=this;
    //列表
    this.getList();
    //this.$watch('$route.fullPath', this.getList); 
  },
  methods:{
    close () {
      this.selectedModal = false;
    },
    //根据页码或每页显示多少条获取列表数据
    getList(){
      //查询常见问题信息
      axios.post("/cgaProjectGuide/getGuideMaterialsPageByGuideIds.do",{projectId:this.$route.query.projectId,guideIds:this.$route.query.guideIds,currentPage:parseInt(this.$route.query.currentPage3) || 1,pageSize:parseInt(this.$route.query.pageSize3) || 10})
      .then(data=>{
        this.total3= parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage3= parseInt(this.$route.query.currentPage3) || 1;
        this.pageSize3= parseInt(this.$route.query.pageSize3) || 10;
        this.trueMaterialsList=data.obj.records;
      });       
    },
    pageChange3(data){
      this.currentPage3 = data;
      Object.assign(this.queryData, this.$route.query, {currentPage3:data});
      this.refreshRouter();
      this.getList();
    },
    pagesizeChange3(data){
      this.pageSize3 = data;
      Object.assign(this.queryData, this.$route.query, {pageSize3:data});
      this.refreshRouter();
      this.getList();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },    
    //全选或单选
    checkedAll: function() {
      var _this = this;
      setTimeout(()=>{
          if (this.checked==false) {//实现反选
            _this.checkboxModel = [];
            _this.checked=false;
          }else{//实现全选_this.checked=true;
            _this.checkboxModel = [];
            _this.trueMaterialsList.forEach(function(item) {
              _this.checkboxModel.push(item.materialId);
            });
          }
      });
    },
    //点击查询原树数据
    selectedModalFun(){
      this.selectedModal = true;
      //查询原树数据
      axios.post("/cgaCaseRegist/queryCgaProjectGuideTreeList.do",{projectNo:this.$route.query.projectNo})
      .then(data=>{
        if(!data.success){
          //返回错误状态                    
          return false;
        }
        this.oldTreeData = data.obj || []; 
      });
    }
  },
  watch: {//深度 watcher 监控
    'checkboxModel': {
      handler: function (val, oldVal) { 
        if (this.checkboxModel.length == this.trueMaterialsList.length) {
          this.checked=true;
        }else{
          this.checked=false;
        }
      },
      deep: true
    }
  }
}
</script>