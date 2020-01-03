<template>
  <div class="layout-content">
    <div class="layout-inquiry">
      <Col span="24">
      	<Button  @click="gobacks()">返回</Button>
      </Col>
    </div> 
    <div class="layout-list" style="top:156px;">
      <Table border :columns="Columns" :data="TableList"></Table> 
      <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> 
    </div>      
  </div>
</template>

<script>
  require('../../../../assets/js/jquery.min.js');
  export default {
    data(){
      return {
        //列表区
        Columns: [
          {
            title: '资料编码',
            key: 'proDocId',
            width: '15%'
          },
          {
            title: '资料名称',
            key: 'materialName',
            width: '55%'
          },
          {
            title: '资料类型',
            key: 'materialTypeName',
            width: '15%'
          },                 
          {
            title: '操作',
            key: 'action',
            width: '15%',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    marginRight: '5px',
                    display: (params.row.fileId==undefined || params.row.fileId=='') ? 'inline-block' : 'none'
                  }                
                }, '无模板'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'ios-download'
                  },
                  style: {
                    display: (params.row.fileId!=undefined && params.row.fileId!='') ? 'inline-block' : 'none'
                  },                
                  on: {
                    click: () => {
                      this.toDownloadTemplate(params.row.fileId);
                    }
                  }
                }, '模板下载')
              ]);
            }
          }
        ],
        TableList: [],
        //分页
        queryData: Object.assign({}, this.$route.query), 
        total: 0,
        currentPage: 1, 
        pageSize: 10,
      }
    },
    created(){
      //列表及分页
      this.getList(); 
      this.$watch('$route.fullPath', this.getList);   
    },
    methods: {    
      //获取Table表格数据
      getList(){
        axios.post("/cgaProject/queryProjectMaterialListByPage.do", this.queryData)
        .then(data=>{
          this.TableList = data.obj.records || [];
          this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
          this.currentPage= parseInt(this.$route.query.currentPage) || 1;
          this.pageSize= parseInt(this.$route.query.pageSize) || 10;
        });      
      },
      gobacks(){
  		this.$router.push({path:'../index',query:{currentPage:this.$route.query.inCurrentPage}})
     	},
      pageChange(data){
        this.currentPage = data;
        Object.assign(this.queryData, {currentPage:data});
        this.refreshRouter();
      },
      pageSizeChange(data){
        this.pageSize = data;
        Object.assign(this.queryData, {pageSize:data});
        this.refreshRouter();
      },    
      refreshRouter(){
        //更新路由
        this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
      },
      //下载
      toDownloadTemplate(id){          
          let token = localStorage.getItem('token');
          //自定义form标签，初始化相关参数
          var form = $("<form>");
          form.attr('style', 'display:none');
          form.attr('target', '');
          form.attr('method', 'post');
          form.attr('action', window.config.api+'/attachment/onLinePre.do');

          var input1 = $('<input>');
          input1.attr('type', 'hidden');
          input1.attr('name', 'fileId');
          input1.attr('value', id);
          
          var input2 = $('<input>');
          input2.attr('type', 'hidden');
          input2.attr('name', 'token');
          input2.attr('value', token);

          var input3 = $('<input>');
          input3.attr('type', 'hidden');
          input3.attr('name', 'downloadType');
          input3.attr('value', 1);
          
          $('body').append(form);
          form.append(input1);
          form.append(input2);
          form.append(input3);
          
          form.submit();
          form.remove();
      }
      //根据查询条件获取列表数据
      // handleSearch(){
      //   Object.assign(this.queryData, {moduleId:this.$route.query.moduleId, currentPage:1, projectName:this.projectName, deptId:this.deptId, themeId:this.themeId});
      //   this.refreshRouter();     
      // },
      // //重置按钮
      // handleReset(){
      //   this.projectName = '';
      //   this.deptId = '';
      //   this.deptName = '';
      //   this.themeId = '';
      //   this.themeName = '';      
      //   Object.assign(this.queryData, {
      //     currentPage: 1,
      //     pageSize: 10,
      //     moduleId: this.$route.query.moduleId, 
      //     deptId: '', 
      //     projectName: ''
      //   });
      //   this.refreshRouter();
      // }          
    }
  }
</script>

