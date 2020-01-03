<template>
  <Row class="panel">
    <Col span="24">
      <Row class="margin-bottom-10">
        <Col span="7"><strong>办理事项：</strong>{{panelCaseInfo.projectName}}</Col>
        <Col span="7"><strong>受理机关：</strong>{{panelCaseInfo.acceptDeptName}}</Col>
        <Col span="5"><strong>事项类型：</strong>{{panelCaseInfo.projectTypeName}}</Col>
        <Col span="5"><strong>办件类型：</strong>{{panelCaseInfo.caseTypeName}}</Col>        
      </Row>
      <Row>
        <Col span="7">
          <strong>办理时限：</strong>
          <span class="red">{{panelCaseInfo.promiseDaysDesc}}</span>
        </Col>
        <Col span="7">
          <strong>办件流水号：</strong> 
          <span class="red">{{panelCaseInfo.caseId}}</span>
        </Col> 
        <Col span="5">
          <!--<strong>是否收费：</strong>-->
          <!--<span class="red">{{panelCaseInfo.isChargeName}}</span>-->
          <strong>办件渠道：</strong>
          <span class="red">
          	<template v-if="panelCaseInfo.applySource=='01'" >网上大厅</template>
          	<template v-else-if="panelCaseInfo.applySource=='02'" >Android</template>
          	<template v-else-if="panelCaseInfo.applySource=='03'" >IOS</template>
          	<template v-else-if="panelCaseInfo.applySource=='04'" >微信</template>
          	<template v-else-if="panelCaseInfo.applySource=='05'" >自助机</template>
          	<template v-else-if="panelCaseInfo.applySource=='06'" >窗口</template>
          	<template v-else>其他</template>
          </span>
        </Col>
        <Col span="5">
          <strong>资料袋查阅：</strong>
          <span class="red">{{panelTacheInfo.materialbagViewStatus}}</span>
        </Col>                        
      </Row>
    </Col>
  </Row>
</template>

<script>
export default{
  //父组件向子组件传递办件详情数据
  props: {
    panelCaseInfo: {
      type: Object
    },
    panelTacheInfo: {
      type: Object
    }     
  }
}
</script>
