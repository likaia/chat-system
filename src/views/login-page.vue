<template>
  <div id="login-panel" ref="loginPanel">
    <div class="top-panel">
      <div class="qrCode-panel">
        <img src="../assets/img/login/code_normal@2x.png" alt="" />
      </div>
    </div>
    <!--头像区域-->
    <div class="headPortrait-panel">
      <!--加载层-->
      <div
        class="load-panel loadWhirl"
        v-if="isLoginStatus === loginStatusEnum.LOGGING_IN"
      >
        <!--头像显示层:登录中-->
        <div class="headPortrait-img-panel avatarRotation">
          <img :src="avatarSrc" alt="" />
        </div>
      </div>
      <!--头像显示层:注册-->
      <div
        class="headPortrait-img-panel"
        v-if="isLoginStatus === loginStatusEnum.REGISTERED"
      >
        <!--灰色蒙层:默认头像-->
        <div class="cover-panel" v-if="isDefaultAvatar === true">
          <p>上传头像</p>
          <input
            class="file"
            name="file"
            type="file"
            accept="image/png,image/gif,image/jpeg,image/jpg"
            @change="uploadAvatar($event)"
          />
        </div>
        <!--头像已上传：取消灰色蒙层-->
        <div class="cover-panel" v-else style="background: rgba(0,0,0,.0);">
          <input
            class="file"
            name="file"
            type="file"
            accept="image/png,image/gif,image/jpeg"
            @change="uploadAvatar($event)"
          />
        </div>
        <img :src="avatarSrc" alt="" />
      </div>
      <!--头像显示层:登录-->
      <div
        class="headPortrait-img-panel"
        v-if="isLoginStatus === loginStatusEnum.NOT_LOGGED_IN"
      >
        <img :src="avatarSrc" alt="" />
      </div>
    </div>
    <!--输入区域:登录-->
    <div
      class="inputArea-panel"
      v-if="isLoginStatus === loginStatusEnum.NOT_LOGGED_IN"
    >
      <div class="item-panel">
        <label>
          <input
            type="text"
            @blur="getUserAvatar()"
            v-model="userName"
            placeholder="输入用户名"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='输入用户名'"
          />
        </label>
      </div>
      <div class="item-panel">
        <label>
          <input
            type="password"
            v-model="password"
            placeholder="输入密码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='输入密码'"
            @keydown.enter.exact="login('click')"
          />
        </label>
        <div
          class="login-btn-panel"
          @click="login('click')"
          @mouseenter="login('hover')"
          @mouseleave="login('leave')"
        >
          <img :src="loginBtnIcon" alt="" />
        </div>
      </div>
    </div>
    <!--输入区域:登录中-->
    <div
      class="inputArea-panel"
      v-else-if="isLoginStatus === loginStatusEnum.LOGGING_IN"
    >
      <div class="username-view-panel">
        <p>
          {{ userName }}
        </p>
      </div>
      <div class="cancel-btn-panel" @click="cancelLogin()" ref="cancelBtn">
        <p>取消</p>
      </div>
    </div>
    <!--输入区域:注册-->
    <div class="inputArea-panel" v-else>
      <div class="item-panel">
        <label>
          <input
            type="text"
            v-model="userName"
            placeholder="输入用户名"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='输入用户名'"
          />
        </label>
      </div>
      <div class="item-panel">
        <label>
          <input
            type="password"
            v-model="password"
            placeholder="输入密码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='输入密码'"
          />
        </label>
      </div>
      <div class="item-panel">
        <label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="确认密码"
            onfocus="this.placeholder=''"
            onblur="this.placeholder='确认密码'"
            @keydown.enter.exact="login('clickRegistered')"
          />
        </label>
        <div
          class="login-btn-panel"
          @click="login('clickRegistered')"
          @mouseenter="login('hover')"
          @mouseleave="login('leave')"
        >
          <img :src="loginBtnIcon" alt="" />
        </div>
      </div>
    </div>
    <!--第三方登录-->
    <div
      class="auth-panel"
      v-if="isLoginStatus === loginStatusEnum.NOT_LOGGED_IN"
    >
      <div class="item-panel" @click.once="getAuthorize('github')">
        <img src="@/assets/img/auth/github.png" alt="github登录" />
      </div>
      <div class="item-panel" @click.once="getAuthorize('gitee')">
        <img src="@/assets/img/auth/gitee.png" alt="gitee登录" />
      </div>
      <div class="item-panel" @click.once="getAuthorize('baidu')">
        <img src="@/assets/img/auth/baidu.png" alt="百度登录" />
      </div>
      <div class="item-panel" @click.once="getAuthorize('oschina')">
        <img src="@/assets/img/auth/oschina.png" alt="开源中国登录" />
      </div>
      <div class="item-panel" @click.once="getAuthorize('coding')">
        <img src="@/assets/img/auth/coding.png" alt="腾讯云登录" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, ref, onMounted } from "vue";
import { loginStatusEnum } from "@/enum/ComponentEnum";
import {
  defaultAvatar,
  defaultLoginBtnIcon,
  loginUndo,
  loginBtnHover,
  loginBtnDown,
  loginBtnNormal
} from "@/resource/LoginResource";
import {
  getAuthorizeDataType,
  responseDataType
} from "@/type/ComponentDataType";
import { base64ToArrayBuffer } from "@/module/login/common-methords/Base64ToBuffer";
import {
  touchIDLoginOptions,
  touchIDRegistered
} from "@/module/login/components-metords/TouchIDLogin";
import base from "@/api/base";
import fileManageAPI from "@/api/fileManageAPI";
import authLoginAPI from "@/api/authLoginAPI";
import websiteManageAPI from "@/api/websiteManageAPI";
import touchIdLoginAPI from "@/api/touchIdLogingAPI";
import _ from "lodash";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

// 组件需要使用的响应式变量
const isLoginStatus = shallowRef(0);
const avatarSrc = shallowRef(defaultAvatar);
const isDefaultAvatar = shallowRef(true);
const userName = shallowRef("");
const password = shallowRef("");
const loginBtnIcon = shallowRef(defaultLoginBtnIcon);
const confirmPassword = shallowRef("");
const cancelBtn = ref();
const state = shallowRef("");
const platform = shallowRef("");

// 组件需要使用的第三方库
const router = useRouter();
const store = useStore();

// 上传头像
const uploadAvatar = (e: { target: { files: FileList } }) => {
  const fileMaxSize = 1024 * 1024;
  // 头像上传
  const file = e.target.files[0];
  if (file.size > fileMaxSize) {
    alert("文件大小不能大于1MB");
    return false;
  }
  // 构造form对象
  const formData = new FormData();
  // 后台取值字段 | blob文件数据 | 文件名称
  formData.append("file", file, file.name);
  // 调用上传api
  fileManageAPI.upload(formData).then((res: responseDataType) => {
    const fileName = `${base.lkBaseURL}/uploads/${res.fileName}`;
    // 更改默认头像状态
    isDefaultAvatar.value = false;
    // 头像赋值
    avatarSrc.value = fileName;
  });
};

// 获取用户头像
const getUserAvatar = () => {
  if (!_.isEmpty(userName.value)) {
    // 调用接口
    websiteManageAPI
      .getUserAvatar({
        userName: userName.value
      })
      .then((res: responseDataType) => {
        if (res.code === 0) {
          // 替换头像
          avatarSrc.value = res.data;
        } else {
          // 上传失败
          avatarSrc.value = defaultAvatar;
        }
      });
  }
};

const login = (status: string) => {
  let loginBtnTime = undefined;
  switch (status) {
    case "hover":
      if (_.isEmpty(password.value) || _.isEmpty(userName.value)) {
        loginBtnIcon.value = loginUndo;
        return false;
      }
      loginBtnIcon.value = loginBtnHover;
      break;
    case "click":
      if (_.isEmpty(password.value) || _.isEmpty(userName.value)) {
        // 密码为空，更改登录图标状态为禁用
        loginBtnIcon.value = loginUndo;
        return false;
      }
      // 执行登录
      loginBtnIcon.value = loginBtnDown;
      clearTimeout(loginBtnTime);
      loginBtnTime = setTimeout(() => {
        if (_.isEmpty(userName.value)) {
          alert("用户名不能为空");
          return false;
        }
        if (_.isEmpty(password.value)) {
          alert("密码不能为空");
          return false;
        }
        // 状态改为正在登录
        isLoginStatus.value = loginStatusEnum.LOGGING_IN;
        // 修改登录按钮图为正在登录
        loginBtnIcon.value = loginBtnNormal;
        // 调用登录接口
        websiteManageAPI
          .login({
            userName: userName.value,
            password: password.value
          })
          .then((res: responseDataType) => {
            if (res.code === 0) {
              // 存储当前用户信息
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("refreshToken", res.data.refreshToken);
              localStorage.setItem("profilePicture", res.data.avatarSrc);
              localStorage.setItem("userID", res.data.userID);
              localStorage.setItem("username", res.data.username);
              // 跳转消息组件
              router.push({
                path: "/"
              });
            } else {
              // 返回登录界面
              isLoginStatus.value = loginStatusEnum.NOT_LOGGED_IN;
              password.value = "";
              setTimeout(() => {
                alert(res.msg);
              }, 300);
            }
          });
      }, 150);
      break;
    case "clickRegistered":
      // 注册事件
      if (
        _.isEmpty(password.value) ||
        _.isEmpty(userName.value) ||
        _.isEmpty(confirmPassword.value)
      ) {
        // 密码为空时修改登录图标为禁用
        loginBtnIcon.value = loginUndo;
        return false;
      }
      loginBtnIcon.value = loginBtnDown;
      clearTimeout(loginBtnTime);
      loginBtnTime = undefined;
      loginBtnTime = setTimeout(() => {
        loginBtnIcon.value = loginBtnNormal;
        // 判断确认密码是否输入
        if (_.isEmpty(confirmPassword.value)) {
          alert("确认密码不能为空");
          return false;
        }
        // 头像必传
        if (isDefaultAvatar.value) {
          alert("头像为必传项");
          return false;
        }
        // 用户名长度不能小于4
        if (_.trim(userName.value).length < 4) {
          alert("用户名长度不能小于4");
          return false;
        }
        // 密码长度不能小于6位
        if (_.trim(password.value).length < 6) {
          alert("密码长度不能小于6位且不能包含空格");
          return false;
        }
        // 判断密码与确认密码是否相等
        if (!_.isEqual(password.value, confirmPassword.value)) {
          alert("两次输入的密码不匹配");
          return false;
        }
        // 调用注册api
        websiteManageAPI
          .registered({
            userName: userName.value,
            password: password.value,
            avatarSrc: avatarSrc.value
          })
          .then((res: responseDataType) => {
            if (res.code === 0) {
              alert(res.data);
              // 切回登录界面
              isLoginStatus.value = loginStatusEnum.NOT_LOGGED_IN;
            } else {
              alert(res.msg);
            }
          });
      }, 150);
      break;
    default:
      if (_.isEmpty(password.value) || _.isEmpty(userName.value)) {
        // 登录按钮图标改为禁用
        loginBtnIcon.value = loginUndo;
        return false;
      }
      // 登录按钮图标改为正常
      loginBtnIcon.value = loginBtnNormal;
      break;
  }
};
const touchIDLogin = async (certificate: string, touchId: string) => {
  // 校验设备是否支持touchID
  const hasTouchID = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (hasTouchID) {
    // 更新登录凭证
    touchIDLoginOptions.publicKey.challenge = base64ToArrayBuffer(certificate);
    // 更新touchID
    touchIDLoginOptions.publicKey.allowCredentials[0].id = base64ToArrayBuffer(
      touchId
    );
    // 开始校验指纹
    await navigator.credentials.get(touchIDLoginOptions as any);
    // 调用指纹登录接口
    touchIdLoginAPI
      .touchIdLogin({
        touchId: touchId,
        certificate: certificate
      })
      .then((res: responseDataType) => {
        if (res.code == 0) {
          // 存储当前用户信息
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("profilePicture", res.data.avatarSrc);
          localStorage.setItem("userID", res.data.userID);
          localStorage.setItem("username", res.data.username);
          const certificate = res.data.certificate;
          localStorage.setItem("certificate", certificate);
          // 跳转消息组件
          router.push({
            path: "/"
          });
          return;
        }
        // 切回登录界面
        isLoginStatus.value = loginStatusEnum.NOT_LOGGED_IN;
        alert(res.msg);
      });
  }
};
const cancelLogin = () => {
  // 取消登录
  cancelBtn.value.style.background = "#f3f3f3";
  // 清空密码显示登录
  password.value = "";
  isLoginStatus.value = loginStatusEnum.NOT_LOGGED_IN;
  cancelBtn.value.style.background = "";
};
const authLogin = (state: string, code: string, platform: string) => {
  authLoginAPI
    .authorizeLogin({
      state,
      code,
      platform
    })
    .then(async (res: responseDataType) => {
      if (res.code == 0) {
        const userId = res.data.userID;
        const username = res.data.username;
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        const profilePicture = res.data.avatarSrc;
        const isInitPassword = res.data.isInitedPassword;
        // 存储当前用户信息
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("profilePicture", profilePicture);
        localStorage.setItem("userID", userId);
        localStorage.setItem("username", username);
        localStorage.setItem("isInitedPassword", isInitPassword);
        // 保存用户凭证，用于指纹登录
        const certificate = res.data.certificate;
        localStorage.setItem("certificate", certificate);
        // 校验设备是否支持touchID
        const hasTouchID = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (hasTouchID) {
          // 更新vuex中的数据
          store.commit("updateUserInfo", {
            token: token,
            refreshToken: refreshToken,
            profilePicture: profilePicture,
            userID: userId,
            username: username
          });
          touchIdLoginAPI
            .getTouchID({
              userId: userId
            })
            .then(async (res: responseDataType) => {
              if (res.code !== 0) {
                // touchId不存在, 询问用户是否注册touchId
                await touchIDRegistered(username, userId, certificate);
              }
              // 保存touchId
              localStorage.setItem("touchId", res.data);
              // 跳转消息组件
              await router.push({
                path: "/"
              });
            });
          return;
        }
        // 跳转消息组件
        await router.push({
          path: "/"
        });
        return;
      }
      // 切回登录界面
      isLoginStatus.value = loginStatusEnum.NOT_LOGGED_IN;
      alert(res.msg);
    });
};
// 获取授权码
const getAuthCode = () => {
  const code = localStorage.getItem("authCode");
  localStorage.removeItem("authCode");
  // 移除localStorage监听
  window.removeEventListener("storage", getAuthCode);
  if (code) {
    // 状态改为正在登录
    isLoginStatus.value = loginStatusEnum.LOGGING_IN;
    authLogin(state.value, code, platform.value);
    return;
  }
  throw platform.value + "授权码获取失败";
};

// 获取授权链接
const getAuthorize = (name: string) => {
  authLoginAPI
    .getAuthorize({ platform: name })
    .then((res: responseDataType<getAuthorizeDataType>) => {
      if (!res.data.state || !res.data.authorizeUrl)
        throw "服务器错误: 授权链接获取失败";
      // 更新状态码与登录平台名称
      state.value = res.data.state;
      platform.value = name;
      // 打开授权窗口
      window.open(
        res.data.authorizeUrl,
        "_blank",
        "toolbar=no,width=800, height=600"
      );
      // 开始监听localStorage,获取授权码
      window.addEventListener("storage", getAuthCode);
    });
};

onMounted(() => {
  const touchId = localStorage.getItem("touchId");
  const certificate = localStorage.getItem("certificate");
  // 如果touchId存在，则调用指纹登录
  if (touchId && certificate) {
    // 提示用户是否需要touchId登录
    setTimeout(() => {
      if (window.confirm("您已授权本网站通过TouchID登录，是否立即登录？")) {
        touchIDLogin(certificate, touchId);
      }
    }, 1000);
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/login.scss" />
