<template>
  <div class="layout-content">
    <Row>
      <Col span="24">
        <h3 class="guide-title">{{egsProjectInfo.projectName}}</h3>
        <h5 class="guide-subtitle">
          <span>事项类型：<strong class="red">{{egsProjectInfo.projectTypeName}}</strong></span>
          <span>所需资料种类数量：<strong class="red">{{trueMaterialsCount}}</strong></span>
          <span>是否收费：<strong class="red">{{isChargeName}}</strong></span>
        </h5>
      </Col>
    </Row>
    <Row>
      <Col span="13">
        <Row>
          <Col span="24">
              <material-view :usablegids='usableGids' ref="profile"></material-view>
          </Col>
        </Row>
      </Col>
      <Col span="10" offset="1" class="explain">
        <Row class="margin-bottom-20">
          <Col span="24">
            <problemTable-view></problemTable-view>
          </Col>
        </Row>
        <Row class="margin-bottom-20">
          <Col span="24">
            <projectFoundationPage-view></projectFoundationPage-view>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row class="center">
      <Col span="24">
        <router-link :to="{path:'index', query:{projectId:this.$route.query.projectId,
          projectNo:this.$route.query.projectNo,projectName:this.$route.query.projectName,
          usableGids:this.$route.query.usableGids}}">
          <Button type="success">上一步</Button>
        </router-link>
        <Button type="primary" @click="checkedAll" style="margin-left:8px;">完成</Button>
        <!-- <router-link to="lack" style="margin-left:8px;"><Button type="warning">材料不足</Button></router-link> -->
        <Button type="warning" @click="toLack">材料不足</Button>
      </Col>
    </Row>

    <!--loading框 Modal Templates-->
    <div class="dhx_modal_cover" v-if='loadingModal'></div>
    <div dhxbox="1" class="dhx_modal_loading" v-if='loadingModal'></div>
    <!--End loading框 Modal Templates-->
  </div>
</template>

<script>
import problemTable from './commonProblemTable.vue';
import projectFoundationPage from './cgaProjectFoundationTable.vue';
import trueMaterialsInfo from './trueMaterialsInfo.vue';
export default{
  components: {
    'problemTable-view':problemTable,
    'projectFoundationPage-view':projectFoundationPage,
    'material-view':trueMaterialsInfo
  },
  data(){
    return{
      loadingModal: false, //loading框
      //页面初始化数据
      egsProjectInfo:{},
      isChargeName:'',
      trueMaterialsCount:'',
      usableGids:[],
      caseId:'',
      noSelectedMids:[],
      allSelectedMids:[],
      allCheckBox:[],
      selectedCheckBox:[]
    }
  },
  created(){
  	this.usableGids=this.$route.query.usableGids;
    axios.post("/cgaCaseRegist/getCgaCaseGuideBaseInfo.do",{guideIds:this.$route.query.guideIds,projectId:this.$route.query.projectId,
      projectNo:this.$route.query.projectNo})
    .then(data=>{
      if(!data.success){
        //返回错误状态
        return false;
      }
      // this.egsProjectMaterialsInfo = data.obj.egsProjectMaterialsInfo || [];
      this.egsProjectInfo = data.obj.egsProjectInfo || {};
      this.isChargeName = data.obj.isCharge==0?"收费":"不收费";
      this.trueMaterialsCount=data.obj.trueMaterialsCount;
    });
  },
  methods: {
    checkedAll(){
      this.loadingModal = true;
      //获取已选择的资料
      /*let choosedCheckbox = [];
      let materialsIdArr = [];
      let materialsIdStr = "";
      choosedCheckbox=$("td > div > input[type='checkbox']:checked");
      for(var i=0;i<choosedCheckbox.length;i++){
        materialsIdArr.push(choosedCheckbox[i].value)
      }
      materialsIdStr = materialsIdArr.join();*/


    //  var t=this.$refs.profile.checkboxModel || [];
     // var k=this.$refs.profile.trueMaterialsList || [];
     // if(t.length==0 && k.length==0){
      //  this.loadingModal = false;
      //  this.$Message.error({
      //    content: '无可选的资料，请检查向导是否配置正确！',
      //    duration: 3
     //   });
     //   return;
     // }
      // var checkedLength=this.$refs.profile.checkboxModel.length;
      // var allCheckBoxLength=this.$refs.profile.trueMaterialsList.length;
      // if(checkedLength<allCheckBoxLength){
      //   this.loadingModal = false;
      // 	this.$Message.error({
      //     content: '请勾选全部所需材料',
      //     duration: 3
      //   });
      // }else{
        this.loadingModal = false;
        //请求后台向外屏发送消息
        axios.post("/cgaCaseRegist/onlySendMsgToAndroid.do",{chooseGids:this.usableGids.join(),projectNo:this.$route.query.projectNo})
        .then(data=>{
          if(data.obj.msg == "success"){
            this.$Message.success('向外屏发送消息成功！');
          }
        });
      	axios.post("/cgaCaseRegist/initCase.do", {projectId:this.$route.query.projectId,guideIds:this.$route.query.guideIds})
      	.then(data=>{
          this.caseId = data.obj.caseId;
          this.$router.push({path:'../window/detail/index', query:{moduleId:this.$route.query.moduleId,projectId:this.$route.query.projectId, projectName:this.$route.query.projectName, caseId:this.caseId,usableGidAble:this.usableGids}})
        });
	    //}
    },
    toLack(){
      //var t=this.$refs.profile.checkboxModel || [];
     // var k=this.$refs.profile.trueMaterialsList || [];
     // if(t.length==0 && k.length==0){
     //   this.$Message.error({
     //     content: '无可选的资料，请检查向导是否配置正确！',
    //      duration: 3
     //   });
     //   return;
     // }
      this.selectedCheckBox=this.$refs.profile.checkboxModel;
      this.allCheckBox=this.$refs.profile.trueMaterialsList;
      for(var i=0;i<this.allCheckBox.length;i++){
      	if(this.selectedCheckBox.indexOf(this.allCheckBox[i].materialId)==-1){//把没有选中的材料id放入变量中
      		this.noSelectedMids.push(this.allCheckBox[i].materialId);
      	}
      	this.allSelectedMids.push(this.allCheckBox[i].materialId);
      }
      if(this.selectedCheckBox.length==this.allCheckBox.length){
      	this.$Message.error({
          content: '已勾选全部材料，不存在材料不足！',
          duration: 3
        });
      }else{
      	this.$router.push({path:'lack', query:{moduleId:this.$route.query.moduleId, projectId:this.$route.query.projectId, projectName:this.$route.query.projectName,projectNo:this.$route.query.projectNo,allSelectedMids:this.allSelectedMids,noSelectedMids:this.noSelectedMids,guideIds:this.$route.query.guideIds}})
      }
    }
  }
}
</script>

<style lang="scss">
.guide-title{
  margin-bottom: 15px;
  text-align: center;
}
.guide-subtitle{
  padding-bottom: 15px;
  margin-bottom: 40px;
  text-align: center;
  border-bottom: 1px solid #dddee1;
  span{
    margin-right: 50px;
    &:last-child{
      margin-right: 0;
    }
  }
}
.need{
  overflow: hidden;
  margin-bottom: 5px;
  &>span{
    display: inline-block;
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
    font-weight: bold;
  }
}
.explain{
  h5{
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    background: #5cadff;
    color: #fff;
    &>i{
      margin-right: 5px;
    }
  }
  .list{
    padding: 6px 15px;
    margin-bottom: 5px;
    border: 1px solid #dddee1;
    border-top: none;
    li{
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
