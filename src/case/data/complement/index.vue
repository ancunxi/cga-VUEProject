<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="6" :xs="12">
						<FormItem>
							<Input v-model="caseId" v-on:input="onInput($event)" v-on:propertychange="onPropertyChange($event)" placeholder="办件流水号"></Input>
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
							<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或住址机构代码"></Input>
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
			projectName: '',
			caseId: '',
			cardNumber: '',
			relatedPersonName: '',
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
				title: '申请人/经办人',
				key: 'relatedPersonName',
				width: '12%'
			}, {
			  title:'企业名称',
        key:'eName',
        width:'14%'
      },{
				title: '证件号码/统一社会信用代码',
				key: 'cardNumber',
				width: '14%'
			}, {
				title: '受理时间',
				key: 'acceptTime',
				width: '12%'
			}, {
				title: '办件状态',
				key: 'caseStateName',
				width: '6%'
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
									$("#CarmeraUpload").off("click");
									this.$router.push({
										path: 'detail/index',
										query: {
											moduleId: this.$route.query.moduleId,
											caseId: params.row.caseId,
											projectId: params.row.projectId,
											cardNumber: params.row.cardNumber,
											inCurrentPage:this.currentPage,
											isShowDeleteButton:this.isShowDeleteButton
										}
									})
								}
							}
						}, '补录')
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
		this.$watch('$route.fullPath', this.getList);
	},
	mounted(){
		this.isShowButton();
	},
	methods: {
		isShowButton(){
			let _this=this;
			axios.post("/cgaPermission/getButtonPermissionData.do", {moduleId:this.$route.query.moduleId})
			.then(data=>{
				data.obj.map(function(item){
					if(item.optCode=="complement:applymaterial:delete"){
						_this.isShowDeleteButton = true;
					}else{
						return false;
					}
				})
				let showButton = false;
				data.obj.map(function(item){
					if(item.optName=="补录"){
						showButton = true;
					}else{
						return false;
					}
				})
				if(!showButton){
					(_this.Columns[_this.Columns.length-1])["render"] = "";
				}
			})
		},
		//获取Table表格数据
		getList() {
			this.loadingModal = true;
			axios.post("/cgaMaterialbagTache/queryCgaCaseMaterialByPage.do", this.queryData)
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
				moduleId: this.$route.query.moduleId,
				currentPage: 1,
				projectName: this.projectName,
				caseId: char,
				cardNumber: this.cardNumber,
				relatedPersonName: this.relatedPersonName
			});
			this.refreshRouter();
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
		}
	}
}
</script>
