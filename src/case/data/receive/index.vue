<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="8" :xs="12">
						<FormItem>
							<Input v-on:input="onInput($event)" v-on:propertychange="onPropertyChange($event)" v-model="caseId" placeholder="办件流水号"></Input>
						</FormItem>
					</Col>
					<Col :lg="8" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
						</FormItem>
					</Col>
					<Col :lg="8" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem>
							<Button type="primary" @click="handleSearch">查询</Button>
							<Button type="ghost" @click="handleReset" style="margin-left: 8px;">重置</Button>
							<Button type="success" @click="toAddPage" style="margin-left: 8px;">签收</Button>
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
export default {
	data() {
		return {
			loadingModal: false, //loading框
			caseId: '', //办件流水号
			projectName: '', //事项名称
			relatedPersonName: '', //申请人或经办人
			Columns: [{
				title: '办件流水号',
				key: 'caseId',
				width: '14%'
			}, {
				title: '申请人/经办人',
				key: 'relatedPersonName',
				width: '10%'
			}, {
        title: '企业名称',
        key: 'eName',
        width: '10%'
      },{
				title: '事项名称',
				key: 'projectName',
				width: '15%'
			}, {
				title: '流转类型',
				key: 'dealTypeName',
				width: '8%'
			}, {
				title: '所处环节',
				key: 'tacheName',
				width: '10%'
			}, {
				title: '处理人',
				key: 'userName',
				width: '10%'
			}, {
				title: '所属机关',
				key: 'deptName',
				width: '13%'
			}, {
				title: '处理时间',
				key: 'operateTime',
				width: '13%'
			}],
			TableList: [],
			//分页
			queryData: Object.assign({
				dealType: "02"
			}, this.$route.query),
			total: 0,
			currentPage: 1,
			pageSize: 10
		}
	},
	created() {
		this.getList();
		this.$watch('$route.fullPath', this.getList);
	},
	methods: {
		//获取Table表格数据
		getList() {
			this.loadingModal = true;
			axios.post("/cgaMaterialbagTache/queryListForUserByPage.do", this.queryData)
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
		toAddPage() {
			this.$router.push({
				path: '../send/add',
				query: {
					moduleId:this.$route.query.moduleId,
					inCurrentPage:this.$route.query.currentPage,
					dealType: "02",
					backPage: "../receive/index"
				}
			});
		},
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
				caseId: this.caseId,
				projectName: this.projectName,
				relatedPersonName: this.relatedPersonName
			});
			this.refreshRouter();
		},
		//重置按钮
		handleReset() {
			this.caseId = '';
			this.projectName = '';
			this.relatedPersonName = '';
			Object.assign(this.queryData, {
				currentPage: 1,
				pageSize: 10,
				caseId: '',
				projectName: '',
				relatedPersonName: ''
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
