import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import MainContent from "@/components/main-content.vue";
import store from "@/store/index.ts";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainContent,
    children: [
      {
        path: "/",
        name: "message",
        component: () => import("@/views/msg-list.vue")
      },
      {
        path: "list",
        name: "list",
        props: true,
        component: () => import("@/views/contact-list.vue")
      },
      {
        name: "more",
        path: "more",
        component: () => import("@/views/more-list.vue")
      }
    ]
  },
  {
    name: "login",
    path: "/login",
    component: Login
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach((to, from, next) => {
  // 路由变化时，更新vuex中的当前组件名
  store.commit("updateComponentName", to.name);
  next();
});

export default router;
