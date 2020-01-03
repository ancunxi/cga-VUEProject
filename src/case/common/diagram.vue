<!-- 流程图 -->
<template>
<div>
  <Row style="width:100%;height:500px;border:1px solid #ccc;overflow-x:auto;">
    <Col span="24" v-if="currNodeName!=''"> <h5 class="title"><span><Icon type="image"></Icon>办件主流程(当前环节:{{currNodeName}})</span></h5></Col>
    <Col span="24" v-if="currNodeName==''"><h5 class="title"><span><Icon type="image"></Icon>办件主流程</span></h5></Col>
    <div style='position:relative;top:35px;' id='disgramBox'>
      <img v-if='workflowShow' :src="workflowapi +'/process/trace/taskPic/'+ opid + '.do?r='+Math.random(10)+'&&token='+checkToken" style="position:absolute; left:0px; top:0px;">

      <template v-for='item in actImpls'>
        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX) +'px;top:'+ (item.y-minY) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height)" @mouseout="disappear(item.id)"></div>
      </template>
      <template v-for='item in hisImpls'>
        <div :id="item.id" :style="'position:absolute; border:0;left:'+ (item.x-minX) +'px;top:'+ (item.y-minY) + 'px;width:+'+ item.width + 'px;height:' + item.height + 'px;'" @mouseover="display(item.id,item.x,item.y,item.width,item.height)" @mouseout="disappear(item.id)"></div>
      </template>
      <div id="disgramModal"><div id="boxV"></div></div>
    </div>
  </Row>
  <!--返回按钮-->
  <Row class="margin-bottom-10 center" v-if="showFlag=='1'">
    <Col span="24">
      <router-link :to="$route.query.path" style="margin-left:8px;" v-if="$route.query.path != ''"><Button type="primary">返回</Button></router-link>
      <router-link to="../index" style="margin-left:8px;" v-else><Button type="primary">返回</Button></router-link>
    </Col>
  </Row>
</div>
</template>

<script>
require('../../assets/js/jquery.min.js');
export default {
  props: {
    showFlag: {//控制返回按钮的显示或隐藏
      type: String,
      default: ''
    }
  }, 
  data () {
    return {
      caseId:'',
      actImpls:[],    //当前准备的
      hisImpls:[],    //操作过的
      minX:'',
      minY:'',
      opid:'',
      workflowapi:'',
      workflowShow:'',
      currNodeName:'',
      checkToken:''
    }
  },
  created(){
    this.workflowapi = window.config.workflowUrl;
    this.checkToken = localStorage.getItem('token');
  },
  methods: {
  	getProcessInstanceId(caseId){
  		this.caseId=caseId;
  		axios.post("/cgaWorkFlow/queryTaskInfo.do", {caseId:caseId})
	    .then(data=>{
	      	var pid=data.obj.processInstanceId;//获取流程实例id
          this.opid = pid;
          this.workflowShow = true;
          this.currNodeName=data.obj.currNodeName;
	      	axios.post("/cgaWorkFlow/queryNodeImgInfo.do", {proinstanceId:pid})
  		    .then(data=>{
            this.actImpls = data.obj.actImpls || []; //当前准备的
            this.hisImpls = data.obj.hisImpls || []; //操作过的
            this.minX = data.obj.minX || 0;
            this.minY = data.obj.minY || 0;
            
  		    });
	    });
  	},
    display(id,leftx,y,w,height){
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



            //str += "<table width='100%'><tr><td width='30%' align='right'>办理人:</td><td align='left'>"+data1[x].LOGINNAME+"</td></tr><tr><td width='30%' align='right'>开始时间:</td><td align='left'>"+data1[x].STARTTIME+"</td></tr><tr><td width='30%' align='right'>结束时间:</td><td align='left'>"+data1[x].ENDTIME+"</td></tr><tr><td class='borderBottom' width='30%' align='right'>停留天数:</td><td class='borderBottom' align='left'>"+data1[x].PROMISE_DAYS+"</td></tr></table>";
          }
          h.style.left = parseInt(leftx) - parseInt(this.minX)  + "px";
          h.style.top  = parseInt(y) - parseInt(this.minY) +  parseInt(height) + 5 + "px";
          v.innerHTML = str; 
          h.style.display = "block";
          
      });

    },
    disappear(event){
      var h = document.getElementById("disgramModal");
      h.style.display = "none";
    }
  }
}
</script>

<style lang="scss" scoped>
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
  //border:1px #CCC solid;
  border:none;
  display:none;
}

</style>