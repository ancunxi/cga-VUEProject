<template>
  <div>
    <Row style="width:100%;height:300px;border:1px solid #dddee1;">
      <Col span="24">
      	    <div>
            <iframe class="sreportFramesCheck" width="100%" height="800" :src='this.fileReproUrls+"/ReportServer?reportlet="+cptUrl+"&__showtoolbar__=false&caseId="+this.caseIds'></iframe>
  		     <!-- <Button type="primary" @click="treportFrames">提交</Button>-->
           </div>
      </Col>
    </Row>
    <Row class="margin-bottom-10 center">
      <Col span="24">
        <router-link to="../index" style="margin-left:8px;"><Button type="primary">返回</Button></router-link>
      </Col>
    </Row> 
  </div>
</template>

<script>
require('../../../../assets/js/jquery.min.js');
export default{
	data () {
    return {
    	nextAudit:'',
      cptUrl:'',
      templateHtml:'',
      inSrc:'',
      intForm:'',
      fileReproUrls:''
    }
 },
  props: {
  	
  	formReportFile:{
      type: String,   
    },
    caseIds:{
      type: String,   
    },
    current: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    }
  },
  created(){	
  	   this.cptUrl = this.formReportFile; 
  	 axios.post("/cgaSysLoginInfo/findInfoById.do")
				      .then(data => {
				      	  this.fileReproUrls=data.obj.frProjectUrl;
				      	 
				      });
 	}
}
</script>
