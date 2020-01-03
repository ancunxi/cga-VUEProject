<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="6" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="caseId" placeholder="办件流水号"></Input>
						</FormItem>
					</Col>
					<Col :lg="6" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
						</FormItem>
					</Col>
					<Col :lg="6" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
						</FormItem>
					</Col>
					<Col :lg="6" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
						</FormItem>
					</Col>
				</Row>
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
export default {
	data() {
		return {
			loadingModal: false, //loading框

			//查询参数定义区
			projectName: this.$route.query.projectName || '',
			caseId: this.$route.query.caseId || '',
			cardNumber: this.$route.query.cardNumber || '',
			relatedPersonName: this.$route.query.relatedPersonName || '',
			Columns: [{
				title: '办件流水号',
				key: 'caseId',
				width: '10%'
			}, {
				title: '项目名称',
				key: 'caseName',
				width: '20%'
			}, {
				title: '事项名称',
				key: 'projectName',
				width: '20%'
			}, {
				title: '申请人 / 经办人',
				key: 'relatedPersonName',
				width: '12%'
			},{
        title: '企业名称',
        key: 'eName',
        width: '14%'
      }, {
				title: '证件号 / 统一社会信用代码',
				key: 'cardNumber',
				width: '14%'
			}, {
				title: '登记时间',
				key: 'registerTime',
				width: '12%'
			}, {
				title: '操作',
				key: 'action',
				width: '8%',
				align: 'center',
				render: (h, params) => {
					return h('div', [
						h('Button', {
							props: {
								type: 'info',
								size: 'small',
								icon: 'edit'
							},
							on: {
								click: () => {
									this.isRouter(params.row);
								}
							}
						}, '登记')
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
		//列表及分页
		this.getList();
		//this.$watch('$route.fullPath', this.getList);
	},
	methods: {
		//获取Table表格数据
		//查询暂予登记或补正状态的相关办件信息（分页）
		getList() {
			this.loadingModal = true;

			axios.post("/cgaCaseRegist/queryTempCaseOrSupplementCaseInfoByPage.do", Object.assign({caseState: '14'}, this.queryData))
			.then(data => {
				this.TableList = data.obj.records || [];
				this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
				this.currentPage = parseInt(this.$route.query.currentPage) || 1;
				this.pageSize = parseInt(this.$route.query.pageSize) || 10;

				this.loadingModal = false;
			}).catch(err => {
				this.loadingModal = false;
			});
		},
		pageChange(data) {
			this.currentPage = data;
			Object.assign(this.queryData, {
				currentPage: data
			});
			this.refreshRouter();
			this.getList();
		},
		pageSizeChange(data) {
			this.pageSize = data;
			Object.assign(this.queryData, {
				pageSize: data
			});
			this.refreshRouter();
			this.getList();
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
				caseId: this.caseId,
				cardNumber: this.cardNumber,
				relatedPersonName: this.relatedPersonName
			});
			this.refreshRouter();
			this.getList();
		},
		//重置按钮
		handleReset() {
			this.projectName = '';
			this.caseId = '';
			this.cardNumber = '';
			this.relatedPersonName = '';
			Object.assign(this.queryData, {
				currentPage: 1,
				pageSize: 10,
				moduleId: this.$route.query.moduleId,
				caseId: '',
				cardNumber: '',
				relatedPersonName: '',
				projectName: ''
			});
			this.refreshRouter();
			this.getList();
		},
		isRouter(row) {
			$("#CarmeraUpload").off("click");
			//跳转到暂予登记页面
			this.$router.push({
				path: './detail/index',
				query: {
					moduleId: this.$route.query.moduleId,
					cardNumber: row.cardNumber,
					projectId: row.projectId,
					projectNo: row.projectNo,
					caseId: row.caseId,
					inCurrentPage:this.currentPage
				}
			});
		}
	}
}
</script>
