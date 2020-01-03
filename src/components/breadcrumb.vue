<template>
  <div class="layout-breadcrumb">    
    <Breadcrumb>
      <BreadcrumbItem><a href="javascript:;">首页</a></BreadcrumbItem>
      <BreadcrumbItem> 
        <a href="javascript:;" v-if='$route.path.indexOf("/case/register") !== -1'>办理登记</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/data") !== -1'>资料中心</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process") !== -1'>业务流程</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office") !== -1'>办件查询</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/count") !== -1'>办件统计</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/configuration") !== -1'>配置管理</a>
		<a href="javascript:;" v-else='$route.path.indexOf("/case/message") !== -1'>消息通知</a>
      </BreadcrumbItem>
      <BreadcrumbItem> 
        <a href="javascript:;" v-if='$route.path.indexOf("/case/register/window") !== -1'>窗口登记</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/register/temporarily") !== -1'>暂予登记处理</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/register/correction") !== -1'>补证件处理</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/register/handle") !== -1'>网上办理</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/register/pretreatment") !== -1'>网上预审</a> 
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/data/complement") !== -1'>资料补录</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/data/send") !== -1'>资料袋出件</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/data/receive") !== -1'>资料袋签收</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/data/inquire") !== -1'>资料袋查询</a> 
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/wait") !== -1'>工作待办</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/payment") !== -1'>办件缴费</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/upload") !== -1'>证照上传</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/print") !== -1'>证照打印</a> 
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/licensesend") !== -1'>证照签收</a> 
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/mine") !== -1'>我的办件</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/organs") !== -1'>受理机关办件</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/implementorgans") !== -1'>实施机关办件</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/instrument") !== -1'>审批文书</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/charge") !== -1'>收费信息</a> 
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/amount") !== -1'>办件量统计</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/time") !== -1'>办件时间分布统计</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/efficiency") !== -1'>办事效率统计</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/charge") !== -1'>收费统计</a>
		<a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/acceptUser") !== -1'>人员办件分类统计</a>
		<a href="javascript:;" v-else-if='$route.path.indexOf("/case/count/projetDept") !== -1'>办件事项部门分类统计</a>		
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/configuration/matter") !== -1'>事项配置</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/configuration/help") !== -1'>帮办配置</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/configuration/auxiliary") !== -1'>辅助流程配置</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/configuration/accept") !== -1'>受理事项配置</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/office/projectcase") !== -1'>事项办件</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/modifycase") !== -1'>办件修改</a>
        <a href="javascript:;" v-else-if='$route.path.indexOf("/case/process/supplementnotice") !== -1'>补正通知</a>
		<a href="javascript:;" v-else-if='$route.path.indexOf("/case/message/message") !== -1'>消息详情</a>
		<a href="javascript:;" v-else-if='$route.path.indexOf("/case/message/index") !== -1'>我的消息</a>
        <router-link :to="{path:'/case/process/administrativecharge/index', query:{moduleId:this.$route.query.moduleId}}" v-else-if='$route.path.indexOf("/case/process/administrativecharge") !== -1'>行政收费</router-link>
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

