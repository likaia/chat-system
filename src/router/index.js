import Vue from 'vue'
import VueRouter from 'vue-router'
import MainBody from '../components/main-body'
import MsgList from '../views/msg-list'
Vue.use(VueRouter);

const routes = [
  {
    name:'contents',
    path: '/contents/:thisStatus',
    components:{
      mainArea:MainBody
    },
    children:[
      {
        path:"message",
        components:{
          msgList:MsgList
        }
      }
    ],
    // 开启组件间的传参，有命名视图的路由必须为每个视图都设置
    props:{
      mainArea:true
    }
  }
];

const router = new VueRouter({
  routes
});

export default router
