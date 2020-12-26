<!--登录页面-->
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
    <!--注册区域-->
    <div
      class="registration-area-panel"
      v-if="isLoginStatus !== loginStatusEnum.LOGGING_IN"
    >
      <p
        v-if="isLoginStatus === loginStatusEnum.NOT_LOGGED_IN"
        @click="registered(true)"
      >
        注册账号
      </p>
      <p v-else @click="registered(false)">返回登录</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loginDataType, responseDataType } from "@/type/ComponentDataType";
import { loginStatusEnum } from "@/enum/ComponentEnum";
import base from "../api/base";
import _ from "lodash";

export default defineComponent({
  name: "login",
  data<T>(): loginDataType<T> {
    return {
      loginUndo: require("../assets/img/login/icon-enter-undo@2x.png"),
      loginBtnIcon: require("../assets/img/login/icon-enter-undo@2x.png"),
      loginBtnHover: require("../assets/img/login/icon-enter-hover@2x.png"),
      loginBtnDown: require("../assets/img/login/icon-enter-down@2x.png"),
      userName: "",
      password: "",
      confirmPassword: "",
      isLoginStatus: 0,
      loginStatusEnum: loginStatusEnum,
      isDefaultAvatar: true,
      avatarSrc: require("../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png"),
      loadText: "上传中"
    };
  },
  methods: {
    login: function<T>(status: string) {
      let loginBtnTime = undefined;
      switch (status) {
        case "hover":
          if (_.isEmpty(this.password) || _.isEmpty(this.userName)) {
            this.loginBtnIcon = this.loginUndo;
            return false;
          }
          this.loginBtnIcon = this.loginBtnHover;
          break;
        case "click":
          if (_.isEmpty(this.password) || _.isEmpty(this.userName)) {
            // 密码为空，更改登录图标状态为禁用
            this.loginBtnIcon = this.loginUndo;
            return false;
          }
          // 执行登录
          this.loginBtnIcon = this.loginBtnDown;
          clearTimeout(loginBtnTime);
          loginBtnTime = setTimeout(() => {
            if (_.isEmpty(this.userName)) {
              alert("用户名不能为空");
              return false;
            }
            if (_.isEmpty(this.password)) {
              alert("密码不能为空");
              return false;
            }
            // 状态改为正在登录
            this.isLoginStatus = loginStatusEnum.LOGGING_IN;
            // 修改登录按钮图为正在登录
            this.loginBtnIcon = require("../assets/img/login/icon-enter-normal@2x.png");
            // 调用登录接口
            this.$api.websiteManageAPI
              .login({
                userName: this.userName,
                password: this.password
              })
              .then((res: responseDataType) => {
                if (res.code === 0) {
                  // 存储当前用户信息
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("profilePicture", res.data.avatarSrc);
                  localStorage.setItem("userID", res.data.userID);
                  localStorage.setItem("username", res.data.username);
                  // 跳转消息组件
                  this.$router.push({
                    name: "message"
                  });
                } else {
                  // 返回登录界面
                  this.isLoginStatus = loginStatusEnum.NOT_LOGGED_IN;
                  this.password = "";
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
            _.isEmpty(this.password) ||
            _.isEmpty(this.userName) ||
            _.isEmpty(this.confirmPassword)
          ) {
            // 密码为空时修改登录图标为禁用
            this.loginBtnIcon = this.loginUndo;
            return false;
          }
          this.loginBtnIcon = this.loginBtnDown;
          clearTimeout(loginBtnTime);
          loginBtnTime = undefined;
          loginBtnTime = setTimeout(() => {
            this.loginBtnIcon = require("../assets/img/login/icon-enter-normal@2x.png");
            // 判断确认密码是否输入
            if (_.isEmpty(this.confirmPassword)) {
              alert("确认密码不能为空");
              return false;
            }
            // 头像必传
            if (this.isDefaultAvatar) {
              alert("头像为必传项");
              return false;
            }
            // 用户名长度不能小于4
            if (_.trim(this.userName).length < 4) {
              alert("用户名长度不能小于4");
              return false;
            }
            // 密码长度不能小于6位
            if (_.trim(this.password).length < 6) {
              alert("密码长度不能小于6位且不能包含空格");
              return false;
            }
            // 判断密码与确认密码是否相等
            if (!_.isEqual(this.password, this.confirmPassword)) {
              alert("两次输入的密码不匹配");
              return false;
            }
            // 调用注册api
            this.$api.websiteManageAPI
              .registered({
                userName: this.userName,
                password: this.password,
                avatarSrc: this.avatarSrc
              })
              .then((res: responseDataType<T>) => {
                if (res.code === 0) {
                  alert(res.data);
                  // 切回登录界面
                  this.isLoginStatus = loginStatusEnum.NOT_LOGGED_IN;
                } else {
                  alert(res.msg);
                }
              });
          }, 150);
          break;
        default:
          if (_.isEmpty(this.password) || _.isEmpty(this.userName)) {
            // 登录按钮图标改为禁用
            this.loginBtnIcon = this.loginUndo;
            return false;
          }
          // 登录按钮图标改为正常
          this.loginBtnIcon = require("../assets/img/login/icon-enter-normal@2x.png");
          break;
      }
    },
    registered: function(status: boolean) {
      // 登录与注册之间的切换
      let degreeOfRotation = 0;
      const timer = setInterval(() => {
        degreeOfRotation += 30;
        if (degreeOfRotation >= 360) {
          // 显示登录或注册
          if (!status) {
            this.isLoginStatus = loginStatusEnum.NOT_LOGGED_IN;
          } else {
            this.isLoginStatus = loginStatusEnum.REGISTERED;
          }
          clearInterval(timer);
        }
        this.$refs.loginPanel.style.transform = `rotateY(${degreeOfRotation}deg)`;
      }, 40);
    },
    getUserAvatar: function() {
      // 获取用户头像
      if (!_.isEmpty(this.userName)) {
        // 调用接口
        this.$api.websiteManageAPI
          .getUserAvatar({
            userName: this.userName
          })
          .then((res: responseDataType) => {
            if (res.code === 0) {
              // 替换头像
              this.avatarSrc = res.data;
            } else {
              // 上传失败
              this.avatarSrc = require("../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png");
            }
          });
      }
    },
    cancelLogin: function() {
      // 取消登录
      this.$refs.cancelBtn.style.background = "#f3f3f3";
      // 清空密码显示登录
      this.password = "";
      this.isLoginStatus = loginStatusEnum.NOT_LOGGED_IN;
      this.$refs.cancelBtn.style.background = "";
    },
    uploadAvatar: function<T>(e: { target: { files: FileList } }) {
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
      this.$api.fileManageAPI
        .upload(formData)
        .then((res: responseDataType<T>) => {
          const fileName = `${base.lkBaseURL}/uploads/${res.fileName}`;
          // 更改默认头像状态
          this.isDefaultAvatar = false;
          // 头像赋值
          this.avatarSrc = fileName;
        });
    }
  },
  watch: {
    // 监听用户名状态
    userName: function(thisVal: string) {
      if (_.isEmpty(thisVal) || _.isEmpty(this.password)) {
        this.loginBtnIcon = this.loginUndo;
      } else {
        this.loginBtnIcon = require("../assets/img/login/icon-enter-normal@2x.png");
      }
    },
    // 监听确认密码状态
    password: function(thisVal: string) {
      if (_.isEmpty(thisVal) || _.isEmpty(this.userName)) {
        this.loginBtnIcon = this.loginUndo;
      } else {
        this.loginBtnIcon = require("../assets/img/login/icon-enter-normal@2x.png");
      }
    }
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/login.scss" />
