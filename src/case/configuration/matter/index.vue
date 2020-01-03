<template>
	<div class="layout-content">
		<div class="layout-inquiry" >
			<Form>
				<Row :gutter="16">
					<Col :lg="5" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="projectNo" placeholder="事项编码"></Input>
						</FormItem>
					</Col>
					<Col :lg="5" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
						</FormItem>
					</Col>
					<Col :lg="5" :xs="12">
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
					<Col span="5">
							<FormItem>
								<Select v-model="checkFlows" placeholder="请选择绑定办件流程状态" @on-change="handleSearch">
									<Option value="01" >已绑定</Option>
									<Option value="02">未绑定</Option>
								</Select>
							</FormItem>
						</Col>
					<Col span="3" style="position:relative;">
							<Button type="ghost" shape="circle" icon="plus" v-show="!display" @click="add" style="position:absolute; top:0; right:15px;">更多条件</Button>
							<Button type="ghost" shape="circle" icon="minus" v-show="display" @click="reduce" style="position:absolute; top:0; right:15px;">收起条件</Button>
					</Col>
				</Row>
				<div v-show="display">
					<Row :gutter="16">
						<Col :lg="5" :xs="12" class="themeBox">
						<FormItem class="input-cursor"  @mouseenter.native='themeTree = true' @mouseleave.native='themeTree = false'>
							<a href="javascript:;" @click="themeTree = !themeTree">
								<Input icon="ios-home" v-model="themeName" placeholder="请选择主题"></Input>
							</a>
							<transition name="fade">
								<Row class="themeSlectContent" v-if='themeTree'>
									<Col span="4" v-for='item in themeTreeData' :key="item.classId"><span @click='themeFun(item.classId,item.className)' :class="{current:item.classId== themeId}">{{item.className}}</span></Col>
								</Row>
							</transition>
						</FormItem>
					</Col>
						
						
					</Row>
				</div>
				<Row>
					<Col span="24">
						<FormItem>
							<Button type="primary" @click="handleSearch">查询</Button>
							<Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
							<Button type="info" @click="bindingFlowMany" style="margin-left:8px;">批量绑定流程</Button>
							<Button type="warning" @click="bindingBoardMany" style="margin-left:8px;">批量绑定分发</Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list" :style="{top:topLength}" style='margin-top:0;' >
			<Table border :columns="Columns" :data="TableList" @on-selection-change="selectChange"></Table>		
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>
		<Modal v-model="modal1"
			title="批量绑定流程"
			@on-ok="selectFlowOk()"
			@on-cancel="selectFlowCancel">
			<Select placeholder="请选择工作流类型" filterable label-in-value clearable ref="selectClear">
                  <template v-for="item in workflowList">
                    <Option :key="item.key" :value="item.key">
                      <div style="width:100%;overflow:hidden;" :title='item.name' @click="workFlowKeyChange(item.key)">{{item.name}}</div>
                    </Option>
                  </template>
            </Select> 
		</Modal>
		
		<Modal v-model="modal2"
			title="批量绑定分发"
			@on-ok="selectBardOk()"
			@on-cancel="selectBardCancel"
			okText="保存"
			width="800">
			<Row>
			    <Col span="12">
					<Form :label-width="130" prop="isDistribute">
						<FormItem label="是否分发:">
							<i-switch v-model="formValidate.isDistribute" size="large">
							<span slot="open">是</span>
							<span slot="close">否</span>
							</i-switch>
						</FormItem>
					</Form>
		       </Col> 
		
		        <Col span="12" v-if="formValidate.isDistribute">
					<Form :label-width="130" prop="legalPersonPath">
						<FormItem label="分发法人办件url:">
							<Input placeholder="分发法人办件url" v-model="formValidate.legalPersonPath"></Input>
						</FormItem>
					</Form>
		        </Col>
		         <Col span="12" v-if="formValidate.isDistribute">
					<Form :label-width="130" prop="naturalPersonPath">
						<FormItem label="分发自然人办件url:">
							<Input placeholder="分发自然人办件url" v-model="formValidate.naturalPersonPath"></Input>
						</FormItem>
					</Form>
		        </Col>
		         <Col span="12" v-if="formValidate.isDistribute">
					<Form :label-width="130" prop="repairPath">
						<FormItem label="分发补齐补正url:">
							<Input placeholder="分发补齐补正url" v-model="formValidate.repairPath"></Input>
						</FormItem>
					</Form>
		        </Col>
	        </Row>
		</Modal>
	</div>
</template>

<script>
	import deptTree from '../../common/deptTree';
	import tree from '../../common/tree';
	export default {
		components: {
			'tree-view': deptTree,
			'Tree': tree,
		},
		data() {
			return {
				topLength: '229px',
				projectId: '',
				projectNo: '',
				P_isDistribute: '',
				//弹框
				deptTree: false,
				themeTree: false,
				display: false,
				//查询区
				projectName: '',
				deptId: '',
				deptName: '',
				themeId: '',
				themeName: '',
				checkFlows: '02',
				//实施机关树数据
				deptTreeData: [],
				//实施机关选中项数据
				deptActiveData: [],
				deptVm: {},
				//用户可操作的部门
				usableDeptIds: [],
				//控制按钮的显示与否
				btnData: [],
				//主题分类树数据
				themeTreeData: [],
				//主题分类选中项数据
				themeActiveData: [],
				modal1:false,
				modal2:false,
				workFlowPath:window.config.workflowUrl,//流程图路径
				//工作流列表
				workflowList:[],
				workFlowKey: '',
				isDistribute: '',
				legalPersonPath: '',
				naturalPersonPath: '',
				repairPath: '',
				formValidate: {
			        isDistribute:'',
			        legalPersonPath:'',
			        naturalPersonPath:'',
			        repairPath:''
			      },
				//表格被选中的行
				tableArr: [],
				projectIds: [],
				//ruleValidate: {
					//workFlowKey: [
					  //{ required: true, message: '请选择工作流类型！', trigger: 'blur' }
					//] 
				//},  isDistribute  legalPersonPath  naturalPersonPath  repairPath
				//列表区
				Columns: [{
                    type: 'selection',
                    width: '5%',
                    align: 'center'
                },  {
					title: '事项编码',
					key: 'projectNo',
					width: '15%'
				}, {
					title: '事项名称',
					key: 'projectName',
					width: '25%'
				}, {
					title: '实施机关',
					key: 'deptName',
					width: '15%'
				}, {
					title: '版本',
					key: 'version',
					width: '4%'
				}, {
					title: '操作',
					key: 'action',
					width: '23%',
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
										this.$router.push({
											path: './flow',
											query: {
												moduleId:this.$route.query.moduleId,
												projectId: params.row.projectId,
												inCurrentPage:this.currentPage,
												
												projectNo:this.projectNo,
												projectName:this.projectName,
												deptId:this.deptId,
												themeActiveData:this.themeActiveData,
												deptName:this.deptName,
												themeId:this.themeId,
												themeName:this.themeName
											}
										})
									}
								}
							}, '登记配置'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									icon: 'ios-download'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											path: './register',
											query: {
												moduleId:this.$route.query.moduleId,
												projectName: params.row.projectName,
												projectNo: params.row.projectNo,
												projectId: params.row.projectId,
												version: params.row.version,
												inCurrentPage:this.currentPage,
												
												projectNosByBack:this.projectNo,
												projectNamesByBack:this.projectName,
												deptId:this.deptId,
												themeActiveData:this.themeActiveData,
												deptName:this.deptName,
												themeId:this.themeId,
												themeName:this.themeName
											}
										})
									}
								}
							}, '流程配置'),
							h('Button', {
								props: {
									type: 'info',
									size: 'small',
									icon: 'ios-download'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											path: './pay',
											query: {
												moduleId:this.$route.query.moduleId,
												projectId: params.row.projectId,
												inCurrentPage:this.currentPage,
												projectNo:this.projectNo,
												projectName:this.projectName,
												deptId:this.deptId,
												themeActiveData:this.themeActiveData,
												deptName:this.deptName,
												themeId:this.themeId,
												themeName:this.themeName
											}
										})
									}
								}
							}, '收费配置')
						]);
					}
				}],
				TableList: [],
				//分页
				queryData: Object.assign({}, this.$route.query),
				total: 0,
				currentPage: 1,
				pageSize: 10
			}
		},
		created() {
	    this.deptName=this.$route.query.deptName;
			this.projectNo=this.$route.query.projectNo;
			this.projectName=this.$route.query.projectName;
			this.deptId=this.$route.query.deptId;
			this.themeActiveData=this.$route.query.themeActiveData;
			this.themeId=this.$route.query.themeId;
			this.themeName=this.$route.query.themeName;			
			//根据当前菜单的moduleId获取实施机关树数据
			axios.post("/cgaPermission/getButtonPermissionData.do", {moduleId: this.$route.query.moduleId})
			.then(data => {
				//按钮权限的控制
				if(data.obj){
					this.btnData = data.obj.map(item => item.optCode);
				}
			})
			axios.post("/cgaPermission/getUsableDeptIds.do", {moduleId: this.$route.query.moduleId})
			.then(data => {
				//当前用户可操作的部门数据
			 	this.usableDeptIds = data.obj || [];
			})
			//将实施机关树的顶级目录传进去用于分发事件
			this.deptVm = this;
			this.$on('handleCallback', item => {
				this.deptActiveData = [item.deptId];
				this.deptId = item.deptId;
				this.deptName = item.deptName;
			});

			//查询主题节点下全部分类列表
			axios.post("/cgaProject/queryThemeClassList.do")
				.then(data => {
					//主题分类树
					this.themeTreeData = data.obj;
				});
           //this.handleSearch();
			//列表及分页
			this.getList();
			this.$watch('$route.fullPath', this.getList);
			// this.handleSearch();
			// this.$watch('$route.fullPath', this.handleSearch);
		},
		methods: {
			handleDept(){
				this.deptTree = true;
				this.deptTreeData = this.$store.state.deptTreeData;
				this.deptActiveData = [];
				this.deptId = '';
				this.deptName = '';
			},
			cancelDept() {
				this.deptActiveData = [];
				this.deptId = '';
				this.deptName = '';
			},
			themeFun(id, name) {
				this.themeId = id;
				this.themeName = name;
				this.themeTree = false;
			},
			//获取Table表格数据
			getList() {
				this.$set(this.queryData,"checkFlows",this.checkFlows)
				axios.post("/cgaProject/queryCgaProjectList.do", this.queryData)
					.then(data => {
						this.TableList = data.obj.records || [];
						this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPage = parseInt(this.$route.query.currentPage) || 1;
						this.pageSize = parseInt(this.$route.query.pageSize) || 10;
					});
			},
			pageChange(data) {
				this.currentPage = data;
				Object.assign(this.queryData, {
					currentPage: data
				});
				this.refreshRouter();
			},
			pageSizeChange(data) {
				this.pageSize = data;
				Object.assign(this.queryData, {
					pageSize: data
				});
				this.refreshRouter();
			},
			refreshRouter() {
				//更新路由
				this.$router.push(this.$route.path + '?' + util.serialize(this.queryData));
			},
			//键盘触发事件
			keyenter(ev) {
				//回车即查询
				if(ev.keyCode === 13) {
					this.handleSearch()
				}
			},
			//根据查询条件获取列表数据
			handleSearch() {
				Object.assign(this.queryData, {
					moduleId: this.$route.query.moduleId,
					currentPage: 1,
					projectName: this.projectName,
					deptId: this.deptId,
					themeId: this.themeId,
					projectNo: this.projectNo,
					projectId: '',
					checkFlows: this.checkFlows,
				});
				this.refreshRouter();
			},
			//查询条件控制
				add() {
					this.display = true;
					this.topLength = '289px';
				},
				reduce() {
					this.display = false;

				this.topLength = '229px';
				},
			//重置按钮
			handleReset() {
				this.projectName = '';
				this.deptId = '';
				this.deptName = '';
				this.themeId = '';
				this.themeName = '';
				this.projectNo = '';
				this.projectId = '',
				this.checkFlows = '02',
					Object.assign(this.queryData, {
						currentPage: 1,
						pageSize: 10,
						moduleId: this.$route.query.moduleId,
						deptId: '',
						projectName: '',
						projectNo: '',
						themeId: '',
						projectId: '',
						checkFlows: '02',
					});
				this.refreshRouter();
			},
			selectChange(selection){
				this.tableArr = selection.map(item => item.projectId); 
			},
			//批量绑定工作流
			bindingFlowMany(){
				if(this.tableArr ==null ||this.tableArr.length==0){
					this.$Message.error({
					  duration: 6,
					  content: '请至少选择一条事项进行操作'
					});
					return false;
				}				
				axios.post("/cgaSupportWorkflow/queryWorkFlowInfo.do")
					.then(data=>{
					this.workflowList = data.obj;
				});									
				if(this.workflowList == null){
					this.$Modal.info({
                        title: '信息',
                        content: '该网站应用程序还未配置任何工作流类型！'
                    });
					return false;
				}else{
					this.$refs.selectClear.clearSingleSelect();
					this.modal1=true;
				}	
			},
			//批量绑定事项配置
			bindingBoardMany(){
				this.formValidate.isDistribute= false;
				if(this.tableArr ==null ||this.tableArr.length==0){
					this.$Message.error({
					  duration: 6,
					  content: '请至少选择一条事项进行操作'
					});
					return false;
				}				
				this.modal2=true;
			},
			workFlowKeyChange(key){
			  this.workFlowKey = key;
			},
			selectBardOk(){
					this.P_isDistribute = this.formValidate.isDistribute;
				  	if (this.P_isDistribute ==true) {
				  	  this.P_isDistribute=0;
				  	} else{
				  		this.P_isDistribute=1;
				  	}
				axios.post("/cgaProjectControl/updateManyCgaProjectByKey.do",{isDistribute:this.P_isDistribute,legalPersonPath:this.formValidate.legalPersonPath,naturalPersonPath:this.formValidate.naturalPersonPath,repairPath:this.formValidate.repairPath,projectIds:this.tableArr.join()})
					.then(data=>{
						this.$Message.success('批量绑定成功！');
						this.tableArr = [];
						this.getList();
						this.$watch('$route.fullPath', this.getList);
					})							
            },
			
			selectFlowOk(){
				alert(this.workFlowKey);
				if (this.workFlowKey != null && this.workFlowKey !="") {
					axios.post("/cgaProjectControl/updateManyCgaProjectByKey.do",{workFlowKey:this.workFlowKey,projectIds:this.tableArr.join()})
					.then(data=>{
						this.$Message.success('批量绑定成功！');
						this.tableArr = [];
						this.getList();
						this.$watch('$route.fullPath', this.getList);
					})							
				}else{
					this.$Message.error({
					  duration: 6,
					  content: '请选择工作流类型！'
					});					
				}	
            },
            selectBardCancel(){

			   this.getList();
			   this.$watch('$route.fullPath', this.getList);
			   this.tableArr = [];
			   this.formValidate.isDistribute=false;
			   this.formValidate.legalPersonPath="";
			   this.formValidate.naturalPersonPath="";
			   this.formValidate.repairPath="";
			   this.isDistribute="1";
			   this.legalPersonPath="";
			   this.naturalPersonPath="";
			   this.repairPath="";
               this.modal2=false; 
            },
            selectFlowCancel(){
			   this.getList();
			   this.$watch('$route.fullPath', this.getList);
			   this.tableArr = [];
			   this.workFlowKey="";
               this.modal1=false; 
            }
		}
	}
</script>

<style lang="scss">
	.ivu-modal-body{
		padding: 16px 35px !important;
	}
	.input-cursor .ivu-input {
		cursor: pointer;
	}
	
	.themeBox {
		.themeSlectContent {
			position: fixed;
			left: 18%;
			right: 15px;
			top:147px;
			z-index: 999;
			background: #fff;
			overflow: hidden;
			border: solid 1px #bed9ee;
			span {
				display: inline-block;
				cursor: pointer;
				height: 35px;
				padding-left: 5px;
				line-height: 35px;
				color: #2697ff;
				&.current {
					color: red;
					font-weight: bold;
				}
			}
		}
	}
	
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity .5s
	}
	
	.fade-enter,
	.fade-leave-to {
		opacity: 0
	}
</style>