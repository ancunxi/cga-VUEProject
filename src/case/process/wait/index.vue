<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col span="6">
					<FormItem>
						<Input v-model="caseId" v-on:input="onInput($event)" v-on:propertychange="onPropertyChange($event)" placeholder="办件流水号"></Input>
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
						<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
					</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
					<FormItem>
						<Button type="primary" @click="handleSearch">查询</Button>
						<Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
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
					//查询区
					caseId: '',
					projectName: '',
					relatedPersonName: '',
					cardNumber: '',
					//控制按钮的显示与否
					btnData: [],
					temp:'',
					//列表
					Columns: [{
						title: '办件流水号',
						key: 'caseId',
						width: '10%',
						render: (h, params) => {
							return h('div', [
								h('span', params.row.caseId),
								h('a', {
									attrs: {
										title: '帮办任务'
									},
									style: {
										marginLeft: "5px",
										color: "#66CC99",
										fontSize: "20px",
										display: params.row.deputyType == true ? 'inline-block' : 'none'
									}
								}, [
									h('Icon', {
										props: {
											type: 'information-circled'
										}
									})
								]),
								h('a', {
									attrs: {
										title: '即将到期，请尽快处理'
									},
									style: {
										marginLeft: "5px",
										color: "#FBBC05",
										fontSize: "20px",
										display: params.row.isExpireTache==false && params.row.isWarningTache==true ? 'inline-block' : 'none'
									}
								}, [
									h('Icon', {
										props: {
											type: 'alert-circled'
										}
									})
								]),
								h('a', {
									attrs: {
										title: '已到期，请尽快处理'
									},
									style: {
										marginLeft: "5px",
										color: "#ED4014",
										fontSize: "20px",
										display: params.row.isExpireTache == true ? 'inline-block' : 'none'
									}
								}, [
									h('Icon', {
										props: {
											type: 'alert-circled'
										}
									})
								])
							]);
						}
					}, //{
						//title: '项目名称',
					//	key: 'caseName',
					//	width: '17%'
					//},
					{
						title: '事项名称',
						key: 'projectName',
						width: '18%'
					}, {
						title: '申请人 / 经办人',
						key: 'relatedPersonName',
						width: '8%'
					}, {
						title: '证件号 / 统一社会信用代码',
						key: 'cardNumber',
						width: '14%'
					}, {
						title: '受理时间',
						key: 'acceptTime',
						width: '14%'
					}, {
						title: '流程类型',
						key: 'workFlowTypeDesc',
						width: '7%'
					}, {
						title: '企业名称',
						key: 'eName',
						width: '17%'
					}, {
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
									// style: {
									// 	display: this.btnData.indexOf('dealwith') !== -1 ? 'inline-block' : 'none'
									// },
									on: {
										click: () => {
											$("#CarmeraUpload").off("click");
											this.$router.push({
												path: './detail/index',
												query: {
													moduleId: this.$route.query.moduleId,
													projectId: params.row.projectId,
													id: params.row.id,
													caseId: params.row.caseId,
													workFlowType: params.row.workFlowType,
													businessId: params.row.businessId,
													deputyType: params.row.deputyType,
													taskId: params.row.taskId,
													taskDefinitionKey: params.row.taskDefinitionKey,
													projectNo: params.row.projectNo,
													cardNumber: params.row.cardNumber,
													inCurrentPage:this.currentPage,
													isShowDeleteButton:this.isShowDeleteButton
												}
											})
										}
									}
								}, '办理')
							]);
						}
					}],
					TableList: [],
					//分页
					queryData: Object.assign({}, this.$route.query),
					total: 0,
					currentPage: 1,
					pageSize: 10,
					isShowDeleteButton:false,
				}
			},
			created() {
				//根据当前菜单的moduleId获取实施机关树数据
				axios.post("/cgaPermission/getButtonPermissionData.do", {
						moduleId: this.$route.query.moduleId
					})
					.then(data => {
						let _this=this;
						//按钮权限的控制
						//this.btnData = data.obj.buttonPermissionData.map(item => item.optCode);

						data.obj.map(function(item){
							if(item.optCode=="wait:applymaterial:delete"){
								_this.isShowDeleteButton = true;
							}else{
								return false;
							}
						})
						let showButton = false;
						data.obj.map(function(item){
							if(item.optName=="办理"){
								showButton = true;
							}else{
								return false;
							}
						})
						if(!showButton){
							(_this.Columns[_this.Columns.length-1])["render"] = "";
						}
					});
				//列表及分页
				this.getList();
				this.$watch('$route.fullPath', this.getList);
			},
			methods: {
				rowClassName(row, index) {
					if(row.isExpireTache === true) {
						return 'demo-table-info-column';
					} else {
						return 'demo-table-error-column';
					}
				},
				getList() {
					this.loadingModal = true;
					axios.post("/cgaCase/queryTodoCaseListByPage.do", this.queryData)
						.then(data => {
							this.TableList = data.obj.records || [];
							this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
							this.currentPage = parseInt(this.$route.query.currentPage) || 1;
							this.pageSize = parseInt(this.$route.query.pageSize) || 10;
							//关闭loading框
							this.loadingModal = false;
						}).catch(error => {
							this.loadingModal = false;
						})
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

				//办件流水号输入自动触发查询 Firefox, Google Chrome, Opera, Safari, Internet Explorer from version 9
				onInput(event) {
					if(this.caseId!=null && this.caseId!=""){
						this.onDelayTask();
					}
				},
				//办件流水号输入自动触发查询 Internet Explorer
				onPropertyChange(event) {
					if (event.propertyName.toLowerCase () == "value") {
						if(this.caseId!=null && this.caseId!=""){
							this.onDelayTask();
						}
					}
				},
				onDelayTask() {
					if (this.temp !="") {
						clearTimeout(this.temp);
					}
					this.temp = setTimeout(()=>{
						this.handleSearch();
					}, 500);
				},
				//根据查询条件获取列表数据
				handleSearch() {
					let char
					if(this.caseId.charAt(0) == 's' || this.caseId.charAt(0) == 'S'){
						char = this.caseId.substring(1);
					}else{
						char = this.caseId;
					}
					this.caseId = char;
					Object.assign(this.queryData, {
						currentPage: 1,
						caseId: char,
						projectName: this.projectName,
						relatedPersonName: this.relatedPersonName,
						cardNumber: this.cardNumber
					});
					this.refreshRouter();
				},
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
				}
			}
	}
</script>

<style lang="scss">

</style>
