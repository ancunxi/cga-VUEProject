<template>
<div>
  <Row style="width:100%;height:300px;border:1px solid #dddee1;">
    <Col span="24">
    	    <div>
          <iframe v-if="isModifyCase == false" class="sreportFramesCheck" width="100%" height="800" :src='this.fileReproUrls+"/ReportServer?reportlet="+cptUrl+"&__showtoolbar__=false&caseId="+this.caseIds'></iframe>
          <!-- <iframe v-else class="sreportFramesCheck" width="100%" height="800" :src='this.fileReproUrls+"/ReportServer?reportlet="+cptUrl+"&op=write&__showtoolbar__=false&caseId="+this.caseIds'></iframe> -->
          <iframe v-else class="sreportFramesCheck" width="100%" height="100%" style='border:none;' :src='fileReproUrls+"/ReportServer?reportlet="+cptUrl+"&op=write&__showtoolbar__=false&caseId="+caseIds'></iframe>
		     <!-- <Button type="primary" @click="treportFrames">提交</Button>-->
         </div>
    </Col>
  </Row>
  <Row class="margin-bottom-10 center">
    <Col span="24">
      <router-link :to="{path:'../index', query:{ moduleId:this.$route.query.moduleId}}"style="margin-left:8px;"><Button type="primary">返回</Button></router-link>

    </Col>
  </Row> 
</div>
</template>




<script>
require('../../../../assets/js/jquery.min.js');
export default{
	data () {
    return {
    	nextAudit:'',
      cptUrl:'',
      templateHtml:'',
      inSrc:'',
      intForm:'',
      fileReproUrls:'',

      pass:false
    }
 },
  props: {
  	
  	formReportFile:{
      type: String,   
    },
    caseIds:{
      type: String,   
    },
    current: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    },
    isModifyCase: [String, Boolean],
  },
  created(){	
  	
  	    //console.log('caseIds----1---',this.$route.query.caseIds);
  	  //	console.log('caseIds----2---',this.caseIds);
   	this.cptUrl = this.formReportFile;
  	 axios.post("/cgaSysLoginInfo/findInfoById.do")
				      .then(data => {
				      	  this.fileReproUrls=data.obj.frProjectUrl;
				      	 
				      });
   	
 
 	},
 	mounted(){
    /**
     * 帆软技术支持
     */
    let _this = this;
    (function(win, doc){
      
     var cb = function(msg){
        _this.intForm = msg;
     };
    var sendMessage = function(){
      if(win.postMessage){
        if (win.addEventListener) {
                  win.addEventListener("message",function(e){
          cb.call(win,e.data);
        },false);
              }else if(win.attachEvent) {
                  win.attachEvent("onmessage",function(e){    
                    cb.call(win,e.data);
      });
              }
      }
    }
    win.sendMessage = sendMessage();
   })(window, document);
 		
 	},

  methods: {
    send(msg,i){  
      /* var ifr = document.getElementsByClassName('sreportFramesCheck')[this.current-1].contentWindow;  
          if(window.postMessage){  
            ifr.postMessage(msg,'*');                     
          }else{
            alert(false)
            ifr.name=msg;
          }*/
       
          var ifr = document.getElementsByClassName('sreportFramesCheck')[i].contentWindow;
          ifr.postMessage(msg,"*")                   
    },
    handleNext(i){ 
      this.send('_g().verifyAndWriteReport()',i);  
      setTimeout(()=>{
        if(this.intForm =="110"){
            //this.$emit('next');
            this.pass = true;
          }else {
            this.$Message.error({
                duration: 3,
                content: '报表验证不通过，请检查后提交！'
            });
            this.pass = false;
          }
      },1000);
    },
  	
  }
}
</script>
