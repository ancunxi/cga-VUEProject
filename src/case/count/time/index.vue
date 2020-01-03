<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form name="paraForm" method="post" target="reportFrame">
				<Row :gutter="12">
					<Col :lg="8" :xs="12">
						<FormItem>
							<a href="javascript:;" @click="handleDept" style="display:block;">
								<i class="ivu-icon ivu-icon-ios-home ivu-input-icon ivu-input-icon-normal"></i>
								<input type="text" class="ivu-input" v-model="deptName" placeholder="请选择实施机关" style="cursor:pointer;">
							</a>
						</FormItem>
						<Modal 
							v-model="deptTree" 
							title="请选择实施机关" 
							width="500"
							class-name="ivu-modal-style ivu-modal-absolute-500" 
							:mask-closable="false"
							@on-ok="okDeptName" 
							@on-cancel="cancelDeptName">
							<Row>
								<Col span="24">
									<template>
										<tree-view :treedata="treeData" :usabledeptids='usableDeptIds' :activedata="activeData" :vm="vm" :ischeckbox="true" :activeid="activeId"></tree-view>
									</template>
								</Col>
							</Row>
						</Modal>
					</Col>
					<Col :lg="8" :xs="12">
						<FormItem>
							<Select v-model="year" placeholder="请选择年份">
								<Option value="2017">2017</Option>
								<Option value="2018">2018</Option>
								<Option value="2019">2019</Option>
								<Option value="2020">2020</Option>
								<Option value="2021">2021</Option>
							</Select>
						</FormItem>						
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem>
							<Button type="primary" @click="handleSearch()">查询</Button>
							<Button type="ghost" @click="handleReset()" style="margin-left: 8px;">重置</Button>
							<Button type="success" @click="exportPdf()" icon="ios-cloud-download" style="margin-left: 8px;">导出[PDF]</Button>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</div>
		<div class="layout-list" style="top:229px;left: 16.66666667%;right:0;padding-left:0;padding-right:0;margin-left:15px;">
			<iframe scrolling="auto" id="reportFrame" name="reportFrame" width="100%" frameborder="0"></iframe>
		</div>
	</div>
</template>

<script>
	import tree from '../countTree.vue';
	require('../../../assets/js/jquery.min.js');
	export default {
		components: {
			'tree-view': tree
		},
		data() {
			return {
				deptTree: false,
				year:'',
				//查询条件
				startDate: '',
				endDate: '',
				//实施机关名称
				deptName: [],
				treeData: [],
				usableDeptIds: [], //可操作部门
				//选中项数据
				activeData: [],
				//传递this，外层实例
				vm: {},
				//所有选中项ID
				activeId: [],
				//所有选中项的名称
				activeName: [],
				//某个返回的item中的所有ID集合
				allIdListData: [],
				//把所有的选中项ID拼接成字符串
				allIdStr: '',
			}
		},
		updated() {
			let bodyH = parseInt($(document).height()) - 240;
			let iframeH = $('#reportFrame').css('height', bodyH);
		},
		created() {
			let token = localStorage.getItem('token');
			//根据导航的菜单id获取实施机关树数据
			// $.post(window.config.api + "/cgaPermission/queryPermissionInfoByParams.do?token=" + token, {
			// 		moduleId: this.$route.query.moduleId
			// 	})
			// 	.then(data => {
			// 		if(!data.success) {
			// 			//返回错误状态                    
			// 			return false;
			// 		}
			// 		this.treeData = data.obj.allDeptTreeData;
			// 		this.usableDeptIds = data.obj.usableDeptIds || [];
			// 	});
			axios.post("/cgaPermission/getUsableDeptIds.do", {moduleId: this.$route.query.moduleId})
			.then(data => {
				//当前用户可操作的部门数据
			 	this.usableDeptIds = data.obj || [];
			})
			//将树的顶级目录传进去用于分发事件
			this.vm = this;
			let _this = this;
			//处理选中项数据
			this.$on('handleCallback', item => {
				//某个返回的item中的所有ID集合/Name集合       
				this.allIdListData = [];
				this.allIdList(item);
				//某项菜单选中后的索引值
				let idx = this.activeId.indexOf(item.id);
				if(idx != -1) {
					//此项之前已被选中 -> 将此项的所有数据从之前的数组删除
					$.each(this.allIdListData, function(index, value) {
						let idx0 = _this.activeId.indexOf(value);
						if(idx0 != -1) {
							_this.activeId.splice(idx0, 1);
						}
					});
				} else {
					//此项之前未被选中 -> 将此项的所有数据添加到之前的数组中 -> 数组合并存在重复数据
					this.activeId = this.arrayNoRepeat(this.activeId.concat(this.allIdListData));
				}
			})
			this.$on('handleCallbackOne', oid => {
				//某项菜单选中后的索引值
				let idx = this.activeId.indexOf(oid);
				if(idx != -1) {
					//此项之前已被选中 -> 将此项的所有数据从之前的数组删除
					this.activeId.splice(idx, 1);
				} else {
					//此项之前未被选中 -> 将此项的所有数据添加到之前的数组中 -> 数组合并存在重复数据
					this.activeId.push(oid);
				}
			})
		},
		mounted() {
			this.handleSearch();
		},
		methods: {
			//某个返回的item中的所有ID集合
			allIdList(item) {
				let _this = this;
				this.allIdListData.push(item.id);
				if(item.childrenList) {
					$.each(item.childrenList, function(index, value) {
						_this.allIdList(value);
					});
				}
			},

			//数组去重
			arrayNoRepeat(array) {
				let arr = array;
				let returnArray = [];
				let obj = {}; //key: value
				for(let i = 0; i < arr.length; i++) {
					obj[arr[i]] = arr[i];
				}
				for(var key in obj) {
					returnArray.push(key);
				} //取出key
				return returnArray;
			},
			//获取选中的name合集
			allNameList(item) {
				let _this = this;
				if(this.activeId.indexOf(item.id) != -1) {
					this.activeName.push(item.name);
				}
				if(item.childrenList) {
					$.each(item.childrenList, function(index, value) {
						_this.allNameList(value);
					});
				}
			},
			//树形菜单弹窗点击确认
			okDeptName() {
				this.activeName = [];
				this.allNameList(this.treeData[0]);
				this.deptName = this.activeName;
				this.allIdStr = this.activeId.map(item => "'" + item + "'").join(",");
			},
			handleDept(){
		    this.deptTree = true;
			this.treeData =  this.$store.state.deptTreeData;
		    this.activeId = [];
				this.activeName = [];
				this.deptName = [];
		  },
			//树形菜单弹窗点击取消
			cancelDeptName() {
				this.activeId = [];
				this.activeName = [];
				this.deptName = [];
			},
			//表单查询
			cjkEncode(text) {
				if(text == null) {
					return "";
				}
				var newText = "";
				for(var i = 0; i < text.length; i++) {
					var code = text.charCodeAt(i);
					if(code >= 128 || code == 91 || code == 93) {
						newText += "[" + code.toString(16) + "]";
					} else {
						newText += text.charAt(i);
					}
				}
				return newText;
			},
			//开始日期
			handleChangeStart(data) {
				this.startDate = data;
			},
			handleSearch() {
				
				  axios.post("/cgaSysLoginInfo/findInfoById.do")
				      .then(data => {
				      	   if(this.startDate != '') {
									var date1 = new Date(this.startDate);
								this.startDate = datautil.formatDate(date1, 'yyyy-MM-dd');
							}
							if(this.endDate != '') {
								var date2 = new Date(this.endDate);
								this.endDate = datautil.formatDate(date2, 'yyyy-MM-dd');
							}
				      	  this.FineReportUrl=data.obj.frProjectUrl;
				      	  var reportURL = this.cjkEncode(this.FineReportUrl + "/ReportServer?reportlet=/cga/caseTimeStatistics.cpt&__pi__=false&__bypagesize__=false" +
								"&startDate=" + this.startDate + "&endDate=" + this.endDate + "&deptIds=" + this.allIdStr);
				
							document.paraForm.action = reportURL; //通过form的name获取表单，并将报表访问路径赋给表单的action
							document.paraForm.submit(); //触发表单提交事件
				      });
			},
			//表单重置
			handleReset() {
				this.activeId = [];
				this.activeName = [];			
				this.deptName = [];
				this.year='';
				this.allIdStr='';
				
				this.handleSearch();
			},
			//导出PDF
			exportPdf() {
				var fileName = encodeURI("办件时间分布统计");
				var reportURL = this.cjkEncode(this.FineReportUrl+ "/ReportServer?reportlet=/cga/caseTimeStatistics.cpt&__pi__=false&__bypagesize__=false&format=pdf&__filename__=" +fileName+
					"&startDate=" + this.year + "&deptIds=" + this.allIdStr);
				window.open(reportURL);
			}
		}
	}
</script>