<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col :lg="8" :xs="13">
						<FormItem prop="leaderId">
							<Input @keydown.native="keyenter($event)" placeholder="领导名称" v-model="leaderId"></Input>
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem>
							<Button type="primary" @click="handleSearch">查询</Button>
							<Button type="ghost" @click="handleReset" style="margin-left:8px;">重置</Button>
							<Button type="success" @click="addIndex" style="margin-left:8px;">添加</Button>
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
			leaderId: '',
			Columns: [{
				title: '领导',
				key: 'leaderId',
				width: '10%'
				}, {
				title: '帮办人',
				key: 'deputyId',
				width: '20%'
			}, {
				title: '操作',
				key: 'action',
				width: '9%',
				align: 'center',
				render: (h, params) => {
					return h('div', [
						h('Button', {
							props: {
								type: 'error',
								size: 'small',
								icon: 'trash-b'
							},
							on: {
								click: () => {
									this.$Modal.confirm({
										title: '温馨提示',
										content: '是否确定删除该信息',
										onOk: () => {
											axios.post("/cgaDeputy/delete.do", {
												id: params.row.ID
											})
											.then(data => {
												this.getList();
												this.$watch('$route.fullPath', this.getList);
												this.$Message.success('删除成功！');
											});
										}
									});
								}
							}
						}, '删除')
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
			axios.post("/cgaDeputy/queryListByPage.do", this.queryData)
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
		addIndex(){
			this.$router.push({path:'add',query:{moduleId:this.$route.query.moduleId,inCurrentPage:this.currentPage}})
		},
		//根据查询条件获取列表数据
		handleSearch() {
			Object.assign(this.queryData, {
				currentPage: 1,
				leaderId: this.leaderId
			});
			this.refreshRouter();
		},
		//重置按钮
		handleReset() {
			this.leaderId = '';
			Object.assign(this.queryData, {
				currentPage: 1,
				pageSize: 10,
				leaderId: ''
			});
			this.refreshRouter();
		}
	}
}
</script>