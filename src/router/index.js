import Vue from 'vue'
import VueRouter from 'vue-router'
import mainBody from '@/components/main-body'

Vue.use(VueRouter);

const routes = [
  {
    name:'contents',
    path: '/contents',
    components:{
      mainArea:mainBody
    }
  }
];

const router = new VueRouter({
  routes
});

export default router
