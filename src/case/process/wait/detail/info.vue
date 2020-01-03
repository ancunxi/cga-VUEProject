<template>    
  <Form :label-width="130">
    <Row class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="document-text"></Icon>项目信息</span></h5>
        <Row>
          <Col span="8">
            <FormItem label="申请类别：">{{caseInfo.applyObjectTypeName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="短信通知：">{{relatedPersonInfo.isSmsName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="发证方式：">{{caseInfo.issueTypeName}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="项目名称：">{{caseInfo.caseName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="资料袋条码号：">{{caseInfo.caseBarcode}}</FormItem>
          </Col>                  
        </Row> 
        <Row>
          <Col span="24">
            <FormItem label="项目地址：">  
              {{projectAddress}}
              <Icon v-if="this.projectAddress!=''" type="location" title="地址定位" @click.native="addressLocationXMDZFun"></Icon>
            </FormItem>
          </Col>  
        </Row>                                         
      </Col>
    </Row>

    <Row v-if="caseInfo.applyObjectType == '0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title"><span><Icon type="person"></Icon>申请人信息</span></h5>
        <p></p>
        <Row>
          <Col span="8">
            <FormItem label="证件类型：">{{relatedPersonInfo.cardTypeName}}</FormItem>
          </Col>
          <Col span="16">
            <FormItem label="证件号码：">{{relatedPersonInfo.cardNumber}}</FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="姓名：">{{relatedPersonInfo.relatedPersonName}}<Icon type="person" v-if="relatedPersonInfo.applyFileId!=undefined && relatedPersonInfo.applyFileId!=''" title="点击查看头像" @click.native="viewIcon"></Icon></FormItem>
          </Col>                   
          <Col span="8">
            <FormItem label="性别：">{{relatedPersonInfo.sexName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="手机号码：">{{relatedPersonInfo.mobile}}</FormItem>
          </Col> 
        </Row> 
        <Row>                                   
          <Col span="8">
            <FormItem label="座机电话：">{{relatedPersonInfo.officeTel}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="邮政编码：">{{relatedPersonInfo.zipcode}}</FormItem>
          </Col>                  
          <Col span="8">
            <FormItem label="电子邮箱：">{{relatedPersonInfo.email}}</FormItem>
          </Col>                  
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="通讯地址：">  
              {{this.txAddress}}
              <Icon v-if="this.txAddress!=undefined && this.txAddress!=''" type="location" title="地址定位"  @click.native="addressLocationTXDZFun"></Icon>
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
            <FormItem label="企业类型：">{{relatedPersonInfo.cardTypeName}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="统一社会信用代码：">{{relatedPersonInfo.cardNumber}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="经办人：">
            {{relatedPersonInfo.relatedPersonName}}<Icon type="person" v-if="relatedPersonInfo.applyFileId!=undefined && relatedPersonInfo.applyFileId!=''" title="点击查看头像" @click.native="viewIcon"></Icon>
            </FormItem>
          </Col>                    
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="企业名称：">{{relatedPersonInfo.ename}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="经办人电话：">{{relatedPersonInfo.mobile}}</FormItem>
          </Col>                                      
        </Row> 
        <Row>
          <Col span="8">
            <FormItem label="营业执照号：">{{relatedPersonInfo.licenseNumber}}</FormItem>
          </Col>                                          
          <Col span="8">
            <FormItem label="法人代表：">{{relatedPersonInfo.keyman}}</FormItem>
          </Col>                  
          <Col span="8">
            <FormItem label="法人身份证：">{{relatedPersonInfo.keymanIdcard}}</FormItem>
          </Col>                  
        </Row>
        <Row>                                   
          <Col span="8">
            <FormItem label="邮政编码：">{{relatedPersonInfo.zipcode}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="企业电话：">{{relatedPersonInfo.officeTel}}</FormItem>
          </Col>                                              
        </Row> 
        <Row>
          <Col span="24">
            <FormItem label="通讯地址：">  
              {{txAddress}}
              <Icon v-if="this.txAddress!=undefined && this.txAddress!=''" type="location" title="地址定位" @click.native="addressLocationTXDZFun"></Icon>
            </FormItem>
          </Col>                                                                        
        </Row>
      </Col>
    </Row>

    <Row v-if="isShowData.isRelatedperson === '0'" class="margin-bottom-20">
      <Col span="24">
        <h5 class="title">
          <span><Icon type="person-stalker"></Icon>关联人</span>
          <strong class="red">（注：若该事项没有代办人，此步骤可跳过！）</strong>
        </h5>
        <Table border :columns="Columns" :data="TableList"></Table>
        <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </Col>
    </Row> 

    <Modal
      v-model="mapModal"
      title="百度地图"
      width="1200"
      :mask-closable="false">
      <map-modal ref='mapChild'></map-modal>
      <div slot="footer"></div>            
    </Modal> 
  </Form>       
</template>

<script>
import mapModal from '../../../common/view/mapSearch.vue';    //地图
export default {
  //父组件向子组件传递基本信息页签详情数据
  props: {    
    caseInfo: {
      type: Object
    },
    relatedPersonInfo: {
      type: Object
    }, 
    isShowData: {
      type: Object
    },  
    //注：父组件向子组件传递字符串类型的数据时，一定要给默认值 default:''
    projectAddress:{
      type:String,
      default:''
    },
    txAddress:{
      type:String,
      default:''
    },
  },
  components: {
    'map-modal': mapModal,
  },
  data () {
    return {   
      //关联人table
      Columns: [
        {
          title: '关联人姓名',
          key: 'relatedPersonName',
          width: '15%'
        },
        {
          title: '关联人类型',
          key: 'relatedPersonTypeName',
          width: '15%'
        },
        {
          title: '证件类型',
          key: 'cardTypeName',
          width: '15%'
        },
        {
          title: '证件号码',
          key: 'cardNumber',
          width: '22%'
        },
        {
          title: '手机号码',
          key: 'mobile',
          width: '18%'
        }
      ],
      TableList: [],
      queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10,  

      mapModal:false,   //百度地图

    }
  },
  created(){
    //渲染关联人列表
    this.getList(); 
    this.$watch('$route.fullPath', this.getList); 
  },
  methods: {
    viewIcon(){
      var fileId=this.relatedPersonInfo.applyFileId;
      var fileName="";
      if(fileId==undefined || fileId==''){
        this.$Message.error('该人员没上传头像！');
        return;
      }else{
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
            this.$Message.error('该人员没上传头像！');
            return;
          }     
        });
      }
    },
    getList(){
      axios.post("/cgaCaseRelatedPerson/queryRelatedPersonListByPage.do", {caseId:this.$route.query.caseId,currentPage:this.currentPage, pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
      }); 
    },     
    pageChange(data){
      this.currentPage = data;
      this.getList();
    },
    pageSizeChange(data){
      this.pageSize = data;      
      this.getList();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },

    //项目地址
    addressLocationXMDZFun(){
      this.mapModal = true;
      this.$refs.mapChild.addressLocationFun(this.projectAddress,'');
    },
    //通讯地址
    addressLocationTXDZFun(){
      this.mapModal = true;	  
      this.$refs.mapChild.addressLocationFun(this.txAddress,'');
    },
  }
}
</script>

<style lang="scss">
/*****modal*****/
.ivu-modal-style{
  .ivu-modal-body{
    padding: 20px 0 0;
    .ivu-form-item{
      padding-right: 20px;
    }
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
}
</style>

  