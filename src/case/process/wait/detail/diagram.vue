<!-- 流程图 -->
<template>
	<Row>
		 <Row style="width:100%;height:500px; overflow-x:auto;">
		  	<!--主流程图-->
		    <Col span="24"><h5 class="title"><span><Icon type="image"></Icon>办件主流程 (当前环节：{{workFlowInfo.mainTacheName}})</span></h5></Col>
		    <div style='position:relative;top:35px;' id='disgramBox'>
		      <img v-if='workflowShow' :src="workflowapi +'/process/trace/taskPic/'+ opid+'.do?r='+Math.random(10)" style="position:absolute; left:0px; top:0px;">

		      <template v-for='item in actImpls'>
		        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX) +'px;top:'+ (item.y-minY) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height,'1')" @mouseout="disappear(item.id,'1')"></div>
		      </template>
		      <template v-for='item in hisImpls'>
		        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX) +'px;top:'+ (item.y-minY) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height,'1')" @mouseout="disappear(item.id,'1')"></div>
		      </template>
		      <div id="disgramModal"><div id="boxV"></div></div>
		    </div>
		    <!--主流程图-->
		  </Row>
		  <div style='border:solid 1px #ccc; height:0; width:100%; margin:15px 0;'></div>
		  <Row style="width:100%;height:400px; overflow-x:auto;">
		  	<!--辅助流程图-->
			<div v-if="workFlowInfo.workFlowType=='1'">
				<Col span="24"><h5 class="title"><span><Icon type="image"></Icon>{{workFlowInfo.workFlowTypeDesc}} (当前环节：{{tacheInfo.tacheName}})</span></h5></Col>
			    <div style='position:relative;top:35px;' id='disgramBox1'>
			      <img v-if='workflowShow1' :src="workflowapi +'/process/trace/taskPic/'+ opid1 +'.do?r='+Math.random(10)" style="position:absolute; left:0px; top:0px;">

			      <template v-for='item in actImpls1'>
			        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX1) +'px;top:'+ (item.y-minY1) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height,'2')" @mouseout="disappear(item.id,'2')"></div>
			      </template>
			      <template v-for='item in hisImpls1'>
			        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX1) +'px;top:'+ (item.y-minY1) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height,'2')" @mouseout="disappear(item.id,'2')"></div>
			      </template>
			      <div id="disgramModal1"><div id="boxV1"></div></div>
			    </div>
			</div>
			<!--辅助流程图-->
		  </Row>
		
	</Row>
 
</template>

<script>
require('../../../../assets/js/jquery.min.js');
export default {
  //父组件向子组件传递基本信息页签详情数据
  props: {
    workFlowInfo: {
      type: Object
    },
    tacheInfo : {
      type: Object
    }
  },
  data () {
    return {
      caseId:'',
      workflowapi:'',

      //主流程
      actImpls:'',    //当前准备的
      hisImpls:'',    //操作过的
      minX:'',
      minY:'',
      opid:'',
      workflowShow:'',

      //辅助流程
      actImpls1:'',    //当前准备的
      hisImpls1:'',    //操作过的
      minX1:'',
      minY1:'',
      opid1:'',
      workflowShow1:'',
    }
  },
  created(){
    this.workflowapi = window.config.workflowUrl;
  },
  methods: {
  	getProcessInstanceId(caseId,opid1){
  		if(opid1!='' && opid1!=undefined){
  			this.opid1 = opid1.workFlowId
  		}else{
  			this.opid1 = '';
  		}
  		
  		this.caseId=caseId;
  		//主流程 查询流程图
  		axios.post("/cgaWorkFlow/queryTaskInfo.do", {caseId:caseId})
	    .then(data=>{
	      var pid=data.obj.processInstanceId;//获取流程实例id
          this.opid = pid;
          this.workflowShow = true;

	      axios.post("/cgaWorkFlow/queryNodeImgInfo.do", {proinstanceId:pid})
		    .then(data=>{
            this.actImpls = data.obj.actImpls || []; //当前准备的
            this.hisImpls = data.obj.hisImpls || []; //操作过的
            this.minX = data.obj.minX || 0;
            this.minY = data.obj.minY || 0;
          
		  });
	    });
	    if(this.opid1!=''){
	    	//辅助流程 查询流程图
	        axios.post("/cgaWorkFlow/queryNodeImgInfo.do", {proinstanceId:this.opid1})
		    .then(data=>{
		      this.workflowShow1 = true;
	          this.actImpls1 = data.obj.actImpls || []; //当前准备的
	          this.hisImpls1 = data.obj.hisImpls || []; //操作过的
	          this.minX1 = data.obj.minX || 0;
	          this.minY1 = data.obj.minY || 0;
		    });
	    }
  	},
    display(id,leftx,y,w,height,type){
    	if(type=='1'){//主流程
    		  var h = document.getElementById("disgramModal");
		      var v = document.getElementById("boxV");
		      
		      v.innerHTML = "";
		      axios.post("/cgaWorkFlow/queryWorkFlowNodeDetail.do", {caseId:this.$route.query.caseId, sid:id})
		      .then(data=>{
		          var str = "";
		          var data1=data.obj.result;
		          str += "<table width='100%' border='1' cellspacing='0' style='text-align:center;border-collapse:collapse;'><tr><thead><tr><th width='25%'>环节名称</th><th>"+data1[0].NODENAME+"</th><th width='25%'>环节天数</th><th>"+data1[0].PROMISE_DAYS+"</th></tr><tr><thead><tr><th width='25%'>办理人</th><th>停留天数</th><th width='25%'>开始时间</th><th>结束时间</th></tr></thead>";
		          for(var x = 0;x < data1.length; x++){
		            str += "<tr><td width='25%'>"+data1[x].LOGINNAME+"</td><td width='25%'>"+data1[x].STOP_DAYS+"</td><td width='25%'>"+data1[x].STARTTIME+"</td><td width='25%'>"+data1[x].ENDTIME+"</td></tr>";
		          }
		          h.style.left = parseInt(leftx) - parseInt(this.minX)  + "px";
		          h.style.top  = parseInt(y) - parseInt(this.minY) +  parseInt(height) + 5 + "px";
		          v.innerHTML = str; 
		          h.style.display = "block";  
		      });
    	}else{//辅助流程
    		var h = document.getElementById("disgramModal1");
		    var v = document.getElementById("boxV1");
		      
		    v.innerHTML = "";
		    axios.post("/cgaWorkFlow/queryWorkFlowNodeDetail.do", {caseId:this.$route.query.caseId, sid:id})
		    .then(data=>{
		        var str = "";
		        var data1=data.obj.result;
		        str += "<table width='100%' border='1' cellspacing='0' style='text-align:center;border-collapse:collapse;'><tr><thead><tr><th width='25%'>环节名称</th><th>"+data1[0].NODENAME+"</th><th width='25%'>环节天数</th><th>"+data1[0].PROMISE_DAYS+"</th></tr><tr><thead><tr><th width='25%'>办理人</th><th>停留天数</th><th width='25%'>开始时间</th><th>结束时间</th></tr></thead>";
		        for(var x = 0;x < data1.length; x++){
		          str += "<tr><td width='25%'>"+data1[x].LOGINNAME+"</td><td width='25%'>"+data1[x].STOP_DAYS+"</td><td width='25%'>"+data1[x].STARTTIME+"</td><td width='25%'>"+data1[x].ENDTIME+"</td></tr>";
		        }
		        h.style.left = parseInt(leftx) - parseInt(this.minX1)  + "px";
		        h.style.top  = parseInt(y) - parseInt(this.minY1) +  parseInt(height) + 5 + "px";
		        v.innerHTML = str; 
		        h.style.display = "block";  
		    });
    	}
    },
    disappear(event,type){
      var h;
      if(type=='1'){
      	h = document.getElementById("disgramModal");
      }else{
      	h = document.getElementById("disgramModal1");
      }
      h.style.display = "none";
    }
  }
}
</script>

<style lang="scss">
  #disgramModal{
  position:absolute;
  z-index:99;
  //width:210px;
  width:370px;
  padding:10px;
  /*height:200px;*/
  font-size:12px;
  background:#FFFFFF;
  line-height:20px;
  border:none;
  display:none;
}
 #disgramModal1{
  position:absolute;
  z-index:99;
  //width:210px;
  width:370px;
  padding:10px;
  /*height:200px;*/
  font-size:12px;
  background:#FFFFFF;
  line-height:20px;
  border:none;
  display:none;
}
</style>