<template>
  <div class="layout-content">
    <div class="layout-list" style='margin-top:0;padding-top:10px;top:104px;'>
      <Form> 
        <Row :gutter="16">        	
          <Col span="23">
            <Form>   
              <Row :gutter="16">
                <Col span="6">
			            <FormItem class="input-cursor">
			              <a href="javascript:;" @click="handleDept">
			                <Input icon="ios-home" v-model="deptName" placeholder="请选择实施机关"></Input>
			              </a>
			            </FormItem>
			            <Modal
			              v-model="deptTree"
			              title="请选择实施机关"
			              width="500"
			              class-name="ivu-modal-style ivu-modal-absolute-500"
                    :mask-closable="false"
			              @on-cancel="cancelDept">
			              <Row>
			                <Col span="24">
			                  <template>
			                    <tree-view :treedata="deptTreeData" :usabledeptids='usableDeptIds' :activedata="deptActiveData" :vm="deptVm"></tree-view>
			                  </template>
			                </Col>
			              </Row>                     
			            </Modal>            
							  </Col>
							  <Col span="6">
                  <FormItem> 
                    <Input v-model="userName" v-on:on-enter='handleSearch()' placeholder="请输入用户名称"></Input>
                  </FormItem>
                </Col>
                <Col span="5">
						<FormItem>
							
										<Select v-model="roleId" placeholder="请选择角色"  filterable label-in-value clearable ref="selectClear">
								             <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
										</Select>
						</FormItem>
						</Col>  
            <Col span="6">
                  <FormItem> 
                    <Input v-model="workNo" v-on:on-enter='handleSearch()' placeholder="请输入工作编号"></Input>
                  </FormItem>
                </Col>
              </Row>        
              <Row>
                <Col span="18"> 
                  <Row :gutter="16"> 
                    <FormItem>
                      <Button type="primary" style="margin-left:8px;" @click="handleSearch()" >查询</Button>
                      <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
                      <Button type="success" @click="batchAdd()" style="margin-left: 8px">复制到</Button>
                      <Button type="" @click="gobacks()" style="margin-left: 8px">返回</Button>      
                    </FormItem>
                  </Row>
                </Col>
              </Row>
            </Form>
            <div>
				<Table border :columns="Columns" :data="datas"   @on-selection-change="selectChange"></Table> 
				<Page :page-size-opts="pageSizeOpts" :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>     
				</div> 
          </Col>
        </Row>
      </Form>
    </div>  
  </div>
</template>

<script>
import deptTree from '../../common/deptTree';
import tree from '../../common/tree';
export default {
  components:{
    'tree-view': deptTree,
    'Tree': tree,
  },  
  data () {
    return {
    	//-----------------------------------------------------------
    	//弹窗
    	modals:'',
    	userIdArray:'',
      deptTree: false,
      userName:'',
    	deptId: '',
      deptName: '',
      roleId: '',
      workNo:'',
      userId:'',
       //实施机关树数据
      deptTreeData: [],
      //实施机关选中项数据
      deptActiveData: [],
	    pageSizeOpts:[10,50,100],
      deptVm: {},        
      //用户可操作的部门
      usableDeptIds:[],					
      roleList: [],
    	userArr: [],
		  dataList: [],
		  datas:[],
      Columns: [
        {
          type: 'selection',
          align: 'center',
          width: '3%'
        }, 
        {
					title: '工作编号',
					key: 'workNo',
					width: '20%'
				}, {
					title: '所属部门',
					key: 'deptName',
					width: '30%'
				}, {
					title: '用户姓名',
					key: 'userName',
					width: '25%'
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
                  size: 'small',
                  icon: 'edit'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                 this.$Modal.confirm({
										title: '温馨提示',
										content: '是否复制 （'+this.$route.query.rowsName+'）的事项到选中的用户？<br/><font color="red">提示：复制用户不会清除当前用户原有的事项!</font>',
										okText :'是',
										cancelText	:'否',
										onOk: () => {
						           	axios.post("/cgaCaseAcceptConfig/saveProjectByPerson.do",{checks:'1',userId:this.$route.query.userId,userIdArray:this.userArr.join()})
				  						      .then(data=>{
				  						      	this.getList();  
				  						      	this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId}});  
				  						      }).catch(error=>{
												        this.$emit('loadingHide');
												      });   
										}
										
									});
									
                  }
                }
              }, '复制到')
            ]);
          }
        }
      ],
      //分页
      queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10   
    }
  }, 
  created(){
  //-----------------------------------------------------------
   //根据当前菜单的moduleId获取实施机关树数据
    axios.post("/cgaPermission/queryPermissionInfoByParams.do",{moduleId:this.$route.query.moduleId})
    .then(data=>{
      //实施机关部门树
      this.deptTreeData = data.obj.allDeptTreeData;
      //当前用户可操作的部门数据
      this.usableDeptIds = data.obj.usableDeptIds || [];
      //按钮权限的控制
      this.btnData = data.obj.buttonPermissionData.map(item=> item.optCode);
    });
    //将实施机关树的顶级目录传进去用于分发事件
    this.deptVm = this;
    this.$on('handleCallback', item=>{
      this.deptActiveData = [item.deptId];
      this.deptId = item.deptId;
      this.deptName = item.deptName; 
    }); 
    
	axios.post("/role/queryListByPage.do",{
	moduleId:this.$route.query.moduleId,
		currentPage: 1,
		pageSize: 1000,
	
	}).then(data=>{
	      //实施机关部门树
	   	  this.roleList = data.obj.records;
	    });
    //列表及分页
    this.getList(); 
    this.$watch('$route.fullPath', this.getList);   
  },
  methods: {
    handleDept(){

      this.deptTree = true;
      this.deptId = '';
      this.deptName = ''; 
      this.deptActiveData = []; 
    },
 	  cancelDept(){
      this.deptId = '';
      this.deptName = ''; 
      this.deptActiveData = [];
    }, 
    //获取Table表格数据
    getList(){
 
     axios.post("/cgaCaseAcceptConfig/queryUserByPage.do", {
					currentPage: this.$route.query.currentPage,
					pageSize: this.$route.query.pageSize,
					userName: this.userName,
					deptId: this.deptId,
					roleId: this.roleId,
					workNo: this.workNo,
					userId: this.$route.query.userId
					
				})
				.then(data => {
				 this.datas = data.obj.records;
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        this.pageSize= parseInt(this.$route.query.pageSize) || 10;
				});
     },
     batchAdd(){
      if(this.userArr ==null ||this.userArr.length==0){
        this.$Message.error({
          duration: 6,
          content: '请至少选择一条事项进行操作'
        });
        return false;
      }
      	this.$Modal.confirm({
										title: '温馨提示',
										content: '是否复制 （'+this.$route.query.rowsName+'）的事项到选中的用户？<br/><font color="red">提示：复制用户不会清除当前用户原有的事项!</font>',
										okText :'是',
										cancelText	:'否',
										onOk: () => {
						           	axios.post("/cgaCaseAcceptConfig/saveProjectByPerson.do",{checks:'1',userId:this.$route.query.userId,userIdArray:this.userArr.join()})
				  						      .then(data=>{
				  						      	this.getList();  
				  						      	this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId}});  
				  						      }).catch(error=>{
												        this.$emit('loadingHide');
												      });  
										}
									});
      
    },
     gobacks(){
        this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,foruserId:this.$route.query.userId,rowsName:this.$route.query.rowsName}})
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
    //根据查询条件获取列表数据
    handleSearch(){
       /* userName:'',
    	deptId: '',
      deptName: '',
      roleId: '',
      workNo:'',
      userId:'',*/
    
      Object.assign(this.queryData, {currentPage:1, moduleId:this.$route.query.moduleId,userName:this.userName, roleId:this.roleId,workNo:this.workNo,userName:this.userName,deptId:this.deptId,userId:this.$route.query.userId});
      this.refreshRouter();     
    },
    //重置按钮
    handleReset(){
      /* userName:'',
    	deptId: '',
      deptName: '',
      roleId: '',
      workNo:'',
      userId:'',*/
	    this.userName = '';
	    this.roleId = '';
	    this.workNo = '';
      this.userId = '';   
      this.projectName = '';
      this.deptId = '';   
      this.deptName = '';
      Object.assign(this.queryData, {
        currentPage: 1,
        pageSize: 10,
        projectName: '',
        deptId: ''
      });
      this.refreshRouter();
    }, 
    selectChange(selection){
      this.userArr = selection.map(item => item.userId); 
    }  
  }  
}
</script>