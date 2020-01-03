<template>
  <div class="layout-content">
		<div class="layout-content layout-content-expand" style="position: relative; padding: 0; margin-top:0;">  
  		<div class="ma_li_head">
        <Form>   
          <div>
            <Row :gutter="16">
            	<Col :lg="5" :xs="10">
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
              <Col :lg="5" :xs="10">
                <FormItem> 
                    <Input v-model="projectName" v-on:on-enter='handleSearch()' placeholder="请输入事项名称"></Input>
                </FormItem>
              </Col>
              <Col :lg="5" :xs="10">
                  <FormItem>
                    <Select v-model="acceptingRange" placeholder="请选择行使层级">
                      <Option value="">-- 请选择行使层级 --</Option>
                      <template v-for="option in level">
                        <Option v-bind:value="option.dictId">{{option.dictName}}</Option>
                      </template>
                    </Select>
                  </FormItem>
              </Col>
              <Col :lg="5" :xs="10">
                  <FormItem>
                  	<Input v-model="areaName" class='areaInput' placeholder="请选择区划" @on-focus="cityChooseFun"></Input>
		                <city-modal 
		                	ref='cityChildXMDZ' 
		                  :parentCode='parentCode'
		                  @cityChildFun='cityFunXMDZ'>
		                </city-modal>
                  </FormItem>
              </Col> 
              <Col :lg="4" :xs="8">
              		<div class="more" v-show="!display">
					          <Button shape="circle" icon="plus" @click="display = true">更多条件</Button>
					        </div> 
					        <div class="more" v-show="display">
					          <Button shape="circle" icon="minus" @click="display = false">收起条件</Button>
					        </div>
              </Col>
            </Row>
            <div v-show="display"> 
              <Row :gutter="16">               
                <Col :lg="5" :xs="10">
                  <FormItem>
                    <Select v-model="caseType" placeholder="请选择办件类型">
                      <Option value="">-- 请选择办件类型 --</Option>
                      <template v-for="option in levelWork">
                        <Option v-bind:value="option.dictId">{{option.dictName}}</Option>
                      </template>
                    </Select>
                  </FormItem> 
                </Col>
                <Col :lg="5" :xs="10">
                  <FormItem>
                    <Select v-model="tongBanRange" placeholder="请选择通办范围">
                      <Option value="">-- 请选择通办范围 --</Option>
                      <template v-for="option in levelname">
                        <Option :value="option.dictId">{{option.dictName}}</Option>
                      </template>
                    </Select>
                  </FormItem> 
                </Col>
                <Col :lg="5" :xs="10">
                  <FormItem>
                    <Select v-model="projectType" placeholder="请选择事项类型">
                      <Option value="">-- 请选择事项类型 --</Option>
                      <template v-for="option in levelType">
                        <Option v-bind:value="option.dictId">{{option.dictName}}</Option>
                      </template>
                    </Select>
                  </FormItem>
                </Col> 
                <Col :lg="5" :xs="10">
                  <FormItem>
                    <Select v-model="dealType" placeholder="请选择办理方式">
                      <Option value="">-- 请选择办理方式 --</Option>
                      <template v-for="option in levelsimply">
                        <Option :value="option.dictId">{{option.dictName}}</Option>
                      </template>
                    </Select>
                  </FormItem> 
                </Col>                               
              </Row>
            </div> 
            <Row>
                <Col span="18"> 
                  <Row :gutter="16"> 
                    <FormItem>
                      <Button type="primary" style="margin-left:8px;" @click="handleSearch()" >查询</Button>
                      <Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
                      <Button type="success" @click="batchAdd()" style="margin-left: 8px">添加</Button>
                      <Button type="success" @click="gobacks()" style="margin-left: 8px">返回</Button>
                    </FormItem>
                  </Row>
                </Col>
            </Row>
          </div>  
        </Form>
      </div>
   </div>
    <div>
				<Table border :columns="ColumnsOther" :data="dataOther"   @on-selection-change="selectChange"></Table> 
				<Page :page-size-opts="pageSizeOpts" :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>     
		</div>   	
    <!--loading框 Modal Templates-->
		<div class="dhx_modal_cover" v-if='loadingModal'></div>
		<div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
		<!--End loading框 Modal Templates-->
  </div>
</template>

<script>
import deptTree from '../../common/deptTree';
import tree from '../../common/tree';
import cityModal from '../../common/cityChoose.vue'; //城市联动选择
export default {
  components:{
    'tree-view': deptTree,
    'Tree': tree,
    'city-modal':cityModal,
  },
  data () {
    return {
    	//-----------------------------------------------------------
    	loadingModal: false, //loading框 
    	//弹窗
      deptTree: false,
      projectName:this.$route.query.projectName || '',
    	deptId: this.$route.query.deptId || '',
      deptName: '',
      areaCode: this.$route.query.areaCode || '',
      areaName:'',
      acceptingRange:this.$route.query.acceptingRange || '',
      tongBanRange:this.$route.query.tongbanRange || '',
      caseType: this.$route.query.caseType || '',
      projectType: this.$route.query.projectType || '',
      dealType:this.$route.query.dealType || '',
       //实施机关树数据
      deptTreeData: [],
      //实施机关选中项数据
      deptActiveData: [],
      //行使层级下拉数据
      level:[],
      //事项类型下拉数据
      levelType:[],
      //办件类型下拉数据
      levelWork:[],
      //办理类型下拉数据
      levelsimply:[],
      //通力范围下拉数据
      levelname:[],
      parentCode:'',
	  	pageSizeOpts:[10,50,100],
      deptVm: {},        
      //用户可操作的部门
      usableDeptIds:[],
      //-----------------------------------------------------------
      display:false,
    	tableArr: [],
    	projectNo: '',
    	projectNos:[],
      userId:'',
		  dataList: [],
		  dataOther:[],
      ColumnsOther: [
        {
          type: 'selection',
          align: 'center',
          width: '3%'
        }, 
        {
          title: '事项编码',
          key: 'projectNo',
          width: '27%'
        },
        {
          title: '事项名称',
          key: 'projectName',
          width: '30%'
        },       
        {
          title: '实施机关',
          key: 'deptName',
          width: '30%'
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
                  	axios.post("/cgaCaseAcceptConfig/save.do",{userId:this.$route.query.userId,projectNos:params.row.projectNo})
  						      .then(data=>{
  						      	this.getList(); 
  						      	this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,foruserId:this.$route.query.userId,rowsName:this.$route.query.rowsName}})
  						      }); 
                  }
                }
              }, '添加')
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

    let token = localStorage.getItem('token');
    //获取数据字典数据       
    $.post(window.config.api + "/sys/sysDictInfo/getAllSysDictInfo.do?token="+token)
    .then(data=>{
      if(!data.success){
        //返回错误状态                    
        return false;
      }
      //获取行使层级的下拉数据
      this.level = data.obj.acceptingRangeDict;
      
      //获取事项类型的下拉数据
      this.levelType = data.obj.projectTypeDict;

      //获取办件类型的下拉数据
      this.levelWork = data.obj.caseTypeDict; 
			
			//获取办理类型下拉数据
			this.levelsimply = data.obj.dealTypeDict;
			
      //获取通办范围的下拉数据
      this.levelname = data.obj.tongBanRangeDict;
    
    });
    //获取系统当前部署所在地区划编码
    $.post(window.config.api + "/cgaCaseAcceptConfig/getAppParamsConfigList.do?token="+token,{paramKey:'deployAreaCode',appCode:'COSPACE'})
    .then(data=>{
      if(!data.success){
        //返回错误状态
        return false;
      }
      let records = data.obj || [];
      if(records.length>0){
      	this.parentCode = records[0].paramValue;
      }
    }); 
    //列表及分页
    this.getList(); 
    this.$watch('$route.fullPath', this.getList); 
  },
  methods: {
  	cityChooseFun(){
      this.$refs.cityChildXMDZ.loadAreaList();
    },
    cityFunXMDZ(code,name){
    	this.areaCode = code;
    	this.areaName = name;
    },
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
    	this.loadingModal = true;
      //axios.post("/cgaCaseAcceptConfig/queryNotInAcceptConfigByPage.do", {projectName:this.projectName,deptId:this.deptId,userId:this.$route.query.userId,currentPage:this.$route.query.currentPage,pageSize:this.$route.query.pageSize})
      axios.post("/cgaCaseAcceptConfig/queryNotInAcceptConfigByPage.do",this.queryData)
      .then(data=>{
      	this.loadingModal = false;
        this.dataOther = data.obj.records;
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        this.pageSize= parseInt(this.$route.query.pageSize) || 10;
      }).catch(error => {
				this.loadingModal = false;
			});
     },
     batchAdd(){
      if(this.tableArr ==null ||this.tableArr.length==0){
        this.$Message.error({
          duration: 6,
          content: '请至少选择一条事项进行操作'
        });
        return false;
      }
			axios.post("/cgaCaseAcceptConfig/save.do",{userId:this.$route.query.userId,projectNos:this.tableArr.join()})
      .then(data=>{
      	this.getList(); 
      	this.$router.push({path:'./index',query:{moduleId:this.$route.query.moduleId,foruserId:this.$route.query.userId,rowsName:this.$route.query.rowsName}})
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
      Object.assign(this.queryData, {
      	currentPage:1,
      	moduleId:this.$route.query.moduleId, 				
      	projectName:this.projectName,
      	deptId:this.deptId,
      	userId:this.$route.query.userId,
      	areaCode:this.areaCode,
      	caseType:this.caseType,
      	projectType:this.projectType,
      	dealType:this.dealType,
      	acceptingRange:this.acceptingRange,
      	tongBanRange:this.tongBanRange
      });
      this.refreshRouter();     
    },
    //重置按钮
    handleReset(){
      this.projectName = '';
      this.deptId = '';   
      this.deptName = '';
      this.areaCode = '';
      this.areaName = '';
      this.caseType = '';
      this.projectType = '';
      this.dealType = '';
      this.acceptingRange = '';
      this.tongBanRange = '';
      Object.assign(this.queryData, {
        currentPage: 1,
        pageSize: 10,
        projectName: '',
        deptId: '',
        areaCode:'',
        caseType:'',
        projectType:'',
        dealType:'',
        acceptingRange:'',
        tongBanRange:'',
        userId:this.$route.query.userId
      });
      this.refreshRouter();
    }, 
    selectChange(selection){
      this.tableArr = selection.map(item => item.projectNo); 
    }  
  }  
}
</script>