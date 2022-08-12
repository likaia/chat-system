import _ from "lodash";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const isMobile = () => {
  return !!navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
};
export default function createdCheck() {
  const router = useRouter();
  const store = useStore();
  // 从本地存储中获取token
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  const username = localStorage.getItem("username");
  if (isMobile()) {
    if (!window.location.href.includes("8020")) {
      // 跳转至生产环境404页面
      window.location.href = "/chat-system/404-page/index.html";
      return;
    }
    // 跳转至开发环境404页面
    window.location.href = "/404-page/index.html";
    return;
  }
  if (_.isEmpty(token) || _.isEmpty(username) || _.isEmpty(refreshToken)) {
    // 跳转登录路由
    localStorage.removeItem("msgArray");
    router.push({ name: "login" }).then();
  } else {
    // 更新vuex中的token
    store.commit("updateUserInfo", {
      token: token,
      refreshToken: refreshToken,
      profilePicture: localStorage.getItem("profilePicture"),
      userID: localStorage.getItem("userID"),
      username: localStorage.getItem("username")
    });
  }
}
