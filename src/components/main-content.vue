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
                @focus="searchImg = 'none'"
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
          <router-link :to="{ path: '/' }" custom v-slot="{ navigate }">
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

<script lang="ts" setup>
import { computed, onMounted, shallowRef } from "vue";
import {
  messageIco,
  messageIcoActive,
  contactIco,
  contactIcoActive,
  moreIco,
  moreIcoActive
} from "@/resource/MainContentResponse";
import _ from "lodash";
import { useStore } from "vuex";
import base from "@/api/base";
import createdCheck from "@/module/main-content/components-metords/createdCheck";
import useCurrentInstance from "@/type/global/UseCurrentInstance";

const store = useStore();
// 登录校验
createdCheck();

const searchImg = shallowRef("block");
const searchContent = shallowRef("");
const addBackground = shallowRef("#ffffff");
const leftIco = shallowRef("none");

const currentComponentName = computed(() => {
  return store.state.currentComponentName;
});
const profilePicture = computed(() => {
  return store.state.profilePicture;
});

const showLeftIco = (status: boolean) => {
  if (status) {
    leftIco.value = "block";
    return;
  }
  leftIco.value = "none";
};

const showSearchImg = () => {
  // 判断当前输入框是否有数据
  if (_.isEmpty(searchContent.value)) {
    searchImg.value = "block";
    return;
  }
  searchImg.value = "none";
};

const createGroupChat = (status: boolean) => {
  if (status) {
    addBackground.value = "#E1E3E5";
    return;
  }
  addBackground.value = "#ffffff";
};

onMounted(() => {
  const { proxy } = useCurrentInstance();
  // 判断websocket是否连接: 当前为未连接状态并且本地存储中有userID
  if (
    !store.state.socket.isConnected &&
    localStorage.getItem("userID") != null
  ) {
    // 连接websocket服务器
    proxy.$connect(
      `${base.lkWebSocket}/${localStorage.getItem(
        "userID"
      )}/${localStorage.getItem("token")}`
    );
  }
  // 监听全局点击事件
  document.addEventListener("click", () => {
    // 隐藏右键菜单
    store.commit("updateRightMenuStatus", {
      status: "none",
      left: "0px",
      top: "0px"
    });
  });
});
</script>

<style scoped lang="scss" src="../assets/scss/main-content.scss" />
