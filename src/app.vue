<template>
  <div id="app" class="wrap">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    created(){
      //从cospace跳转过来，token已存在，直接从路由中获取token
      if(window.location.href.split('token=')[1] != undefined){
       
        let token1 = window.location.href.split('token=')[1];
        //console.log(token1)
        let token = token1.split('#/')[0];
        //console.log(token)
        localStorage.setItem('token',token); 
      }
      
      //监听token是否过期，若过期则跳转到登录页面
      this.checkToken();
      this.$watch('$route.fullPath', this.checkToken);
      //获取token，通过token拿到用户真实信息并存储到全局
      let token = localStorage.getItem('token');
      if(token){
        axios.post("/cgaSysLoginInfo/findInfoById.do")
        .then(data => {
          if(!data.success){
            this.$router.push({path: '/login'});
            return false;
          }
          //通过vuex修改页面标题          
          this.$store.commit('SAVE_USER', data.obj);
        });
      }else{
        if(!/^\#\/(login)/.test(window.location.hash)){
          this.$router.push({path: '/login'});
        }
      }     
    },
    methods: {
      //监听token是否过期
      checkToken(){
        if(window.location.hash !== "#/login"){
          axios.post("/login/checkToken.do")
          .then(data=>{
            if(data.success == true && data.status == 200){

            }else if(data.status == 401){
              this.$router.push({path: '/login'});
              this.$Message.error(data.msg);
              return false
            }else{
              this.$Message.error("请重新登录！");
              this.$router.push({path: '/login'});
            }
          });
        }         
      }
    }
  }
</script>

