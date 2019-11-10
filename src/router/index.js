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
    redirect: '/contents'
  },
  {
    name:'contents',
    path: '/contents/:thisStatus',
    components:{
      mainArea:MainBody
    },
    children:[
      {
        path:'message',
        component:MsgList
      },
      {
        path:"contact",
        component:ContactList
      },
      {
        path:"more",
        component:MoreList
      }
    ],
  }
];

const router = new VueRouter({
  routes
});

export default router
