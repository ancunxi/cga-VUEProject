<!-- 办件历程 -->
<template>
  <div id="timeline">
    <div id="arrow" style="display:none;">
      <ul>
        <li class="arrowup" style="opacity: 1;"></li>
        <li class="arrowdown" style="opacity: 1;"></li>
      </ul>
    </div>

    <div id="history" style="left:-200px;">
      <div class="title">
        <h2>办件历程</h2>
        <div id="circle">
          <div class="circlecontent">
            <div thisyear="2018" class="timeblock">
              <span class="numf" style="background-position: 0px -48px;"></span>
              <span class="nums" style="background-position: 0px 0px;"></span>
              <span class="numt" style="background-position: 0px -24px;"></span>
              <span class="numfo" style="background-position: 0px -192px;"></span>
              <div class="clear"></div>
            </div>
            <div class="timeyear">11月27日</div>
          </div>
        </div>
      </div>
      
      <div id="content" style="height: 485px;">
        <ul class="list" style="height: 460px;">
          <li style="margin-top: 0;" class=""  v-for="(item, index) in timelineList">
            <template v-if="index < 5">
              <div class="liwrap">
                <div class="lileft" style="left:0;">
                  <div class="date">
                    <!-- <span class="year">2013</span> -->
                    <span class="md">{{item.progressTime}}</span>
                  </div>
                </div>
                <div class="point"><b :class="{process:item.progressType==0, file:item.progressType==1, express:item.progressType==2}"></b></div>
                <div class="liright" style="right: 0;">
                  <div class="histt"><a href="javacript:void(0);">{{item.progressTitle}}</a></div>
                  <div class="hisct">{{item.progressContext}}</div>
                </div>
              </div>
            </template>
            <template v-if="index >= 5">
              <div class="liwrap">
                <div class="lileft" style="left:-400px;">
                  <div class="date">
                    <!-- <span class="year">2013</span> -->
                    <span class="md">{{item.progressTime}}</span>
                  </div>
                </div>
                <div class="point"><b :class="{process:item.progressType==0, file:item.progressType==1, express:item.progressType==2}"></b></div>
                <div class="liright" style="right: -1000px;">
                  <div class="histt"><a href="javacript:void(0);">{{item.progressTitle}}</a></div>
                  <div class="hisct">{{item.progressContext}}</div>
                </div>
              </div>
            </template>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script>
// require('../../assets/timeline/jquery.js');
require('../../assets/timeline/jquery.mousewheel.js');
require('../../assets/timeline/jquery.easing.js');

export default {
  props: {
    showFlag: {//控制返回按钮的显示或隐藏
      type: String,
      default: ''
    }
  }, 
  data () {
    return {
      timelineList: [],
    }
  },
  created(){
    
    this.getList(this.$route.query.caseId);
  },
  updated(){
    $(".layout-menu-right").scroll(function(){
      var top = $(this).scrollTop();
      if(top > 130){
        $('#timeline').css({'position':'relative', 'top':top-135});
      }else{
        $('#timeline').css('position', 'static');
      }
      // console.log(parseInt($(".list li:first").css("marginTop")) > 95)
      // if(parseInt($(".list li:first").css("marginTop")) > 95){
      //   $(this).scrollTop(130);
      // }
      
    });

    e();
    function e(){
      //c=$(".list li").eq(d).find(".year").html();   获取页面节点日期
      var date = new Date();
      var c= ''+date.getFullYear();
      //$(".timeblock").attr("thisyear",c);  //改变顶部年份
      var a=c.split(""),b=["numf","nums","numt","numfo"];
      for(var i=0;4>i;i++){
        $("."+b[i]+"").stop(!0,!1).animate({backgroundPosition:"0px "+-24*a[i]},{duration:200})
      }

      $(".timeyear").html( (date.getMonth()+1) + '月' + date.getDate() + '日');
    }

      
    $(".list .liwrap").mouseover(function(){
      $(".list li").removeClass("thiscur");
      $(this).parent().addClass("thiscur")
    });
    var b=0,f=$(".list li").length,d=0,a=!0,c;
    var row;
    // (function(){
    //   var a=$(window).height();
    //   890<=a&&(row=7);
    //   800<=a&&890>a&&(row=6);
    //   726<=a&& 800>a&&(row=5);
    //   726>a&&(row=4)}
    // )();
    (function(){
      var a=$(window).height();
      890<=a&&(row=6);
      800<=a&&890>a&&(row=5);
      726<=a&& 800>a&&(row=4);
      726>a&&(row=3)}
    )();
    var h=f-row;
    $(".list").height(95*row);
    $("#content").height(95*row+25);
    $.fn.liOut=function(){
      $(this).find(".lileft").animate({left:"-400px"},500,"easeOutQuart");
      $(this).find(".liright").animate({right:"-1200px"},500,"easeOutQuart")
    };
    $.fn.liIn=function(){
      $(this).find(".lileft").animate({left:"0px"},500,"easeOutQuart");
      $(this).find(".liright").animate({right:"0px"},500,"easeOutQuart")
    };
    $(".arrowdown").click(function(){
      a&&parseInt($(".list li:first").css("marginTop"))> -95*h&&(d++,b--,a=!1,$(".list li").eq(d-1).liOut(),$(".list li").eq(d+row-1).liIn(),$(".list li:first").animate({marginTop:95*b},600,"easeInOutQuad",function(){
        a=!0;$(".arrowdown").css("opacity",1);
        $(".arrowdown").removeClass("arrow_active")
      }),e()
    )});
    $(".arrowup").click(function(){
      a&&0!=parseInt($(".list li:first").css("marginTop"))&&(b++,d--,a=!1,$(".list li").eq(d).liIn(),$(".list li").eq(d+row).liOut(),$(".list li:first").animate({marginTop:95*b},600,"easeInOutQuad",function(){
        a=!0;$(".arrowup").css("opacity", 1);
        $(".arrowup").removeClass("arrow_active")
      }),e()
    )});
    $(".list").mousewheel(function(b,c){
      Math.abs(c);
      if(a){
        var d=parseInt($(".list li:first").css("marginTop"));
        0<c?0!=d&&($(".arrowup").addClass("arrow_active"),$(".arrowup").trigger("click")):d>-95*h&&($(".arrowdown").addClass("arrow_active"),$(".arrowdown").trigger("click"))
      }
    });
    //$(".timeblock").attr("thisyear",c);  //改变顶部年份
    $(".list li:gt("+(row-1)+")").find(".lileft").css({left:"-400px"});
    $(".list li:gt("+(row-1)+")").find(".liright").css({right:"-1200px"});

    //返回顶部
    var timer;
    $(".circlecontent").click(function(){
      timer = setInterval(function(){
        if(parseInt($(".list li:first").css("marginTop"))>-95){
          console.log(parseInt($(".list li:first").css("marginTop")));
          clearInterval(timer);
          return false;
        }else{
          //$(".arrowup").trigger("click");
          a&&0!=parseInt($(".list li:first").css("marginTop"))&&(b++,d--,a=!1,$(".list li").eq(d).liIn(),$(".list li").eq(d+row).liOut(),$(".list li:first").animate({marginTop:95*b},400,"easeInOutQuad",function(){
            a=!0;$(".arrowup").css("opacity", 1);
            $(".arrowup").removeClass("arrow_active")
          }),e())
        }
      },10)
    });
  
  },
  methods: {
  	getList(caseId){
  		axios.post("/cgaCaseTache/queryCaseProgressList.do", {caseId:caseId})
	    .then(data=>{
        if(data.status == 200 && data.success == true){
          this.timelineList = data.obj;
        }
	      	
      })
		  
  	},
  }
}
</script>

<style lang="scss" scoped>
#timeline * {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
}
.clear{clear:both;display:block;height:0;overflow:hidden;}

/* history */
#history{width:1580px;height:450px;position:relative;margin:0 auto;}
.title{height:95px;line-height:95px;text-indent:280px;}
.title h2{color:#7c7c7c;font-size:18px;font-weight:500;}
#circle{
  cursor: pointer;
  width:83px;height:83px;position:absolute;top:0;left:390px;border:6px solid rgba(0,0,0,0.15);border-radius:95px;text-indent:0;text-align:center;
  -webkit-transition:all 0.3s linear;
  -moz-transition:all 0.3s linear;
  -o-transition:all 0.3s linear;
  transition:all 0.3s linear;
}


#circle span{font-size:18px;color:#b0b0b0;}

.timeyear{color:#b0b0b0;font-size:16px;line-height:20px;}
.timeblock{height:28px;margin-top:22px;margin-left:5px;}
.timeblock span{display:block;height:24px;width:18px;background:url(../../assets/timeline/images/date.png) no-repeat 0 0;float:left;}
.timeblock .numf{background-position:0px -48px;}
.timeblock .nums{background-position:0px 0px;}
.timeblock .numt{background-position:0px -24px;}
.timeblock .numfo{background-position:0px -72px;}
#content{height:355px;width:1480px;overflow:hidden;background:url(../../assets/timeline/images/vertical.png) no-repeat 434px 2px;padding-top:10px;}
.list{overflow:hidden;position:relative;}
.list li{height:95px;vertical-align:bottom;overflow:hidden;position:relative;}
.liwrap{height:55px;margin-top:28px;}
.liwrap .express {
  //background: #ed3f14;
  background:#fff url(../../assets/timeline/images/express.png) no-repeat -2px -2px;
}
.liwrap .file {
  background:#fff url(../../assets/timeline/images/file.png) no-repeat -2px -2px;
}
.liwrap .process {
  background:#fff url(../../assets/timeline/images/process.png) no-repeat -2px -2px;
}
.lileft{position:absolute;top:0;left:0px;height:55px;width:400px;line-height:55px;text-align:right;}
.liright{position:absolute;top:0;right:0px;height:55px;width:1000px;}
.histt{height:35px;line-height:35px;}
.hisct{font-size:14px;color:#6e6e6e;}
.md{font-size:16px;color:#AEAEAE;}
.year{font-size:12px;color:#AEAEAE;margin-right:10px;}
.point{width:55px;height:55px;position:absolute;top:0;left:409px;background:url(../../assets/timeline/images/point.png) no-repeat 0px 18px;overflow:hidden;}
.point b{
  height:36px;width:36px;background:#fff;display:block;margin:7px 0 0 7px;border-radius:36px;border:2px solid #6bc30d;
  -webkit-transition:all 0.1s linear;
  -moz-transition:all 0.1s linear;
  -o-transition:all 0.1s linear;
  transition:all 0.1s linear;
  position:absolute;
  top:0;left:0;
}
.thiscur .point b{border:7px solid rgba(107,195,13,0.6);margin:2px 0px 0px 2px;border-radius:52px;}
.thiscur .histt a{color:#6bc30d;}
.histt a{
  text-decoration: none;
  // font-weight: bold;
  font-size: 20px;
  //color:#747474;
  color:#000;
  -webkit-transition:all 0.3s linear;
  -moz-transition:all 0.3s linear;
  -o-transition:all 0.3s linear;
  transition:all 0.3s linear;
}
#arrow{position:fixed;top:50%;right:30px;}
*html #arrow{position:absolute;top:expression(eval(document.documentElement.scrollTop));margin-top:350px;}

#arrow ul li{
  display:block;height:20px;width:20px;background:url(../../assets/timeline/images/icons.png) no-repeat 0 0;cursor:pointer;
  -webkit-transition:all 0.2s ease-out;
  -moz-transition:all 0.2s ease-out;
  -o-transition:all 0.2s ease-out;
  transition:all 0.2s ease-out;
}
#arrow ul li:active{background-color:#000;}
#arrow ul .arrow_active{
  background-color:#000;
  -webkit-transition:all 0.1s ease-in;
  -moz-transition:all 0.1s ease-in;
  -o-transition:all 0.1s ease-in;
  transition:all 0.1s ease-in;
}
#arrow ul .arrowup{background-position:0px -26px;margin-bottom:10px;}
#arrow ul .arrowdown{background-position:0px 0px;}

//@import './../static/css/global.css'; /*引入公共样式*/
</style>