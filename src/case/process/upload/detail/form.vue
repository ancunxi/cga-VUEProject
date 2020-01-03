<template>
  	<div class="layout-content">
  		<Row style="width:100%;height:800px;border:1px solid #dddee1;margin-bottom:20px;">
	        <Col span="24">
	          <iframe id="reportFrame" width="100%" height="800" :src='this.$route.query.fineReportUrl+"/ReportServer?reportlet="+this.$route.query.cptUrl+"&op=write&caseId="+this.$route.query.caseId'></iframe>
	        </Col>
	    </Row>

      <Row class="margin-bottom-20 center">
        <Col span="24">
          <router-link :to='"index?caseId="+this.$route.query.caseId+"&projectId="+this.$route.query.projectId' style="margin-left:8px;"><Button>返回</Button></router-link>
        </Col>
      </Row>

  	</div>
</template>
<script>
export default {
  data () {
    return {
    	//cptUrl:'',
    	//FineReportUrl:''
    }
  },
  //created(){
    //this.cptUrl = this.$route.query.cptUrl;
  //},
  //mounted() {
	 //axios.post("/cgaSysLoginInfo/findInfoById.do")
		 //.then(data => {
			 // this.FineReportUrl=data.obj.frProjectUrl;
		  //});
	//},
}
</script>