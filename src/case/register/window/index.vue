<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="8" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
						</FormItem>
					</Col>
					<Col :lg="8" :xs="12">
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
							<div style="margin-bottom:15px;">
								<Input v-model="searchDeptName" placeholder="请输入实施机关名称" style="width: 300px" @keyup.enter.native="searchDept"></Input>
								<Button type="primary" @click="searchDept" >搜索</Button>
								<Button type="error" @click="resetDept">重置</Button>
							</div>
							<Row>
								<Col span="24">
									<template>
										<searchTree-view v-if="showSearchTree" :treedata="deptTreeData" :usabledeptids='usableDeptIds' :activedata="deptActiveData" :vm="deptVm"></searchTree-view>
										<tree-view v-else :treedata="deptTreeData" :usabledeptids='usableDeptIds' :activedata="deptActiveData" :vm="deptVm"></tree-view>
									</template>
								</Col>
							</Row>
						</Modal>
					</Col>
					<Col :lg="8" :xs="12" class="themeBox">
  					<FormItem class="input-cursor">
  						<a href="javascript:;" @click="themeTree = !themeTree">
  							<Input icon="ios-home" v-model="themeName" placeholder="请选择主题" @focus='themeTree = true' @on-blur='themeTree = false'></Input>
  						</a>
              <transition name="fade">
                <div class="themeSlectContent" v-if='themeTree'>
                  <Row>
                    <Col span="4" v-for='item in themeTreeData' :key="item.classId">
                      <span @click='themeFun(item.classId,item.className)' :class="{current:item.classId== themeId}">{{item.className}}</span>
                    </Col>
                  </Row>
                </div>
              </transition>
  					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
					<FormItem>
						<Button type="primary" @click="handleSearch">查询</Button>
						<Button type="ghost" @click="handleReset" style="margin-left:8px">重置</Button>
					</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list">
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
	require('../../../assets/js/jquery.min.js');
	import deptTree from '../../common/deptTree';
	import tree from '../../common/tree';
	import searchDeptTree from '../../common/searchDeptTree';
	export default {
		components: {
			'tree-view': deptTree,
			'searchTree-view': searchDeptTree,
			'Tree': tree,
		},
		data() {
			return {
				showSearchTree:false,
				searchDeptName:'',
				loadingModal: false, //loading框
				//弹框
				deptTree: false,
				themeTree: false,
				//查询区
				projectName: '',
				deptId: '',
				deptName: '',
				themeId: '',
				themeName: '',
				projectId: '',
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
				//列表区
				Columns: [{
					title: '事项编码',
					key: 'projectNo',
					width: '17%',
				}, {
					title: '事项名称',
					key: 'projectName',
					width: '30%'
				}, {
					title: '事项实施编码',
					key: 'projectShowNo',
					width: '10%'
				}, {
					title: '实施机关',
					key: 'deptName',
					width: '19%'
				}, {
					title: '版本',
					key: 'version',
					width: '5%'
				}, {
					title: '操作',
					key: 'action',
					width: '19%',
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
									marginRight: '5px',
									display: this.btnData.indexOf('register') !== -1 ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.isRouter(params.row);
									}
								}
							}, '登记办理'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									icon: 'ios-download'
								},
								style: {
									display: this.btnData.indexOf('download') !== -1 ? 'inline-block' : 'none'
								},
								on: {
									click: () => {
										this.$router.push({
											path: './download/index',
											query: {
												projectId: params.row.projectId,
												inCurrentPage:this.currentPage
											}
										})
									}
								}
							}, '模板下载')
						]);
					}
				}],
				TableList: [],
				//分页
				queryData: Object.assign({}, this.$route.query),
				total: 0,
				currentPage: 1,
				pageSize: 10,
				caseId: '', //办件流水号
			}
		},
		created() {
			//列表及分页
			this.getList();
			this.$watch('$route.fullPath', this.getList);

			//根据当前菜单的moduleId获取实施机关树数据
			// axios.post("/cgaPermission/queryPermissionInfoByParams.do", {moduleId: this.$route.query.moduleId})
			// .then(data => {
			// 	//实施机关部门树
			// 	this.deptTreeData = data.obj.allDeptTreeData;
			// 	//当前用户可操作的部门数据
			// 	this.usableDeptIds = data.obj.usableDeptIds || [];
			// 	//按钮权限的控制
			// 	this.btnData = data.obj.buttonPermissionData.map(item => item.optCode);
			// });

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

			//查询主题节点下全部分类列表
			axios.post("/cgaProject/queryThemeClassList.do")
			.then(data => {
				//主题分类树
				this.themeTreeData = data.obj;
			});
		},

		methods: {
			handleDept(){
				this.deptTreeData = this.$store.state.deptTreeData;
				this.deptTree = true;
				this.deptId = '';
				this.deptName = '';
				this.deptActiveData = [];
			},
			cancelDept() {
				this.deptId = '';
				this.deptName = '';
				this.deptActiveData = [];
			},
			themeFun(id, name) {
				this.themeId = id;
				this.themeName = name;
        		this.themeTree = false;
			},
			resetDept(){
				this.searchDeptName = '';
				this.deptTreeData = this.$store.state.deptTreeData;
				this.showSearchTree = false;
			},
			//搜索部门名称
			searchDept(){
				this.showSearchTree = true;
				axios.post("/sys/sysDept/queryDeptTreeList.do",{deptNameQuery:this.searchDeptName})
				.then(data=>{
					this.deptTreeData = data.obj || [];
				})
			},
			//获取Table表格数据
			getList() {
				this.loadingModal = true;
				axios.post("/cgaProject/queryAcceptProjectListByPage.do", this.queryData)
					.then(data => {
						this.TableList = data.obj.records || [];
						this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
						this.currentPage = parseInt(this.$route.query.currentPage) || 1;
						this.pageSize = parseInt(this.$route.query.pageSize) || 10;
						//关闭loading框
						this.loadingModal = false;
					}).catch(error => {
						this.loadingModal = false;
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
					classId: this.themeId
				});
				this.refreshRouter();
			},
			//重置按钮
			handleReset() {
				this.projectName = '';
				this.deptId = '';
				this.deptName = '';
				this.themeId = '';
				this.themeName = '';
				Object.assign(this.queryData, {
					currentPage: 1,
					pageSize: 10,
					moduleId: this.$route.query.moduleId,
					deptId: '',
					projectName: ''
				});
				this.refreshRouter();
			},
			//点击登记办理按钮控制路由的跳转（进入内页详情或者办件向导模块）
			isRouter(row) {
				$("#CarmeraUpload").off("click");
				this.loadingModal = true;
				axios.post("/cgaProjectGuide/checkCgaProjectGuide.do", {projectNo: row.projectNo})
				.then(data => {
					if(data.obj != null && data.obj.flag == '0') {
						this.$router.push({path: '../guide/index', query: { projectNo: row.projectNo, projectId: row.projectId, projectName: row.projectName}
						});
						this.loadingModal = false;
					}else{
						//初始化办件流水号
						axios.post("/cgaCaseRegist/initCase.do", {projectId: row.projectId})
						.then(data => {
							this.loadingModal = false;
							if(data.status == '200' && data.success == true) {
								this.caseId = data.obj.caseId;
								this.$router.push({path: './detail/index', query: {moduleId: this.$route.query.moduleId, projectId: row.projectId, projectNo: row.projectNo, projectName: row.projectName, caseId: this.caseId, inCurrentPage:this.currentPage}
								})
							} else {
								this.$Message.error(data.msg);
							}
						}).catch(error => {
							this.loadingModal = false;
						});
					}
				}).catch(error => {
					this.loadingModal = false;
				});
			}
		}
	}
</script>

<style lang="scss">
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
        font-size: 20px;
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
