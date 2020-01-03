import Vue from 'vue';
import Router from 'vue-router';
//全局模板
import App from './app.vue';
//引入iview及css
import iView from 'iview';
import 'iview/dist/styles/iview.css';

//引入公用的css文件
import './assets/css/common.css'; 
//引入公用的js文件
import './assets/js/axios.js';

//路由配置文件
import routeMap from './router/index.js';

//vuex配置文件
import store from './vuex/store.js';

//控制浏览器下console不显示vue的提示
Vue.config.productionTip = false;

//模块化编程需要use
Vue.use(Router);
Vue.use(iView);

// 创建 router 实例
const router = new Router({
  routes: routeMap()
});

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
