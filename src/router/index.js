import Vue from 'vue'
import VueRouter from 'vue-router'
import mainBody from '@/components/main-body'

Vue.use(VueRouter);

const routes = [
  {
    path:"/mainBody",
    name:"mainBody",
    component:mainBody
  }
];

const router = new VueRouter({
  routes
});

export default router
