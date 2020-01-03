<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<div class="layout-tabs">
				<router-link :to="{path:'index2',query:{moduleId:this.$route.query.moduleId}}">待发证</router-link>
				<a href="javascript:;" class="active">已发证</a>
			</div>
			<Form>
				<Row :gutter="16">
					<Col span="6">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="caseId" placeholder="办件流水号"></Input>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人"></Input>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
					<FormItem>
						<Button type="primary" @click="handleSearch">查询</Button>
						<Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
						<router-link :to="{path:'receive', query:{moduleId:$route.query.moduleId, dealType: '01', backup:'index'}}">
						<!-- <Button type="success" style="margin-left: 8px;">收证</Button> -->
						</router-link>

					</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list" style="top:285px;">
			<Table border :columns="Columns" :data="TableList"></Table>
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				caseId: '',
				projectName: '',
				relatedPersonName: '',
				cardNumber: '',
				Columns: [
					{
						title: '办件流水号',
						key: 'caseId',
						width: '14%'
					},
					{
						title: '事项名称',
						key: 'projectName',
						width: '23%'
					},
					{
						title: '申请人/经办人',
						key: 'relatedPersonName',
						width: '19%'
					},
					{
						title: '证件号码/统一社会信用代码',
						key: 'cardNumber',
						width: '25%'
					},
					{
						title: '发证时间',
						key: 'sendTime',
						width: '14%'
					},
					{
						title: '操作',
						key: 'action',
						width: '9%',
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
								}, '查看')
							]);
						}
					}
				],
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
			this.$watch('$route.fullPath', this.getList);
		},
		methods: {
			getList() {
				this.loadingModal = true;
				axios.post("/cgaCaseLicenceSend/queryListByPage.do", Object.assign({
					licenceState: '1',
					caseId: this.caseId,
					projectName: this.projectName,
					relatedPersonName: this.relatedPersonName,
					cardNumber: this.cardNumber
				}, this.queryData))
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
			//根据查询条件获取列表数据
			handleSearch() {
				Object.assign(this.queryData, {
					caseId: this.caseId,
					projectName: this.projectName,
					relatedPersonName: this.relatedPersonName,
					cardNumber: this.cardNumber
				});
				this.refreshRouter();
			},
			//重置按钮
			//重置按钮
			handleReset() {
				this.caseId = '';
				this.projectName = '';
				this.relatedPersonName = '';
				this.cardNumber = '';
				Object.assign(this.queryData, {
					currentPage: 1,
					pageSize: 10,
					caseId: '',
					projectName: '',
					relatedPersonName: '',
					cardNumber: ''
				});
				this.refreshRouter();
			},
			isRouter(row) {
				//跳转到暂予登记页面
				this.$router.push({
					path: '/case/process/licensesend/info/index',
					query: {
						moduleId: this.$route.query.moduleId,
						projectId: row.projectId,
						projectName: row.projectName,
						caseId: row.caseId,
						projectNo: row.projectNo,
						inCurrentPage:this.currentPage,
						backPage: "index",
						path:"/case/process/licensesend/index2"
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.layout-tabs {
		position: relative;
		border-bottom: 1px solid #dddee1;
		margin-bottom: 20px;
		a {
			display: inline-block;
			width: 80px;
			height: 36px;
			line-height: 20px;
			text-align: center;
			padding: 8px 10px;
			margin-right: 16px;
			color: #495060;
			&.active {
				color: #2d8cf0;
				font-weight: 600;
				&:before {
					content: '';
					display: block;
					position: absolute;
					left: 100px;
					bottom: -1px;
					width: 80px;
					height: 2px;
					background: #3399ff;
				}
			}
		}
	}
</style>
