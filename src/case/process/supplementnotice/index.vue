<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form>
				<Row :gutter="16">
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="caseId" placeholder="办件流水号"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="projectName" placeholder="事项名称"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="relatedPersonName" placeholder="申请人或经办人或企业名称"></Input>
					</FormItem>
					</Col>
					<Col span="5">
					<FormItem>
						<Input @keydown.native="keyenter($event)" v-model="cardNumber" placeholder="证件号码或统一社会信用代码"></Input>
					</FormItem>
					</Col>
					<Col span="4" style="position:relative;">
					<Button type="ghost" shape="circle" icon="plus" v-show="!display" @click="add" style="position:absolute; top:0; right:15px;">更多条件</Button>
					<Button type="ghost" shape="circle" icon="minus" v-show="display" @click="reduce" style="position:absolute; top:0; right:15px;">收起条件</Button>
					</Col>

				</Row>
				<div v-show="display">
					<Row :gutter="16">
						<Col span="5">
						<FormItem>
							<Select v-model="caseState" placeholder="请选择办件状态">
								<Option value="15">办理中</Option>
								<Option value="04">补正中</Option>
								<Option value="09">已办结</Option>
								<Option value="12">不予办理</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="5">
						<FormItem>

							<Date-picker type="date" :value="startTime" format="yyyy-MM-dd" placeholder="选择开始日期" v-model="startTime" @on-change="handleChangeStart"></Date-picker>
						</FormItem>
						</Col>
						<Col span="5">
						<FormItem>
							<Date-picker type="date" :value="endTime" format="yyyy-MM-dd" placeholder="选择结束日期" v-model="endTime" @on-change="handleChangeEnd"></Date-picker>
						</FormItem>
						</Col>
					</Row>
				</div>
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
		<div class="layout-list" :style="{top:topLength}">
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
	var datautil = require('../../../assets/js/date.js');
	export default {
		data() {
				return {
					btnData:'',
					loadingModal: false, //loading框
					topLength: '229px',
					//查询参数定义区
					projectName: '',
					caseId: '',
					cardNumber: '',
					relatedPersonName: '',
					caseState: '',
					startTime: '',
					endTime: '',
					endTime_addOne:'',
					show: true,
					display: false,
					Columns: [{
						title: '办件流水号',
						key: 'caseId',
						width: '9%'
					}, {
						title: '事项名称',
						key: 'projectName',
						width: '14%'
					}, {
						title: '申请人 / 经办人',
						key: 'relatedPersonName',
						width: '10%'
					},{
					  title:'企业名称',
            key:'eName',
            width:'16%'
          }, {
						title: '联系电话',
						key: 'mobile',
						width: '8%'
					}, {
						title: '证件号 / 统一社会信用代码',
						key: 'cardNumber',
						width: '12%'
					}, {
						title: '登记时间',
						key: 'registerTime',
						width: '9%'
					}, {
						title: '办理状态',
						key: 'caseStateName',
						width: '9%'
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
										icon: 'search'
									},
									style: {
									display: this.btnData.indexOf('notice') !== -1 ? 'inline-block' : 'none'
								          },
									on: {
										click: () => {
											    this.$Modal.confirm({
										                title: '温馨提示',
										                content: '是否发送短信通知提醒',
										                onOk: () => {
										                  this.$emit('loadingShow');
										                  axios.post("/cgaCase/sendSmsMesage.do", {
										                     projectName: params.row.projectName,
										                     caseId: params.row.caseId,

										                  })
										                  .then(data=>{
										                    if(data.status !== '200') {
										                      resolve(0)
										                      this.$Message.error(data.msg);
										                      return false
										                    }
										                    resolve(data)
										                  }).catch(error=>{
										                    this.$emit('loadingHide');
										                  });
										                },
										                onCancel: () => {
										                    resolve(0)
										                }
										              })
										}
									}
								}, '通知')
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
					axios.post("/cgaPermission/queryPermissionInfoByParams.do", {moduleId: this.$route.query.moduleId})
					.then(data => {
						//按钮权限的控制
						this.btnData = data.obj.buttonPermissionData.map(item => item.optCode);
					});
			},
			methods: {
				//获取Table表格数据
				getList() {
					this.loadingModal = true;
					axios.post("/cgaCase/supplementNoticeByPage.do", this.queryData)
						.then(data => {
							this.loadingModal = false;
							this.TableList = data.obj.records;
							this.total = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
							this.currentPage = parseInt(this.$route.query.currentPage) || 1;
							this.pageSize = parseInt(this.$route.query.pageSize) || 10;
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
				//开始日期
				handleChangeStart(data) {
					if(this.endTime_addOne != '' && Date.parse(data) > Date.parse(this.endTime_addOne)){
						this.$Message.error({
		          content: '开始时间不能大于结束时间',
		          duration: 4
		        });
		        this.startTime = "";
		        return false;
					}else{
						this.startTime = data;
					}
				},
				//结束日期
				handleChangeEnd(data) {
					if(this.startTime != '' && Date.parse(data) < Date.parse(this.startTime)){
						this.$Message.error({
		          content: '结束时间不能小于开始时间',
		          duration: 4
		        });
		        this.endTime_addOne = "";
		        return false;
					}else{
						this.endTime_addOne = data;
					}
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
					/* if(this.startTime!='' && this.startTime!=undefined){
					   alert(this.startTime)
					     alert((JSON.stringify(this.startTime)))
					     alert((JSON.stringify(this.startTime)).substring(1,11))
					   this.startTime = (JSON.stringify(this.startTime)).substring(1,11);

					 }
					 if(this.endTime!='' && this.endTime!=undefined){
					   this.endTime =  (JSON.stringify(this.endTime)).substring(1,11);
					 }*/
					if(this.startTime != '') {
						var date1 = new Date(this.startTime);
						this.startTime = datautil.formatDate(date1, 'yyyy-MM-dd');
					}

					if(this.endTime != '') {
						var date2 = new Date(this.endTime);
						this.endTime_addOne = datautil.formatDate(new Date((date2 / 1000 + 86400) * 1000), 'yyyy-MM-dd');
						//this.endTime = datautil.formatDate(date2, 'yyyy-MM-dd');
					} else {
						this.endTime_addOne = datautil.formatDate(new Date(((new Date()) / 1000 + 86400) * 1000), 'yyyy-MM-dd');

					}

					Object.assign(this.queryData, {
						moduleId: this.$route.query.moduleId,
						currentPage: 1,
						projectName: this.projectName,
						caseId: this.caseId,
						cardNumber: this.cardNumber,
						relatedPersonName: this.relatedPersonName,
						caseState: this.caseState,
						startTime: this.startTime,
						endTime: this.endTime_addOne
					});
					this.refreshRouter();
				},
				//重置按钮
				handleReset() {
					this.projectName = '';
					this.caseId = '';
					this.cardNumber = '';
					this.relatedPersonName = '';
					this.startTime = '';
					this.endTime = '';
					this.caseState = '';
					Object.assign(this.queryData, {
						currentPage: 1,
						pageSize: 10,
						moduleId: this.$route.query.moduleId,
						caseId: '',
						cardNumber: '',
						relatedPersonName: '',
						projectName: '',
						startTime: '',
						endTime_addOne: '',
						endTime:''
					});
					this.refreshRouter();
				},
				isRouter(row) {
					console.log("1111111111111");
							this.$Modal.confirm({
				                title: '温馨提示',
				                content: '是否发送短信通知提醒',
				                onOk: () => {
				                  this.$emit('loadingShow');
				                  axios.post("/cgaCase/sendSmsMesage.do", {
				                     projectName: params.row.projectName,
				                     caseId: params.row.caseId,

				                  })
				                  .then(data=>{
				                    if(data.status !== '200') {
				                      resolve(0)
				                      this.$Message.error(data.msg);
				                      return false
				                    }
				                    resolve(data)
				                  }).catch(error=>{
				                    this.$emit('loadingHide');
				                  });
				                },
				                onCancel: () => {
				                    resolve(0)
				                }
				              })


				},
				//查询条件控制
				add() {
					this.display = true;
					this.topLength = '289px';
				},
				reduce() {
					this.display = false;

					this.topLength = '229px';
				}
			}
	}
</script>

<style lang="scss">
	.ivu-date-picker {
		width: 100%;
	}
</style>
