<template>
  <div class="layout-content">
    <Row>
      <Col span="24" class="margin-bottom-20">
        <div id="payment" v-html="paymentHtml" align="center"></div>
      </Col>
      <Col span="24" class="center">
        <Button type="success" @click="printPage">打印</Button>
        <router-link :to="{path:'./index2', query:{moduleId:$route.query.moduleId}}" style="margin-left:8px;">
          <Button>返回</Button>
        </router-link>
      </Col>
    </Row>          
  </div>
</template>

<script>
require('../../../assets/js/jquery.min.js');
export default{
  data(){
    return{
      paymentHtml: ''
    }
  },
  created(){
    axios.post("/cgaDocumentPrint/queryTemplatePrint.do", {id:this.$route.query.w06ID})
    .then(data=>{
      if(data.status == '200' && data.success == true){
        this.paymentHtml = data.obj.HTML;
      }
    })
  },
  methods:{
    printPage(){
      axios.post("/cgaDocumentPrint/updatePrintNum.do",{id:this.$route.query.w06ID})
      .then(data=>{
        if(data.status == '200' && data.success == true){
          var newWindow=window.open("打印窗口","_blank");
          var payHtml = $("#payment").html();
          newWindow.document.write(payHtml);
          newWindow.document.close();
          newWindow.onload = function(){
            newWindow.print();
            newWindow.close();
          }
          // setTimeout(function(){
          //   newWindow.print();
          //   newWindow.close();
          // },300);
        }
      });      
    }
  }  
}
</script>

