<template>
	<div class="layout-content">
		<div class="layout-list" style='top:104px;padding-top:10px;'>
			<Form>
				<Row :gutter="16">
					<Col span="6">
						<Form>
							<Row :gutter="16">
								<Col span="12">
									<FormItem class="input-cursor">
										<a href="javascript:;" @click="handleDept">
											<Input icon="ios-home" v-model="deptName1" placeholder="实施机关"></Input>
										</a>
									</FormItem>
									<Modal
										v-model="deptTree1"
										title="实施机关"
										width="500"
										class-name="ivu-modal-style ivu-modal-absolute-500"
										:mask-closable="false"
										@on-cancel="cancelDept">
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
										<Input v-model="projectName" v-on:on-enter='handleSearchOther()' placeholder="事项名称"></Input>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col span="18">
									<Row :gutter="16">
										<FormItem>
											<Button type="primary" style="margin-left:8px;" @click="handleSearchOther()">查询</Button>
											<Button type="ghost" @click="handleResetOther()" style="margin-left: 8px">重置</Button>
										</FormItem>
									</Row>
								</Col>
							</Row>
						</Form>
						<div>
							<Table border :columns="columns" id='tableid' :data="dataList" @on-row-click="seleClickRow" @on-select="selectFu"></Table>
							<Page :total="total1" :current="currentPageOther" :page-size="pageSizeOther" show-total show-elevator @on-change="pageChange1" @on-page-size-change="pageSizeChange1"></Page>
						</div>
					</Col>
					<Col span="17" offset="1">
						<Form>
							<Row :gutter="16">
								   <Col span="6">
									<FormItem>
										<Input v-on:on-enter='handleSearch()' v-model="caseId" placeholder="办件流水号"></Input>
									</FormItem>
									</Col>
									<Col span="6">
									<FormItem>
										<Input   v-on:on-enter='handleSearch()' v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
									</FormItem>
									</Col>
									<Col span="6">
									<FormItem>
										<Input v-on:on-enter='handleSearch()' v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
									</FormItem>
									</Col>

									<Col span="4" style="position:relative;">
									<Button type="ghost" shape="circle" icon="plus" v-show="!display" @click="add" style="position:absolute; top:0; right:15px;">更多条件</Button>
									<Button type="ghost" shape="circle" icon="minus" v-show="display" @click="reduce" style="position:absolute; top:0; right:15px;">收起条件</Button>
									</Col>
							</Row>
							<div v-show="display">
										<Row :gutter="16">
											<Col span="6">
											<FormItem>
												<Select v-model="caseState" placeholder="请选择办件状态">
													<Option value="15">办理中</Option>
													<Option value="04">补正中</Option>
													<Option value="09">已办结</Option>
													<Option value="12">不予受理</Option>
													<Option value="13">不予办理</Option>
												</Select>
											</FormItem>
											</Col>
											<Col span="6">
											<FormItem>
												<Date-picker type="date" :value="startTime" format="yyyy-MM-dd" placeholder="选择开始日期" v-model="startTime" @on-change="handleChangeStart"></Date-picker>
											</FormItem>
											</Col>

											<Col span="6">
											<FormItem>
												<Date-picker type="date" :value="endTime" format="yyyy-MM-dd" placeholder="选择结束日期" v-model="endTime" @on-change="handleChangeEnd"></Date-picker>
											</FormItem>
											</Col>
										<!--	<Col span="6">
											<FormItem>
												<Input v-on:on-enter='handleSearch()' v-model="ename" placeholder="企业名称"></Input>
											</FormItem>
											</Col>-->
										</Row>
				       </div>

							<Row>
								<Col span="18">
									<Row :gutter="16">
										<FormItem>
											<Button type="primary" style="margin-left:8px;" @click="handleSearch()">查询</Button>
											<Button type="ghost" @click="handleReset()" style="margin-left: 8px">重置</Button>
										</FormItem>
									</Row>
								</Col>
							</Row>



						</Form>
						<div>
							<Table border :columns="ColumnsOther" :data="dataOther"></Table>
							<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
						</div>
					</Col>
				</Row>
			</Form>
		</div>
	</div>
</template>



<script>
	var datautil = require('../../../assets/js/date.js');
	import deptTree from './deptTree';
	require('../../../assets/js/jquery.min.js');

	export default {
		components: {
			'tree-view': deptTree,
		},
		data() {
			return {
				//-----------------------------------------------------------
				//弹窗
                applySourceName:null,
				deptTree: false,
				projectName: '',
				userName: '',
				deptId: '',
				deptName: '',
				ename:'',
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

				//checkIndexOf:1,
				checkIndexOf: this.$route.query.checkIndexOf || 1,
				//查询参数定义区
				projectName: this.$route.query.projectName,
				caseName:'',
				caseId: '',
				cardNumber: '',
				relatedPersonName: '',
				caseState: '',
				startTime: '',
				endTime: '',
				deptId: '',
				loadingModal: false, //loading框
				topLength: '229px',
				show: true,
				display: false,
				columns: [ {
					title: '事项名称',
					key: 'projectName',
					width: '30%'


				}, {
					title: '实施机关',
					key: 'deptName',
					width: '25%'
				}],

				ColumnsOther: [{
					title: '办件流水号',
					key: 'caseId',
					width: '10%'
				}, {
					title: '项目名称',
					key: 'caseName',
					width: '16%'
				}, {
					title: '申请人 / 经办人',
					key: 'relatedPersonName',
					width: '8%'
				}, {
          title:'企业名称',
          key:'ename',
          width:'10%'
        },{
					title: '联系电话',
					key: 'mobile',
					width: '10%'
				}, {
					title: '证件号 / 统一社会信用代码',
					key: 'cardNumber',
					width: '15%'
				}, {
					title: '登记时间',
					key: 'registerTime',
					width: '12%'
				}, {
					title: '办理状态',
					key: 'caseStateName',
					width: '6%'
				}, {
					title: '操作',
					key: 'action',
					width: '7%',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									size: 'small',
									icon: 'search'
								},
								on: {
									click: () => {
										this.isRouter(params.row);
									}
								}
							}, '查看')
						]);
					}
				}

				],
				resets1: '',
				rowsName: '',
				foruserId: '',
				install: '',
				rowsIn: this.$route.query.rowsIn,
				dataList: [],
				dataOther: [],
				//分页
				queryData: Object.assign({}, this.$route.query),
				queryData1: Object.assign({}, this.$route.query),
				total: 0,
				currentPage: this.$route.query.currentPage || 1,
				pageSize: 10,

				total1: 0,
				currentPageOther: 1,
				pageSizeOther: 10
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
			this.getProjectList();

			if(this.checkIndexOf==1){
				this.getCaseIndexOfList();
			}else{
				this.getCaseList();

			}

			  /*this.getCaseList();
				this.$watch('$route.fullPath', this.getCaseList);*/
			 this.$watch('$route.fullPath', this.getProjectList);
             //this.$watch('$route.fullPath', this.getCaseIndexOfList);
		},
		methods: {
			handleDept(){
				 this.deptTree1 = true;
				 this.deptTreeData = this.$store.state.deptTreeData;
			},
			//开始日期
			handleChangeStart(data) {
				if(this.endTime != '' && Date.parse(data) > Date.parse(this.endTime)){
					this.$Message.error({
	          content: '开始时间不能大于结束时间',
	          duration: 4
	        });
	        this.startTime = "";
	        return false;
				}else{
					this.startTime = data;
				}
			},
			//结束日期
			handleChangeEnd(data) {
				if(this.startTime != '' && Date.parse(data) < Date.parse(this.startTime)){
					this.$Message.error({
	          content: '结束时间不能小于开始时间',
	          duration: 4
	        });
	        this.endTime = "";
	        return false;
				}else{
					this.endTime = data;
				}
			},
			add() {
				this.display = true;
				this.topLength = '289px';
			},
			reduce() {
				this.display = false;

				this.topLength = '229px';
			},
			cancelDept() {
				    this.deptId = '',
					this.deptName = ''
			},
			//获取Table表格数据
			getProjectList() {
				axios.post("/cgaCase/queryAllProjectByPage.do", {
						currentPage: this.$route.query.currentPageOther,
						pageSize: this.$route.query.pageSizeOther,
						projectName: this.projectName,
						deptId: this.deptId1
					})
					.then(data => {
						this.dataList = data.obj.records;
						this.total1 = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPageOther = parseInt(this.$route.query.currentPageOther) || 1;
						this.pageSizeOther = parseInt(this.$route.query.pageSizeOther) || 10;
					});
					this.loadingModal = true;
			},

			getCaseIndexOfList() {

			axios.post("/cgaCase/queryAllCaseInfoByPage.do", {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						caseId: this.caseId,
						cardNumber: this.cardNumber,
						relatedPersonName: this.relatedPersonName,
						caseState: this.caseState,
						startTime: this.startTime,
						endTime: this.endTime,
						deptId: this.deptId,
						ename:this.ename
					})
					.then(data => {
						this.dataOther = data.obj.records;
						this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPage = this.currentPage || 1;
						this.pageSize = this.pageSize || 10;
					});
			},
			getCaseList() {
				this.checkIndexOf=2;

				axios.post("/cgaCase/queryProjectCaseInfoByPage.do", {
						currentPage: this.currentPage,
						pageSize: this.pageSize,
						caseId: this.caseId,
						cardNumber: this.cardNumber,
						relatedPersonName: this.relatedPersonName,
						caseState: this.caseState,
						startTime: this.startTime,
						endTime: this.endTime,
						deptId: this.deptId,
						projectNo: this.rowsIn,
						ename:this.ename
					})
					.then(data => {
						this.dataOther = data.obj.records;
						this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPage = this.currentPage || 1;
						this.pageSize = this.pageSize || 10;
					});
			},
			selectFu(selection, row) {},
			seleClickRow(row, index) {
				$('#tableid tr td').removeClass('tdbg');
				$('#tableid tr').eq(index + 1).find('td').addClass('tdbg');
				this.rowsIn = row.projectNo;
				//this.rowsName = row.userName;
				this.indexTable = index;
				this.currentPage=1,
				this.pageSize=10,

				this.getCaseList();
			},
			pageChange(data) {

				this.currentPage = data;
                  if(this.checkIndexOf==2){
                  	this.getCaseList();
                  }else{
                  	this.getCaseIndexOfList();

                  }
			},
			pageSizeChange(data) {

				this.pageSize = data;
				 if(this.checkIndexOf==2){
                  	this.getCaseList();
                  }else{
                  	this.getCaseIndexOfList();
                  }
				//this.refreshRouter();
			},
			pageChange1(data) {
				this.currentPageOther = data;
				Object.assign(this.queryData, {
					currentPageOther: data
				});

				this.refreshRouter();
			},
			pageSizeChange1(data) {
				this.pageSizeOther = data;
				Object.assign(this.queryData, {
					pageSizeOther: data
				});
				//debugger;
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
			isRouter(row) {

        		//初始化办件流水号
				this.$router.push({
					path: './detail/index',
					query: {
						cardNumber: row.cardNumber,
						moduleId: this.$route.query.moduleId,
						projectId: row.projectId,
						caseId: row.caseId,
						projectNo: row.projectNo,
						inCurrentPage:this.currentPage,
						checkIndexOf:this.checkIndexOf,
						projectNo: row.projectNo,
						projectNameIndex: row.projectName,
						currentPageOther:this.currentPageOther,
						applySourceName:row.applySourceName=="电子数据交换"?'true':'false'
					}
				});



			},

			//根据查询条件获取列表数据
			handleSearch() {
				if(this.startTime != '') {
					var date1 = new Date(this.startTime);
					this.startTime = datautil.formatDate(date1, 'yyyy-MM-dd');
				}
				if(this.endTime != '') {
					var date2 = new Date(this.endTime);
					this.endTime = datautil.formatDate(date2, 'yyyy-MM-dd');
				} else {
					//this.endTime = datautil.formatDate(new Date(((new Date()) / 1000 + 86400) * 1000), 'yyyy-MM-dd');

				}
				this.currentPage= 1;

			   if (this.rowsIn !=null && this.rowsIn !='' ) {
							this.getCaseList();
						} else{
							this.getCaseIndexOfList();
						}

			},
			//重置按钮
			handleReset() {
				this.caseId='';
			    this.cardNumber='';
				this.relatedPersonName='';
				this.caseState='';
				this.startTime='';
				this.endTime='';
				if (this.rowsIn !=null && this.rowsIn !='' ) {
					this.getCaseList();
				} else{
					this.getCaseIndexOfList();
				}
			},
			//根据查询条件获取列表数据
			handleSearchOther() {
				Object.assign(this.queryData, {
					currentPageOther: 1,
					moduleId: this.$route.query.moduleId,
					projectName: this.projectName,
					deptId1: this.deptId1
				});

				this.getProjectList();
				this.refreshRouter();
			},

			handleResetOther() {
				this.resets1 = 1;
				this.projectName = '';
				this.deptId1 = '';
				this.deptName1 = '';
				this.deptActiveData1=[];
				this.dataOther=[];
				Object.assign(this.queryData, {
					currentPageOther: 1,
					pageSizeOther: 10,
					deptId1: '',
					userName: ''
				});
				this.getProjectList();
				this.getCaseIndexOfList();
				this.refreshRouter();

			},

		}

	}
</script>

<style>
	.tdbg {
		background: #eaf4fe !important;
	}
</style>
