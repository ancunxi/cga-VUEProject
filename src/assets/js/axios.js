import Vue from 'vue'
import router from '@/router'
import store from '@/vuex/store'
import Qs from 'qs'

//设置请求超时时间60秒
axios.defaults.timeout = 60000
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.transformRequest = [obj => Qs.stringify(obj)]

//请求前的拦截处理
axios.interceptors.request.use(
  config => {
    //config.url = `${window.config.api}/cospace2017${config.url}`
    config.url = `${window.config.api}${config.url}`
    if(localStorage.getItem('token')){
      config.url = `${config.url}?token=${localStorage.getItem('token')}`
    }
    return config;
  },
  err => {
    return Promise.reject(err);    
  }
)

//响应后的拦截处理
axios.interceptors.response.use(
  response => {
    //未登录
    if (response.data.status == 420){
      console.log('yang',response.data.msg);
      location.href = '/#/login';
    }
    try {
      if(!response.data) {
        response.data = {}
      }
      if(!response.data.data) {
        response.data.data = {}
      }
    } 
    catch (err) {
      response.data = {
        code: -10000,
        data: {},
        msg: '网络异常，请稍后再试！'
      }
    }
    return response.data
  },
  error => {
    if(error.response){
      console.log(error.response.msg)
    }
    // 返回接口返回的错误信息 
    return Promise.resolve({
      data: {},
      msg: error.msg
    })  
  }
)
