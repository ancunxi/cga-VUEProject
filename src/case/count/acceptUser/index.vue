<template>
	<div class="layout-content">
		<div class="layout-inquiry">
			<Form name="paraForm" method="post" target="reportFrame">
				<Row :gutter="12">				
					<Col :lg="5" :xs="12">
						<FormItem>					
							<Input v-model="acceptName" placeholder="请输入办件人员姓名"></Input>
						</FormItem>	
					</Col>
					<Col span="2">&nbsp;</Col>
					<Col :lg="6" :xs="12">
						<FormItem>
							<Date-picker type="date" :value="startDate" v-model="startDate" @on-change="handleChangeStart" format="yyyy-MM-dd" placeholder="请选择开始日期"></Date-picker>
						</FormItem>
					</Col>
					<Col :lg="6" :xs="12">
						<FormItem>
							<Date-picker type="date" :value="endDate" v-model="endDate" @on-change="handleChangeEnd" format="yyyy-MM-dd" placeholder="请选择结束日期"></Date-picker>
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
		<div class="layout-list" style="left: 16.66666667%;right:0;padding-left:0;padding-right:0;margin-left:15px;overflow-x:hidden;overflow-y:hidden;">
			<iframe scrolling="no" id="reportFrame" name="reportFrame" width="100%"  height="100%" frameborder="0"></iframe>
		</div>
	</div>
</template>

<script>
	var datautil=require('../../../assets/js/date.js');

	//import tree from '../countTree.vue';
	require('../../../assets/js/jquery.min.js');
	export default {
		components: {
			//'tree-view': tree
		},
		data() {
			return {
				deptTree: false,
				//查询条件
				startDate: '',
				endDate: '',
				acceptName:'',			
			}
		},
		updated() {
			let bodyH = parseInt($(document).height())-240;
			let iframeH = $('#reportFrame').css('height', bodyH);
		},
		created() {
			
		},
		mounted() {
			this.handleSearch();
		},
		methods: {
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
				if(this.endDate != '' && Date.parse(data) > Date.parse(this.endDate)){
					this.$Message.error({
	          content: '开始时间不能大于结束时间',
	          duration: 4
	        });
	        this.startDate = "";
	        return false;
				}else{
					this.startDate = data;
				}
			},
			//结束日期
			handleChangeEnd(data) {
				if(this.startDate != '' && Date.parse(data) < Date.parse(this.startDate)){
					this.$Message.error({
	          content: '结束时间不能小于开始时间',
	          duration: 4
	        });
	        this.endDate = "";
	        return false;
				}else{
					this.endDate = data;
				}
			},
			handleSearch() {
				if(this.startDate != '') {
					var date1 = new Date(this.startDate);
					this.startDate = datautil.formatDate(date1, 'yyyy-MM-dd');
				}

				if(this.endDate != '') {
					var date2 = new Date(this.endDate);
					this.endDate = datautil.formatDate(date2, 'yyyy-MM-dd');
				}
				
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
				      	  var name = encodeURI(this.acceptName);
				      	  var reportURL = this.cjkEncode(this.FineReportUrl + 							"/ReportServer?reportlet=/cga/caseAcceptUserStatistics.cpt&__pi__=false&__bypagesize__=false" +
							"&startDate=" + this.startDate + "&endDate=" + this.endDate + "&acceptName=" + name);
				
							document.paraForm.action = reportURL; //通过form的name获取表单，并将报表访问路径赋给表单的action
							document.paraForm.submit(); //触发表单提交事件
				      });
				
				
			},
			//表单重置
			handleReset() {
				this.startDate = '';
				this.endDate = '';
				this.acceptName = '';
				this.handleSearch();
       // location.reload();
			},
			//导出PDF
			exportPdf() {
				if(this.startDate != '') {
					var date1 = new Date(this.startDate);
					this.startDate = datautil.formatDate(date1, 'yyyy-MM-dd');
				}

				if(this.endDate != '') {
					var date2 = new Date(this.endDate);
					this.endDate = datautil.formatDate(date2, 'yyyy-MM-dd');
				}
				var fileName = encodeURI("人员办件分类统计");
				var name = encodeURI(this.acceptName);
				var reportURL = this.cjkEncode(this.FineReportUrl+"/ReportServer?reportlet=/cga/caseAcceptUserStatistics.cpt&__pi__=false&__bypagesize__=false&format=pdf&__filename__="+fileName+"&startDate="+this.startDate+"&endDate="+this.endDate+"&acceptName=" + name);
				
				window.open(reportURL);
			}
		}
	}
</script>