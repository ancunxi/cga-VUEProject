<template>
	<div class="layout-content">
    <Row class="margin-bottom-20">
    	<h5 class="title">
        <span><Icon type="images"></Icon>照面信息</span>
      </h5>
    </Row>
    <Row>
      <Col span="24">
        <Table border :columns="Columns" :data="TableList"></Table> 
        <Page :total="total" :current="currentPage" :page-size="pageSize" show-total show-elevator show-sizer @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </Col>
    </Row> 

		<Row style="margin-top:50px;">
      <Col span="24">
        <h5 class="title">
          <span><Icon type="upload"></Icon>上传附件</span>
        </h5>
        <Row class="annex">
          <!--附件上传之后-->
          <template v-for="item in caseFileList">
            <Col span="4" class="uploadAfter">
              <a href="javascript:;" class="uploadImg" :title="item.fileName + item.fileType">
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
                  <Button type="success" size="small"  @click="previews(item.fileId,item.fileType)">预览</Button>
                  <Button type="success" size="small" style="margin:5px 0;" @click="reNameShow(item.id)">重命名</Button>
                  <Button type="error" size="small" @click="delConfirm(item.id, item.fileId)">删除</Button>
                </div>            
              </a>
				<div>
					 <p :title="item.fileName + item.fileType" v-if='reloadNameShowId!=item.id' style="text-align: left;padding-left:10px">{{item.fileName + item.fileType}}</p>
					<input type="text" name="请输入名称" v-focus="true" style="margin-top:3px;margin-bottom:3px; display:block; width:80px;" v-model='reloadName'  v-if='reloadNameShowId==item.id' @blur="reNameFun(item.id)"> 
				</div>
            </Col>
                
          </template> 
          <!--附件上传之前-->         
          <Col span="4" class="uploadLocalFile">
            <a href="javascript:;" class="uploadImg">        
              <img src="../../../../assets/img/upload.png"> 
              <div class="uploadHoverBtn" style="height: 80px;">
                <Button type="primary" size="small" class="margin-bottom-10">上传</Button>
                <form id="uploadForm" class="uploadForm">
                  <input type="hidden" name="folder" :value="'cga/' + this.$route.query.caseId">
                  <input type="hidden" name="source" value="1">
                  <input type="file" name="datafile" @change="uploadSpecial" accept=".png,.jpg,.jpeg,.gif,.bmp,.pdf,.doc,.docx,.txt,.xls,.xlsx">
                </form>    
                <Button type="success" size="small" @click='userPhoto'>拍照</Button>
              </div>                          
            </a>
            <div v-if="percent > 0" class="percent">
              <Progress :percent="percent" hide-info></Progress>
            </div> 
          </Col>        
        </Row>
      </Col>
    </Row>    

    <Row class="margin-bottom-20 center">
      <Col span="24">
      	<Button  @click="gobacks()">返回</Button>
      </Col>
    </Row>
    
    <!--start  预览-->
    <ul id="dowebok17" style="display: none;">
      <li v-for="item in caseFileList" v-if="item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg'"><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :src="apiH+ '/attachment/onLinePre.do?fileId=' + item.fileId" :alt="item.fileName"></li>
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
// require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');
import {Viewer} from '../../../../assets/js/viewer.js';
export default {
  data () {
    return {
      uploadShow: true,     //材料上传前后的显示和隐藏
	  fineReportUrl:'',		//帆软报表服务器url地址
      percent: 0,           //进度条
      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,

      reloadName:'', //重命名
      reloadNameShowId:'',//

      caseFileList:[], //附件列表
      imgMaterialData:[], //照片附件
    	Columns: [
        {
	      title: '照面表单',
	      key: 'formName',
	      width: '15%'
        },
        {
          title: '表单报表文件路径',
          key: 'formReportFile',
          width: '60%'
        },
        {
          title: '表单排序',
          key: 'isOrder',
          width: '10%'
        },                                 
        {
          title: '操作',
          key: 'four',
          width: '15%',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small',
                  icon: 'edit'
                },
                on: {
                  click: () => {
                    this.$router.push({path:'./form',query:{
                      cptUrl:params.row.formReportFile,
                      caseId:this.$route.query.caseId,
					  fineReportUrl:this.fineReportUrl,
                      projectId:this.$route.query.projectId
                    }})
                  }
                }
              }, '照面信息录入')
            ]);
          }
        }
      ],
      TableList: [],
      //分页
      // queryData: Object.assign({}, this.$route.query), 
      total: 0,
      currentPage: 1, 
      pageSize: 10  
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
  created(){
    this.apiH = window.config.api;
    this.getList();
    // this.$watch('$route.fullPath', this.getList);
    this.loadFileList();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    //获取Table表格数据
    getList(){     	axios.post("/cgaCaseLicenceFile/queryProjectFormDetailListByPage.do",{projectId:this.$route.query.projectId,formType:"1",currentPage:this.currentPage,pageSize:this.pageSize})
      .then(data=>{
        this.TableList = data.obj.records;
        this.total = parseInt(data.obj.total==undefined?0:data.obj.total);
        // this.currentPage= parseInt(this.$route.query.currentPage) || 1;
        // this.pageSize= parseInt(this.$route.query.pageSize) || 10;
		//如果列表数据不为空，则获取帆软照面信息录入表单url地址，以便传给子页面，子页面不用再单独去查询帆软服务器地址，
		//单独查询影响页面加载速度
		if(this.TableList.length>0){
		  axios.post("/cgaSysLoginInfo/findInfoById.do")
			.then(data => {
				this.fineReportUrl=data.obj.frProjectUrl;
		  });
		}
      });      
    },
	//高拍仪 拍照 上传申请材料
    userPhoto(){
	  //如果是ie10以上及360兼容模式浏览器
	  if (!!window.ActiveXObject || "ActiveXObject" in window || window.navigator.userAgent.indexOf('compatible') != -1){
		showCarmeraWin(this.photoCarmeraFun); //打开高拍仪拍照上传窗口
	  }else{
		this.$Modal.info({
			title: '信息',
			content: '<p>对不起，该设备只支持IE10以上及360兼容模式的浏览器！</p>',
			onOk: () => {
			  
			}
		});
	  }
    },
	photoCarmeraFun(attachmentId, originalName){
		let _this = this;
    	axios.post("/cgaCaseLicenceFile/addCaseLicenceFile.do", {caseId:this.$route.query.caseId, fileId:attachmentId,fileName:originalName})
		  .then(data=>{
			if(data.success){
			  this.$Message.info('上传成功！');
			  this.loadFileList();
			}else{
			  this.$Message.info('上传失败！');
			}
		})
	},
    gobacks(){
  		this.$router.push({path:'../index',query:{currentPage:this.$route.query.inCurrentPage,moduleId:this.$route.query.moduleId}})
  	},
    //加载上传附件列表
    loadFileList(){
      axios.post("/cgaCaseLicenceFile/queryCaseLicenceFileList.do", {caseId:this.$route.query.caseId})
      .then(data=>{
        this.caseFileList = data.obj;
      });  
    },
    refreshRouter(){
      //更新路由
      this.$router.push(this.$route.path  + '?' + util.serialize(this.queryData));
    },
    pageChange(data){
      this.currentPage = data;
      this.getList();
      // Object.assign(this.queryData, {currentPage:data});
      // this.refreshRouter();
    },
    pageSizeChange(data){
      this.pageSize = data;
      this.getList();
      // Object.assign(this.queryData, {pageSize:data});
      // this.refreshRouter();
    },
    //上传特殊情况材料
    uploadSpecial(){ 
      let self = this;
      var formData = new FormData($( "#uploadForm" )[0]);
      $.ajax({  
        url: window.config.api + '/attachment/uploadFile.do',  
        type: 'POST',  
        data: formData,
        async: false,  
        cache: false,  
        contentType: false,  
        processData: false, 
        success: function (data) {          
          //上传时间进度
          let fileTime = data.obj.uploadTime;
          fileTime<=1000 ? fileTime=1000 : fileTime=fileTime;
          let timer = null;
          timer = setInterval(function(){
            if(self.percent >= 100){
              clearInterval(timer);
              // self.uploadShow = false;
              // self.formValidate.fileId = data.obj.id;
              // self.formValidate.fileName = data.obj.fileName;         
              self.percent = 0;  
              axios.post("/cgaCaseLicenceFile/addCaseLicenceFile.do", {caseId:self.$route.query.caseId, fileId:data.obj.id})
              .then(data=>{
                if(data.success){
                  self.$Message.info('上传成功！');
                  self.loadFileList();
                }
              })                            
            }
            else{
              self.percent += 100/parseInt(fileTime/1000);
            }
          },1000);          
        },
        error: function (err) { 
          self.$Message.error('上传失败！');
        }
      });  
    },    
    delConfirm (id,fileId) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除吗？</p>',
        okText: '删除',
        onOk: () => {
          axios.post("/cgaCaseLicenceFile/deleteCaseLicenceFile.do", {id:id,fileId:fileId})
          .then(data=>{
            this.$Message.info('删除成功');
            this.loadFileList();
          });  
        },
        onCancel: () => {
        }
      });
    },
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp' && type != '.jpeg'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok17'), {
          url: 'data-original'
        });
        this.imgMaterialData=this.caseFileList.filter(function(item){
          return (item.fileType == '.png' || item.fileType == '.jpg' || item.fileType == '.bmp' || item.fileType == '.jpeg')
        })
        let imgNum=0;
        for(let i=0;i<this.imgMaterialData.length;i++){
          if(this.imgMaterialData[i].fileId==id){
            imgNum = i
          }
        }
        $('#dowebok17 img')[imgNum].click();
        // setTimeout(()=>{
        //   $('#dowebok17 img').click();
        //   let _this = this;
        //   let timeImg = setInterval(function(){
        //       if($('.viewer-container img').attr('alt') != undefined){
        //           clearInterval(timeImg);
        //           $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
        //       }
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
      axios.post("/cgaCaseLicenceFile/renameFileName.do", {id:id, fileName:this.reloadName})
      .then(data=>{
        this.$Message.success(data.msg);
        this.reloadName = '';
        this.loadFileList();
      })
    }          
  }
}
</script>

<style lang="scss">
@import "../../../../assets/css/viewer.css";
.annex{
  margin-bottom: 20px;
  border: 1px solid #e9eaec; 
  .uploadImg{
    .uploadHoverBtn{
      display: none;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
      width: 90px;
      height: 90px;
      padding: 5px; 
      text-align: center;    
      border-radius: 3px;
      background: rgba(0,0,0,0.5);
    }
    &:hover .uploadHoverBtn{
      display: block;
    } 
  }
  .uploadLocalFile{
    margin-top: 10px;
  }  
  .uploadAfter{
    text-align: center;
    margin: 10px 0;
    .uploadImg{
      position: relative;
      display: block;
      img{
        height:90px;
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
    }  
  }
}
</style>