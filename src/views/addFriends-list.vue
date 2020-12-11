<template>
  <div class="addFriends-list-outer-mask">
    <div
      class="addFriends-list-content"
      ref="addFriendsListContent"
      @mousedown="alertDown($event)"
      @mousemove="alertMove($event)"
      @mouseup="alertUp"
      @blur="alertUp"
    >
      <div class="top-panel">
        <div class="top-panel-left">
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco(true)"
            @mouseleave="showLeftIco(false)"
            @click="removeAddAlert"
          >
            <img
              :style="{ display: leftIco }"
              src="../assets/img/close.png"
              class="close-icon"
              alt=""
            />
          </div>

          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco(true)"
            @mouseleave="showLeftIco(false)"
          >
            <img
              :style="{ display: leftIco }"
              class="min-icon"
              src="../assets/img/min.png"
              alt=""
            />
          </div>
        </div>
        <div class="top-panel-right">
          <p>添加联系人/群聊</p>
        </div>
      </div>
      <div class="main-panel" ref="mainPanel">
        <div class="main-panel-search">
          <div class="main-panel-search-icon">
            <img
              src="../assets/img/list/aio_group_search_normal@2x.png"
              alt=""
            />
          </div>
          <div class="main-panel-search-input">
            <input
              type="text"
              style=""
              v-model="searchFriendInfo"
              placeholder="用户id/用户名"
              @keyup.enter="searchFriendInfoResult"
              @focus.stop="clearMouseEvent"
              ref="serachInput"
            />
            <img
              src="@/assets/img/list/search_tokenfield_delete@2x.png"
              alt=""
              v-if="searchFriendInfo"
              @click="clearSearchFriendInfo"
            />
          </div>
        </div>
        <div class="main-panel-content" v-if="showUserInfo">
          <div class="main-panel-content-name">
            联系人
          </div>
          <div
            ref="mainPanelContentFriendsInfo"
            class="main-panel-content-friends-info"
          >
            <div
              v-for="list in friendsList"
              :key="list.userId"
              class="main-panel-content-friendsList"
            >
              <template v-if="!list.msg">
                <div class="friendsList-img-avatarSrc">
                  <img :src="list.avatarSrc" alt="" />
                </div>
                <div class="friendsList-userName">
                  {{ list.userName }}({{ list.userId }})
                </div>
                <div class="friendsList-isFriend" v-if="!list.isFriend">
                  <img src="@/assets/img/list/+normal@2x.png" alt="" />
                </div>
                <div class="friendsList-isNotFriend" v-else>
                  已添加
                </div>
              </template>
              <template v-else>
                <div class="friendsList-isNotFriendsInfo">
                  --{{ list.msg }}--
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { responseDataType } from "@/type/ComponentDataType";
export default defineComponent({
  name: "addFriends-list",
  methods: {
    // 关闭添加好友弹框
    removeAddAlert() {
      this.$emit("no-show-add-friends-alert", !this.show);
    },
    // 获取搜索好友列表
    searchFriendInfoResult() {
      this.friendsList = [];
      if (this.searchFriendInfo) {
        this.showUserInfo = true;
        this.$api.websiteManageAPI
          .getSearchUserInfoList({
            content: this.searchFriendInfo,
            userId: this.$store.state.userID
          })
          .then((res: responseDataType) => {
            this.$refs.mainPanel.style = "height:auto;";
            this.$refs.mainPanelContentFriendsInfo.style =
              " height: 269px;overflow: auto; ";
            this.$refs.addFriendsListContent.style.marginTop =
              -(this.$refs.addFriendsListContent.clientHeight / 2) + "px";
            if (res.data.length > 0) {
              res.data.forEach((item: any) => {
                if (!item.isFriend) {
                  this.friendsList.push({
                    userName: item.userName,
                    userId: item.userId,
                    avatarSrc: item.avatarSrc
                  });
                } else {
                  this.friendsList.push({
                    userName: item.userName,
                    userId: item.userId,
                    avatarSrc: item.avatarSrc,
                    isFriend: item.isFriend
                  });
                }
              });
            }
            if (res.data.length == 0) {
              this.friendsList.push({ msg: "该用户不存在" });
            }
          });
      } else {
        this.$refs.addFriendsListContent.style.marginTop = "";
        this.$refs.mainPanel.style = "";
        this.showUserInfo = false;
      }
    },
    // 清空搜索框的内容
    clearSearchFriendInfo() {
      this.searchFriendInfo = "";
      this.$refs.serachInput.focus();
    },
    // 判断关闭与最小化图标是否出现
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
    },
    // 按下触发可拖曳事件
    alertDown: function(e: any) {
      this.moveAlertData.x = e.clientX;
      this.moveAlertData.y = e.clientY;
      if (this.friendsList.length != 0) {
        this.moveAlertData.t =
          this.$refs.addFriendsListContent.offsetTop +
          this.$refs.addFriendsListContent.clientHeight / 2;
      } else {
        this.moveAlertData.t = this.$refs.addFriendsListContent.offsetTop + 126;
      }
      this.moveAlertData.l = this.$refs.addFriendsListContent.offsetLeft + 350;
      this.moveAlertData.isDown = true;
      this.$refs.addFriendsListContent.style.cursor = "move";
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      if (this.moveAlertData.isDown == false) {
        return;
      }
      this.moveAlertData.moveX = e.clientX;
      this.moveAlertData.moveY = e.clientY;
      this.moveAlertData.movel =
        this.moveAlertData.moveX -
        (this.moveAlertData.x - this.moveAlertData.l);
      this.moveAlertData.movet =
        this.moveAlertData.moveY -
        (this.moveAlertData.y - this.moveAlertData.t);

      this.$refs.addFriendsListContent.style.left =
        this.moveAlertData.movel + "px";
      this.$refs.addFriendsListContent.style.top =
        this.moveAlertData.movet + "px";
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.moveAlertData.isDown = false;
      this.$refs.addFriendsListContent.style.cursor = "default";
    },
    // 获取搜索框焦点事件
    clearMouseEvent: function() {
      this.moveAlertData.isDown = false;
    }
  },
  props: {
    showAddAlert: Boolean
  },
  data() {
    return {
      searchFriendInfo: "",
      friendsList: [],
      showUserInfo: false,
      leftIco: "none",
      moveAlertData: {
        x: 0,
        y: 0,
        l: 0,
        t: 0,
        moveX: 0,
        moveY: 0,
        movel: 0,
        movet: 0,
        isDown: false
      }
    };
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "no-show-add-friends-alert": (val: boolean) => {
      return !_.isNull(val);
    }
  }
});
</script>
<style scoped lang="scss" src="../assets/scss/addFriends-list.scss"></style>
