<template>
  <div class="layout-content">
    <div class="print">
      <Tabs type="card">
        <TabPane :label="tabName1">
          <Row style="margin-bottom:20px;">
            <Col span="24">
              <div id="templateHtmlDiv" v-html="templateHtml" align="center"></div>
            </Col>
          </Row> 
          <Row class="center">
            <Col span="24">
              <Button type="success" @click="printPage($route.query.w01ID,'1')">打印</Button>
              <router-link :to="{path:'window/index',query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}}" style="margin-left:8px;"><Button>返回</Button></router-link>
            </Col>
          </Row>
        </TabPane>
       <!-- <TabPane :label="tabName2">
          <Row style="margin-bottom:20px;">
            <Col span="24">
              <div id="templateHtmlDiv1" v-html="templateHtml1" align="center"></div>
            </Col>
          </Row> 
          <Row class="center">
            <Col span="24">
              <Button type="success" @click="printPage($route.query.w02ID,'2')">打印</Button>
              <router-link :to="{path:'window/index',query:{moduleId:this.$route.query.moduleId,currentPage:this.$route.query.inCurrentPage}}" style="margin-left:8px;"><Button>返回</Button></router-link>
            </Col>
          </Row> 
        </TabPane>-->
      </Tabs>
    </div>         
  </div>
</template>

<script>
require('../../assets/js/jquery.min.js');
export default {
  data () {
    return {
      templateHtml:'',
      templateHtml1:'',
      tabName1: (h) => {
        return h('div', [
          h('span', '收件通知单'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.getPrintData(this.$route.query.w01ID,'w01','1');
              }
            }
          })
        ])
      },
      tabName2: (h) => {
        return h('div', [
          h('span', '材料清单'),
          h('Button', {
            props: {
              type: 'ghost',
              size: 'small'
            },
            on: {
              click: () => {
                this.getPrintData(this.$route.query.w02ID,'w02','2');
              }
            }
          })
        ])
      },
    }
  },
  created(){
    this.getPrintData(this.$route.query.w01ID,'w01','1');
  },
  methods:{
    getPrintData(id,wordName,type){
      axios.post("/cgaDocumentPrint/queryTemplatePrint.do",{id:id})
      .then(data=>{
        if(data.success){
          if(type=='1'){
            this.templateHtml = data.obj.HTML;
          }else{
            this.templateHtml1 = data.obj.HTML;
          }
        }
      });
    },
    printPage(id,type){
      axios.post("/cgaDocumentPrint/updatePrintNum.do",{id:id})
      .then(data=>{
        if(data.success){


	  var obj=document.getElementsByClassName('text'); //选择所有name="'test'"的对象，返回数组
          for(var i=0; i<obj.length; i++){
            obj[i].setAttribute('value', obj[i].value);
          }
          var obj=document.getElementsByClassName('checkbox'); //选择所有name="'test'"的对象，返回数组
          for(var i=0; i<obj.length; i++){
            if(obj[i].checked){
              obj[i].setAttribute('checked', 'checked');
            }
          }
          var obj=document.getElementsByClassName('radio'); //选择所有name="'test'"的对象，返回数组
          for(var i=0; i<obj.length; i++){
            if(obj[i].checked){
              obj[i].setAttribute('checked', 'checked');
            }
          }

          var newWindow=window.open("打印窗口","_blank");
          var tpHtml ='';
          if(type=='1'){
            tpHtml = $("#templateHtmlDiv").html();
          }else{
            tpHtml = $("#templateHtmlDiv1").html();
          }
          newWindow.document.write(tpHtml);
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

<style lang="scss">
.print .ivu-tabs-nav .ivu-tabs-tab button{
  position: absolute;
  top: 0;
  left: 0;              
  width: 90px;
  height: 31px;
  border: 0;  
  background: red;
  opacity: 0;
  filter: alpha(opacity=0);
}
</style>

