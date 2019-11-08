import Vue from 'vue'
import VueRouter from 'vue-router'
import MainBody from '../components/main-body'
import MsgList from '../views/msg-list'
import ContactList from '../views/contact-list'
import MoreList from  '../views/more-list'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/contents/message/msgList'
  },
  {
    name:'contents',
    path: '/contents/:thisStatus',
    components:{
      mainArea:MainBody
    },
    children:[
      {
        path:"msgList",
        components:{
          msgList:MsgList
        }
      },
      {
        path:"contactList",
        components:{
          contactList:ContactList
        }
      },
      {
        path:"moreList",
        components:{
          moreList:MoreList
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
