<template>
  <div class="layout-ceiling">
    <div class="layout-logo">单窗通办综合受理系统</div>
    <div class="layout-ceiling-main">
      <p class="info">
        <span>欢迎您，{{userInfo.userName}}</span>
        <span>部门：{{userInfo.deptName}}</span>
        <!-- <span>{{today}}</span> -->
      </p>
      <p class="redirect">
		<a href="javascript:;" @click="testPhoto">高拍仪调试</a><span> | </span>
        <router-link to="/">回到工作台</router-link><span> | </span>
        <a :href="cospaceUrl">云平台</a><span> | </span>
        <a href="javascript:;" @click="outConfirm">退出</a>
      </p>
		<Modal v-model="modal1" width="450" @on-cancel="photoCancel(1)">
			<p slot="header" style="color:blue;text-align:left">
				<Icon type="ios-information-circle"></Icon>
				<span>高拍仪调试</span>
			</p>
			<div style="text-align:center">
				<iframe src="./static/photo.html" ref="frame" width="100%" height="300" frameborder="0" scrolling="no"></iframe>
			</div>
			<div slot="footer">
				<Button type="primary" @click="photoOpen">打开摄像头</Button>
				<Button type="success" @click="photoCancel(2)">关闭摄像头</Button>
			</div>
		</Modal>
    </div>
  </div>
</template>
<script>
require('../assets/js/jquery.min.js');
export default{
  data(){
    return{
      userInfo: {
        userName: '',
        deptName: '',
      },
      cospaceUrl: '',
      oToken: '',
      today: '',
      //工作待办——流程图图片存放地址
      workflowUrl: '',
	    modal1: false,
      waitList: [],
      waitTotalX:0

    }
  },
  created(){
    //从cospace跳转过来，token已存在，直接从路由中获取token
    if(window.location.href.split('token=')[1] != undefined){
      let token1 = window.location.href.split('token=')[1];
      //console.log(token1)
      let token = token1.split('#/')[0];
      //console.log(token)
      localStorage.setItem('token',token);
    }

    let token = localStorage.getItem('token');
    this.oToken = token;
    this.cospaceUrl = window.config.cospaceUrl+'/#/?token='+this.oToken;

    //通过token获取头部区域的用户信息
    axios.post("/cgaSysLoginInfo/findInfoById.do")
    .then(data=>{
      this.userInfo = data.obj;
      let workflowUrl = data.obj.workFlowUrl;
      localStorage.setItem('workflowUrl', workflowUrl);
    });

    var myDate = new Date();
    //获取年
    var year = myDate.getFullYear();
    //获取月
    var month = myDate.getMonth()+1;
    //获取日
    var date = myDate.getDate();
    //获取星期中的某一天，返回值是0（星期天）到6（星期六）之间的一个整数
    var day = myDate.getDay();
    //使用一个数组来输出星期的名称，而不是数字
    var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
    var weekday = "星期" + weekArray[day];
    this.today = year+"年" +month+"月" +date+"日" + ' ' +weekday;
    axios.post("/cgaCase/queryTodoCaseListByPage.do", this.queryData)
      .then(data => {
        this.waitTotalX = parseInt(data.obj.total == undefined ? 0 : data.obj.total);
        if(this.waitTotalX>0){
          $(".tipfloat").animate({height:"show"},800);
          setTimeout(function () {
            $(".tipfloat").animate({height:"hide"},800);
          },8000);
        }
      }).catch(error => {
      this.$Message.error("查询待办件失败！")
    })
  },
  mounted(){
 
  },
  methods: {
    outConfirm () {
		this.$Modal.confirm({
			title: '退出确认',
			content: '<p>您确定要退出系统吗？</p>',
			onOk: () => {
			  axios.post("/login/cospaceLoginOut.do")
			  .then(data=>{
				this.$Message.success('退出成功！');
				this.$router.push({path: '/login'});
			  });
			},
			onCancel: () => {

			}
		});
    },
	testPhoto(){
		//如果是ie10以上及360兼容模式浏览器
		if (!!window.ActiveXObject || "ActiveXObject" in window || window.navigator.userAgent.indexOf('compatible') != -1){
			this.modal1=true;
		}else{
			this.$Modal.info({
				title: '信息',
				content: '<p>对不起，该设备只支持IE10以上及360兼容模式的浏览器！</p>',
				onOk: () => {

				}
			});
		}
	},

	photoOpen(){
		window.setTimeout(this.photoInit,500);
	},
	photoInit(){
		var obj = this.$refs.frame;
		obj.contentWindow.CZUR_Initialize();
		obj.contentWindow.CZUR_OpenDevice();
	},
	photoCancel(type){
		var obj = this.$refs.frame;
		obj.contentWindow.CZUR_CloseDevice();
		obj.contentWindow.CZUR_Deinitialize();
		if(type == 1){
			this.modal1=false;
		}
	}
  }
}





</script>

<style lang="scss">
.layout-ceiling {
  padding: 10px 20px;
  background: #464c5b;
  color: #fff;
  overflow: hidden;
  .layout-logo {
    float: left;
    height: 40px;
    line-height: 40px;
    font-size: 24px;
  }
  .layout-ceiling-main {
    float: right;
    .info {
      font-size: 14px;
      span {
        margin-left: 15px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .redirect {
      text-align: right;
      span {
        padding: 0 10px;
        color: #e9eaec;
      }
    }
  }
}

.waitMessage{
  padding:0px;margin:0px;
}
.waitMessage img{
  border:0px;
}
.fl{
  float:left
}
.fr{
  float:right
}

.tipfloat{
  display:none;
  border:1px  #8e9cde solid;
  position:fixed;
  bottom:0px;
  right:21px;
  width:350px;
  height:200px;
  background:#fff;
}
.tipfloat_bt{
  height:40px;
  line-height:40px;
  background:#52c3ff;
  padding:0px 5px;
  font-size:18px;
  color:#fff;
}
.xx_nrong{
  font-size:16px;
  line-height:40px;
  height: 40px;
  color:#333;
  width: 350px;
  padding:0 10px;
  overflow: hidden; /*自动隐藏文字*/
  text-overflow: ellipsis;/*文字隐藏后添加省略号*/
  white-space: nowrap;/*强制不换行*/
  transition:all 1s ease;
}
.xx_nrong:hover{
  opacity: 0.7;
  background: #cef1ff;
  color: black;
  cursor:pointer;
}
  .waitPage{
    font-size:16px;
    line-height:40px;
    height: 40px;
    color:#333;
    width: 350px;
    padding:0 10px;
  }
</style>
