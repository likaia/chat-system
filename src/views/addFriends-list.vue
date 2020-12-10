<template>
  <div class="addFriends-list-outer-mask">
    <div class="addFriends-list-content" ref="addFriendsListContent">
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
    removeAddAlert() {
      this.$emit("no-show-add-friends-alert", !this.show);
    },
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
            console.log(res.data);

            this.$refs.addFriendsListContent.style = "margin-top:-220px;";
            this.$refs.mainPanel.style = "height:auto;";
            this.$refs.mainPanelContentFriendsInfo.style =
              " height: 269px;overflow: auto; ";
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
        this.$refs.addFriendsListContent.style = "";
        this.$refs.mainPanel.style = "";
        this.showUserInfo = false;
      }
    },
    clearSearchFriendInfo() {
      this.searchFriendInfo = "";
    },
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
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
      leftIco: "none"
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
