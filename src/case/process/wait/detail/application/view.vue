<!-- 申请材料 查看 -->
<template>
  <div style="padding:0 15px;">
    <Row>
      <template v-for="item in materialData">
        <Col span="4" class="view">
          <a href="javascript:;" class="uploadArea" :title="item.fileName + item.fileType">
            <img v-if="item.pass === '1'" src="../../../../../assets/img/pass.png">
            <img v-else-if="item.pass === '0'" src="../../../../../assets/img/Npass.png">
            <img v-else-if="item.pass === '2'" src="../../../../../assets/img/falseMaterial.png">
            <img v-else-if="/^.+\.png$/.test(item.fileName + item.fileType) == true" src="../../../../../assets/img/icon_file_png.png">
            <img v-else-if="/^.+\.jpg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpg.png">
            <img v-else-if="/^.+\.jpeg$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_jpeg.png">
            <img v-else-if="/^.+\.gif$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_gif.png">  
            <img v-else-if="/^.+\.bmp$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_bmp.png">            
            <img v-else-if="/^.+\.pdf$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_pdf.png">
            <img v-else-if="/^.+\.doc$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_doc.png">
            <img v-else-if="/^.+\.docx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_docx.png">
            <img v-else-if="/^.+\.ppt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_ppt.png">
            <img v-else-if="/^.+\.txt$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_txt.png">
            <img v-else-if="/^.+\.xls$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xls.png">
            <img v-else="/^.+\.xlsx$/.test(item.fileName + item.fileType) == true " src="../../../../../assets/img/icon_file_xlsx.png">           
            <div class="uploadHoverBtn">
              <Button type="success" size="small" style="margin-bottom:3px;" @click="previews(item.fileId,item.fileType)">预览</Button>
              <Button type="primary" size="small" style="margin-bottom:3px;" @click="reNameShow(item.id)">重命名</Button>
              <Button v-if="(isShowDeleteButton==true||isShowDeleteButton=='true') && item.pass!='1'" type="error" size="small" @click="delConfirm(item.id,item.fileId)">删除</Button>
              <Button type="info" size="small" @click="reviewMaterial(item)">审查</Button>
            </div>            
          </a>  
			<p :title="item.fileName + item.fileType" v-if='reloadNameShowId!=item.id' style="text-align: left;padding-left:10px">{{item.fileName + item.fileType}}</p>
            <input type="text" name="请输入名称" v-focus="true" v-model='reloadName' v-if='reloadNameShowId==item.id' @blur="reNameFun(item.id)" style="margin-top:3px;margin-bottom:3px; display:block; width:80px;">

            <div style="text-align:left;">
              <Button type="info" size="small" @click="falseMaterial(item.id)" v-if="item.isPass != '2'">虚假材料</Button>
              <Button type="success" size="small" @click="recoverMaterial(item.id)" v-if="item.isPass == '2'">恢复材料</Button>
            </div>
        </Col>    
      </template>
    </Row> 

    <Modal
        v-model="ReviewModal"
        title="审核"
        width="98%"
        ok-text='返回'
        cancel-text=''
        @on-cancel="backShowModal"
        @on-ok="backShowModal">
        <div class="contentBox">
          <div class="reviewImgBox" id="reviewShowImg">
            <img v-if="isShowImg" :src="apiH+ '/attachment/onLinePre.do?fileId=' + imgFileId" alt="" class="reviewImg"> 
            <iframe v-if="isShowFile" scrolling='auto' frameborder='0' height="800" width="800" :src="apiH+ '/attachment/onLinePre.do?fileId=' + imgFileId" class="viewer-move viewer-transition" style="margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
            <div style="text-align:center;">点击图片可以实现图片的放大及旋转等操作</div> 
          </div>
          <div class="reviewTestBox">
            <div style="overflow:hidden;">
              <div class="reviewInput">
                  <Input type="textarea" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入审核意见..." v-model='description'></Input>
              </div>
              <div class="reviewBtn">
                <div  @click='submit' style="width:70px;height:30px;line-height:30px;text-align:center;background-color:#19be6b;color:white;border-radius:5px;" class="passBtn">通过</div>
                <div  @click='cancel' style="width:70px;height:30px;line-height:30px;text-align:center;background-color:#f29100;color:white;border-radius:5px;margin-top:12px;" class="noPassBtn">不通过</div>
                <!-- <p>
                  <Button type="success" size="default" @click='submit'>通过</Button>
                </p>
                <p style="margin-top:0px;">
                  <Button type="warning" size="default"  @click='cancel' style="margin-top:8px;">不通过</Button>
                </p> -->
              </div>
            </div>
            <div>
              <h5 class="reviewHistory">历史审核:</h5>
              <ul>
                <li v-for="(item,index) in reviewData" v-bind:key="index" class="reviewSpan">
                  <div>
                    <Icon type="ios-checkmark" color='#19be6b' size=20 v-if="item.ispass=='1'"></Icon>
                    <Icon type="ios-close" color='#f16543' size=20 v-if="item.ispass=='0'"></Icon>
                    <span class="userNameSpan">{{item.userName}}</span> ：<span>{{item.description}}</span>
                  </div>
                  <div class="reviewTime">{{item.createTime}}</div>
                </li>
              </ul>
              <div class="reviewPage">
                  <Page :total="totalNum" show-sizer @on-change="changePage" :page-size="pageSize" @on-page-size-change="changeSize" :page-size-opts = "pageSizeOption"></Page>
              </div>
            </div>
          </div>
        </div>
    </Modal>

    <!--start  预览-->
    <ul id="dowebok19" style="display: none;">
      <li v-for="item in materialData" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-show="previewsModal">
      <div class="viewer-canvas viewer-invisible">
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
      </div>
      <div class="viewer-button viewer-close" data-action="mix"></div>
    </div>
    <!--end  预览-->
  </div>
</template>

<script>
// require('../../../../../assets/js/viewer.min.js');
require('../../../../../assets/js/jquery.min.js');
import {Viewer} from '../../../../../assets/js/viewer.js';
export default{
  data(){
    return{
      materialData: [],   //材料列表数据
      imgMaterialData:[],  //图片材料列表数据
      materialId0: '',    
      //图片文档预览
      apiH: '',
      viewFileId: '',     //文件id
      previewsModal: false,
      reloadName: '',     //重命名
      reloadNameShowId: '',
      isShowDeleteButton:false,
      ReviewModal:false,       //审核模块
      imgFileId:"",                //审核的图片显示
      imgId:'',                 //当前显示材料id
      isReview:false,              //当前审核人是否已审核
      userData:'',               //申请人的资料
      materialName:'',               //材料名
      materialType:'',              //材料类型
      // reviewColumns: [
      //     {
      //         title: '审核人',
      //         key: 'userName'
      //     },
      //     {
      //         title: '审核意见',
      //         key: 'description'
      //     }
      // ],
      reviewData:[],
      description:'',
      totalNum:100,
      currentPage:1,
      pageSize:5,
      currentObj:{},
      pageSizeOption:[5,10,15,20],
      isShowImg:true,
      isShowFile:true,
    }
  },
  directives: {
	  focus: {
		// 指令的定义
		inserted: function (el) {
		  el.focus()
		}
	  }
	},
  //根据办件流水号和事项资料ID查询查看材料的列表
  created(){
    this.currentObj = {};
    this.isReview = false;
    this.apiH = window.config.api;
    this.isShowDeleteButton=this.$route.query.isShowDeleteButton;
  },
  mounted(){
    var viewer12 = new Viewer(document.getElementById('reviewShowImg'));
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods: {
    changePage(data){
      this.currentPage = data;
      this.reviewChangePage(this.currentObj);
    },
    changeSize(data){
      this.pageSize = data;
      this.reviewChangePage(this.currentObj);
    },
    reviewChangePage(item){
      axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsAuditingList.do", {caseMaterialId:item.id,currentPage:this.currentPage,pageSize:this.pageSize})
      .then(data=>{
      this.reviewData = data.obj || [];
      })
    },
    submit(){
      if(this.isReview && this.description){
        this.$Message.info({
          content: "您当前审核意见将会覆盖历史审核意见",
          duration: 3,
        });
      }
      this.ReviewModal = false;
      axios.post("/cgaCaseMaterial/saveCgaCaseMaterialsAuditing.do", {caseMaterialId:this.imgId,description:this.description,ispass:'1'})
      .then(data=>{
        this.$Message.info({
          content: data.msg,
          duration: 2,
        });
      })
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:this.imgId,isPass:'1'})
      .then(data=>{
        this.$Message.success('材料审核通过');
      })
      this.isReview = false;
    },
    cancel(){
      if(this.isReview && this.description){
         this.$Message.info({
          content: "您当前审核意见将会覆盖历史审核意见",
          duration: 3,
        });
      }
      this.ReviewModal = false;
      axios.post("/cgaCaseMaterial/saveCgaCaseMaterialsAuditing.do", {caseMaterialId:this.imgId,description:this.description,ispass:'0'})
      .then(data=>{
        this.$Message.info({
          content: data.msg,
          duration: 2,
        });
      })
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:this.imgId, isPass:'0'})
      .then(data=>{
        this.$Message.success('材料审核不通过');
      })
      this.isReview = false;
    },
    backShowModal(){
      this.$emit('backViewModal');  //触发父组件更新
    },
    reviewMaterial(item){
      if(item.fileType=='.jpg'||item.fileType=='.jpeg'||item.fileType=='.png'||item.fileType=='.gif'){
        this.isShowImg = true;
        this.isShowFile = false;
      }else{
        this.isShowImg = false;
        this.isShowFile = true;
      }
      this.currentObj = item;
      if(item.pass=='0'||item.pass=='1'){
        this.isReview = true;
      }
      this.materialType = item.fileType;
      this.materialName = item.fileName;
      this.description = '';
      this.imgId = item.id;
      this.ReviewModal = true; 
      this.imgFileId = item.fileId;
      axios.post("/cgaCaseMaterial/queryCgaCaseMaterialsAuditingList.do", {caseMaterialId:item.id})
      .then(data=>{
      this.reviewData = data.obj || [];
      this.totalNum = this.reviewData.length;
    })
      this.$emit('hideShowModal');  //触发父组件更新
    },
    getViewList(materialId){
      this.materialId0 = materialId || this.materialId0;
      axios.post("/cgaCaseMaterial/queryCaseMaterialFileList.do", {caseId:this.$route.query.caseId, materialId:this.materialId0})
      .then(data=>{
        this.materialData = data.obj || [];
      })
    },

    //材料置为虚假
    falseMaterial(viewId) {
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:viewId, isPass:'2'})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          this.$Message.success('材料置为虚假材料');
          this.getViewList();
        }else{
          this.$Message.error(data.msg);
        }
      })
    },
    //材料恢复
    recoverMaterial(viewId) {
      axios.post("/cgaCaseMaterial/examineCaseMaterialFile.do", {id:viewId, isPass:'1'})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          this.$Message.success('材料审核通过');
          this.getViewList();
        }else{
          this.$Message.error(data.msg);
        }
      })
    },

    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok19'), {
          url: 'data-original'
        });
        this.imgMaterialData=this.materialData.filter(function(item){
          return (item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg')
        })
        let imgNum=0;
        for(let i=0;i<this.imgMaterialData.length;i++){
          if(this.imgMaterialData[i].fileId==id){
            imgNum = i
          }
        }
        $('#dowebok19 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok19 img').click();
        //   let _this = this;
        //   let timeImg = setInterval(function(){
        //     if($('.viewer-container img').attr('alt') != undefined){
        //       clearInterval(timeImg);
        //       $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
        //     }
        //   },300)
        // })
      }
    },
    reNameShow(id){
      this.reloadNameShowId = id;
    },
    //重命名办件材料的材料名称
    reNameFun(id, name){
      this.reloadNameShowId = '';
      if(this.reloadName == ''){
        this.$Message.error('保存失败，重命名不能为空！');
        return false;
      }
      axios.post("/cgaCaseMaterial/renameFileName.do", {id:id, fileName:this.reloadName})
      .then(data=>{
        this.$Message.success(data.msg);
        this.reloadName = '';
        this.getViewList();
      })
    },
    //删除办件材料记录
    delConfirm(id,fileId){
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          axios.post("/cgaCaseMaterial/deleteCaseMaterialFile.do", {id:id, fileId:fileId})
          .then(data=>{
            this.$Message.success(data.msg);
            this.getViewList();
            this.$emit('parentgetList');  //触发父组件更新
          })
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "../../../../../assets/css/viewer.css";
.viewer-toolbar{
  width: 280px !important;
}
.view{
  text-align: center;
  margin: 10px 0 20px;
  .uploadArea{
    position: relative;
    display: block;
    img{
      display: block;
    }
    p{
      width: 80px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; 
      color: #1c2438;    
    }
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
    &:hover .uploadHoverBtn{
      display: block;
    }  
  }  
}
.contentBox{
  overflow: hidden;
}
.reviewImgBox{
  float: left;
  width: 65%;
  border: 1px solid #e9eaec;
  padding: 10px;
}
.reviewImg{
  width: 100%;
}
.reviewTestBox{
  width: 34%;
  float: right;
  font-size: 15px;
  overflow: hidden;
}
.reviewInput{
  float: left;
  width: 83%;
}
.ivu-modal{
  top:0;
}
.reviewTest{
  height: 120px;
  width: 100%;
  border-color: #e9eaec;
}
.reviewHistory{
  border-bottom: 1px solid #e9eaec;
  margin-top: 20px;
  font-size: 18px;
}
.reviewBtn{
  float: left;
}
.passBtn{
  cursor: pointer;
}
.noPassBtn{
  cursor: pointer;
}
.reviewTime{
  margin-top: 5px;
  color: #999;
}
.reviewPage{
  margin-top: 20px;
}
.userNameSpan{
  font-size: 17px;
}
.userNameSpan:hover{
  color: #0000ff;
}
.reviewSpan{
  margin-top: 10px;
}
.ivu-modal-header-inner{
  font-size: 19px;
  font-weight: 500;
}
</style>