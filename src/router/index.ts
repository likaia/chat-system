import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import MainContent from "@/components/main-content.vue";
import store from "@/store/index.ts";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: MainContent,
    redirect: "index.html",
    children: [
      {
        path: "/index|index.html/", // 使用正则表达式匹配路径
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
  history: createWebHistory(process.env.BASE_URL), // 地址栏不带#
  routes
});
router.beforeEach((to, from, next) => {
  // 路由变化时，更新vuex中的当前组件名
  store.commit("updateComponentName", to.name);
  next();
});

export default router;
