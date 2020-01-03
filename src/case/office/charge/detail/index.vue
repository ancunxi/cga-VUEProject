<template>
	<div>
	  <div class="layout-content">
	    <panel-view></panel-view>
	    <opinion-view @previewsFun="previews"></opinion-view>         
	  </div>
	   <!--start  预览-->
		<ul id="dowebok5" style="display: none;">
		  <li><img :data-original="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId " :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId"></li>
		</ul>
		<div class="viewer-container viewer-fixed viewer-fade viewer-transition viewer-in" style="z-index: 2015000;" v-show="previewsModal">
		  <div class="viewer-canvas viewer-invisible">
		    <iframe scrolling='auto' frameborder='0' :src="apiH+ '/attachment/onLinePre.do?fileId=' + viewFileId" class="viewer-move viewer-transition" style="width:96%; height:96%; margin:1% 2%; visibility: visible; max-width: none !important; transform: rotate(0deg) scale(1, 1);"></iframe>
		  </div>
		  <div class="viewer-button viewer-close" data-action="mix"></div>
		</div>
		<!--end  预览-->
	</div>
</template>

<script>
require('../../../../assets/js/viewer.min.js');
require('../../../../assets/js/jquery.min.js');
import panel from '../../../common/panel.vue';
import opinion from './info.vue';
export default {
  components: {
    'panel-view': panel,     
    'opinion-view': opinion     
  },
  data(){
    return{
  	//图片文档预览
    apiH:'',
    viewFileId:'',  //文件id
    previewsModal:false
	}
  },
  created(){
    this.apiH = window.config.api;
  },
  mounted:function(){
    $(document).on("click",".viewer-close",()=>{
      this.previewsModal = false;
      this.viewFileId = '';
    })
  },
  methods:{
    //预览
    previews(id,type){
      this.viewFileId = id;
      if(type != '.png' && type != '.jpg' && type != '.bmp'){
        this.previewsModal = true;
      }else{
        var viewer = new Viewer(document.getElementById('dowebok5'), {
          url: 'data-original'
        });
        setTimeout(()=>{
          $('#dowebok5 img').click();
          let _this = this;
          let timeImg = setInterval(function(){
            if($('.viewer-container img').attr('alt') != undefined){
              clearInterval(timeImg);
              $('.viewer-container img').attr('src', _this.apiH+ '/attachment/onLinePre.do?fileId=' + _this.viewFileId);
            }
          },300)
        })
        
      }
    }  
  }
}
</script>




