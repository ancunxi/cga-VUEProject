<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="caseId" placeholder="办件流水号"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
					</FormItem>
					</Col>

					<Col span="4" style="position:relative;">
					<Button type="ghost" shape="circle" icon="plus" v-show="!display" @click="add" style="position:absolute; top:0; right:15px;">更多条件</Button>
					<Button type="ghost" shape="circle" icon="minus" v-show="display" @click="reduce" style="position:absolute; top:0; right:15px;">收起条件</Button>
					</Col>

				</Row>

				<div v-show="display">
					<Row :gutter="16">
						<Col span="5">
						<FormItem>
							<Select v-model="caseState" placeholder="请选择办件状态">
								<Option value="15">办理中</Option>
								<Option value="04">补正中</Option>
								<Option value="09">已办结</Option>
								<Option value="12">不予办理</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="5">
						<FormItem>
							<Date-picker type="date" :value="startTime" format="yyyy-MM-dd" placeholder="选择开始日期" v-model="startTime" @on-change="handleChangeStart"></Date-picker>
						</FormItem>
						</Col>
						<Col span="5">
						<FormItem>
							<Date-picker type="date" :value="endTime" format="yyyy-MM-dd" placeholder="选择结束日期" v-model="endTime" @on-change="handleChangeEnd"></Date-picker>
						</FormItem>
						</Col>
						<Col span="5">
						<FormItem class="input-cursor">
							<a href="javascript:;" @click="handleDept">
								<Input icon="ios-home" v-model="deptName" placeholder="请选择实施机关"></Input>
							</a>
						</FormItem>
						<Modal
							v-model="deptTree"
							title="请选择实施机关"
							width="500"
							class-name="ivu-modal-style"
							:mask-closable="false"
							@on-cancel="cancelDept">
							<Row>
								<Col span="24">
									<template>
										<tree-view :treedata="deptTreeData" :activedata="deptActiveData" :vm="deptVm"></tree-view>
									</template>
								</Col>
							</Row>
						</Modal>
						</Col>
					<!--	<Col span="4">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="ename" placeholder="请输入企业名称"></Input>
						</FormItem>
						</Col>-->
					</Row>
				</div>

				<Row>
					<Col span="24">
					<FormItem>
						<Button type="primary" @click="handleSearch">查询</Button>
						<Button type="ghost" @click="handleReset" style="margin-left: 8px;">重置</Button>
					</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list" :style="{top:topLength}">
			<Table border :columns="Columns" :data="TableList"></Table>
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>

		<!--loading框 Modal Templates-->
		<div class="dhx_modal_cover" v-if='loadingModal'></div>
		<div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
		<!--End loading框 Modal Templates-->
	</div>
</template>

<script>
	var datautil = require('../../../assets/js/date.js');

	import deptTree from '../../common/deptCommonTree';
	export default {
		components: {
			'tree-view': deptTree
		},
		data() {
			return {
				loadingModal: false, //loading框
				topLength: '229px',
				show: true,
				display: false,
				deptId: '',
				deptName: '',
				deptTree: false,
				//实施机关树数据
				deptTreeData: [],
				//实施机关选中项数据
				deptActiveData: [],
				deptVm: {},
				//用户可操作的部门
				usableDeptIds: [],
				//控制按钮的显示与否
				btnData: [],
				//查询参数定义区
				projectName: '',
				caseId: '',
				cardNumber: '',
				relatedPersonName: '',
				caseState: '',
				startTime: '',
				endTime: '',
				deptId: '',
				ename:'',
				Columns: [{
					title: '办件流水号',
					key: 'caseId',
					width: '10%'
				}, {
					title: '事项名称',
					key: 'projectName',
					width: '15%'
				}, {
					title: '企业名称',
					key: 'ename',
					width: '11%'
				},{
					title: '申请人 / 经办人',
					key: 'relatedPersonName',
					width: '7%'
				}, {
					title: '联系电话',
					key: 'mobile',
					width: '10%'
				}, {
					title: '证件号 / 统一社会信用代码',
					key: 'cardNumber',
					width: '14%'
				}, {
					title: '登记时间',
					key: 'registerTime',
					width: '14%'
				}, {
					title: '办理状态',
					key: 'caseStateName',
					width: '8%'
				}, {
					title: '操作',
					key: 'action',
					width: '16%',
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									size: 'small',
									icon: 'search'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.isRouter(params.row);
									}
								}
							}, '查看'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									icon: 'ios-download'
								},
								on: {
									click: () => {
										this.initTempCgaCase(params.row);
									}
								}
							}, '重新生成')


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
			//获取当前登录人所属部门信息，并以该部门id为根节点查询部门树
			axios.post("/cgaSysLoginInfo/findInfoById.do")
				.then(data => {
					var deptId = data.obj.deptId; //当前登录人部门id
					axios.post("/sys/sysDept/queryDeptTreeList.do", {
							deptId: deptId
						})
						.then(data => {
							//实施机关部门树
							this.deptTreeData = data.obj || [];
						});
				});
			//将实施机关树的顶级目录传进去用于分发事件
			this.deptVm = this;
			this.$on('handleCallback', item => {
				this.deptActiveData = [item.deptId];
				this.deptId = item.deptId;
				this.deptName = item.deptName;
			});
			//列表及分页
			this.getList();
			this.$watch('$route.fullPath', this.getList);
		},
		methods: {
			handleDept(){
		    this.deptTree = true;
		    this.deptActiveData = [];
				this.deptId = '';
				this.deptName = '';
		  },
			cancelDept() {
				this.deptActiveData = [];
				this.deptId = '';
				this.deptName = '';
			},
			//获取Table表格数据
			getList() {
				this.loadingModal = true;
				axios.post("/cgaCase/queryImplementorgansByPage.do", this.queryData)
					.then(data => {
						this.loadingModal = false;
						this.TableList = data.obj.records;
						this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPage = parseInt(this.$route.query.currentPage) || 1;
						this.pageSize = parseInt(this.$route.query.pageSize) || 10;
					}).catch(error => {
						this.loadingModal = false;
					});;
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
			//键盘触发事件
			keyenter(ev) {
				//回车即查询
				if(ev.keyCode === 13) {
					this.handleSearch()
				}
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
				}
				Object.assign(this.queryData, {
					moduleId: this.$route.query.moduleId,
					currentPage: 1,
					projectName: this.projectName,
					caseId: this.caseId,
					cardNumber: this.cardNumber,
					relatedPersonName: this.relatedPersonName,
					caseState: this.caseState,
					startTime: this.startTime,
					endTime: this.endTime,
					deptId: this.deptId,
					ename: this.ename
				});
				this.refreshRouter();
			},
			//重置按钮
			handleReset() {
				this.projectName = '';
				this.caseId = '';
				this.cardNumber = '';
				this.relatedPersonName = '';
				this.startTime = '';
				this.endTime = '';
				this.deptId = '';
				this.caseState = '';
				this.ename = '';
				Object.assign(this.queryData, {
					currentPage: 1,
					pageSize: 10,
					moduleId: this.$route.query.moduleId,
					caseId: '',
					cardNumber: '',
					relatedPersonName: '',
					projectName: '',
					startTime: '',
					endTime: '',
					deptId: '',
					ename: '',
				});
				this.refreshRouter();
			},
			isRouter(row) {
				//跳转到暂予登记页面
				this.$router.push({
					path: './detail/index',
					query: {
						cardNumber: row.cardNumber,
						moduleId: this.$route.query.moduleId,
						projectId: row.projectId,
						caseId: row.caseId,
						projectNo: row.projectNo,
						inCurrentPage:this.currentPage
					}
					// path: '/case/office/implementorgans/info/index',
					// query: {
					// 	backPage: "index",
					// 	moduleId: this.$route.query.moduleId,
					// 	projectId: row.projectId,
					// 	projectName: row.projectName,
					// 	caseId: row.caseId,
					// 	projectNo: row.projectNo,
					// 	inCurrentPage:this.currentPage,
					// 	path:"/case/office/implementorgans/index"
					// }
				});
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

			initTempCgaCase(rowValue){

				this.$Modal.confirm({
					title: '初始化提示',
					content: '确定要重新生成吗？',
					onOk: () => {
						axios.post("/cgaCase/initTempCgaCase.do",{caseId:rowValue.caseId})
						.then(data=>{
						  this.$Message.success('重新生成成功！');
						}).catch(error=>{
						});

					}
				});
			}
		}
	}



</script>

<style lang="scss">
	.ivu-date-picker {
		width: 100%;
	}
</style>
