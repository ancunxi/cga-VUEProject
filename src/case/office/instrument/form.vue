<template>
  	<div class="layout-content" style="margin-bottom:100px;">
  		<Row style="width:100%;margin-bottom:20px;">
	        <Col span="24">
                 <div id="templateHtmlDiv" v-html="templateHtml" align="center"></div>
	        </Col>
	    </Row>
      <Row style="position: fixed; width:83.33333333%; padding:5px; bottom:0; text-align: center; background: #fff;">
        <Col>
          <Button type="primary" @click="printPage">打印</Button>
         <Button  style="margin-left:8px;"  @click="gobacks">返回</Button>
        </Col>
      </Row>

  	</div>
</template>
<script>
require('../../../assets/js/jquery.min.js');
export default {
  data () {
    return {
      templateHtml:''
    }
  },
  created(){
    axios.post("/cgaDocumentPrint/queryTemplatePrint.do",{
      id:this.$route.query.id,
      code:this.$route.query.code
    })
    .then(data=>{
      if(data.status == '200' && data.success == true){
      	         this.templateHtml = data.obj.HTML;
      }
     });
  },
  methods:{
  	gobacks(){
  		this.$router.push({path: 'index',query: {currentPage:this.$route.query.inCurrentPage,moduleId:this.$route.query.moduleId}})
  	},
    printPage(){
      axios.post("/cgaDocumentPrint/updatePrintNum.do",{id:this.$route.query.id})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          var newWindow=window.open("打印窗口","_blank");
          var tpHtml = $("#templateHtmlDiv").html();
          newWindow.document.write(tpHtml);
          newWindow.document.close();
          newWindow.onload = function(){
            newWindow.print();
            newWindow.close();
          }
        }
      });      
    }
  }
}
</script>