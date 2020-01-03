<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="8" :xs="13">
						<FormItem>
							<Input @keydown.native="keyenter($event)" placeholder="辅助流程名称" v-model="supportName"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem>
							<Button type="primary" @click="handleSearch">查询</Button>
							<Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
							<router-link :to="{path:'add',query:{moduleId:this.$route.query.moduleId,inCurrentPage:this.$route.query.currentPage}}" style="margin-left:8px;"><Button type="success">添加</Button></router-link>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list" style="top:229px;">
			<Table border :columns="Columns" :data="TableList"></Table>
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			//弹窗
			deptTree: false,
			supportName: '',
			isUse: '',
			//列表区
			Columns: [{
				title: '辅助流程名称',
				key: 'supportName',
				width: '20%'
			}, {
				title: '辅助流程类型',
				key: 'supportType',
				width: '10%',
				render: (h, params) => {
					return h('div', [
            h('span', params.row.supportType == 0?'常规辅助流程':'缴费辅助流程')
        	]);
					// if(params.row.supportType == 0) {
					// 	return '常规辅助流程';
					// } else {
					// 	return '缴费辅助流程';
					// }
				}
			}, {
				title: '是否可用',
				key: 'isUse',
				width: '8%',
				render: (h, params) => {
					return h('div', [
            h('span', params.row.isUse == '0'?'是':'否')
        	]);
					// if(params.row.isUse == '0') {
					// 	return '是';
					// } else {
					// 	return '否';
					// }
				}
			}, {
				title: '辅助流程描述',
				key: 'description',
				width: '27%',
				render: (h, params) => {
					return h('span', {
						attrs: {
							title:params.row.description
						},
						style: {
							width: '27%',
							overflow:'hidden',
							textOverflow:'ellipsis',
							whiteSpace: 'nowrap',
						},
					}, params.row.description)
				}
			}, {
				title: '操作',
				key: 'action',
				width: '13%',
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
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.$router.push({
										path: './edit',
										query: {
											moduleId:this.$route.query.moduleId,
											id: params.row.id,
											inCurrentPage:this.currentPage
										}
									})
								}
							}
						}, '编辑'),
						h('Button', {
							props: {
								type: 'primary',
								size: 'small',
								icon: 'ios-download'
							},
							on: {
								click: () => {
									this.$router.push({
										path: './deploy',
										query: {
											moduleId:this.$route.query.moduleId,
											id: params.row.id,
											inCurrentPage:this.currentPage
										}
									})
								}
							}
						}, '流程配置')
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
	methods: {
		//获取Table表格数据
		getList() {
			axios.post("/cgaSupportWorkflow/queryListByPage.do", this.queryData)
			.then(data => {
				this.TableList = data.obj.records || [];
				this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
				this.currentPage = parseInt(this.$route.query.currentPage) || 1;
				this.pageSize = parseInt(this.$route.query.pageSize) || 10;
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
				currentPage: 1,
				supportName: this.supportName
			});
			this.refreshRouter();
		},
		//重置按钮
		handleReset() {
			this.supportName = '';
			Object.assign(this.queryData, {
				currentPage: 1,
				pageSize: 10,
				supportName: '',
			});
			this.refreshRouter();
		}
	}
}
</script>