<template>
  <div  class="layout-content">
    
    <Row>
      <Col span="16" style="height:500px; border: 1px solid #dddee1; padding:10px;">
        <img :src="apiH+ '/attachment/onLinePre.do?fileId=' + $route.query.fileId" class='examineImg' v-if='$route.query.fileType == ".png" ||  $route.query.fileType == ".jpg"'>
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + $route.query.fileId"  class='examineImg' v-else></iframe>
      </Col>
      <Col span="8">
        <Form :label-width="120" class="form-bottom">
          <FormItem label="申请人：">{{userData.relatedPersonName}}</FormItem>
          <FormItem label="证件类型：">{{userData.cardTypeName}}</FormItem>
          <FormItem label="证件号码：">{{userData.cardNumber}}</FormItem>
          <FormItem label="材料名：">{{$route.query.fileName}}{{$route.query.fileType}}</FormItem>
          <FormItem label="材料审核意见：">
            <Input type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..." v-model='description'></Input>
          </FormItem>
        </Form>   
                  
      </Col>
    </Row>
    <Row>
      <Col span='24' style='text-align:center;'>
        <Button type="success" style="margin-bottom:3px; margin-top:8px;" @click='submit'>通过</Button>
        <Button type="warning" style="margin-bottom:3px; margin-top:8px;"  @click='cancel'>不通过</Button> 
        <router-link :to="{path:'view', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber,tabsName:$route.query.tabsName}}"><Button>返回</Button></router-link>   
      </Col>
    </Row>

  </div>
</template>

<script>

export default{
  
  data(){
    return{
      apiH:'',
      description:'',
      userData:'',
    }
  },
  //根据办件流水号和事项资料ID查询查看材料的列表
  created(){
    this.apiH = window.config.api; 
    this.caseDetailSearch();
  },
  
  methods: {
    //查询我的办件（或机关办件）的办件详情信息  
    caseDetailSearch(){
      axios.post("/cgaCase/queryMyCaseInfoByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.userData = Object.assign({}, this.userData, data.obj.relatedPersonInfo);
      }); 
    },
   
    //审核办件材料（通过或不通过）
    submit(){
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:this.$route.query.viewId, isPass:'1', description:this.description})
      .then(data=>{
        this.$Message.success('材料审核通过');
        this.$router.push({path:'view', query:{materialId:this.$route.query.materialId, id:this.$route.query.id, caseId:this.$route.query.caseId, projectId:this.$route.query.projectId, moduleId:this.$route.query.moduleId,cardNumber:this.$route.query.cardNumber}})
      })
    },
    cancel(){
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:this.$route.query.viewId, isPass:'0', description:this.description})
      .then(data=>{
        this.$Message.success('材料审核不通过');
        this.$router.push({path:'view', query:{materialId:this.$route.query.materialId, id:this.$route.query.id, caseId:this.$route.query.caseId, projectId:this.$route.query.projectId, moduleId:this.$route.query.moduleId,cardNumber:this.$route.query.cardNumber}})
      })
    },
   
  
  },
}
</script>

<style lang="scss">
.examineImg{
  height:480px;
  width:100%;
}

</style>