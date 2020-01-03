<!-- 网上办理 意见处理区 -->
<template>
  <div class="opinion-area">
    <div class="opinion-icon"><img src="../../../../assets/img/expand.png"></div>
    <div class="opinion-content">
      <Form  ref="opinionData" :model="opinionData">
        <Row style="border:1px solid #dddee1; padding:10px; margin-bottom:10px;">
          <Col span="4">
            <p><b>流程类型：</b> {{workFlowInfo.workFlowTypeDesc}}</p>
            <p><b>环节名称：</b> {{tacheInfo.tacheName}}</p>
            <p><b>环节天数：</b> {{tacheInfo.tacheDays}}</p>
            <p><b>指定处理人：</b> {{tacheInfo.assignerNames}}</p>
          </Col>

          <Col span="12" offset="1">
            <span>处理意见：</span>
            <!-- <FormItem class="no-margin-bottom">
              <Input type="textarea" :autosize="{minRows:4,maxRows: 4}" placeholder="请输入环节处理意见" v-model='tacheIdea'></Input>
            </FormItem> -->
            <FormItem
              class="margin-bottom-10 opinionDataBox"
              prop="tacheIdea"
              :rules="{required: true, message: '环节处理意见不能为空', trigger: 'blur'}">
              <Input type="textarea" :autosize="{minRows:4,maxRows:4}" placeholder="请输入环节处理意见,150个字符以内" v-model='opinionData.tacheIdea' :maxlength="opinionNum"></Input>
            </FormItem>
          </Col>

          <Col span="6" offset="1">
            <Row>
              <Col span="24">
                <Input placeholder="添加常用意见" class="common-opinion" v-model='opinion'></Input>
                <Button type="primary" size="small" style="margin-left:5px;" @click='addOpinion'>添加</Button>
              </Col>
              <Col span="24" class='opinionBox'>
                <div class="system-opinion">
                  <span  v-for='(item, index) in opinionListSys'>
                    <a href="javascript:;" @dblclick='dblOpinion(item.opinionDesc)'>{{item.opinionDesc}}</a>
                    <i class="ivu-breadcrumb-item-separator">|</i>
                  </span>                                     
                </div>
                <div class="self-opinion">
                  <template v-for='(item, index) in opinionList'>
                    <a href="javascript:;">
                      <span @dblclick='dblOpinion(item.opinionDesc)'>{{item.opinionDesc}}</span>
                      <i class="ivu-icon ivu-icon-android-cancel" @click='delOpinion(item.id)'></i>
                    </a>                    
                  </template>
                </div>
              </Col>
            </Row>           
          </Col>
        </Row>

        <Row class="center">
          <Col span="24">
            <FormItem>
              <Button type="primary" @click="agree">通过</Button>
              <Button type="warning" @click="veto" style="margin-left:8px;">不通过</Button> 
              <!-- <Button type="error" @click="handleUnpass" style="margin-left:8px;">不予登记</Button> -->
              <router-link :to="{path:'../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}}" style="margin-left:8px;"><Button>返回</Button></router-link>

              <!--不予登记-->  
              <!-- <Modal 
                v-model="unpassModal" 
                width="520" 
                class-name="ivu-modal-style audit-modal"
                :mask-closable="false">
                <p slot="header"><span>不予登记意见框</span></p>
                <div>
                  <Form :label-width="20">
                    <div style="text-align:center; padding: 10px 20px;">
                      
                      <FormItem :class="unpassTip?'ivu-form-item-error':''">
                        <i style="position:absolute;left:-20px; top: 0; color: #ed3f14;">*</i>
                        <Input v-model="unpassOpinion" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入处理意见"></Input>
                        <div class="ivu-form-item-error-tip" v-show="unpassTip">请输入处理意见</div>
                      </FormItem>
                    </div>
                     
                    <div class="ivu-modal-btn">
                      <FormItem>
                        <Button type="text" @click="unpassCancel">取消</Button>
                        <Button type="primary" @click="unpassSubmit" style="margin-left: 8px">确定</Button>
                      </FormItem>                
                    </div>               
                  </Form>
                </div>
              </Modal> -->

              <Modal 
                v-model="auditModal" 
                width="520" 
                class-name="ivu-modal-style opinion-modal"
                :mask-closable="false">
                <p slot="header"><span>下一环节</span></p>
                <Form ref="tacheData" :model="tacheData" :label-width="130">
                  <template v-for="(item, index) in tacheList">              
                    <div class="ivu-modal-form">
                      <FormItem label="下一环节名称：">{{item.tacheName}}</FormItem>
                      <!--以下条件都满足时显示‘下一环节处理人’这一项内容-->
                      <template v-if="showNextUserSelect && item.candidateList &&item.candidateList.length > 0 ">
                        <FormItem label="下一环节处理人：" 
                          prop="auditorId"
                          :rules="[{required:true, type:'array', min:1, message:'请选择下一环节处理人', trigger:'change'}]">
                          <Select v-model="tacheData.auditorId[index]" multiple placeholder="请选择下一环节处理人">
                            <template v-for="subItem in item.candidateList">
                              <Option :value="subItem.userId" :key="subItem.userId">{{ subItem.userName }}</Option>
                            </template>
                          </Select>
                        </FormItem>  
                      </template>
                    </div>              
                  </template>
                </Form>
                <div slot="footer">
                  <Button type="text" @click="handleReset">取消</Button>
                  <span v-if="showNextUserSelect">
                    <Button type="primary" @click="haveSelectStart" style="margin-left: 8px">确定</Button>
                  </span> 
                  <span v-else>
                    <Button type="primary" @click="noSelectStart" style="margin-left: 8px">确定</Button>
                  </span>
                </div>
              </Modal>
            </FormItem>
          </Col>
        </Row> 
      </Form>
    </div>
  </div>
</template>

<script>
require('../../../../assets/js/jquery.min.js');
export default {
  //父组件向子组件传递基本信息页签详情数据
  props: {
    workFlowInfo: {
      type: Object
    },
    tacheInfo: {
      type: Object
    },
    assignDeptId:{
      type:String
    }
  },
  data () {
    return {
      // unpassModal: false,         //不予登记弹窗
      // unpassOpinion: '',          //不予登记意见框
      // unpassTip: false,           //不予登记
      opinionNum:150,            //处理意见限制的字数
      opinionData: {
        tacheIdea: '',            //环节处理意见
      }, 
      opinion: '',                //添加意见
      opinionList: [],            //添加意见列表 
      opinionListSys: [],         //系统意见表
      auditModal: false,          //下一环节弹窗
      showNextUserSelect: false,  //根据条件判断是否显示选人框
      tacheList: [],              //下一环节数据
      tacheSubList: [],           //提交下一环节数据
      isShowNextUserSelect: '',   //0不显示下一环节选人框，1显示下一环节选人框
      isParallelGateway: '',      //是否入/出并联环节，0否，1是
      tacheData: {
        auditorId: [],            //所选中的下一环节处理人Id
      }      
    }
  },
  created(){
    this.allOpinionList()//查询全部常用意见（含系统和个人意见）
  },
  mounted(){
    this.run();
  },
  methods: {
    //查询全部常用意见（含系统和个人意见）
    allOpinionList(){
      axios.post("/cgaCaseOpinion/queryAllOpinionList.do", {})
      .then(data=>{
        this.opinionListSys = data.obj.filter((item)=>item.opinionType == '0') || [];
        this.opinionList = data.obj.filter((item)=>item.opinionType == '1') || [];
      })  
    },
    //添加个人常用意见
    addOpinion(){
      if(this.opinion == ''){
        this.$Message.error('个人意见为空!');
        return false;
      }
      axios.post("/cgaCaseOpinion/addOption.do", {opinionDesc:this.opinion})
      .then(data=>{
        this.$Message.success('个人意见添加成功!');
        this.opinion = '';
        this.allOpinionList();
      })  
    },
    //删除个人常用意见
    delOpinion(id){
      axios.post("/cgaCaseOpinion/deleteOption.do", {id:id})
      .then(data=>{
        this.$Message.info('个人意见删除成功!');
        this.allOpinionList();
      }) 
    },
    //双击环节处理意见
    dblOpinion(item){
      if(this.opinionData.tacheIdea == ''){
        this.opinionData.tacheIdea = item;
      }else{
        this.opinionData.tacheIdea += '，'+item;
      }
    },

    // 不予登记
    // handleUnpass() {
    //   this.unpassOpinion == '';
    //   this.unpassModal = true;
    // },
    // unpassCancel() {
    //   this.unpassOpinion == '';
    //   this.unpassModal = false;
    // },
    // unpassSubmit() {
    //   if(this.unpassOpinion == ''){
    //     this.unpassTip = true;
    //     this.$Message.error('请输入处理意见');
    //     return false;
    //   }
    //   this.unpassTip = false;

    //   this.$emit('loadingShow');
    //   axios.post("/cgaCase/modifyCgaCaseForRegister.do", {caseId:this.$route.query.caseId, tacheIdea:this.unpassOpinion})
    //   .then(data=>{
    //     if(data.status == '200' && data.success == true){
    //       this.$Message.success(data.msg);
    //       this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
    //       this.unpassModal = false;
    //     }else{
    //       this.$Message.error(data.msg);
    //     }
    //     this.$emit('loadingHide');
    //   }).catch(error=>{
    //     this.$emit('loadingHide');
    //   });
    // },

    //环节处理区域同意操作
    agree(){
      this.$refs.opinionData.validate((valid) =>{
        axios.post("/cgaCaseRegist/saveCgaCaseNetCheckAssign.do",{assignDeptId:this.assignDeptId,caseId:this.$route.query.caseId})
        .then(data=>{
          if(data.status == '200' && data.success == true){
            if (valid) {
              //未开启工作流查询下一步候选人，渲染下拉选
              axios.post("/cgaCase/querySecondTaskCandidateList.do", {projectId:this.$route.query.projectId})
              .then(data=>{
                this.$emit('loadingHide'); 
  
                if(data.status == '200' && data.success == true){
                  //显示下一环节弹窗
                  this.auditModal = true; 
                  //下一环节数据
                  this.tacheList = data.obj;
                  //注意：需要设置数组的长度
                  for (var i = 0; i < this.tacheList.length; i++) {
                    this.tacheData.auditorId.push([]);
                  }
                  this.isShowNextUserSelect = data.obj.map(item => item.isShowNextUserSelect)[0].toString();
                  this.isParallelGateway = data.obj.map(item => item.isParallelGateway)[0].toString();
                  if(this.isShowNextUserSelect=='1'&&this.isParallelGateway=='0'){
                    //显示下一环节选人框
                    this.showNextUserSelect = true;
                  }else{
                    //不出现下一环节选人框
                    this.showNextUserSelect = false;
                  }
  
                }else{
                  this.$Message.error(data.msg);
                  return false
                }     
              }).catch(error=>{
                this.$emit('loadingHide');
              }); 
            }
          }else{
              this.$Message.error(data.msg);
              return false
          }
        })
      });
      
    },
    //点击登记完成按钮开启办件流程时，显示下一环节弹窗，如果没有下一环节处理人项时，可直接保存并提交数据
    noSelectStart(){
      //办件登记完成(网上办理 通过 同此接口)
      this.$emit('loadingShow');
      let nextUsers = '';
      if(this.showNextUserSelect){
        this.tacheSubList = this.tacheList.map(item =>{
          return {
            taskDefinitionKey: item.taskDefinitionKey,
            userIds: this.tacheData.auditorId.toString()
          }
        }); 
        this.nextUsers = JSON.stringify(this.tacheSubList);       
      }
      axios.post("/cgaCaseRegist/doCaseRegisterFinish.do", {id:this.$route.query.id, caseId:this.$route.query.caseId, projectId:this.$route.query.projectId, isParallelGateway:this.isParallelGateway, nextUsers:this.nextUsers, auditOpinion:this.opinionData.tacheIdea})
      .then(data=>{
        this.$emit('loadingHide');
        
        if(data.status == '200' && data.success == true){
          this.auditModal = false;
          this.$Message.success('办件开启成功！');
          this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
        }else{
          this.$Message.error('办件开启失败！');
          this.auditModal = true;
          return false;
        }
      }).catch(error=>{
        this.$emit('loadingHide');
      });          
    },
    //点击登记完成按钮开启办件流程时，显示下一环节弹窗，如果有下一环节处理人项时，需要先验证再保存并提交数据
    haveSelectStart(){
      this.$refs.tacheData.validate((valid) => {
        if (valid) {     
          let key = false;
          //注意：需要设置数组的长度
          for (var i = 0; i < this.tacheList.length; i++) {
            console.log(this.tacheData.auditorId[i][0])  
            if(this.tacheData.auditorId[i][0] == undefined){
              key = true;
              break;
            }
          }

          if(!key){
            this.noSelectStart();
          }else{
            this.$Message.error({
                content: '请选择下一环节处理人',
                duration: 5
            });
          }

        }
      })        
    },        
    //点取消按钮清空数据并关闭弹窗
    handleReset(){
      this.$refs.tacheData.resetFields();
      this.auditModal = false;
    },
    //网上办理不通过
    veto(){
      this.$refs.opinionData.validate((valid) =>{
        if (valid) {
          //申请办件之暂予登记、需补正、网上办理不通过等操作
          this.$emit('loadingShow');
          axios.post("/cgaCaseRegist/doTempOrSupplementRegist.do", {caseId:this.$route.query.caseId, caseState:'18', auditOpinion:this.opinionData.tacheIdea})
          .then(data=>{
            if(data.status == '200' && data.success == true){
              this.auditModal = false;
              this.$Message.success(data.msg);
              this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
            }else{
              this.$Message.error(data.msg);
            }
            this.$emit('loadingHide');
          }).catch(error=>{
            this.$emit('loadingHide');
          }); 
        }
      });     
    },
    //意见处理框动画效果
    run(){
      let ma = $('.opinion-area')[0];
      let side = $('.opinion-icon');
      let content = $('.opinion-content')[0];
      let toggle = true;
      side.on('click',function(){
        let timer = null;
        let timerd = null;
        if(toggle == true){
          timer = setInterval(function(){
            let seep = ma.offsetHeight/4 + 1;
            if(ma.offsetHeight <= 1){
              ma.style.height = 0;
              toggle = false;
              clearInterval(timer);
            }else{
              ma.style.height = ma.offsetHeight - seep + 'px';
            }
          },50);
          side.removeClass('back_active');
          side.addClass('go_active');    
        }else{
          timerd = setInterval(function(){
            let seep = (212 - ma.offsetHeight)/4 + 1;
            if(ma.offsetHeight >= 211){
              ma.style.height = 212 + 'px';
              toggle = true;
              clearInterval(timerd);
            }else{
              ma.style.height = ma.offsetHeight + seep + 'px';
            }
          },50);
          side.removeClass('go_active');
          side.addClass('back_active');
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
//start animate-------
.go_active{animation: goed 1s forwards;}
.back_active{animation: backed 1s forwards;}
@keyframes goed{
  0{transform: rotate(0deg);}
  100%{transform: rotate(180deg);}
}
@keyframes backed{
  1%{transform: rotate(180deg);}
  100%{transform: rotate(0deg);}
}
//end animate-------

.opinion-area{
  position: fixed;
  left: 16.66666667%;
  bottom: 0;
  width: 83.33333333%;
  background: #f3f3f3;
  .opinion-icon{
    position: fixed;
    width: 40px;
    height: 40px;
    margin-top: -40px;
    left: 56.66666667%;
    margin-left: -20px;
    cursor: pointer;
  }
  .opinion-content{
    padding: 10px 10px 0;
    .common-opinion{
      width: 80%;
      &>.ivu-input{
        height: 28px;
        //line-height: 28px;
      }
    }
    .opinionBox{
      border:1px solid #dddee1;
      padding:5px; 
      margin-top:5px;
      .system-opinion{
        a{
          color: #000;
        }
        a:hover{
          color: #2b85e4;
        }
        &>span:last-child .ivu-breadcrumb-item-separator{
          display: none;
        }
      }
      .self-opinion{
        margin-top: 5px;
        height:40px;
        overflow:auto;
        a{
          display: block;
          overflow: hidden;
          height: 20px;
          line-height: 20px;
          span{
            float: left;
            display: inline-block;
            height: 16px;
            line-height: 16px;
            padding: 2px 5px;
            color: #495060;
          }
          &:hover span{
            color: #2b85e4;
          }
          i{
            float: left;
            margin-left: 5px;
            padding: 2px 5px;
            font-size: 16px;
            display: none;
          }
          &:hover i{
            display: block;
            color: #df5138;
          }
        }          
      }
    }    
  }
}
/***环节处理区***/
.opinion-modal{
  .ivu-modal-body{
    padding: 0;
    .ivu-form{
      .ivu-modal-form>.ivu-form-item{
        padding: 0 20px;
        &:first-child{
          padding-top: 24px;
        }
      }
      .ivu-modal-btn{
        border-top: 1px solid #e9eaec;
        padding: 12px 18px;
        text-align: right;
        .ivu-form-item{
          margin-bottom: 0;
        }
      }   
    }
  }
}
</style>