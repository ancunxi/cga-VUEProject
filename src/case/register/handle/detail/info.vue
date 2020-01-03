<!-- 申请基本信息  查看 -->
<template>    
  <Form :label-width="130">
    <Row class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="document-text"></Icon>项目信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="申请类别：">
            {{projectData.applyObjectTypeName}}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="短信通知：">
              {{projectData.isSms=='0'?'是':'否'}}
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="发证方式：">{{projectData.issueTypeName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="项目名称：">{{projectData.caseName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="资料袋条码号：">{{projectData.caseBarcode}}</FormItem>
          </Col>                  
        </Row> 
        <Row>
          <Col span="12">
            <FormItem label="项目地址：">  
              {{trueProjectAddress}}
              <Icon v-if="trueProjectAddress!=''" type="location" title="地址定位"   @click.native="addressLocationXMDZFun"></Icon>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="办件流转街道：">
              <Input v-model="assignDeptName" class='areaInput' placeholder="请选择办件流转街道" @on-focus="deptChooseFun"></Input>
              <dept-choose 
                ref='streetDeptChild' 
                @streetDeptChildFun='streetDeptChildFun'>
              </dept-choose>
            </FormItem>
          </Col>  
        </Row>                                         
      </Col>
    </Row>

    <Row v-if="projectData.applyObjectType=='0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="person"></Icon>申请人信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="证件类型：">{{userData.cardTypeName}}</FormItem>
          </Col>
          <Col span="16">
            <FormItem label="证件号码：">{{userData.cardNumber}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="姓名：">
              {{userData.relatedPersonName}}<Icon type="person" title="点击查看头像" v-if='userIconShow' @click.native="viewIcon"></Icon>
            </FormItem>
          </Col>                   
          <Col span="8">
            <FormItem label="性别：">{{userData.sexName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="手机号码：">{{userData.mobile}}</FormItem>
          </Col> 
        </Row> 
        <Row>                                   
          <Col span="8">
            <FormItem label="座机电话：">{{userData.officeTel}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="邮政编码：">{{userData.zipcode}}</FormItem>
          </Col>                  
          <Col span="8">
            <FormItem label="电子邮箱：">{{userData.email}}</FormItem>
          </Col>                  
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="通讯地址：">  
              {{trueTxAddress}}
              <Icon v-if="trueTxAddress!=undefined && trueTxAddress!=''" type="location" title="地址定位" @click.native="addressLocationTXDZFun"></Icon>
            </FormItem>
          </Col>  
        </Row>                                                          
      </Col>
    </Row>

    <Row v-else class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="home"></Icon>申请企业信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="企业类型：">{{userData.cardTypeName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="统一社会信用代码：">{{userData.cardNumber}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="经办人：">
              {{userData.relatedPersonName}}<Icon type="person" title="点击查看头像" v-if='userIconShow' @click.native="viewIcon"></Icon>
            </FormItem>
          </Col>                    
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="企业名称：">{{userData.ename}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="经办人电话：">{{userData.mobile}}</FormItem>
          </Col>                                      
        </Row> 
        <Row>
          <Col span="8">
            <FormItem label="营业执照号：">{{userData.licenseNumber}}</FormItem>
          </Col>                                          
          <Col span="8">
            <FormItem label="法人代表：">{{userData.keyman}}</FormItem>
          </Col>                  
          <Col span="8">
            <FormItem label="法人身份证：">{{userData.keymanIdcard}}</FormItem>
          </Col>                  
        </Row>
        <Row>                                   
          <Col span="8">
            <FormItem label="邮政编码：">{{userData.zipcode}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="企业电话：">{{userData.officeTel}}</FormItem>
          </Col>                                              
        </Row> 
        <Row>
          <Col span="24">
            <FormItem label="通讯地址：">  
              {{trueTxAddress}}
              <Icon v-if="trueTxAddress!=undefined && trueTxAddress!=''" type="location" title="地址定位" @click.native="addressLocationTXDZFun"></Icon>
            </FormItem>
          </Col>                                                                        
        </Row>
      </Col>
    </Row>

     <Modal
      v-model="mapModal"
      title="百度地图"
      width="1200"
      class-name="ivu-modal-style"
      :mask-closable="false">
      <map-modal ref='mapChild'></map-modal>
      <div slot="footer"></div>            
    </Modal>                                                     
  </Form>       
</template>

<script>
import mapModal from '../../../common/view/mapSearch.vue';    //地图
import deptChoose from '../../../common/streetDeptChoose.vue';      //街道业务部门选择
export default {
  props: {
    isShowData: {
      type: Object
    },
  }, 
  components: {
    'map-modal': mapModal,
    'dept-choose':deptChoose,
  },
  data () {
    return {    
      //项目地址
      trueProjectAddress:'', 
      //通讯地址
      trueTxAddress:'',

      issueTypeData: [],       //发证方式
      assignDeptData: [],      //办件流转街道
      //性别（这里需要注意！）
      sexData: [
        {
          id: '01',
          name: '男'
        },
        {
          id: '02',
          name: '女'
        },        
      ],             
      cardTypeData: [],        //证件类型
      companyTypeData: [],     //企业类型
      specialData: [],         //特殊情况材料列表数据
      //项目信息块
      projectData: {
        applyObjectType: '0',  //申请类别
        isSms: '1',            //短信通知
        issueType: '01',       //发证方式
        caseName: '',          //项目名称
        assignDeptId: '',      //办件流转街道Id
        caseAreaCode: '',      //项目所在地区
        caseAddress: '',       //项目所在地区详细地址
      },
      //个人信息或企业信息块
      userData: {
        cardType: '',          //证件类型、企业类型
        cardNumber: '',        //证件号码、统一社会信用代码
        relatedPersonName: '', //申请人姓名、经办人姓名
        sex: '',               //性别
        mobile: '',            //手机号码、经办人电话
        officeTel: '',         //座机电话、企业电话
        zipcode: '',           //邮政编码
        email: '',             //电子邮箱
        areaCode: '',          //通讯所在地区
        address: '',           //通讯详细地址
      },
      userIconShow:false,    
      specialModal:false,      //特殊情况材料上传 modal框
      relatedModal:false,      //关联人 modal框
      nextAudit:false,         //下一环节审核人 是否显示
      mapModal:false,          //百度地图
      assignDeptName:'',			 //街道业务部门名称
    }
  },
  created(){
    //初始化项目名称
    this.projectData.caseName = this.$route.query.projectName;  
    //获取数据字典下拉框数据
    axios.post("/cgaCaseRegist/getRegistAllDictInfo.do")
    .then(data=>{
      this.issueTypeData = data.obj.issueTypeDict;
      this.cardTypeData = data.obj.cardTypeDict;
      this.companyTypeData = data.obj.companyTypeDict;
    });
    //获取办件流转街道下拉框数据
    axios.post("/cgaCaseRegist/queryDeptListByRange.do", {acceptingRange:'4'})
    .then(data=>{
      this.assignDeptData = data.obj;
    });

    //进入后获取 项目信息/申请人信息 部分
    this.caseDetailSearch();
    //渲染特殊情况材料列表
    this.getSpecial();
  },
  methods: {
    //查询我的办件（或机关办件）的办件详情信息  
    caseDetailSearch(){
      axios.post("/cgaCase/queryMyCaseInfoByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.projectData = Object.assign({}, this.projectData, data.obj.caseInfo);
        this.userData = Object.assign({}, this.userData, data.obj.relatedPersonInfo);

        //项目地址
        var caseAreaCodeName1=this.projectData.caseAreaCodeName || '';
        var caseAddress1=this.projectData.caseAddress || '';
        this.trueProjectAddress=caseAreaCodeName1+caseAddress1;
        //通讯地址
        var areaCodeName1=this.userData.areaCodeName || '';
        var address1=this.userData.address || '';
        this.trueTxAddress=areaCodeName1+address1;
        
        this.searchUserIcon();
      }); 
    },
    //根据办件流水号获取特殊情况材料列表数据
    getSpecial(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj;      
      }); 
    },

    //预览
    searchUserIcon(){
      var fileId=this.userData.applyFileId;
      if(fileId==undefined || fileId==''){
        this.userIconShow = false;
      }
    },
   
    viewIcon(){
      var fileId=this.userData.applyFileId;
      var fileName="";
      //根据附件id查询附件详细信息
      axios.post("/attachment/getAttachmentInfoById.do", {fileId:fileId})
      .then(data=>{
        fileName = data.obj.fileName || '';
        if(fileName!='' && fileName!=undefined){
          if(/^.+\.png$/.test(fileName) == false && /^.+\.jpg$/.test(fileName) == false){
             this.$emit('previewsFun',fileId,'.pdf');
          }else{
            this.$emit('previewsFun',fileId,'.jpg');
          }
        }else{
          this.$Message.error('头像查询失败！');
          return;
        }     
      });
    },

    //项目地址
    addressLocationXMDZFun(){
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.trueProjectAddress,'');
    },
    //通讯地址
    addressLocationTXDZFun(){
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.trueTxAddress,'');
    },
    //获取办件流转街道的数据
    deptChooseFun(){
    	this.$refs.streetDeptChild.loadDeptList();
   	},
    streetDeptChildFun(assignDeptId,assignDeptName){
   		this.projectData.assignDeptId = assignDeptId;
   		this.assignDeptName = assignDeptName;
      this.$emit("street",this.projectData.assignDeptId)
   	},
  }
}
</script>


  