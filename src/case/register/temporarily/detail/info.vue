<template>
  <div class="basicInfo">    
    <Form ref="projectData" :model="projectData" :label-width="130">
      <Row class="margin-bottom-20">
        <Col span="24">
          <h5 class="title"><span><Icon type="document-text"></Icon>项目信息</span></h5>
          <Row>
            <Col span="6">
              <FormItem label="申请类别：">
                <RadioGroup v-model="projectData.applyObjectType" @on-change="handleReset">
                  <Radio :label="'0'">个人</Radio>
                  <Radio :label="'1'">企业</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="短信通知：">
                <RadioGroup v-model="projectData.isSms">
                  <Radio :label="'0'">是</Radio>
                  <Radio :label="'1'">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="发证方式：">
                <RadioGroup v-model="projectData.issueType">
                  <template v-for="item in issueTypeData">
                    <Radio :label="item.dictId">{{item.dictName}}</Radio>
                  </template>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem 
                label="项目名称：" 
                prop="caseName"
                :rules="[{required: true, message: '项目名称不能为空', trigger: 'blur'}]">
                <Input v-model="projectData.caseName" placeholder="请输入项目名称" @on-blur="checkedCaseName"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipName">项目名称首尾不能有空格</div>
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
          <Row>
            <Col span="12">
              <FormItem label="项目地址：">
                <Input v-model="projectData.caseAreaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('XMDZ')"></Input>
                <city-modal 
                  ref='cityChildXMDZ' 
                  @cityChildFun='cityFunXMDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="projectData.caseAddress" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationXMDZFun"></Input>
              </FormItem>
            </Col> 
          </Row> 
          <Row>
            <Col span="12">
              <FormItem 
                label="业务编号：" >
                <Input v-model="projectData.code1"  class="businessCode" placeholder="请输入项目名称" @on-change="checkedCode(0)"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="票号：">
                <Input v-model="projectData.code2" placeholder="请输入项目名称" @on-blur="checkedCode(1)"></Input>
              </FormItem>
            </Col>                  
          </Row>                                         
        </Col>
      </Row>
    </Form>

    <!--根据申请类别值控制申请人信息和申请企业信息模块是否显示-->
    <Form ref="userData" :model="userData" :label-width="140">
      <Row v-if="this.projectData.applyObjectType=='0'" class="margin-bottom-20">
        <Col span="24">
          <h5 class="title"><span><Icon type="person"></Icon>申请人信息</span></h5>
          <Row>
            <Col span="8">
              <FormItem 
                label="证件类型：" 
                prop="cardType"
                :rules="[{required: true, message: '请选择证件类型', trigger: 'change'}]">
                <Select v-model="userData.cardType" placeholder="请选择证件类型" @on-change="v=>{setCardOption(v)}">
                  <template v-for="item in cardTypeData">
                    <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col span="15">
              <FormItem 
                label="证件号码：" 
                prop="cardNumber"
                :rules="[{required: true, message: '证件号码不能为空', trigger: 'blur'}]">
                <Input v-model="userData.cardNumber" placeholder="请输入证件号码" @on-blur="checkedIdCard"></Input>
               <!-- <i class="ivu-icon ivu-icon-card" @click="Idcard" v-show="idCardIcon" style="position:absolute; top:2px; right:0;"></i>-->
                <div class="ivu-form-item-error-tip" v-show="tipNumber" v-text="tipMsg"></div>
              </FormItem>
            </Col>
            <Col span="1">
              <span style="display:inline-block; margin:6px; height:33px;" >
                <Icon type="alert-circled" color="#ed3f14" size="20" title="该证件号曾出现虚假材料记录，请认真审核材料" v-if="userData.falseMaterialNum != 0"/>
              </span>
            </Col>
          </Row>
          
          <Row>
            <Col span="8">
              <FormItem 
                label="申请人姓名：" 
                prop="relatedPersonName"
                :rules="[{required: true, message: '申请人姓名不能为空', trigger: 'blur'}]">
                <Input v-model="userData.relatedPersonName" placeholder="请输入姓名"></Input>
              </FormItem>
            </Col>                   
            <Col span="8">
              <FormItem 
                label="性别："
                prop="sex"
                :rules="[{required: true, message: '请选择性别', trigger: 'change'}]">
                <RadioGroup v-model="userData.sex">
                  <template v-for="item in sexData">
                    <Radio :label="item.id">{{item.name}}</Radio>
                  </template>
                </RadioGroup>             
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem 
                label="手机号码：" 
                prop="mobile"
                :rules="[{required: true, message: '手机号码不能为空', trigger: 'blur'}]">
                <Input v-model="userData.mobile" placeholder="请输入手机号码" @on-blur="checkedMobile"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipMobile">手机号码格式不正确</div>     
              </FormItem>
            </Col> 
          </Row> 
          <Row>                                   
            <Col span="8">
              <FormItem label="座机电话：">
                <Input v-model="userData.officeTel" placeholder="请输入座机电话" @on-blur="checkedTel"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipTel">座机电话格式不正确</div>                
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="邮政编码：">
                <Input v-model="userData.zipcode" placeholder="请输入邮政编码" @on-blur="checkedZipcode"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipZipcode">邮政编码格式不正确</div>
              </FormItem>
            </Col>                  
            <Col span="8">
              <FormItem 
                label="电子邮箱："
                prop="email"
                :rules="{type: 'email', message: '电子邮箱格式不正确', trigger: 'blur'}">
                <Input v-model="userData.email" placeholder="请输入电子邮箱"></Input>   
              </FormItem>
            </Col>                  
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="通讯地址：">
                <Input v-model="userData.areaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('TXDZP')"></Input>
                <city-modal  
                  ref='cityChildTXDZP'  
                  @cityChildFun='cityFunTXDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="userData.address" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationTXDZFun"></Input>
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
              <FormItem 
                label="企业类型：" 
                prop="cardType"
                :rules="[{required: true, message: '请选择企业类型', trigger: 'change'}]">
                <Select v-model="userData.cardType" placeholder="请选择企业类型" @on-change="v=>{setCompanyOption(v)}">
                  <template v-for="item in companyTypeData">
                    <Option :value="item.dictId" :key="item.dictId">{{item.dictName}}</Option>
                  </template>
                </Select>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem 
                label="统一社会信用代码：" 
                prop="cardNumber"
                :rules="[{required: true, max: 30, message: '不能为空且长度不超过30位', trigger: 'blur'}]">
                <!-- <Input v-model="userData.cardNumber" @on-blur="inquiryCompanyInfo" placeholder="请输入统一社会信用代码"></Input> -->
                <Input v-model="userData.cardNumber" placeholder="请输入统一社会信用代码"></Input>
              </FormItem>
            </Col>
            <Col span="1">
              <span style="display:inline-block; margin:6px; height:33px;" >
                <Icon type="alert-circled" color="#ed3f14" size="20" title="该证件号曾出现虚假材料记录，请认真审核材料" v-if="userData.falseMaterialNum != 0"/>
              </span>
            </Col>
            <Col span="8">
              <FormItem 
                label="经办人姓名：" 
                prop="relatedPersonName"
                :rules="[{required: true, message: '经办人姓名不能为空', trigger: 'blur'}]">
                <Input v-model="userData.relatedPersonName" placeholder="请输入经办人姓名"></Input>
              </FormItem>
            </Col>
          <!-- </Row>
          <Row> -->
            <Col span="16">
              <FormItem 
                label="企业名称：" 
                prop="ename"
                :rules="[{required: true, message: '企业名称不能为空', trigger: 'blur'}]">
                <Input v-model="userData.ename" placeholder="请输入企业名称"></Input>
              </FormItem>
            </Col> 
            <Col span="8">
              <FormItem 
                label="经办人电话：" 
                prop="mobile"
                :rules="[{required: true, message: '经办人电话不能为空', trigger: 'blur'}]">
                <Input v-model="userData.mobile" placeholder="请输入经办人电话" @on-blur="checkedMobile"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipMobile">经办人电话格式不正确</div>
              </FormItem>
            </Col>                  
          <!-- </Row> 
          <Row> -->                                   
            <Col span="8">
              <FormItem label="营业执照号：">
                <Input v-model="userData.licenseNumber" placeholder="请输入营业执照号"></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem 
                label="法人代表：" 
                prop="keyman"
                :rules="[{required: true, message: '法人代表不能为空', trigger: 'blur'}]">
                <Input v-model="userData.keyman" placeholder="请输入法人代表"></Input>
              </FormItem>
            </Col>                  
            <Col span="8">
              <FormItem 
                label="法人身份证号：" 
                prop="keymanIdcard"
                :rules="[{trigger: 'blur'}]">
                <Input v-model="userData.keymanIdcard" placeholder="请输入法人身份证号" @on-blur="checkedKeymanIdcard"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipKeymanNumber">法人身份证号格式不正确</div>
              </FormItem>
            </Col>                  
          <!-- </Row>
          <Row>  -->                                  
            <Col span="8">
              <FormItem label="邮政编码：">
                <Input v-model="userData.zipcode" placeholder="请输入邮政编码" @on-blur="checkedZipcode"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipZipcode">邮政编码格式不正确</div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="企业电话：">
                <Input v-model="userData.officeTel" placeholder="请输入企业电话" @on-blur="checkedTel"></Input>
                <div class="ivu-form-item-error-tip" v-show="tipTel">企业电话格式不正确</div>
              </FormItem>
            </Col>                                    
          <!-- </Row>              
          <Row> -->
            <Col span="12">
              <FormItem label="通讯地址：">
                <Input v-model="userData.areaCodeName" class='areaInput' placeholder="请选择所在地区" @on-focus="cityChooseFun('TXDZC')"></Input>
                <city-modal  
                  ref='cityChildTXDZC'  
                  @cityChildFun='cityFunTXDZ'>
                </city-modal>
              </FormItem>
            </Col> 
            <Col span="1" class="line"><span>-</span></Col>
            <Col span="11">
              <FormItem class="address">
                <Input v-model="userData.address" placeholder="请输入详细地址" icon="location" title="地址定位" @on-click="addressLocationTXDZFun"></Input>
              </FormItem>
            </Col> 
          </Row>                                                           
        </Col>
      </Row>
    </Form>

    <Row class="margin-bottom-40">
      <Col span="24">
        <h5 class="title"><span><Icon type="ios-list"></Icon>申请材料</span></h5>
        <template>
          <table-data
            :projectApplyType="projectData.applyObjectType"
            :userCardNumber="userData.cardNumber">
          </table-data>                    
        </template>
      </Col>
    </Row>
    
    <!--接收父组件传递的数据由isSpecialfile字段控制特殊情况材料模块是否显示-->
    <Row v-if="isShowData.isSpecialfile === '0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title">
          <span><Icon type="images"></Icon>特殊情况材料</span>
          <strong class="red">（注：此页签可自定义上传材料名称，如需上传资料收件页签以外的材料可由此处上传）</strong>
        </h5>
        <Row class="bordered-dashed-1">
          <!--上传之后-->
          <template v-for="item in specialList">
            <Col span="4" class="uploadArea">
              <a href="javascript:;" :title="item.fileName + item.fileType">
                <img v-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../assets/img/icon_file_png.png">
                <img v-if="/^.+\.jpg$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_jpg.png">
                <img v-if="/^.+\.jpeg$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_jpeg.png">
                <img v-if="/^.+\.gif$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_gif.png"> 
                <img v-if="/^.+\.bmp$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_bmp.png">           
                <img v-if="/^.+\.pdf$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_pdf.png">
                <img v-if="/^.+\.doc$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_doc.png">
                <img v-if="/^.+\.docx$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_docx.png">
                <img v-if="/^.+\.ppt$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_ppt.png">
                <img v-if="/^.+\.txt$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_txt.png">
                <img v-if="/^.+\.xls$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_xls.png">
                <img v-if="/^.+\.xlsx$/.test(item.fileName + item.fileType) == true " src="../../../../assets/img/icon_file_xlsx.png">
                <!--鼠标移动上去的效果-->
                <div class="uploadHoverBtn" style="padding:11px 10px;">
                  <Button type="success" size="small" @click="previews(item.fileId,item.fileType)" class="margin-bottom-10">预览</Button>
                  <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button>
                </div>            
              </a> 
              <p :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>         
            </Col>    
          </template> 
          <!--上传之前-->         
          <Col span="4" style="margin:10px;">
            <a href="javascript:;" @click='handleResetSpecialData'>          
              <img src="../../../../assets/img/upload.png">
            </a>
            <Modal
              v-model="specialModal"
              title="上传特殊情况材料"
              width="600"
              :footer-hide="true"
              :mask-closable="false">
              <special-modal 
                @specialCancel='handleCloseSpecialModal' 
                @specialSubmit='handleSubmitSpecialData'
                ref='specialChild'>
              </special-modal>
            </Modal>
          </Col>          
        </Row>                          
      </Col>
    </Row> 
            

    <!--接收父组件传递的数据由isRelatedperson字段控制关联人模块是否显示-->
    <Row v-if="isShowData.isRelatedperson === '0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title" style="overflow:hidden;">
          <span><Icon type="person-stalker"></Icon>关联人</span>
          <strong class="red">（注：若该事项没有代办人，此步骤可跳过！）</strong>
          <Button type="success" icon="plus-round" @click="handleResetRelatedData" class="fr">添加</Button>
        </h5>
        <template>
          <table-related ref='loadRelatedTableList'></table-related>          
        </template>
      </Col>
    </Row> 

    <Row>
      <Col span="24" class="all-btns">
        <button-view 
          :current="current"
          :length="length"
          :nextaudit='nextAudit'
          @next="handleNext" 
          @unpass="handleUnpass"
          @complete="handleComplete(projectData.assignDeptId)" 
          @temporarily="handleTemporarily" 
          @correction="handleCorrection"
          @loadingShow="handleLoadingShow"
          @loadingHide="handleLoadingHide"
          ref="child">
        </button-view>
      </Col>
    </Row> 

    <Modal
      v-model="relatedModal"
      title="添加关联人信息"
      width="800"
      class-name="ivu-modal-style no-modal-footer"
      :mask-closable="false">
      <!--父组件绑定自定义事件-->
      <related-modal
        ref='relatedChild' 
        :projectApplyType="projectData.applyObjectType"
        @relatedSubmit='handleSubmitRelatedData' 
        @relatedCancel='handleCloseRelatedModal'
        @addressLocationRelatedFun='addressLocationRelatedFunP'>
      </related-modal>  
    </Modal>   

    <Modal
      v-model="mapModal"
      title="百度地图"
      width="1200"
      class-name="ivu-modal-style"
      :mask-closable="false">
      <map-modal ref='mapChild'></map-modal>
      <div slot="footer"></div>
    </Modal> 
  </div>       
</template>

<script>
var timeouttimer;

var RegExp = require('../../../../assets/js/validator.js');
require('../../../../assets/js/jquery.min.js');

import dataRow from './table-data.vue';
import specialModal from '../../window/detail/special/index.vue'; 
import relatedRow from '../../window/detail/table-related.vue';
import relatedModal from '../../window/detail/related/index.vue';  
import button from './button.vue';
import cityModal from '../../../common/cityChoose.vue';      //城市联动选择
import mapModal from '../../../common/view/mapSearch.vue';   //地图
import deptChoose from '../../../common/streetDeptChoose.vue';      //街道或业务部门选择
export default {
  props: {
    isShowData: {
      type: Object
    },
    current: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    nextaudit: {
      type: Boolean
    }
  }, 
  components: {
    'table-data': dataRow,
    'special-modal': specialModal,    
    'table-related': relatedRow,
    'related-modal': relatedModal,    
    'button-view': button,
    'city-modal': cityModal,
    'map-modal': mapModal,
    'dept-choose':deptChoose,
  },
  data () {
    return {
      issueTypeData: [],       //发证方式
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
      cardTypeDictId: '01',      //证件类型当前选中的dictId值      
      companyTypeData: [],     //企业类型
      companyTypeDictId: '',   //企业类型当前选中的dictId值
      //项目信息块
      projectData: {
        applyObjectType: '0',  //申请类别
        isSms: '1',            //短信通知
        issueType: '01',       //发证方式
        caseName: '',          //项目名称
        assignDeptId: '',      //办件流转街道Id
        caseAreaCode: '',      //项目所在地区code
        caseAreaCodeName: '',  //项目所在地区
        caseAddress: '',       //项目所在地区详细地址
        code1: '',             //业务编号
        code2: ''              //票号
      },
    
      //个人信息或企业信息块
      userData: {
        cardType: '01',          //证件类型、企业类型
        cardNumber: '',        //证件号码、统一社会信用代码
        relatedPersonName: '', //申请人姓名、经办人姓名
        sex: '',               //性别
        mobile: '',            //手机号码、经办人电话
        officeTel: '',         //座机电话、企业电话
        zipcode: '',           //邮政编码
        email: '',             //电子邮箱
        areaCode: '',          //通讯所在地区code
        areaCodeName: '',      //通讯所在地区
        address: '',           //通讯详细地址
        ename: '',             //企业名称
        licenseNumber: '',     //营业执照
        keyman: '',            //法人代表
        keymanIdcard: '',      //法人身份证号
        falseMaterialNum: 0,   //虚假材料数
        callSignBusinessCode:''        //next使用
      },
      specialList: [],         //特殊情况材料列表数据
      specialModal: false,     //特殊情况材料上传 modal框
      relatedModal: false,     //关联人 modal框
      nextAudit: false,        //下一环节审核人 是否显示
      mapModal: false,         //百度地图
      //正则表达式
      tipName: false,          //项目名称错误提示消息      
      tipNumber: false,        //证件号码错误提示信息
      tipMsg: '',              //证件号码提示内容
      tipKeymanNumber: false,  //法人身份证号错误提示信息
      tipMobile: false,        //手机号码错误提示信息
      tipTel: false,           //座机电话错误提示信息
      tipZipcode: false,       //邮政编码错误提示信息
      idCardIcon: true,        //控制证件号码读卡图标是否显示
			assignDeptName:'',			 //街道部门名称
      scrollLength:0,          //页面卷曲长度
    }
  },
  created(){
    //获取数据字典下拉框数据
    axios.post("/cgaCaseRegist/getRegistAllDictInfo.do")
    .then(data=>{
      this.issueTypeData = data.obj.issueTypeDict;
      this.cardTypeData = data.obj.cardTypeDict;
      this.companyTypeData = data.obj.companyTypeDict;
    });
    //进入后获取 项目信息/申请人信息 部分
    this.caseDetailSearch();
    //渲染特殊情况材料列表
    this.getSpecial();
  },
  mounted(){
    //*************************start 高拍仪获取身份证信息、上传照片*********************************//
    //let _this = this;
    //$("#CarmeraUpload").on("click",function(){
      //if(localStorage.getItem('carmeraType') == 'carmeraFun'){
        //let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
        //if(aname == ''){
          //alert('请输入文件名！');
          //return false;
        //}
        //关闭高拍仪
        //document.getElementById('carmerayw_cover').classList.remove('carmerayw_cover');
        //document.getElementById('carmerayw').classList.remove('carmerayw');
       // _this.carmeraFun();
      //}      
    //}) 
    //*************************end 高拍仪获取身份证信息、上传照片****************************//

  },
  methods: {
    //*************************start 高拍仪获取身份证信息、上传照片**************************//
    //读取身份证信息
    //Idcard(){
      //Idcard0();
      //this.userData.cardNumber = document.getElementById('Text6').value;
      //this.userData.relatedPersonName = document.getElementById('Text1').value;
      //this.userData.sex = document.getElementById('Text2').value=='男'?'01':'02';
      //this.inquiryPersonInfo();
    //},
    //选择证件类型
    setCardOption(value){
      this.cardTypeDictId = value;
      //01表示身份证类型，需要显示读卡icon
      //if(this.cardTypeDictId == '01'){
        //this.idCardIcon = true;
      //}else{
        //this.idCardIcon = false;
        //return false
      //}
    },    
    //根据身份证号查询申请人信息
    inquiryPersonInfo(){
      //证件类型是身份证并且证件号码不为空时
      if(this.cardTypeDictId == '01' && this.userData.cardNumber !== ''){
        axios.post("/cgaCaseRegist/queryCitizenByCardNumber.do", {cardNumber:this.userData.cardNumber})
        .then(data=>{
          if(data.status == '200' && data.success == true){
            //申请类别
            this.projectData.applyObjectType = data.obj.applyObjectType || '';
            //短信通知
            this.projectData.isSms = data.obj.isSms || ''; 
            //证件类型
            this.userData.cardType = data.obj.cardType || '';
            //申请人姓名
            this.userData.relatedPersonName = data.obj.relatedPersonName || '';
            //性别
            this.userData.sex = data.obj.sex || '';          
            //手机号码
            this.userData.mobile = data.obj.mobile || ''; 
            //座机电话
            this.userData.officeTel = data.obj.officeTel || '';
            //邮政编码
            this.userData.zipcode = data.obj.zipcode || '';
            //电子邮箱
            this.userData.email = data.obj.email || '';
            //通讯地址code
            this.userData.areaCode = data.obj.areaCode || '';
            //通讯地址
            this.userData.areaCodeName = data.obj.areaCodeName || '';
            //通讯详细地址
            this.userData.address = data.obj.address || '';
            //虚假材料数
            this.userData.falseMaterialNum = data.obj.falseMaterialNum || 0;

            var $error = $('.ivu-form-item-error');
            if(this.userData.relatedPersonName !== '' || this.userData.sex !== '' || this.userData.mobile !== ''){
              $error.find('.ivu-form-item-error-tip').hide();
              $error.find('.ivu-input').css('border','1px solid #dddee1');
              $error.find('.ivu-icon').css('color','#80848f');
            }            
          }else{
            this.$Message.error(data.msg);
          }
        });
      }
    },
    //0:业务编号;  1:票号
    checkedCode(type){
      clearTimeout(timeouttimer);
      timeouttimer = setTimeout(()=>{
        if((type==0 && this.projectData.code1=='') || (type==1 && this.projectData.code2=='')){
          return false;
        }

        //获取排队叫号系统办事人信息
        let code;
        if(type == 0){
          code = this.projectData.code1;
        }else{
          code = this.projectData.code2;
        }
        axios.post("/cgaCaseRegist/queryCallSignBusinessInfo.do", {type:type,code:code})
        .then(data=>{

          if(data.status == '200' && data.success == true){
            if(data.obj == undefined){
              return false;
            }
            this.userData.relatedPersonName = data.obj.relatedPersonName || '';
            if (this.projectData.applyObjectType == 0) {
              //窗口登记业务编号扫码后，如果是企业类型申报，统一社会信用代码框不用回显数据
              this.userData.cardNumber = data.obj.cardNumber || '';
            }
            this.userData.mobile = data.obj.mobile || '';
            this.userData.callSignBusinessCode = data.obj.businessCode || '';
            this.userData.falseMaterialNum = data.obj.falseMaterialNum || '';
          }else{
            //this.$Message.error(data.msg);
          }
        });
      },500);
    },
    //证件号码
    checkedIdCard(){
      //不为空时进行正则验证
      if(this.userData.cardNumber !== ''){
        if(this.cardTypeDictId !== ''){
          //格式不正确时，显示错误提示信息
          switch(this.cardTypeDictId){
            //身份证、驾驶证
            case '01':
              if(!RegExp.rules.idCard.test(this.userData.cardNumber)&&!RegExp.rules.HKIdCard.test(this.userData.cardNumber)&&!RegExp.rules.MCIdCard.test(this.userData.cardNumber)&&!RegExp.rules.TWIdCard.test(this.userData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '身份证号码格式不正确';
                return false
              }else{
                this.tipNumber = false;
                this.tipMsg = '';
                //this.inquiryPersonInfo();
              } 
              break;
            //军官证
            case '02':
              if(!RegExp.rules.officer.test(this.userData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '军官证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //驾驶证
            case '03':
              if(!RegExp.rules.idCard.test(this.userData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '驾驶证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break; 
            //护照
            case '04':
              if(!RegExp.rules.passport1.test(this.userData.cardNumber) || !RegExp.rules.passport2.test(this.userData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '护照格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            //港澳台证
            case '05':
              if(!RegExp.rules.hmtPass.test(this.userData.cardNumber)){
                this.tipNumber = true;
                this.tipMsg = '港澳台证格式不正确';
                return false
              }else{
                this.tipNumber = false;
              } 
              break;
            default:
              this.tipNumber = false;                                   
          }          
        }else{
          this.$Message.info('请先选择证件类型！');
        }
      }else{
        this.tipNumber = false;  
      }       
    },
    //项目名称
    checkedCaseName(){
      //不为空时进行正则验证
      if(this.projectData.caseName !== ''){
        //格式不正确时，显示错误提示信息
        if(/^\s+|\s+$/g.test(this.projectData.caseName)){
          this.tipName = true;
          return false
        }else{
          this.tipName = false; 
        }
      }else{
        this.tipName = false;
      }
    },    
    //手机号码
    checkedMobile(){
      //不为空时进行正则验证
      if(this.userData.mobile !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.mobile.test(this.userData.mobile)){
          this.tipMobile = true;
          return false
        }else{
          this.tipMobile = false; 
        }
      }else{
        this.tipMobile = false;
      }
    },
    //座机电话
    checkedTel(){
      //不为空时进行正则验证
      if(this.userData.officeTel !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.tel.test(this.userData.officeTel)){
          this.tipTel = true;
          return false
        }else{
          this.tipTel = false; 
        }
      }else{
        this.tipTel = false; 
      }
    },
    //邮政编码
    checkedZipcode(){
      //不为空时进行正则验证
      if(this.userData.zipcode !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.postcode.test(this.userData.zipcode)){
          this.tipZipcode = true;
          return false
        }else{
          this.tipZipcode = false; 
        }
      }else{
        this.tipZipcode = false; 
      }
    },
    //选择企业类型  
    setCompanyOption(value){
      this.companyTypeDictId = value;
    },          
    //根据统一社会信用代码查询企业信息
    inquiryCompanyInfo(){
      if(this.companyTypeDictId == '01' && this.userData.cardNumber !== ''){
        axios.post("/cgaCaseRegist/queryCorpByCardNumber.do", {cardNumber:this.userData.cardNumber})
        .then(data=>{
          if(data.status == '200' && data.success == true){
            //申请类别
            this.projectData.applyObjectType = data.obj.applyObjectType || '';
            //短信通知
            this.projectData.isSms = data.obj.isSms || '';          
            //企业类型
            this.userData.cardType = data.obj.cardType || '';
            //统一社会信用代码
            this.userData.cardNumber = data.obj.cardNumber || ''; 
            //经办人姓名
            this.userData.relatedPersonName = data.obj.relatedPersonName || ''; 
            //企业名称
            this.userData.ename = data.obj.ename || '';
            //经办人电话
            this.userData.mobile = data.obj.mobile || '';
            //营业执照号
            this.userData.licenseNumber = data.obj.licenseNumber || '';
            //法人代表
            this.userData.keyman = data.obj.keyman || '';
            //法人身份证号
            this.userData.keymanIdcard = data.obj.keymanIdcard || '';  
            //邮政编码
            this.userData.zipcode = data.obj.zipcode || '';
            //企业电话
            this.userData.officeTel = data.obj.officeTel || ''; 
            //通讯地址code
            this.userData.areaCode = data.obj.areaCode || '';
            //通讯地址
            this.userData.areaCodeName = data.obj.areaCodeName || '';
            //通讯详细地址
            this.userData.address = data.obj.address || ''; 
            //虚假材料数
            this.userData.falseMaterialNum = data.obj.falseMaterialNum || 0;

            var $error = $('.ivu-form-item-error');
            if(this.userData.relatedPersonName !== '' || this.userData.ename !== '' || this.userData.mobile !== '' || this.userData.keyman !== '' || this.userData.keymanIdcard !== ''){
              $error.find('.ivu-form-item-error-tip').hide();
              $error.find('.ivu-input').css('border','1px solid #dddee1');
              $error.find('.ivu-icon').css('color','#80848f');
            }             
          }else{
            this.$Message.error(data.msg);
          }
        });
      } 
    }, 
    //法人身份证号
    checkedKeymanIdcard(){
      //不为空时进行正则验证
      if(this.userData.keymanIdcard !== ''){
        //格式不正确时，显示错误提示信息
        if(!RegExp.rules.hmtPass.test(this.userData.keymanIdcard)){
           this.tipKeymanNumber = true;
                  return false
        }else{
          this.tipKeymanNumber = false;
        } 
      }else{
        this.tipKeymanNumber = false;
      }        
    },

    //拍照
    //userPhoto(){
      //localStorage.setItem("carmeraType","carmeraFun");
      //opendeviceCarmera(2);  //摄像头  1身份证    2 头像
      //显示高拍仪
      //document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
      //document.getElementById('carmerayw').classList.add('carmerayw');
      //清空之前的值  （仅需清理文件名）
      //document.getElementById('CarmeraPhotoName').value = '';
      // document.getElementById('Base64Text').value;  //照片编码
    //},
    //carmeraFun(){
      //let abase64 = document.getElementById('Base64Text').value;   //图片编码
      //let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
      //let _this = this;
      //Base64文件上传(HDFS)
      //axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', //filename:aname+'.jpg', filedatas:abase64})
      //.then(data=>{
        //添加办件图像记录信息
        //if(!data.success){
          //返回错误状态  
          //this.$Message.error('头像上传失败');                  
          //return false;
        //}
        //axios.post("/cgaCaseRegist/addCaseStaff.do", {caseId:this.$route.query.caseId, applyFileId:data.obj.id})
        //.then(data0=>{
          //if(!data0.success){
            //返回错误状态  
            //this.$Message.error('头像上传失败');                  
            //return false;
          //}
          //this.$Message.success('头像上传成功');
        //}); 
      //}); 
    //},
    //*************************end 高拍仪获取身份证信息、上传照片**************************************//
		 //街道或业务部门选择
    deptChooseFun(){
    	this.$refs.streetDeptChild.loadDeptList();
   	},
   	streetDeptChildFun(assignDeptId,assignDeptName){
   		this.projectData.assignDeptId = assignDeptId;
   		this.assignDeptName = assignDeptName;
   	},
    //*************************start 地址联动选择**************************************//
    cityChooseFun(addressName){
      if(addressName == 'XMDZ'){
          this.$refs.cityChildXMDZ.loadAreaList(addressName);
      }else if(addressName == 'TXDZP'){
          this.$refs.cityChildTXDZP.loadAreaList(addressName);
      }else{
        this.$refs.cityChildTXDZC.loadAreaList(addressName);
      } 
    },
    cityFunXMDZ(code,name){
      this.projectData.caseAreaCode = code;
      this.projectData.caseAreaCodeName = name;
    },
    cityFunTXDZ(code,name){
      this.userData.areaCode = code;
      this.userData.areaCodeName = name;
    },
    //*************************end 地址联动选择**************************************//

    //*************************start 百度地图**************************************//
    //项目地址
    addressLocationXMDZFun(){
      if(this.projectData.caseAreaCodeName=='' && this.projectData.caseAddress == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.projectData.caseAreaCodeName,this.projectData.caseAddress);
    },
    //通讯地址
    addressLocationTXDZFun(){
      if(this.userData.areaCodeName=='' && this.userData.address == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.userData.areaCodeName,this.userData.address);
    },
    addressLocationRelatedFunP(areaCodeName,address){
      //alert(areaCode,address)
      if(areaCodeName=='' && address == ''){
        this.$Message.error('地址为空');  
        return false;
      }
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(areaCodeName,address);
    },
    //*************************end 百度地图**************************************//

    //查询我的办件（或机关办件）的办件详情信息  
    caseDetailSearch(){
      axios.post("/cgaCase/queryMyCaseInfoByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.projectData = Object.assign({}, this.projectData, data.obj.caseInfo);
        this.userData = Object.assign({}, this.userData, data.obj.relatedPersonInfo);
        $('.businessCode').find('input').focus();
      }); 
    }, 

    //切换个人信息和企业信息时对userData这个表单进行重置
    handleReset(){
      this.$refs.userData.resetFields();
      this.userData.cardType = '01';
      this.userData.officeTel = '';
      this.userData.zipcode = '';
      this.userData.areaCodeName = '';
      this.userData.address = ''; 
      this.userData.falseMaterialNum = 0;       
      //清空正则错误提示信息
      this.tipMobile = false;
      this.tipZipcode = false;
      this.tipTel = false;  

      $('.businessCode').find('input').focus();
    }, 

    /******************** 特殊情况材料模块start ********************/
    //根据办件流水号获取特殊情况材料列表数据
    getSpecial(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId: this.$route.query.caseId})
      .then(data=>{
        this.specialList = data.obj;      
      }); 
    },
    //预览
    previews(id,type){
      this.$emit('previewsFun',id,type);
    },    
    //删除已上传的特殊情况材料
    delConfirm(id, fileId){
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk:()=>{
          axios.post("/cgaSpecialFile/deleteSpecialFile.do", {id:id, fileId:fileId})
          .then(data=>{
            this.$Message.success(data.msg);
            this.getSpecial();
            this.$emit("updateSpecilData");              
          })
        }
      })      
    },
    //点击上传特殊情况材料弹窗，先清空之前填写的数据
    handleResetSpecialData(){
      this.scrollLength = document.documentElement.scrollTop || document.body.scrollTop;  //获取卷曲长度

      this.specialModal = true;
      this.$refs.specialChild.handleReset();      
    },
    //提交上传特殊情况材料，成功后需要关闭弹窗，重新渲染特殊情况材料数据
    handleSubmitSpecialData(){
      this.specialModal = false;
      let _this = this;
      let timeImg = setInterval(function(){
        var len = document.documentElement.scrollTop || document.body.scrollTop;  //获取卷曲长度
        if(len == _this.scrollLength){
          clearInterval(timeImg);
        }
        window.scrollTo(0,_this.scrollLength);
      },100)
      this.getSpecial();
      this.$emit("updateSpecilData");  
    },
    //父组件绑定自定义事件:关闭上传特殊情况材料的弹窗
    handleCloseSpecialModal(){
      this.specialModal = false;
      let _this = this;
      let timeImg = setInterval(function(){
        var len = document.documentElement.scrollTop || document.body.scrollTop;  //获取卷曲长度
        if(len == _this.scrollLength){
          clearInterval(timeImg);
        }
        window.scrollTo(0,_this.scrollLength);
      },100)
    },
    /******************** 特殊情况材料模块end ********************/

    /******************** 关联人模块start ********************/    
    //点击添加关联人信息弹窗，先清空之前填写的数据
    handleResetRelatedData(){
      this.relatedModal = true;
      this.$refs.relatedChild.handleReset();      
    },
    //提交关联人信息，成功后需要关闭弹窗，重新渲染关联人列表数据
    handleSubmitRelatedData(){
      this.relatedModal = false;
      this.$refs.loadRelatedTableList.getList();  
    },
    //父组件绑定自定义事件:关闭添加关联人信息的弹窗
    handleCloseRelatedModal(){
      this.relatedModal  = false;
    },
    /******************** 关联人模块start ********************/    

    //----------------以上为数据获取，以下为数据提交----------------------------//

    //验证表单必填项
    submitForm(){
      return new Promise((resolve) => {
        this.$refs.projectData.validate((valid) => {
          this.$refs.userData.validate((valid2) => {
            if (valid && valid2) {
              this.$Modal.confirm({
                title: '温馨提示',
                content: '所有必填项已验证通过，请确认是否提交？',
                onOk: () => {
                  this.$emit('loadingShow');
                  axios.post("/cgaCaseRegist/saveRegistForNext.do", {
                    ...this.projectData,
                    ...this.userData,
                    caseId: this.$route.query.caseId,
                    //申报渠道06代表窗口
                    applySource: '06',
                  })
                  .then(data=>{
                    if(data.status !== '200') {
                      resolve(0)
                      this.$Message.error(data.msg);
                      return false
                    }
                    resolve(data)
                  }).catch(error=>{
                    this.$emit('loadingHide');
                  }); 
                },
                onCancel: () => {
                  resolve(0)
                }
              })         
            }else {
              this.$Message.error('表单验证失败！');
              resolve(0)
            }
          })
        })
      })
    },
    //点下一步验证所有必填项并提交保存窗口登记相关信息
    handleNext() {
      this.submitForm().then(res => {
        this.$emit('loadingHide');
        if(res !== 0) {
          this.$Message.success(res.msg);
          this.$emit('next')
        }
      })
    },
    //处理不予登记
    handleUnpass(){
      this.submitForm().then(res => {
        this.$emit('loadingHide');
        if(res !== 0) {
          this.$refs.child.unpassSubmit0();
        }
      })
    },
    handleComplete(assignId){
      this.submitForm().then(res => {
        if(res !== 0) {
          this.$Message.success('登记完成！'); 
          this.projectData.assignDeptId = assignId;
          this.$emit('complete');
          this.$refs.child.handleComplete0(assignId);
          //显示审核环节弹窗
          this.nextAudit = true;
        }else{
          this.nextAudit = false;
          this.$emit('loadingHide');
        }       
      })      
    }, 
    //点暂予登记或需补正按钮，保存成功的数据会流转到暂予登记处理或补正件处理模块的列表页（数据由接口提供），页面需要跳转到窗口登记模块的列表页 
    handleTemporarily(){
      this.submitForm().then(res => {
        if(res !== 0) {
          axios.post("/cgaCaseRegist/doTempOrSupplementRegist.do", {caseId:this.$route.query.caseId, caseState:'14'})
          .then(data=>{
            this.$emit('loadingHide');
            this.$Message.success('暂予登记成功！');
            this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
          }).catch(error=>{
            this.$emit('loadingHide');
          }); 
        }else{
          this.$emit('loadingHide');
        }
      })      
    },
    //补正
    handleCorrection(){
      //仅登记使用，在暂予登记、补正页面统一使用暂予登记页面
      this.submitForm().then(res => {
        if(res !== 0) {
          axios.post("/cgaCaseRegist/doTempOrSupplementRegist.do", {caseId:this.$route.query.caseId, caseState:'04'})
          .then(data=>{
            this.$emit('loadingHide');
            this.$Message.success('补正成功！');
            this.$router.push({path: '../index', query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}});
          }).catch(error=>{
            this.$emit('loadingHide');
          }); 
        }else{
          this.$emit('loadingHide');
        }
      })
    },
    handleLoadingShow(){
      this.$emit('loadingShow');
    },
    handleLoadingHide(){
      this.$emit('loadingHide');
    }        
  }
}
</script>

<style lang="scss">
.all-btns>.ivu-form>.ivu-form-item>.ivu-form-item-content{
  text-align: center;
  margin-left: 0!important;
}
/*****modal*****/
.no-modal-footer{
  .ivu-modal-body{
    padding: 0;
    .ivu-modal-btn{
      border-top: 1px solid #e9eaec;
      padding: 12px 18px;
      text-align: right;
      .ivu-form-item{
        margin-bottom: 0;
        padding-right: 0;
      }
    } 
  } 
  .ivu-modal-footer{
    display: none;
  }
}
</style>

  