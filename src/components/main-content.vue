<template>
  <!--登录后的页面-->
  <div id="main-content" ref="mainContent">
    <div class="top-panel" ref="topPanel">
      <!--左侧图标-->
      <div class="left-panel">
        <div
          class="icon-panel"
          @mouseover="showLeftIco(true)"
          @mouseleave="showLeftIco(false)"
        >
          <div class="fillet-ico-panel close-ico">
            <img
              :style="{ display: leftIco }"
              src="../assets/img/close.png"
              alt=""
            />
          </div>

          <div class="fillet-ico-panel mini-ico">
            <img
              :style="{ display: leftIco }"
              src="../assets/img/min.png"
              alt=""
            />
          </div>
          <div class="fillet-ico-panel max-ico">
            <img
              :style="{ display: leftIco }"
              src="../assets/img/max.png"
              alt=""
            />
          </div>
        </div>
        <div class="search-panel">
          <div class="search">
            <img
              src="../assets/img/search_editText@2x.png"
              alt=""
              :style="{ display: searchImg }"
            />
            <label>
              <input
                type="text"
                @focus="hideSearchImg"
                @blur="showSearchImg"
                v-model="searchContent"
              />
            </label>
          </div>
          <div
            class="add-panel"
            @mouseleave="createGroupChat(false)"
            @mouseup="createGroupChat(false)"
            @mousedown="createGroupChat(true)"
            :style="{ background: addBackground }"
          >
            <img src="../assets/img/create_discuss_simple@2x.png" alt="" />
          </div>
        </div>
      </div>
      <div class="right-panel">
        <!--功能切换 路由入口-->
        <div class="function-switching-panel">
          <router-link :to="{ name: 'message' }" custom v-slot="{ navigate }">
            <div
              class="main-ico-area"
              @click="navigate"
              @keypress.enter="navigate"
              role="link"
            >
              <img
                :src="
                  currentComponentName === 'message' ||
                  currentComponentName === 'messageDisplay'
                    ? messageIcoActive
                    : messageIco
                "
                alt="消息"
              />
            </div>
          </router-link>
          <router-link :to="{ name: 'list' }" custom v-slot="{ navigate }">
            <div
              class="main-ico-area"
              @click="navigate"
              @keypress.enter="navigate"
              role="link"
            >
              <img
                :src="
                  currentComponentName === 'list' ||
                  currentComponentName === 'dataPanel'
                    ? contactIcoActive
                    : contactIco
                "
                alt="好友列表"
              />
            </div>
          </router-link>
          <router-link :to="{ name: 'more' }" custom v-slot="{ navigate }">
            <div
              class="main-ico-area"
              @click="navigate"
              @keypress.enter="navigate"
              role="link"
            >
              <img
                :src="currentComponentName === 'more' ? moreIcoActive : moreIco"
                alt="更多"
              />
            </div>
          </router-link>
        </div>
        <!--头像区域-->
        <div class="avatar-area-panel">
          <!--在线状态-->
          <div class="status-panel"></div>
          <div class="avatar-panel">
            <img :src="profilePicture" alt="头像" />
          </div>
        </div>
      </div>
    </div>
    <!--路由出口-->
    <div class="main-content-view">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { mainContentDateType } from "@/type/ComponentDataType";
import { defineComponent } from "vue";
import base from "@/api/base";

export default defineComponent({
  name: "MainContent",
  data<T>(): mainContentDateType<T> {
    return {
      searchImg: "block",
      searchContent: "",
      addBackground: "#ffffff",
      leftIco: "none",
      messageIco: require("../assets/img/menu-message-normal@2x.png"),
      messageIcoActive: require("../assets/img/menu-message-down@2x.png"),
      contactIco: require("../assets/img/menu-contact-normal@2x.png"),
      contactIcoActive: require("../assets/img/menu-contact-down@2x.png"),
      moreIco: require("../assets/img/menu-more-normal@2x.png"),
      moreIcoActive: require("../assets/img/menu-more-down@2x.png")
    };
  },
  created() {
    // 从本地存储中获取token
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const username = localStorage.getItem("username");
    if (this.isMobile()) {
      if (!window.location.href.includes("8020")) {
        // 跳转至生产环境404页面
        window.location.href = "/chat-system/404-page/index.html";
      } else {
        // 跳转至开发环境404页面
        window.location.href = "/404-page/index.html";
      }
    }
    if (_.isEmpty(token) || _.isEmpty(username) || _.isEmpty(refreshToken)) {
      // 跳转登录路由
      localStorage.removeItem("msgArray");
      this.$router.push({ name: "login" });
    } else {
      // 更新vuex中的token
      this.$store.commit("updateUserInfo", {
        token: token,
        refreshToken: refreshToken,
        profilePicture: localStorage.getItem("profilePicture"),
        userID: localStorage.getItem("userID"),
        username: localStorage.getItem("username")
      });
    }
  },
  mounted() {
    // 判断websocket是否连接: 当前为未连接状态并且本地存储中有userID
    if (
      !this.$store.state.socket.isConnected &&
      localStorage.getItem("userID") !== null
    ) {
      // 连接websocket服务器
      this.$connect(`${base.lkWebSocket}/${localStorage.getItem("userID")}`);
    }
    // 监听全局点击事件
    document.addEventListener("click", () => {
      // 隐藏右键菜单
      this.$store.commit("updateRightMenuStatus", {
        status: "none",
        left: "0px",
        top: "0px"
      });
    });
  },
  methods: {
    // 显示搜索图标
    showSearchImg: function() {
      // 判断当前输入框是否有数据
      if (_.isEmpty(this.searchContent)) {
        this.searchImg = "block";
      } else {
        this.searchImg = "none";
      }
    },
    // 隐藏搜索图标
    hideSearchImg: function() {
      this.searchImg = "none";
    },
    // 创建群聊
    createGroupChat: function(status: boolean) {
      if (status) {
        this.addBackground = "#E1E3E5";
      } else {
        this.addBackground = "#ffffff";
      }
    },
    // 显示左上角图标
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
    },
    getThisWindowHeight: () => window.innerHeight,
    getThisWindowWidth: () => window.innerWidth,
    isMobile: () => {
      return !!navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
    }
  },
  computed: {
    // 当前组件名
    currentComponentName(): string {
      return this.$store.state.currentComponentName;
    },
    // 用户头像
    profilePicture(): string {
      return this.$store.state.profilePicture;
    }
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/main-content.scss" />
