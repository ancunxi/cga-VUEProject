<template>
	<div class="layout-content">		
		<div class="layout-inquiry" >
			<Form>
				<Row :gutter="16">
					<Col :lg="5" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="messageAuthorName" placeholder="发送人"></Input>
						</FormItem>
					</Col>
					<Col :lg="5" :xs="12">							
						<FormItem>
							<Select v-model="messageState" placeholder="请选择消息状态">
								<Option value="1">已读</Option>
								<Option value="0">未读</Option>
							</Select>
						</FormItem>
					</Col>
					<Col :lg="5" :xs="12">
						<FormItem>
							<Input @keydown.native="keyenter($event)" v-model="messageTitle" placeholder="标题"></Input>
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
		<div class="layout-list" style='margin-top:0;' >
			<Table border :columns="Columns" :data="TableList" @on-selection-change="selectChange"></Table>		
			<Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
		</div>
	</div>
</template>

<script>

	export default {
		components: {
		},
		data() {
			return {
				messageState:'',
				messageAuthorName:'',
				messageTitle:'',
				//列表区
				Columns: [{
                    title: '发送人',
					key: 'messageAuthorName',
					align: 'center',
                    width: '15%'
                },  {
					title: '发送时间',
					key: 'sendDate',
					align: 'center',
					width: '15%'
				}, {
					title: '标题',
					key: 'messageTitle',
					align: 'center',
					width: '35%',
					ellipsis:true
					
				}, {
					title: '状态',
					key: 'messageStateName',
					align: 'center',
					width: '15%'
				}, {
					title: '操作',
					key: 'action',
					width: '15%',
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
										this.$router.push({
											path: '/case/message/message',
											query: {
												messageId: params.row.messageId
											}
										})
									}
								}
							}, '查看')
						]);
					}
				}],
				TableList: [],
				//分页
				queryData: Object.assign({messageSource:'系统'}, this.$route.query),
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
			selectChange(){

			},
			//获取Table表格数据
			getList() {
				axios.post("/cgaSorMessage/queryListByPage.do", this.queryData)
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
					moduleId: this.$route.query.moduleId,
					messageTitle:this.messageTitle,
					messageAuthorName:this.messageAuthorName,
					messageState:this.messageState,
					messageSource:'系统',
					currentPage: 1,
				});
				this.refreshRouter();
			},
			//重置按钮
			handleReset() {
				this.messageAuthorName = "";
				this.messageTitle = "";
				this.messageState = "";
				Object.assign(this.queryData, {
					currentPage: 1,
					pageSize: 10,
					moduleId: this.$route.query.moduleId,
					messageAuthorName: '',
					messageTitle: '',
					messageState: '',
				});
				this.refreshRouter();
			},
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