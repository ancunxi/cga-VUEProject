<template>
  <Row>
    <Col span="24">
    	  <div class="ma_layout_content" style="height:1080px">
          <iframe class="sreportFramesCheck" width="100%" height="100%" style='border:none;' :src='FineReportUrl+"/ReportServer?reportlet="+cptUrl+"&op=write&__showtoolbar__=false&caseId="+this.$route.query.caseId'></iframe>
		     <!-- <Button type="primary" @click="treportFrames">提交</Button>-->
        </div>
    </Col>
    <Col span="24" class="center">
      <button-view 
        :current="current"
        :length="length"
        :nextaudit='nextAudit'
        @next="handleNext" 
        @prev="handlePrev" 
        @unpass="handleUnpass"
        @complete="handleComplete" 
        @temporarily="handleTemporarily" 
        @correction="handleCorrection"
        @loadingShow="handleLoadingShow"
        @loadingHide="handleLoadingHide"
        ref="child">
      </button-view>
    </Col>
  </Row>  
</template>

<script>
import button from './button.vue';
require('../../../../assets/js/jquery.min.js');
export default{
	data () {
    return {
    	nextAudit:'',
      cptUrl:'',
      templateHtml:'',
      inSrc:'',
      intForm:'',
      FineReportUrl:''
    }
  },
  props: {
  	formReportFile:{
      type: String,   
    },
    caseId:{
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
  },
  created(){
   	this.cptUrl = this.formReportFile;
   	
   	
 
 	},
 	mounted(){
 		  axios.post("/cgaSysLoginInfo/findInfoById.do")
				      .then(data => {
				      	  this.FineReportUrl=data.obj.frProjectUrl;
				      });
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
 
  components: {

    'button-view': button
  },
  methods: {
  	treportFrames(){
  		this.send('_g().verifyAndWriteReport()');  
  	},
  	send(msg){    
        /* var ifr = document.getElementsByClassName('sreportFramesCheck')[this.current-1].contentWindow;  
            if(window.postMessage){  
              ifr.postMessage(msg,'*');                     
            }else{
            	alert(false)
            	ifr.name=msg;
            }*/
         
						var ifr = document.getElementsByClassName('sreportFramesCheck')[this.current-1].contentWindow;
						ifr.postMessage(msg,"*")
		 
						              
    },  
    handleNext(){ 
      	this.send('_g().verifyAndWriteReport()');  
      	setTimeout(()=>{
      		if(this.intForm =="110"){
      	      this.$emit('next');
			      }else {
			      	  this.$Message.error({
					          duration: 3,
					          content: '验证不通过，请检查后提交！'
			        });
			      }
      	},1000);
      
    
    },
    handlePrev() {
      this.$emit('prev');
    },
    handleUnpass(){
      this.send('_g().verifyAndWriteReport()');  
      setTimeout(()=>{
        if(this.intForm =="110"){
          //---------------------------------------------------
            this.$refs.child.unpassSubmit0();
          //------------------------------------------------
          }else {
              this.$Message.error({
                  duration: 3,
                  content: '验证不通过，请检查后提交！'
            });
          }
        
      },1000);
    },
    handleComplete(){
    		this.send('_g().verifyAndWriteReport()');  
    		setTimeout(()=>{
      		if(this.intForm =="110"){
      			//---------------------------------------------------
      	      this.$refs.child.handleComplete0();
              this.nextAudit = true;
            //------------------------------------------------
			      }else {
			      	  this.$Message.error({
					          duration: 3,
					          content: '验证不通过，请检查后提交！'
			        });
			      }
      		
      	},1000);

    },
    handleTemporarily(){
        this.send('_g().verifyAndWriteReport()'); 
    	  setTimeout(()=>{
      		if(this.intForm =="110"){
      			//---------------------------------------------------
      	         this.$emit('temporarily');
            //------------------------------------------------
			      }else {
			      	  this.$Message.error({
					          duration: 3,
					          content: '验证不通过，请检查后提交！'
			        });
			      }		
      	},1000);
    },
    handleCorrection(){
      this.send('_g().verifyAndWriteReport()'); 
    	setTimeout(()=>{
      		if(this.intForm =="110"){
      			    		//---------------------------------------------------
      	        this.$emit('correction');
            //------------------------------------------------
			      }else {
			      	  this.$Message.error({
					          duration: 3,
					          content: '验证不通过，请检查后提交！'
			        });
			      }		
      	},1000);
     
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




