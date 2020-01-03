<template>
  <Row>
    <Col span="24">
      <Row class="margin-bottom-40">
        <Col span="24">
          <h5 class="title"><span><Icon type="compose"></Icon>申请材料</span><Button type="info" @click="compareMaterial" class="compareBtn">比对</Button></h5>
          <Row class="apply-material">
            <template v-for="item in materialData">
              <!-- <Col span="4" class="margin-bottom-40 h140" :style ="node"> -->
              <Col span="4" class="margin-bottom-40 h140">
                <div class="plate">
                  <a href="javascript:;" class="uploadArea">
                    <span v-if="item.uploadNum > '0'" class="number" style="margin-left:22%;margin-top:2%">{{item.uploadNum}}</span>
                    <!--上传材料前的显示-->
                    <span v-if="item.fileType == undefined">
                      <img src="../../../../assets/img/icon_png_unknow.png">
                    </span>
                    <!--材料上传成功之后-->
                    <span v-else>
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
                    </span>
                    <!--鼠标移动上去的效果-->
                    <div class="uploadHoverBtn" v-if="tacheInfo.isSupplement == 'true'">
                      <!--上传按钮-->
                      <Row style="padding-top:4px;" class="uploadLocalFile">
                        <Col span="24">
                          <Button size="small">上传</Button>
                          <form :id="item.id" class="uploadForm" style="left:20px; width:40px; height:24px;">
                            <input type="hidden" name="folder" :value="'cga/' + $route.query.caseId">
                            <input type="hidden" name="source" value="1">
                            <input type="file" name="datafile" class="file" @change="uploadMaterial(item.id, item.caseId, item.materialId)" style="width:40px; height:24px;">
                          </form>         
                        </Col>
                      </Row>
                      <Button size="small" @click='userPhoto(item.caseId, item.materialId)'>高拍仪</Button>
                      <Button type="primary" size="small" @click='addModalFun(item.materialId, relatedPersonCardNumber)'>添加</Button>
                    </div>                
                  </a>

                  <p class="upload-tips">
                    <Icon v-if="item.isPickupPaper==0" type="checkmark-circled" title="材料已接收"></Icon>
                    <span :title="item.materialName">{{item.materialName}}</span>
                  </p>

                  <div>
                    <Button type="info" size="small" v-if="item.exampleNum > '0'" @click='sampleModalFun(item.materialId,item.exampleNum)'>样例</Button>
                    <Button type="success" size="small" v-if="item.uploadNum > '0'" @click='viewModalFun(item.materialId,item.uploadNum)'>查看</Button>
                  </div>
                </div>
              </Col>
            </template>
          </Row>
          <Modal
            v-model="comparisonModal"
            title="比对"
            ok-text="放大"
            cancel-text="确定"
            @on-ok="showBigImg"
            :styles="{top: '30px'}"
            width="1000">
            <ul class="compareBox">
              <li class="compareLeft">
                <Input placeholder="请输入资料名称" v-model="searchLeftName" style="width: 325px" @keyup.enter.native='searchLeft'></Input>
                <Button type="info" @click="searchLeft">搜索</Button>
                <Button type="error" @click="resetLeft">重置</Button>
                  <Menu theme="light" style="width:auto;margin-left:15px;margin-top:10px;" v-if="showStartLeft">
                    <template v-for="(item,index) in compareMaterialData">
                      <Submenu :name="index" style="text-align:left;">
                        <template slot="title">
                          <Icon type="navicon-round"></Icon><span @click="showChildrenLeft(item,item.materialId)">
                            {{item.fileName}}
                          </span>
                        </template>
                          <template v-for="(itemChild,index) in item.childrenList">
                            <MenuItem :name="index">
                              <div @click="leftImgcompare(itemChild.fileId)">
                                <span style="margin-left:50px;">{{itemChild.fileName}}</span>
                              </div>
                            </MenuItem>
                          </template>
                      </Submenu>
                    </template>
                </Menu>
                  <template v-if="showSearchLeft">
                    <Menu theme="light" style="width:auto;margin-top:10px;">
                      <template v-for="(item,index) in searchLeftList">
                        <MenuItem :name="index" style="text-align:left;">
                          <div @click="leftImgcompare(item.fileId)">
                            <span style="margin-left:50px;">{{item.fileName}}</span>
                          </div>
                        </MenuItem>
                      </template>
                    </Menu>
                  </template>
                  <template v-if="showLeftImg">
                    <img :src="apiH+ '/attachment/onLinePre.do?fileId=' + materiaDataLeft" class="compareImg">
                  </template>
              </li>
              <li class="compareRight">
                <Input placeholder="请输入资料名称" v-model="searchRightName" style="width: 325px" @keyup.enter.native='searchRight'></Input>
                <Button type="info" @click="searchRight">搜索</Button>
                <Button type="error" @click="resetRight">重置</Button>
                <Menu theme="light" style="width:auto;margin-left:15px;margin-top:10px;" v-if="showStartRight">
                    <template v-for="(item,index) in compareMaterialData">
                      <Submenu :name="index" style="text-align:left;">
                        <template slot="title">
                          <Icon type="navicon-round"></Icon><span @click="showChildrenRight(item,item.materialId)">
                            {{item.fileName}}
                          </span>
                        </template>
                          <template v-for="(itemChild,index) in item.childrenList">
                            <MenuItem :name="index">
                              <div @click="rightImgcompare(itemChild.fileId)">
                                <span style="margin-left:50px;">{{itemChild.fileName}}</span>
                              </div>
                            </MenuItem>
                          </template>
                      </Submenu>
                    </template>
                </Menu>
                  <template v-if="showSearchRight">
                    <Menu theme="light" style="width:auto;margin-top:10px;">
                      <template v-for="(item,index) in searchRightList">
                        <MenuItem :name="index" style="text-align:left;">
                          <div @click="rightImgcompare(item.fileId)">
                            <span style="margin-left:50px;">{{item.fileName}}</span>
                          </div>
                        </MenuItem>
                      </template>
                    </Menu>
                  </template>
                  <template v-if="showRightImg">
                    <img :src="apiH+ '/attachment/onLinePre.do?fileId=' + materiaDataRight" class="compareImg">
                  </template>
              </li>
            </ul>    
        </Modal>
        <Modal
          v-model="bigImgShowModal"
          width="100%"
          :styles="{top: '10px'}"
          @on-cancel="backCompareImg"
          cancel-text=""
          @on-ok="backCompareImg"
          :closable="false"
        >
          <div style="overflow:hidden;">
            <img :src="apiH+ '/attachment/onLinePre.do?fileId=' + materiaDataLeft" class="compareBigImg">
            <img :src="apiH+ '/attachment/onLinePre.do?fileId=' + materiaDataRight" class="compareBigImg">
          </div>
        </Modal>
          <Modal
            v-model="exampleModal"
            title="样例"
            width="850"
            class-name="ivu-modal-style"
            :mask-closable="false">
            <sample-modal ref='sampleChild'></sample-modal>  
          </Modal>

          <Modal
            v-model="viewModal"
            title="查看"
            width="850"
            class-name="ivu-modal-style"
            :mask-closable="false">
            <view-modal ref='viewChild' @parentgetList='getMaterialList' @hideShowModal='hideViewModal' @backViewModal='backViewModal'></view-modal>
          </Modal>

          <Modal
            v-model="addModal"
            title="添加"
            width="850"
            class-name="ivu-modal-style no-modal-footer"
            :mask-closable="false">
            <add-modal 
              ref='addChild'
              @applicationAdd='applicationAddP' 
              @applicationCancel='applicationCancelP'>
            </add-modal> 
          </Modal>                                               
        </Col>
      </Row>

      <Row v-if="isShowData.isSpecialfile === '0'" class="margin-bottom-20">
        <Col span="24">
          <h5 class="title">
            <span><Icon type="images"></Icon>特殊情况材料</span>
            <strong class="red">（注：此页签可自定义上传材料名称，如需上传资料收件页签以外的材料可由此处上传）</strong>
          </h5>
          <Row class="bordered-dashed-1">
            <!--上传之后-->
            <template v-for="item in specialData">
              <Col span="4" class="special-material">
                <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
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
                  <div class="uploadHoverBtn">
                    <Button type="success" size="small" @click="previews(item.fileId,item.fileType)" class="margin-bottom-10" style='margin-top:10px;'>预览</Button>
                    <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button>
                  </div>            
                </a>
                <p class="uploadName" :title="item.fileName + item.fileType">{{item.fileName + item.fileType}}</p>
              </Col>    
            </template> 
            <!--上传之前--> 
            <Col span="4" style="margin:10px;">
              <a href="javascript:;" @click='handleResetSpecialData'>
                <img src="../../../../assets/img/upload.png">              
              </a>
            </Col> 
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
          </Row>                                    
        </Col>
      </Row>

      <Row>
        <Col span="24" class="margin-bottom-10">
          <h5 class="title" style="overflow:hidden;">
            <span><Icon type="bag"></Icon>资料袋信息</span>
            <i class="fr">
              <Button type="info" v-on:click="specialModalFun('02')">快速签收</Button>
              <Button type="info" style="margin-left:8px;" v-on:click="specialModalFun('03')">快速查阅</Button>
            </i>
          </h5>
        </Col>
        <Col span="24">
          <Table border :columns="Columns" :data="TableList"></Table>
          <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page> 
        </Col>
      </Row>
    </Col>
  </Row>
</template>

<script>
require('../../../../assets/js/jquery.min.js');
import sampleModal from './application/sample.vue';   //申请材料》样例
import viewModal from './application/view.vue';       //申请材料》查看
import addModal from './application/add.vue';         //申请材料》添加
import specialModal from './special/index.vue';
export default {
  props: {
    isShowData: {
      type: Object
    },
    tacheInfo: {
      type: Object
    },
    relatedPersonCardNumber: {
      type: String
    }
  },
  components: {
    'sample-modal': sampleModal,
    'view-modal': viewModal,
    'add-modal': addModal,
    'special-modal': specialModal,
  },
  data () {
    return {
      // node:{//图标样式
      //   backgroundImage: "url(" + require("../../../../assets/img/fangguanju.png") + ")",
      //   backgroundSize: "cover",
      //   marginLeft: "30px",
      //   border: "1px solid #E4E3E3",
      //   boxSizing: "border-box",
      // },
      materialData: [],
      fileId: '',       //材料Id
      fileName: '',     //材料名称
      specialData: [],  //特殊情况材料列表数据
      Columns: [
        {
          title: '环节名称',
          key: 'tacheName',
          width: '13%'
        },
        {
          title: '操作人',
          key: 'userName',
          width: '9%'
        },
        {
          title: '所属机关',
          key: 'deptName',
          width: '25%'
        },
        {
          title: '操作时间',
          key: 'operateTime',
          width: '18%'
        },
        {
          title: '处理类型',
          key: 'dealTypeName',
          width: '15%'
        },                    
        {
          title: '处理意见',
          key: 'description',
          width: '20%'
        },
      ],
      TableList: [],
      queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10,
      //高拍仪当前点击项  
      caseId: '', 
      materialId: '',
      exampleModal: false,   //申请材料样例modal框
      viewModal: false,      //申请材料  查看 modal框
      addModal: false,       //申请材料  添加 modal框
      specialModal: false,   //上传特殊情况材料modal框
      comparisonModal: false,//申请材料  比对modal框
      showCompareModal:false, //比对结果modal框
      bigImgShowModal:false,  //图片发达显示模块
      compareMaterialData:[], //比对的申请材料的总信息
      showStartLeft:true,     //左边开始时材料的树信息显示模块
      showStartRight:true,    //右边开始时材料的树信息显示模块
      showSearchLeft:false,   //左边搜索后材料的树信息显示模块
      showSearchRight:false,  //右边搜索后材料的树信息显示模块
      searchLeftList:[],      //左边搜索后材料的列表
      searchRightList:[],     //右边搜索后材料的列表
      searchLeftName:'',      //左边输入框的搜索关键字
      searchRightName:'',     //右边输入框的搜索关键字
      materiaDataLeft:'',     //左边显示的图片的资料字符串
      materiaDataRight:'',    //右边显示的图片的资料的字符串
      showRightImg:false,     //左边显示图片的模块
      showLeftImg:false       //右边显示图片的模块
    }
  },
  created(){
    this.apiH = window.config.api;
    //渲染资料袋信息列表
    this.getBagList();
    this.$watch('$route.fullPath', this.getBagList); 
  },
  mounted(){
    //*************************start 高拍仪获取身份证信息、上传照片**************************************//
    let _this = this;
    $("#CarmeraUpload").on("click",function(){
      if(localStorage.getItem('carmeraType') == 'materialcarmeraFun'){
        let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
        if(aname == ''){
         alert('请输入文件名！');
          return false;
        }
        //关闭高拍仪
        document.getElementById('carmerayw_cover').classList.remove('carmerayw_cover');
        document.getElementById('carmerayw').classList.remove('carmerayw');
        _this.materialcarmeraFun(_this.caseId, _this.materialId);
      }
    })
    //*************************end 高拍仪获取身份证信息、上传照片**************************************//
  },
  methods: {
    hideViewModal(){
      this.viewModal=false;
    },
    backViewModal(){
      this.viewModal=true;
    },
    searchLeft(){
      this.showStartLeft = false;
      this.showLeftImg = false;
      if(this.searchLeftName){
        axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsList.do", {fileName:this.searchLeftName,caseId:this.$route.query.caseId})
        .then(data=>{
          if(!data.success){
            //返回错误状态 
            return false;
          }
          this.showSearchLeft = true;
          this.searchLeftList = data.obj || [];
        }); 
      }else{
        this.resetLeft();
      }
    },
    searchRight(){
      this.showStartRight = false;
      this.showRightImg = false;
      if(this.searchRightName){
        axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsList.do", {fileName:this.searchRightName,caseId:this.$route.query.caseId})
        .then(data=>{
          if(!data.success){
            //返回错误状态 
            return false;
          }
          this.showSearchRight = true;
          this.searchRightList = data.obj || [];
        }); 
      }else{
        this.resetRight();
      }
    },
    resetLeft(){
      this.showStartLeft = true;
      this.showSearchLeft = false;
      this.showLeftImg = false;
      this.searchLeftName = '';
      this.materiaDataLeft='';
      materiaDataLight:''
    },
    resetRight(){
      this.showStartRight = true;
      this.showSearchRight = false;
      this.showRightImg = false;
      this.searchRightName = '';
      this.materiaDataRight='';
    },
    rightImgcompare(fileId){
      this.showStartRight = false;
      this.showSearchRight = false;
      this.showRightImg = true;
      this.materiaDataRight = fileId;
    },
    leftImgcompare(fileId){
      this.showStartLeft = false;
      this.showSearchLeft = false;
      this.showLeftImg = true;
      this.materiaDataLeft = fileId;
    },
    showBigImg(){
      this.bigImgShowModal = true;
    },
    backCompareImg(){
      this.comparisonModal = true;
    },
    compareMaterial(){
        this.resetRight();
        this.resetLeft();
        this.comparisonModal = true;
        axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsList.do", {caseId:this.$route.query.caseId})
        .then(data=>{
          this.compareMaterialData = data.obj || [];           
        }); 
    },
    showChildrenLeft(item,materialId){
      axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsList.do", {materialId:materialId,caseId:this.$route.query.caseId})
      .then(data=>{
        if(!data.success){
          //返回错误状态 
          return false;
        }
        let childrenListLeft = [];
        if(data.obj.length){
          childrenListLeft = data.obj.filter(function(item){
            if(item.fileType=='.jpg'||item.fileType=='.jpeg'||item.fileType=='.png'||item.fileType=='.gif'){
              return item;
            }
          })
        }
        this.$set(item,'childrenList',childrenListLeft);     
      });
    },
    showChildrenRight(item,materialId){
      axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsList.do", {materialId:materialId,caseId:this.$route.query.caseId})
      .then(data=>{
        if(!data.success){
          //返回错误状态 
          return false;
        }
        let childrenListRight = [];
        if(data.obj.length){
          childrenListRight = data.obj.filter(function(item){
            if(item.fileType=='.jpg'||item.fileType=='.jpeg'||item.fileType=='.png'||item.fileType=='.gif'){
              return item;
            }
          })
        }
        this.$set(item,'childrenList',childrenListRight);   
      });
    },
    //************************* 申请材料模块 start *************************//    
    //查询指定办件的申请材料列表数据
    getMaterialList(){
      axios.post("/cgaCaseMaterial/queryCaseGuideMaterialListByPage.do", {caseId:this.$route.query.caseId, pageSize: 100})
      .then(data=>{
        this.materialData = data.obj.records || [];           
      }); 
    },
    //上传申请材料
    uploadMaterial(id, caseId, materialId){
      let self = this;
      var formData = new FormData($( "#"+id )[0]);
      $.ajax({  
        url: window.config.api + '/attachment/uploadFile.do',  
        type: 'POST',  
        data: formData,
        async: false,  
        cache: false,  
        contentType: false,  
        processData: false, 
        success: function (data) {
          self.fileId = data.obj.id;
          self.fileName = data.obj.fileName; 
          self.fileType = data.obj.fileType;            
          self.$Message.success('上传成功！'); 
          //新增办件材料记录
          axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
          .then(data=>{
            self.getMaterialList();
          });
        },
        error: function (err) { 
          self.$Message.error('上传失败！');
        }
      });  
    },
    //高拍仪 拍照 上传申请材料
    userPhoto(caseId, materialId){
      localStorage.setItem("carmeraType","materialcarmeraFun");
      this.caseId = caseId;
      this.materialId = materialId;
      opendeviceCarmera(1);  //摄像头  1身份证    2 头像
      //显示高拍仪
      document.getElementById('carmerayw_cover').classList.add('carmerayw_cover');
      document.getElementById('carmerayw').classList.add('carmerayw');
      //清空之前的值  （仅需清理文件名）
      document.getElementById('CarmeraPhotoName').value = '';
      // document.getElementById('Base64Text').value;  //照片编码
    },
    materialcarmeraFun(caseId, materialId){
      let abase64 = document.getElementById('Base64Text').value;   //图片编码
      let aname = document.getElementById('CarmeraPhotoName').value; //图片名称
      let _this = this;
      //Base64文件上传(HDFS)
      axios.post("/attachment/uploadFileFromBase64.do", {folder:'cga/' + this.$route.query.caseId, source:'1', filename:aname+'.jpg', filedatas:abase64})
      .then(data=>{
        //新增办件材料记录
        axios.post("/cgaCaseMaterial/addCaseMaterialFile.do", {fileId:data.obj.id, caseId:caseId, materialId:materialId})
        .then(data=>{
          this.$Message.success('上传成功');
          this.getMaterialList();
        });
      }); 
    },
    //点击样例弹出样例modal 
    sampleModalFun(materialId,exampleNum){
      if(exampleNum>0){
        this.exampleModal = true;
        this.$refs.sampleChild.getSampleList(materialId);
      }
    },
    //点击查看弹出查看modal 
    viewModalFun(materialId,uploadNum){
      if(uploadNum > 0){
        this.viewModal = true;
        this.$refs.viewChild.getViewList(materialId);
      }      
    },
    //点击添加弹出添加modal 
    addModalFun(materialId,relatedPersonCardNumber){
      this.addModal = true;
      this.$refs.addChild.getAddList(materialId,relatedPersonCardNumber);
    },
    //add 点击添加
    applicationAddP(){
      this.addModal = false;
      this.getMaterialList();
    },
    //add 点击取消
    applicationCancelP(){
      this.addModal = false;
    },
    //************************* 申请材料模块 end *************************//


    //************************* 特殊情况材料模块 start *************************//    
    //根据办件流水号获取特殊情况材料列表数据
    getSpecialList(){
      axios.post("/cgaSpecialFile/querySpecialFileListByCaseId.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        this.specialData = data.obj || [];
      }); 
    },
    //点击上传特殊情况材料弹窗，先清空之前填写的数据
    handleResetSpecialData(){
      this.specialModal = true;
      this.$refs.specialChild.handleReset();
    },
    //提交上传特殊情况材料，成功后需要关闭弹窗，重新渲染特殊情况材料数据
    handleSubmitSpecialData(){
      this.specialModal = false;
      this.getSpecialList();
    },
    //父组件绑定自定义事件:关闭上传特殊情况材料的弹窗
    handleCloseSpecialModal(){
      this.specialModal = false;
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
            this.getSpecialList();            
          })
        }
      })      
    },
    //************************* 特殊情况材料模块 end *************************//


    //************************* 资料袋信息模块 start *************************//
    getBagList(){
      axios.post("/cgaMaterialbagTache/queryListByPage.do", {caseId:this.$route.query.caseId,currentPage:this.currentPage, pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records || [];
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        if(this.total>0) {
          this.tacheInfo.materialbagViewStatus="已查阅";
        } else{
          this.tacheInfo.materialbagViewStatus="未查阅";
        }
      });      
    },
    pageChange(data){
      this.currentPage = data;
      this.getBagList();
    },
    pageSizeChange(data){
      this.pageSize = data;      
      this.getBagList();
    },    
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },
    //资料签收、查阅弹出框
    specialModalFun(type){
      // let caseBarcodeList;
      // caseBarcodeList = this.TableList.map(item =>{
      //   return item.caseBarcode;
      // })
      //alert(caseBarcodeList.join(","))

      //新增资料袋流转记录信息
      axios.post("/cgaMaterialbagTache/save.do", {
        caseId: this.$route.query.caseId,
        //caseBarcodeBatch: caseBarcodeList.join(","),
        caseBarcodeBatch: this.$route.query.caseId,
        dealType: type,
        description: '',
      }).then(data=>{
        if(data.status == '200' && data.success == true){
          this.$Message.success('保存成功!');
          this.getBagList();
        }else{
          this.$Message.error(data.msg);
        }
        
      });
    }
  }
}
</script>

<style lang="scss">
.uploadArea{
  .uploadHoverBtn{
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 80px;
    height: 80px;
    text-align: center;    
    border-radius: 3px;
    background: rgba(0,0,0,0.5);
  }
  &:hover .uploadHoverBtn {
    display: block;
  } 
}

.upload-tips {
  width: 120px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 5px; 
  color: #1c2438;
  i {
    font-size: 15px;
    color: #19be6b;
    cursor: pointer;
  } 
}

.apply-material{
  padding: 10px 10px 30px;
  border: 1px dashed #e9eaec;
  .plate{
    position: relative;
    width: 120px;
    //height: 80px;
    text-align: center;
    margin: 15px auto;
    .uploadArea{
      .number{
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 20px;
        height: 20px;
        text-align: center;
        background: #0000FF;
        border-radius: 50%;
        color: #fff;
        font-size: 12px;
      }
      &:hover .number{
        display: none;
      }  
    }
  }
}

.special-material{
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea{
    position: relative;
    display: block;
    img{
      display: block;
    } 
  }
  .uploadName{
    width: 90px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 5px; 
    color: #1c2438;
  }  
}

.no-modal-footer .ivu-modal-footer{
  display: none;
}
.compareBox{
  display: flex;
  justify-content: space-between;
  .compareRight,.compareLeft{
    width: 480px;
    height: auto;
    border: 1px solid #f4f4f4;
    box-sizing: border-box;
    text-align: center;
    padding: 10px 0;
  }
}
.compareImg{
  width:455px;
  height: auto;
  margin-top: 10px;
}
.compareBigImg{
  width: 49.8%;
  float: left;
}
.compareBtn{
  float: right;
}
.ivu-menu-item{
  padding: 4px !important;
}
.ivu-menu-submenu-title{
  padding: 4px !important;
}
</style>