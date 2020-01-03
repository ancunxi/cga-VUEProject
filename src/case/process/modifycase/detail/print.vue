<template>
  <div class="layout-content">
    <h5 class="title margin-bottom-10">缴费通知单</h5>
    <Row style="height:300px;border:1px solid #dddee1;margin-bottom:20px;">
      <Col span="24">
        缴费通知单由后端接口提供，是一个嵌套的html页面。
      </Col>
    </Row> 
    <Row class="center">
      <Col span="24">
        <Button type="success">打印</Button>
        <router-link to="./index" style="margin-left:8px;"><Button>返回</Button></router-link>
      </Col>
    </Row>         
  </div>
</template>

