//受理审批
import inside from './case.js';

export default () => [
  {
    path: '/login',
    component: function(resolve) {
      require(['../components/login.vue'], resolve);
    }
  },
  {
    path: '/',
    component: function(resolve) {
      require(['../components/index.vue'], resolve);
    }
  },
  {
      path: '/addquick',
      component: function(resolve) {
        require(['../components/addquick.vue'], resolve);
      }      
  },
  inside
]
