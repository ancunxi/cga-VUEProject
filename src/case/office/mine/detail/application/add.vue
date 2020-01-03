<template>
  <div class="layout-content">
    <Row class="margin-bottom-20">
      <Col span="24">
        <h6 class="margin-bottom-10">标准资料材料</h6>
        <Row>
          <Col span="4">
            <template  v-for="item in exampleDataList">
              <Row>
                <Col span="4">
                  <!-- <Checkbox ></Checkbox> -->
                  <input type="checkbox" v-model='checkboxModel' :value='item.fileId' />
                </Col>
                <Col span="20">
                  <img v-if="/^.+\.png$/.test(item.exampleName) == true" src="../../../../../assets/img/icon_file_png.png">
                  <img v-if="/^.+\.jpg$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_jpg.png">
                  <img v-if="/^.+\.jpeg$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_jpeg.png">
                  <img v-if="/^.+\.gif$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_gif.png">  
                  <img v-if="/^.+\.bmp$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_bmp.png">           
                  <img v-if="/^.+\.pdf$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_pdf.png">
                  <img v-if="/^.+\.doc$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_doc.png">
                  <img v-if="/^.+\.docx$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_docx.png">
                  <img v-if="/^.+\.ppt$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_ppt.png">
                  <img v-if="/^.+\.txt$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_txt.png">
                  <img v-if="/^.+\.xls$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_xls.png">
                  <img v-if="/^.+\.xlsx$/.test(item.exampleName) == true " src="../../../../../assets/img/icon_file_xlsx.png">
                  <p>申请报表</p> 
                  <div>
                    <Button type="primary" size="small" class="preview" @click="previews(item.fileId,item.fileType)">预览</Button>
                  </div>
                </Col>
              </Row>  
            </template>      
          </Col>
                      
        </Row>        
      </Col>
    </Row>
    <!--历史材料先隐藏掉
    <Row>
      <Col span="24">
        <h6>2. 其它历史材料</h6>
        <Row>
          <Col span="4">
            <Row>
              <Col span="4">
                <Checkbox></Checkbox>
              </Col>
              <Col span="20">
                <a href="javascript:;"><img src="../../../../../assets/img/icon_file_doc.png"></a>
                <p>申请报表</p> 
                <div>
                  <Button type="primary" size="small" class="preview">预览</Button>
                </div>
              </Col>
            </Row>        
          </Col>                  
        </Row>        
      </Col>
    </Row>     
    -->
    <Row class="center">
      <Col span="24">
        <Button type="primary" v-on:click='applicationAdd'>确定</Button>
        <router-link :to="{path:'../index', query:{materialId:$route.query.materialId, id:$route.query.id, caseId:$route.query.caseId, projectId:$route.query.projectId, moduleId:$route.query.moduleId,cardNumber:$route.query.cardNumber}}"><Button>取消</Button></router-link>      
      </Col>
    </Row>   

    <!--start  预览-->
    <ul id="dowebok6" style="display: none;">
      <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
    </ul>
    <div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015;" v-if="previewsModal">
      <div class="viewer-canvas viewer-invisible">
        <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
      </div>
      <div class="viewer-button viewer-close" data-action="mix"></div>
    </div>
    <!--end  预览-->
  </div>
</template>

<script>
export default{
  data(){
    return{
      exampleDataList: [],

      //图片文档预览
      apiH:'',
      viewFileId:'',  //文件id
      previewsModal:false,
      //勾选
      checkboxModel:[]
    }
  },
  created(){
    this.apiH = window.config.api;
    this.exampleList();
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    exampleList(){
      //查询申请人历史标准资料办件材料列表
      //cardNumber 证件号码或统一社会信用代码
      //materialId 事项资料ID
      axios.post("/cgaCaseMaterial/queryHistoryStandardMaterialFileList.do", {materialId:this.$route.query.materialId,cardNumber:this.$route.query.cardNumber})
      .then(data=>{
        this.exampleDataList = data.obj;
      });
    },
    //预览
    previews(id,name){
      this.viewFileId = id;
      if(/^.+\.png$/.test(name) == false && /^.+\.jpg$/.test(name) == false && /^.+\.bmp$/.test(name) == false){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok6'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok6 img').click();
          let _this = this;
          let timeImg = setInterval(function(){
              if($('.viewer-container img').attr('alt') != undefined){
                  clearInterval(timeImg);
                  $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
              }
          },300)
        })
        
      }
    },

    applicationAdd(){
      //添加历史资料办件材料记录
      //caseId 办件流水号
      //materialId 事项资料ID
      //fileIds  附件IDS  fileIds  附件IDS，例如uuid1,uuid2
      var t=this.checkboxModel||[];
      if(t.length==0){
        this.$Message.error('未勾选任何材料，不能进行添加！');
      }else{
        var fileIds=this.checkboxModel.join();
        axios.post("/cgaCaseMaterial/addHistoryCaseMaterialFile.do", {caseId:this.$route.query.caseId,materialId:this.$route.query.materialId,fileIds:fileIds})
        .then(data=>{
          this.$Message.success('添加成功！');
        });
      }
    }
  }
}
</script>




