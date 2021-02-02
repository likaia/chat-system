<template>
  <moveSettings ref="move">
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
            @click.stop="removeAddAlert"
          >
            <img
              :style="{ display: leftIco }"
              src="@/assets/img/close.png"
              class="close-icon"
              alt=""
            />
          </div>
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco()"
            @mouseleave="showLeftIco()"
          >
            <img
              :style="{ display: leftIco }"
              class="min-icon"
              src="@/assets/img/min.png"
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
              src="@/assets/img/list/aio_group_search_normal@2x.png"
              alt=""
            />
          </div>
          <div class="main-panel-search-input">
            <input
              type="text"
              v-model="searchFriendInfo"
              placeholder="用户id/用户名"
              @keyup.enter="searchFriendInfoResult"
              @mousemove.stop=""
              @mousedown.stop=""
              @mouseout.stop=""
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
              v-for="(list, index) in friendsList"
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
                  <img
                    :ref="setAddIconNormal"
                    src="@/assets/img/list/+normal@2x.png"
                    alt=""
                    style="display:block;"
                    @mouseover="Hover(index, false)"
                  />
                  <img
                    :ref="setAddIconHover"
                    src="@/assets/img/list/+hover@2x.png"
                    alt=""
                    style="display:none;"
                    @click.stop="Press(index)"
                    @mouseout="Normal(index)"
                  />
                  <img
                    :ref="setAddIconPress"
                    src="@/assets/img/list/+press@2x.png"
                    alt=""
                    style="display:none;"
                  />
                </div>
                <div
                  class="friendsList-isNotFriend"
                  :ref="setAddIconNormal"
                  v-else
                >
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
  </moveSettings>

  <addFriendIdentityChecked
    v-if="isChecked"
    :arg-userName="argUserName"
    :arg-userId="argUserId"
    :is-checked="isChecked"
    receiveChecked="sendChecked"
    @no-show-identity-checked="noShowIdentityChecked(noShow)"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { responseDataType } from "@/type/ComponentDataType";
import addFriendIdentityChecked from "./addFriends-identityChecked.vue";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
export default defineComponent({
  components: { addFriendIdentityChecked, moveSettings },
  name: "addFriends-list",
  methods: {
    // 关闭添加好友弹框
    removeAddAlert() {
      this.$store.commit("updateAddFriendStatus", false);
    },
    // 关闭好友身份认证
    noShowIdentityChecked(noShow: boolean) {
      this.isChecked = noShow;
    },
    // 获取搜索好友列表
    searchFriendInfoResult() {
      // 获取最新好友信息初始化
      this.friendsList = [];
      this.setAddIconH = [];
      this.setAddIconN = [];
      this.setAddIconP = [];
      // 当搜索框有内容
      if (this.searchFriendInfo) {
        this.showUserInfo = true;
        // 调用接口获取搜索好友数据列表
        this.$api.websiteManageAPI
          .getSearchUserInfoList({
            content: this.searchFriendInfo,
            userId: this.$store.state.userID
          })
          .then((res: responseDataType) => {
            // 对整体框位置做相当于的适应
            this.$refs.mainPanel.style = "height:auto;";
            this.$refs.mainPanelContentFriendsInfo.style =
              " height: 269px;overflow: auto; ";

            // 整体框位置在下边界贴下边界
            if (
              this.$refs.addFriendsListContent.offsetTop +
                this.$refs.addFriendsListContent.offsetHeight >
              window.innerHeight
            ) {
              this.$refs.addFriendsListContent.style.top =
                window.innerHeight -
                this.$refs.addFriendsListContent.offsetHeight +
                "px";
            }
            // 当好友数量大于一个
            if (res.data.length > 0) {
              res.data.forEach((item: any) => {
                // 是好友
                if (!item.isFriend) {
                  if (item.userId != this.$store.state.userID) {
                    this.friendsList.push({
                      userName: item.userName,
                      userId: item.userId,
                      avatarSrc: item.avatarSrc
                    });
                  }

                  // 不是好友
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
            // 没有好友
            if (this.friendsList.length == 0) {
              this.friendsList.push({ msg: "该用户不存在或是你本人" });
            }
          });
      } else {
        this.$refs.addFriendsListContent.style.marginTop = "";
        this.$refs.mainPanel.style = "";
        this.showUserInfo = false;
      }
    },
    // 清空搜索框的内容并获取焦点
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
      this.$refs.move.alertDown(e, this.$refs.addFriendsListContent);
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      this.$refs.move.alertMove(e, this.$refs.addFriendsListContent);
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.$refs.move.alertUp(this.$refs.addFriendsListContent);
    },
    // 获取normal添加图标元素
    setAddIconNormal: function(el: Element) {
      if (el != null) {
        this.setAddIconN.push(el);
        if (el.tagName == "DIV") {
          this.setAddIconHover(el);
          this.setAddIconPress(el);
        }
      }
    },
    // 获取hover的添加图标元素
    setAddIconHover: function(el: Element) {
      if (el != null) {
        this.setAddIconH.push(el);
      }
    },
    // 获取click添加图标元素
    setAddIconPress: function(el: Element) {
      if (el != null) {
        this.setAddIconP.push(el);
      }
    },
    // 鼠标悬浮是显示hover的添加图标
    Hover(index: number) {
      this.setAddIconN[index].style.display = "none";
      this.setAddIconH[index].style.display = "block";
      this.setAddIconP[index].style.display = "none";
    },
    // 鼠标离开目标是显示normal的添加图标
    Normal(index: number) {
      setTimeout(() => {
        this.setAddIconN[index].style.display = "block";
        this.setAddIconH[index].style.display = "none";
        this.setAddIconP[index].style.display = "none";
      }, 20);
    },
    // 鼠标单击时是显示click的添加图标
    Press(index: number) {
      this.setAddIconN[index].style.display = "none";
      this.setAddIconH[index].style.display = "none";
      this.setAddIconP[index].style.display = "block";
      // 开启验证弹窗并传值
      this.isChecked = true;
      this.argUserName = this.friendsList[index].userName;
      this.argUserId = this.friendsList[index].userId;
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
      setAddIconN: [],
      setAddIconH: [],
      setAddIconP: [],
      isChecked: false,
      argUserName: "",
      argUserId: ""
    };
  }
});
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/addFriend/addFriends-list.scss"
></style>
