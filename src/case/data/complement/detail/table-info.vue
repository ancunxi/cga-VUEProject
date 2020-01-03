
<template>
	
  <Row class="panel">
  	
    <Col span="24">
      <Row class="margin-bottom-10">
        <Col span="7"><strong>办理事项：</strong>{{caseInfoData.projectName}}</Col>
        <Col span="7"><strong>受理机关：</strong>{{caseInfoData.acceptDeptName}}</Col>
        <Col span="5"><strong>事项类型：</strong>{{caseInfoData.projectTypeName}}</Col>
        <Col span="5"><strong>办件类型：</strong>{{caseInfoData.caseTypeName}}</Col>        
      </Row>
      <Row>
        <Col span="7">
          <strong>办理时限：</strong>
          <span class="red">{{caseInfoData.promiseDaysDesc}}</span>
        </Col>
        <Col span="7">
          <strong>办件流水号：</strong> 
          <span class="red">{{this.$route.query.caseId}}</span>
        </Col> 
        <Col span="5">
          <strong>是否收费：</strong>
          <span class="red">{{caseInfoData.isChargeName}}</span>
        </Col>               
      </Row>
    </Col>
  </Row>
</template>
<script>
export default{
  data(){
    return{
      caseInfoData: {
        type: Object
      }
    }
  },
  created(){
    //根据办件流水号查询办件登记相关信息
    axios.post("/cgaCase/queryCaseRegistInfoByCaseId.do", {caseId:this.$route.query.caseId})
    .then(data=>{
      this.caseInfoData = data.obj.caseInfo;
      //办件ID
      this.caseInfoData.id = data.obj.caseInfo.id;
      if(this.$route.query.id == undefined){
        this.$router.push({path:this.$route.fullPath+'&id='+this.caseInfoData.id});
      }
    });
  }
}
</script>
