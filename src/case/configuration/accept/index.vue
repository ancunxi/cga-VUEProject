<template>
	<div class="layout-content">
		<div class="layout-list" style='top:104px;padding-top:10px;'>
			<Form>
				<Row :gutter="16">
					<Col span="8">
						<Form>
							<Row :gutter="16">
								<Col span="12">
									<FormItem class="input-cursor">
										<a href="javascript:;" @click="deptTree1 = true">
											<Input icon="ios-home" v-model="deptName1" placeholder="请选择部门"></Input>
										</a>
									</FormItem>
									<Modal 
										v-model="deptTree1" 
										title="请选择部门" 
										width="500" 
										class-name="ivu-modal-style ivu-modal-absolute-500" 
										:mask-closable="false"
										@on-cancel="cancelDept1">
										<Row>
											<Col span="24">
												<template>
													<tree-view :treedata="deptTreeData" :usabledeptids='usableDeptIds' :activedata="deptActiveData1" :vm="deptVm"></tree-view>
												</template>
											</Col>
										</Row>
									</Modal>
								</Col>
								<Col span="12">
									<FormItem>
										<Input v-model="userName" v-on:on-enter='handleSearch1()' placeholder="请输入用户姓名"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="18">
									<Row :gutter="16">
										<FormItem>
											<Button type="primary" style="margin-left:8px;" @click="handleSearch1()">查询</Button>
											<Button type="ghost" @click="handleReset1()" style="margin-left: 8px;">重置</Button>
											<Button type="success" @click="copyUserProjects()" style="margin-left: 8px;">复制人员事项</Button>
										</FormItem>
									</Row>
								</Col>
							</Row>
						</Form>
						<div>
							<Table border :columns="columns" id='tableid' :data="dataList" @on-row-click="seleClickRow" @on-select="selectFu"></Table>
							<Page :total="total1" :current="currentPage1" :page-size="pageSize1" show-total show-elevator @on-change="pageChange1" @on-page-size-change="pageSizeChange1"></Page>
						</div>
					</Col>
					<Col span="15" offset="1">
						<Form>
							<Row :gutter="16">
								<Col span="8">
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
													<treeview :treedata="deptTreeData" :usabledeptids='usableDeptIds' :activedata="deptActiveData" :vm="deptVm"></treeview>
												</template>
											</Col>
										</Row>
									</Modal>
								</Col>
								<Col span="8">
									<FormItem>
										<Input v-model="projectName" v-on:on-enter='handleSearch()' placeholder="请输入事项名称"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="18">
									<Row :gutter="16">
										<FormItem>
											<Button type="primary" style="margin-left:8px;" @click="handleSearch()">查询</Button>
											<Button type="ghost" @click="handleReset()" style="margin-left: 8px;">重置</Button>
											<Button type="success" @click="batchAdd()" style="margin-left: 8px;">添加</Button>
											<Button type="error" @click="deleteBatch()" style="margin-left: 8px;">批量删除</Button>
											<Button type="warning" @click="acceptConfigByPerson()" style="margin-left: 8px;">全部删除</Button>
										</FormItem>
									</Row>
								</Col>
							</Row>
						</Form>
						<div>
							<Table border :columns="ColumnsOther" :data="dataOther"  @on-selection-change="selectChange" ></Table>
							<Page :page-size-opts="pageSizeOpts" :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange"  @on-page-size-change="pageSizeChange"></Page>
						</div>
					</Col>
				</Row>
			</Form>
		</div>
	</div>
</template>

<script>
	import deptTree from './deptTree';
	import tree from './tree';
	require('../../../assets/js/jquery.min.js');
	export default {
		components: {
			'tree-view': deptTree,
			'treeview': tree,
		},
		data() {
			return {
				//-----------------------------------------------------------
				//弹窗
                projectNoArr: [],
				deptTree: false,
				projectName: '',
				userName: '',
				deptId: '',
				deptName: '',
				//实施机关树数据
				deptTreeData: [],
				//实施机关选中项数据
				deptActiveData: [],
				deptVm: {},
				//用户可操作的部门
				usableDeptIds: [],
				///-----------------------------------------------------------
				//-----------------------------------------------------------
				//弹窗
				deptTree1: false,
				projectName1: '',
				deptId1: '',
				deptName1: '',
				//实施机关选中项数据
				deptActiveData1: [],

				///-----------------------------------------------------------
				projectNo: '',
				indexTable: '',
				columns: [{
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
				}],

				ColumnsOther: [
				{
                    type: 'selection',
                    width: '5%',
                    align: 'center'
                },{
					title: '事项编码',
					key: 'projectNo',
					width: '20%'
				}, {
					title: '事项名称',
					key: 'projectName',
					width: '20%'
				}, {
					title: '实施机关',
					key: 'deptName',
					width: '25%'
				}, {
					title: '操作',
					key: 'action',
					width: '10%',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'error',
									size: 'small',
									icon: 'trash-b'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
									  var _this = 	this;
										this.$Modal.confirm({
											title: '温馨提示',
											content: '是否确定删除该信息',
											okText:'是',
											cancelText:'否',
											onOk: () => {
											_this.projectNoArr =	params.row.projectNo;
												axios.post("/cgaCaseAcceptConfig/delete.do", {
													projectNoArray: _this.projectNoArr,
													userId: this.rowsIn
												})
												.then(data => {
													this.getInAcceptConfigList();
													this.$watch('$route.fullPath', this.getInAcceptConfigList);
													this.$Message.success('删除成功！');
													_this.projectNoArr="";
												});
											},
											onCancel: () => {
													this.getInAcceptConfigList();
													this.$watch('$route.fullPath', this.getInAcceptConfigList);
													this.$Message.info('返回页面！');
													_this.projectNoArr="";
											},
										});
									}
								}
							}, '移除')
						]);
					}
				}],
				resets1: '',
				rowsName: '',
				foruserId: '',
				install: '',
				rowsIn: '',
				dataList: [],
				dataOther: [],
				//分页  
				queryData: Object.assign({}, this.$route.query),
				queryData1: Object.assign({}, this.$route.query),
				pageSizeOpts:[10,50,100],
				
				total: 0,
				currentPage: 1,
				pageSize: 10,

				total1: 0,
				currentPage1: 1,
				pageSize1: 10
			}
		},
		created() {
			//-----------------------------------------------------------
			//根据当前菜单的moduleId获取实施机关树数据
			// axios.post("/cgaPermission/queryPermissionInfoByParams.do", {
			// 		moduleId: this.$route.query.moduleId
			// 	})
			// 	.then(data => {
			// 		//实施机关部门树
			// 		this.deptTreeData = data.obj.allDeptTreeData;
			// 		//当前用户可操作的部门数据
			// 		this.usableDeptIds = data.obj.usableDeptIds || [];
			// 		//按钮权限的控制
			// 		this.btnData = data.obj.buttonPermissionData.map(item => item.optCode);
			// 	});

			// axios.post("/sys/sysDept/queryDeptTreeList.do")
			// .then(data => {
			// 	//实施机关部门树
			// 	this.deptTreeData = data.obj;
			// })
			axios.post("/cgaPermission/getButtonPermissionData.do", {moduleId: this.$route.query.moduleId})
			.then(data => {
				//按钮权限的控制
				this.btnData = data.obj.map(item => item.optCode);
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
			this.$on('handleCallback1', item => {
				this.deptActiveData1 = [item.deptId];
				this.deptId1 = item.deptId;
				this.deptName1 = item.deptName;
			});
			//列表及分页
			this.getList();
			this.$watch('$route.fullPath', this.getInAcceptConfigList);
			this.$watch('$route.fullPath', this.getList);
		},
		methods: {
			handleDept1(){
				this.deptTree1 = true;
				this.deptActiveData1 = [];
				this.deptId1 = '';
				this.deptName1 = '';
			},
			handleDept() {
				this.deptTree = true;
				this.deptTreeData = this.$store.state.deptTreeData;
				this.deptActiveData = [];
		    this.deptId = '';
				this.deptName = '';
			},
			cancelDept1(){
				this.deptActiveData1 = [];
				this.deptId1 = '';
				this.deptName1 = '';
			},
			cancelDept() {
				this.deptActiveData = [];
		    this.deptId = '';
				this.deptName = '';
			},
			//获取Table表格数据 
			getList() {
				if(this.resets1 == null || this.resets1.length == 0) {
					if(this.userName.length == "0") {
						if(this.$route.query.rowsName != null) {
							this.userName = this.$route.query.rowsName;
						}
					}
				}
				axios.post("/cgaCaseAcceptConfig/queryUserByPage.do", {
					currentPage: this.$route.query.currentPage1,
					pageSize: this.$route.query.pageSize1,
					userName: this.userName,
					deptId: this.deptId1
				})
				.then(data => {
					this.dataList = data.obj.records;
					this.total1 = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
					this.currentPage1 = parseInt(this.$route.query.currentPage1) || 1;
					this.pageSize1 = parseInt(this.$route.query.pageSize1) || 10;
				});
			},
			selectChange(selection){
				this.projectNoArr = selection.map(item => item.projectNo); 

			},
			getInAcceptConfigList() {
				this.dataOther = [];
				if(this.rowsIn == null || this.rowsIn.length == 0) {
					if(this.$route.query.foruserId != null) {
						this.rowsIn = this.$route.query.foruserId;
					}
				}
				axios.post("/cgaCaseAcceptConfig/queryInAcceptConfigByPage.do", {
					currentPage: this.$route.query.currentPage,
					pageSize: this.$route.query.pageSize,
					projectName: this.projectName,
					userId: this.rowsIn,
					deptId: this.deptId
				})
				.then(data => {
					this.dataOther = data.obj.records;
					this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
					this.currentPage = parseInt(this.$route.query.currentPage) || 1;
					this.pageSize = parseInt(this.$route.query.pageSize) || 10;
				});
				
			},
			selectFu(selection, row) {},
			seleClickRow(row, index) {
				$('#tableid tr td').removeClass('tdbg');
				$('#tableid tr').eq(index + 1).find('td').addClass('tdbg');
				this.rowsIn = row.userId;
				this.rowsName = row.userName;
				this.indexTable = index;
				this.getInAcceptConfigList();
			},
            copyUserProjects() {
				if(this.rowsIn == null || this.rowsIn.trim().length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户'
					});
					return false;
				} else {
					var arr = new Array();
					this.install = arr.push(this.rowsIn);
					this.$router.push({
						path: './personProjects',
						query: {
							moduleId:this.$route.query.moduleId,
							userId: this.rowsIn,
							rowsName: this.rowsName
						}
					})
				}
			},
			batchAdd() {
				if(this.rowsIn == null || this.rowsIn.trim().length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户'
					});
					return false;
				} else {
					var arr = new Array();
					this.install = arr.push(this.rowsIn);
					this.$router.push({
						path: './add',
						query: {
							moduleId:this.$route.query.moduleId,
							userId: this.rowsIn,
							rowsName: this.rowsName
						}
					})
				}
			},
			
			deleteBatch() {
				
				if(this.rowsIn == null || this.rowsIn.trim().length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户'
					});
					return false;
				}else if(this.projectNoArr == null || this.projectNoArr.length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请勾选右侧需删除的事项！'
					});
					return false;
				} else {
					   this.$Modal.confirm({
							title: '温馨提示',
							content: '是否删除勾选的事项？',
							okText:'是',
							cancelText:'否',
							onOk: () => {
								axios.post("/cgaCaseAcceptConfig/deleteBitchAcceptConfig.do", {
									projectNoArray:this.projectNoArr.join(),
									userId: this.rowsIn
								})
								.then(data => {
									this.getInAcceptConfigList();
									this.$watch('$route.fullPath', this.getInAcceptConfigList);
									this.$Message.success('删除成功！');
								});
							},
							onCancel: () => {
								    this.getInAcceptConfigList();
								  	this.$watch('$route.fullPath', this.getInAcceptConfigList);
									this.$Message.info('返回页面！');
							}
						});
				}
			},
			acceptConfigByPerson() {
				if(this.rowsIn == null || this.rowsIn.trim().length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户！'
					});
					return false;
				 }else {
					   this.$Modal.confirm({
							title: '温馨提示',
							content: '是否清空该人员的所有事项？',
							okText:'是',
							cancelText:'否',
							onOk: () => {
								axios.post("/cgaCaseAcceptConfig/deleteBitchAcceptConfig.do", {
									userId: this.rowsIn
								})
								.then(data => {
									this.getInAcceptConfigList();
									this.$watch('$route.fullPath', this.getInAcceptConfigList);
									this.$Message.success('删除人员事项成功！');
								});
							},
							onCancel: () => {
								    this.getInAcceptConfigList();
								  	this.$watch('$route.fullPath', this.getInAcceptConfigList);
									this.$Message.info('返回页面！');
							}
						});
				}
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
			pageChange1(data) {
				this.currentPage1 = data;
				Object.assign(this.queryData, {
					currentPage1: data
				});
				this.refreshRouter();
			},
			pageSizeChange1(data) {
				this.pageSize1 = data;
				Object.assign(this.queryData, {
					pageSize1: data
				});
				this.refreshRouter();
			},
			refreshRouter() {
				//更新路由
				this.$router.push(this.$route.path + '?' + util.serialize(this.queryData));
			},
			refreshRouter1() {
				//更新路由
				this.$router.push(this.$route.path + '?' + util.serialize(this.queryData1));
			},
			//键盘触发事件1
			keyenter1(ev) {
				//回车即查询
				if(ev.keyCode === 13) {
					this.handleSearch1()
				}
			},
			//键盘触发事件2
			keyenter2(ev) {
				//回车即查询
				if(ev.keyCode === 13) {
					this.handleSearch()
				}
			},
			//根据查询条件获取列表数据
			handleSearch() {
				if(this.rowsIn == null || this.rowsIn.length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户'
					});
					return false;
				} else {
					Object.assign(this.queryData, {
						currentPage: 1,
						moduleId: this.$route.query.moduleId,
						projectName: this.projectName,
						deptId: this.deptId
					});
					this.getInAcceptConfigList();
				}
			},
			
			//根据查询条件获取列表数据
			handleSearch1() {
				Object.assign(this.queryData, {
					currentPage1: 1,
					moduleId: this.$route.query.moduleId,
					userName: this.userName,
					deptId1: this.deptId1
				});
				this.refreshRouter();
			},

			handleReset1() {
				this.resets1 = 1;
				this.userName = '';
				this.deptId1 = '';
				this.deptName1 = '';
				this.deptActiveData1=[];
				Object.assign(this.queryData, {
					currentPage1: 1,
					pageSize1: 10,
					deptId1: '',
					userName: ''
				});
				this.refreshRouter();
			},
			//重置按钮
			handleReset() {
				if(this.rowsIn == null || this.rowsIn.length == 0) {
					this.$Message.error({
						duration: 6,
						content: '请点击左侧一条用户'
					});
					return false;
				} else {
					this.projectName = '';
					this.deptId = '';
					this.deptName = '';
					this.deptActiveData=[];
					this.getInAcceptConfigList();
				}
			},
		}
	}
</script>

<style lang="scss">
	.tdbg {
		background: #eaf4fe!important;
	}
</style>