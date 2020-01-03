<template>
	<div class="layout-content">
		<div class="layout-inquiry">
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
						<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
					</FormItem>
					</Col>
					<Col span="6">
					<FormItem>
						<!-- <Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input> -->
						<Select v-model="templateCode" placeholder="审批公文">
							<template v-for="item in templateList">
								<Option :value="item.code" :key="item.code">{{item.name}}</Option>
							</template>
						</Select>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
					<FormItem>
						<Button type="primary" @click="handleSearch">查询</Button>
						<Button type="ghost" style="margin-left: 8px;" @click="handleReset">重置</Button>
					</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list">
			<Table border :columns="Columns" :data="TableList"></Table>
			<!-- <div class="ma_noData">抱歉，暂无数据！</div>  -->
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>

		<!--loading框 Modal Templates-->
		<div class="dhx_modal_cover" v-if='loadingModal'></div>
		<div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
		<!--End loading框 Modal Templates-->
	</div>
</template>

<script>
	export default {
		data() {
				return {
					loadingModal: false, //loading框
					caseId: '', //办件流水号
					projectName: '', //事项名称
					relatedPersonName: '', //申请人或经办人
					templateCode: '',
					templateList: {}, //审批公文列表
					Columns: [{
							title: '办件流水号',
							key: 'caseId',
							width: '9%'
						}, {
							title: '项目名称',
							key: 'caseName',
							width: '15%'
						}, {
							title: '公文名称',
							key: 'name',
							width: '12%'
						},
						// {
						//   title: '文书类型',
						//   key: 'four',
						//   width: '10%'
						// },
						{
							title: '申请人 / 经办人',
							key: 'relatedPersonName',
							width: '8%'
						}, {
					    title:'企业名称',
              key:'eName',
              width:'15%'
            },{
							title: '受理时间',
							key: 'acceptTime',
							width: '10%'
						}, {
							title: '办理状态',
							key: 'caseStateName',
							width: '6%'
						},
						// {
						// 	title: '打印次数',
						// 	key: 'printNum',
						// 	width: '7%',
						// 	render: (h, params) => {
						// 		var printNum1 = params.row.printNum;
						// 		if(printNum1 != null || printNum1 != "") {
						// 			return printNum1;
						// 		} else {
						// 			return 0;
						// 		}
						// 	}
						// },
						{
							title: '打印次数',
							key: 'printNum',
							width: '6%',
						},
						{
							title: '操作',
							key: 'action',
							width: '6%',
							align: 'nine',
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
												this.$router.push({
													path: './form',
													query: {
														moduleId:this.$route.query.moduleId,
														id: params.row.id,
														code: params.row.templateCode,
														inCurrentPage:this.currentPage
													}
												})
											}
										}
									}, '打印')
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
				this.getList();
				this.loadDocTemplates();
				this.$watch('$route.fullPath', this.getList);
			},
			methods: {
				loadDocTemplates() {
					axios.post("/cgaDocumentTemplate/queryList.do")
						.then(data => {
							this.templateList = data.obj;
						});
				},
				//获取Table表格数据
				getList() {
					this.loadingModal = true;
					axios.post("/cgaDocumentPrint/queryCgaDocumentPrintByPage.do", this.queryData)
						.then(data => {
							this.TableList = data.obj.records;
							this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
							this.currentPage = parseInt(this.$route.query.currentPage) || 1;
							this.pageSize = parseInt(this.$route.query.pageSize) || 10;

							this.loadingModal = false;
						}).catch(err => {
							this.loadingModal = false;
						});
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
						currentPage: 1,
						caseId: this.caseId,
						projectName: this.projectName,
						relatedPersonName: this.relatedPersonName,
						cardNumber: this.cardNumber,
						printId: this.templateCode
					});
					this.refreshRouter();
				},
				//重置按钮
				handleReset() {
					this.caseId = '';
					this.projectName = '';
					this.relatedPersonName = '';
					this.cardNumber = '';
					this.templateCode='';
					Object.assign(this.queryData, {
						currentPage: 1,
						pageSize: 10,
						caseId: '',
						projectName: '',
						relatedPersonName: '',
						cardNumber: '',
						printId:'',
					});
					this.refreshRouter();
				},
				refreshRouter() {
					//更新路由
					this.$router.push(this.$route.path + '?' + util.serialize(this.queryData));
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
				}
			}
	}
</script>
