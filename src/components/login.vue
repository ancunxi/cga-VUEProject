<template>
  <div class="login">
    <div class="loginbox">
      <div class="login-logo">
        <span class="logo"></span>
        <span class="title">单窗通办综合受理系统</span>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleInline">
        <FormItem prop="username">
          <Input type="text" v-model="formValidate.username">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formValidate.password" @keyup.enter.native='handleSubmit'>
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Checkbox v-model="checked"><span style="margin-left:5px;">记住用户名和密码</span></Checkbox>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="handleSubmit()">登录</Button>
        </FormItem>
      </Form>
    </div>
    <div class="copyright">
      <p>推荐使用<a href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html" target="_blank">Chrome</a>浏览器或将您的IE浏览器升级到IE10+以上版本访问本系统，您将获得最佳体验。</p>
      <p>Copyright @2005 - 2017 LiloSoft, Inc. All rights reserved.<br/>Powered by lilosoft</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      formValidate: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { type: 'string', min: 4, max: 16, message: '用户名长度在4~16位之间', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', max: 12, message: '密码长度不超过12位', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
	//先清空浏览器自带保存的用户名和密码，只认复选框记住用户名和密码这一操作,只对360兼容模式有效
	this.formValidate.username=" ";
	this.formValidate.password="";
	this.getCookie();
	
  },
  methods: {
	//保存用户名和密码到cookie中
	setCookie(c_name,c_pwd,exdays) {
		var exdate=new Date();//获取时间
		exdate.setTime(exdate.getTime() + 24*60*60*1000*exdays);//保存的天数
		//字符串拼接cookie
		window.document.cookie="userName"+"="+c_name+";path=/;expires="+exdate.toGMTString();
		window.document.cookie="userPwd"+"="+c_pwd+";path=/;expires="+exdate.toGMTString();
	},
	//读取cookie
	getCookie() {
		if (document.cookie.length>0) {
		  var arr=document.cookie.split('; ');//这里显示的格式需要切割一下自己可输出看下
		  for(var i=0;i<arr.length;i++){
			var arr2=arr[i].split('=');//再次切割
			//判断查找相对应的值
			if(arr2[0]=='userName'){
			  this.formValidate.username=arr2[1];
			}  
			if(arr2[0]=='userPwd'){
			  this.formValidate.password=arr2[1];
			}
		  }
		  if(this.formValidate.password!=null && this.formValidate.password!="" 
		  && this.formValidate.username!=null && this.formValidate.username!=""){
			this.checked=true;
		  }
		}
	},
	clearCookie() {  
		this.setCookie("", "", -1);  
	}, 
    handleSubmit() {
	  this.formValidate.username=this.formValidate.username.trim();
      this.$refs['formValidate'].validate((valid) => {
        if (valid) { 
		  //判断复选框是否被勾选 勾选则将用户名和密码保存到cookie中，否则把之前的cookie清除
		  if(this.checked){
				//传入账号名，密码，和保存天数3个参数
			   this.setCookie(this.formValidate.username,this.formValidate.password,7);
		  }else{
			   this.clearCookie();
		  }
          axios.post("/login/cospaceLogin.do", {
              ...this.formValidate
          }).then(data => {
            if(data.success == false){
              //返回错误状态
              this.$Message.error(data.msg);
              return false;
            }           
            this.$store.commit('UPDATE_TOKEN', data.obj.token);
            //这里说明登录成功了，存token并跳转到首页  
            localStorage.setItem('token', data.obj.token);
            //根据token获取用户的真实信息
            //如果后端能返回当前用户的登录信息则无需重复登录并跳转到首页
            //如果后端返回失效的登录信息则会跳转到登录页重新登录
            let self = this;
            axios.post("/cgaSysLoginInfo/findInfoById.do")
              .then(data => {
                if(data.success == false){
                self.$Message.error(data.msg);  
                self.$router.push({path: '/login'});
                return false;
              }             
              //通过vuex修改页面标题
              self.$store.commit('SAVE_USER', data.obj);
              let url = data.obj.workFlowUrl;

              //若工作流地址最后没有带斜杠，则自动补上斜杠
              var strLast= url.charAt(url.length-1);
              if(strLast!="/"){
                window.config.workflowUrl = url+'/workflow';
              }else{
                window.config.workflowUrl = url+'workflow';
              }
              localStorage.setItem('workFlowUrl', window.config.workflowUrl);
              
            });
            this.$router.push({ path: '/' });
          });           
        } 
        else {
          this.$Message.error(data.msg);
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login{
  position: relative;
  min-height: 100%;
  background: url(../assets/img/login_bg.png) center center no-repeat;
  background-size: 100% 100%;
  .loginbox{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -183px;
    margin-left: -190px;
    width: 380px;    
    background: #fff;
    box-shadow: 11px 11px 11px rgba(0, 0, 0, .2);
    -webkit-box-shadow: 11px 11px 11px rgba(0, 0, 0, .2);
    .login-logo{
      width: 380px;
      height: 100px;
      background: url(../assets/img/login_logo_bg.jpg) no-repeat;
      text-align: center;
      padding: 16px 0;
      .logo{
        display: inline-block;
        vertical-align: middle;
        width: 68px;
        height: 68px;
        margin-right: 15px;
        background: url(../assets/img/login_logo.png) no-repeat;
      }
      .title{
        display: inline-block;
        vertical-align: middle;
        height: 68px;
        line-height: 68px;
        font-size: 28px;
        color: #1f9799;
      }
    }
    .ivu-form{
      width: 380px;
      padding: 20px 30px;
      .ivu-input{
        line-height: 38px;
        height: 38px;
      }
      .ivu-btn{
        font-size: 16px;
      }
    }
  }
  .copyright{
    position: fixed;
    left: 50%;
    bottom: 0;
    width: 532px;
    margin-left: -266px;
    text-align: center;
    color: #000;
    font-size: 12px;
    p{
      margin: 0 0 10px;
      a{
        margin: 0 5px;
        color: #e25252;
        font-weight: bold;
      }
    }
  }
}
</style>
