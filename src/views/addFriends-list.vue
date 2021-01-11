<template>
  <div class="addFriends-list-outer-mask">
    <div class="addFriends-list-inside-mask" style="">
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
                src="../assets/img/close.png"
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
                v-model="searchFriendInfo"
                placeholder="用户id/用户名"
                @keyup.enter="searchFriendInfoResult"
                @focus.stop="clearMouseEvent"
                @dblclick.stop=""
                @mousemove.stop=""
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
    </div>
  </div>
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
export default defineComponent({
  components: { addFriendIdentityChecked },
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
      // 获取初始时当前框距离对应边界的大小位置和当前鼠标左键点下时事件的位置
      this.moveAlertData.x = e.clientX;
      this.moveAlertData.y = e.clientY;
      this.moveAlertData.t = this.$refs.addFriendsListContent.offsetTop;
      this.moveAlertData.l = this.$refs.addFriendsListContent.offsetLeft;
      this.moveAlertData.isDown = true;
      // 将鼠标图标换成可拖动
      this.$refs.addFriendsListContent.style.cursor = "move";
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      // 防止未按下事件触发时，可获取并持续触发可拖曳事件
      if (this.moveAlertData.isDown == false) {
        return;
      }
      // 获取移动时最新的鼠标位位置
      this.moveAlertData.moveX = e.clientX;
      this.moveAlertData.moveY = e.clientY;
      // 移动时最新位置 = 移动时最新的鼠标位位置 - （初始时的鼠标大小位置 - 初始时鼠标左键点下时事件的位置）
      this.moveAlertData.movel =
        this.moveAlertData.moveX -
        (this.moveAlertData.x - this.moveAlertData.l);
      this.moveAlertData.movet =
        this.moveAlertData.moveY -
        (this.moveAlertData.y - this.moveAlertData.t);
      // 对左边界进行边界处理

      if (this.moveAlertData.movel < 0) {
        this.moveAlertData.movel = 0;
      }
      // 对右边界进行边界处理
      if (
        this.moveAlertData.movel +
          this.$refs.addFriendsListContent.offsetWidth >
        window.innerWidth
      ) {
        this.moveAlertData.movel =
          window.innerWidth - this.$refs.addFriendsListContent.offsetWidth;
      }
      // 对下边界进行边界处理
      if (
        this.moveAlertData.movet +
          this.$refs.addFriendsListContent.offsetHeight >
        window.innerHeight
      ) {
        this.moveAlertData.movet =
          window.innerHeight - this.$refs.addFriendsListContent.offsetHeight;
      }
      // 对上边界进行边界处理
      if (this.moveAlertData.movet < 0) {
        this.moveAlertData.movet = 0;
      }
      // 渲染最新位置
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
      },
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
<style scoped lang="scss" src="../assets/scss/addFriends-list.scss"></style>
