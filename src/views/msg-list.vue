<!--消息选项卡-->
<template>
  <div id="mainBody">
    <ul
      class="list-panel transparent-scroll-bar"
      ref="listController"
      v-if="msgList.length > 0"
    >
      <li
        class="row-panel"
        v-for="(item, index) in msgList"
        :key="item.id"
        @click="
          showChatInterface(
            item.buddyId,
            index,
            item.type,
            item.buddyId,
            item.userName
          )
        "
        :class="{ active: currentIndex === index }"
        v-right-click:[{id:index,userName:item.userName}]="rightMenuObj"
      >
        <div class="item-subscript-panel"></div>
        <div class="item-avatar-panel">
          <img :src="item.avatarSrc" alt="用户头像" />
        </div>
        <div class="item-nickname-panel">
          <p class="title">{{ item.userName }}</p>
          <p class="subtitle">
            {{ item.lastMsgTxt ? item.lastMsgTxt : "暂无消息" }}
          </p>
        </div>
        <div class="item-time-panel">
          <!--非今天的消息显示日期-->
          <p
            v-if="
              Date.parse(serverTime.substring(0, 10)) -
                Date.parse(item?.lastTime?.substring(0, 10)) >=
                86400000
            "
          >
            {{ item?.lastTime?.substring(5, 10) }}
          </p>
          <!--今天的消息显示具体时间-->
          <p v-else>{{ item?.lastTime?.substring(10, 16) }}</p>
          <!--小于10条时的数字展示-->
          <div
            class="msg-count-panel"
            v-if="item.totalUnread > 0 && item.totalUnread < 10"
          >
            {{ item.totalUnread }}
          </div>
          <div
            class="msg-count-panel msg-count-more-panel"
            v-else-if="item.totalUnread >= 10 && item.totalUnread <= 99"
          >
            {{ item.totalUnread }}
          </div>
          <div
            class="msg-count-panel msg-count-more-panel"
            v-else-if="item.totalUnread >= 100"
          >
            99+
          </div>
        </div>
      </li>
    </ul>
    <div class="content-panel" ref="contentPanel">
      <img
        src="@/assets/img/list/contact_non_selected@2x.png"
        alt="空组件"
        v-if="widgetIsNull"
      />
      <message-display
        v-else
        :message-status="messageType"
        :list-id="listId"
        :server-time="serverTime"
        :buddy-id="buddyId"
        :buddy-name="buddyName"
        @update-last-message="updateLastMessage($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import messageDisplay from "@/components/message-display.vue";
import {
  LastMessageObj,
  localMsgObj,
  msgListDataType,
  msgListType,
  responseDataType,
  totalMessage
} from "@/type/ComponentDataType";
import { rightMenuType } from "vue-right-click-menu-next/dist/lib/type/pluginsType";

export default defineComponent({
  name: "msg-list",
  components: {
    messageDisplay
  },
  methods: {
    getThisWindowWidth: () => window.innerWidth,
    // 获取子组件传过来的值
    updateLastMessage: function(data: LastMessageObj) {
      // 获取localStorage中的消息内容与时间
      let localMsgList: Array<localMsgObj> = [];
      if (!_.isNull(JSON.parse(localStorage.getItem("msgList") as string))) {
        localMsgList = JSON.parse(localStorage.getItem("msgList") as string);
      }
      // 本地存储没有数据则重新赋值
      if (_.isNull(JSON.parse(localStorage.getItem("msgList") as string))) {
        // 向本地存储里设置值
        const msgObj: localMsgObj = {};
        msgObj.id = data.id;
        msgObj.lastMsgTxt = data.text;
        msgObj.lastTime = data.time;
        localStorage.setItem("msgList", JSON.stringify([msgObj]));
      }
      // 收到新窗口的消息，渲染未读消息
      if (!_.isUndefined(data.isPush)) {
        this.updateLastMsg(data, localMsgList);
        // 判断是否为未读消息
        if (!_.isEqual(this.listId, data.id)) {
          // 更新消息列表中未读消息总数
          this.updateMsgListTotalUnread(localMsgList, data);
        }
      } else {
        this.updateLastMsg(data, localMsgList);
      }
    },
    // 更新消息列表的未读消息数量
    updateMsgListTotalUnread: function(
      localMsgList: Array<localMsgObj>,
      data: { id: string },
      status?: boolean
    ) {
      // 修改消息列表的未读消息数量
      for (let i = 0; i < this.msgList.length; i++) {
        const msgObj: totalMessage = this.msgList[i];
        if (_.isEqual(this.msgList[i].buddyId, data.id)) {
          // 消息数量为null或者状态为清除未读消息时将其初始化为0
          if (msgObj.totalUnread == null || status == true) {
            msgObj.totalUnread = 0;
          } else {
            msgObj.totalUnread++;
          }
        }
      }
      // 修改本地存储中的未读消息数量
      for (let j = 0; j < localMsgList.length; j++) {
        const localMasgObj = localMsgList[j];
        if (
          _.isEqual(localMasgObj.id, data.id) &&
          localMasgObj.totalUnread != null
        ) {
          // 为true则清除未读消息
          if (status === true) {
            localMasgObj.totalUnread = 0;
          } else {
            localMasgObj.totalUnread++;
          }
        }
      }
      if (localMsgList.length > 0) {
        // 将修改后的数据放回本地存储
        localStorage.setItem("msgList", JSON.stringify(localMsgList));
      }
    },
    // 更新列表的最后一条消息内容
    updateLastMsg: function(
      data: LastMessageObj,
      localMsgList: Array<localMsgObj>
    ) {
      // 更新消息列表中的消息内容与时间
      for (let i = 0; i < this.msgList.length; i++) {
        const msgObj: totalMessage = this.msgList[i];
        // 找到消息列表中buddyId与子组件id相等的值
        if (_.isEqual(msgObj.buddyId, data.id)) {
          // 修改消息对象中最后一条消息内容与时间
          msgObj.lastMsgTxt = data.text;
          msgObj.lastTime = data.time;
        }
      }
      // 更新本地存储中的消息内容与时间
      for (let i = 0; i < localMsgList.length; i++) {
        const msgObj: localMsgObj = localMsgList[i];
        // 如果未读消息条数为null则初始化为0
        if (msgObj.totalUnread == null) {
          msgObj.totalUnread = 0;
        }
        if (_.isEqual(msgObj.id, data.id)) {
          // 修改本地存储中消息对象的最后一条消息内容与时间
          msgObj.lastMsgTxt = data.text;
          msgObj.lastTime = data.time;
        }
      }
      if (localMsgList.length > 0) {
        // 将修改后的数据放回本地存储
        localStorage.setItem("msgList", JSON.stringify(localMsgList));
      }
    },
    // 显示消息面板组件
    showChatInterface: function(
      listID: string,
      liIndex: number,
      type: number,
      buddyId: string,
      buddyName: string
    ) {
      if (_.isEmpty(listID)) {
        alert("无消息id");
        return false;
      }
      // 清除未读消息
      this.updateMsgListTotalUnread(
        JSON.parse(localStorage.getItem("msgList") as string),
        { id: listID },
        true
      );
      this.currentIndex = liIndex;
      this.listId = listID;
      this.messageType = type;
      this.buddyId = buddyId;
      this.buddyName = buddyName;
      this.widgetIsNull = false;
    }
  },
  mounted() {
    // token不为空时获取好友列表
    if (!_.isEmpty(this.$store.state.token)) {
      // 获取好友列表
      this.$api.messageListAPI
        .getMessageList({
          pageNo: 1,
          pageSize: 20,
          userId: this.$store.state.userID
        })
        .then((res: responseDataType) => {
          // 获取好友列表传递的用户ID
          const userId = this.$route.params.userId;
          if (res.code === 0) {
            // 接口返回的数据
            const messageList: Array<totalMessage> = res.data.messageList;
            // 需要向本地存储的数据
            let localMsgList: Array<localMsgObj> = [];
            // 拿出本地存储中的数据
            if (
              !_.isNull(JSON.parse(localStorage.getItem("msgList") as string))
            ) {
              localMsgList = JSON.parse(
                localStorage.getItem("msgList") as string
              );
            }
            // 判断本地存储中的数据与接口已渲染的数据条数是否一致
            if (!_.isEqual(localMsgList.length, messageList.length)) {
              // 不一致则重置本地存储的数据
              localMsgList = [];
              for (let i = 0; i < messageList.length; i++) {
                const msgobj: totalMessage = messageList[i];
                localMsgList.push({
                  id: msgobj.buddyId
                });
              }
              // 将新的数据放入本地存储
              localStorage.setItem("msgList", JSON.stringify(localMsgList));
            }
            // 修改消息列表的最后发送内容与时间
            for (let i = 0; i < localMsgList.length; i++) {
              const msgObj = localMsgList[i];
              if (
                _.isEqual(msgObj.id, messageList[i].buddyId) &&
                Object.keys(msgObj).length > 1
              ) {
                // 更新messageList[i]的最后发送消息内容与时间
                messageList[i].lastTime = msgObj.lastTime;
                messageList[i].lastMsgTxt = msgObj.lastMsgTxt;
                messageList[i].totalUnread = msgObj.totalUnread;
              }
            }
            // 渲染页面
            this.msgList = messageList;
            this.$nextTick(() => {
              if (userId) {
                for (let i = 0; i < messageList.length; i++) {
                  const item = messageList[i];
                  if (_.isEqual(item.buddyId, userId)) {
                    // 打开聊天窗口
                    this.showChatInterface(
                      item.buddyId,
                      i,
                      item.type,
                      item.buddyId,
                      item.userName
                    );
                  }
                }
              }
              // 滚动时显示滚动条，不滚动时隐藏滚动条
              let scrollTimer = 0;
              this.$refs.listController.onscroll = () => {
                // 显示滚动条
                this.$refs.listController.classList.remove(
                  "transparent-scroll-bar"
                );
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                  // 隐藏滚动条
                  this.$refs.listController.classList.add(
                    "transparent-scroll-bar"
                  );
                }, 500);
              };
            });
            // 判断用户是否设置密码
            let isInitedPassword = localStorage.getItem("isInitedPassword");
            if (isInitedPassword != null) {
              // string转boolean
              isInitedPassword = eval(isInitedPassword);
              if (isInitedPassword) {
                alert(
                  "检测到您还没有设置密码，如需使用用户名密码登录，请在设置界面修改密码"
                );
              }
            }
            // 验证完毕后，将其移除，防止重复检测问题
            localStorage.removeItem("isInitedPassword");
            // 监听消息接收
            this.$options.sockets.onmessage = (res: { data: string }) => {
              const data = JSON.parse(res.data);
              if (data.code === 200) {
                // 更新在线人数
                this.$store.commit("updateOnlineUsers", data.onlineUsers);
              } else if (data.code === -1) {
                // 消息发送失败,退出登陆
                this.$api.websiteManageAPI
                  .updateOnlineStatus({
                    userId: this.$store.state.userID,
                    status: false
                  })
                  .then(() => {
                    localStorage.clear();
                    this.$router.push("/login");
                  });
                return;
              } else {
                // 更新在线人数
                this.$store.commit("updateOnlineUsers", data.onlineUsers);
                // 获取服务端推送的消息
                const msgObj: msgListType = {
                  msgText: data.msg,
                  avatarSrc: data.avatarSrc,
                  createTime: data.createTime,
                  userId: data.userID,
                  buddyId: data.buddyId,
                  messageStatus: data.messageStatus,
                  userName: data.username
                };
                // 更新对应的群聊消息列表内容
                if (msgObj.messageStatus === 1) {
                  let senderName = "";
                  // 消息类型为群聊消息且发送者不为自己则添加发送者昵称
                  if (!_.isEqual(msgObj.userId, this.$store.state.userID)) {
                    senderName = (msgObj.userName as string) + ":";
                  }
                  if (msgObj?.msgText?.includes("img")) {
                    this.updateLastMessage({
                      text: senderName + "[图片消息]",
                      id: msgObj.buddyId,
                      time: msgObj.createTime,
                      isPush: true
                    });
                  } else {
                    this.updateLastMessage({
                      text: senderName + msgObj.msgText,
                      id: msgObj.buddyId,
                      time: msgObj.createTime,
                      isPush: true
                    });
                  }
                } else {
                  // 更新对应的单聊消息列表内容
                  if (msgObj?.msgText?.includes("img")) {
                    this.updateLastMessage({
                      text: "[图片消息]",
                      id: msgObj.userId,
                      time: msgObj.createTime,
                      isPush: true
                    });
                  } else {
                    this.updateLastMessage({
                      text: msgObj.msgText,
                      id: msgObj.userId,
                      time: msgObj.createTime,
                      isPush: true
                    });
                  }
                }
              }
            };
          } else {
            alert(res.msg);
          }
        });
      // 获取当前服务器时间
      this.$api.serverAPI.getServerTime().then((res: responseDataType) => {
        this.serverTime = res.data;
      });
    }
  },
  unmounted() {
    // 销毁时移除消息监听
    this.$options.sockets.onmessage = null;
  },
  data(): msgListDataType {
    return {
      msgSubscriptIco: require("../assets/img/msg-subscript.png"),
      GroupBlocked: require("../assets/img/Group_Blocked@2x.png"),
      lastMessageContent: "",
      currentIndex: -1, // 当前点击项索引
      widgetIsNull: true,
      listId: "",
      messageType: null,
      buddyId: "",
      serverTime: null,
      buddyName: "",
      msgList: []
    };
  },
  computed: {
    rightMenuObj(): rightMenuType {
      // 右键菜单对象，菜单内容和处理事件
      const obj: rightMenuType = {
        this: this,
        text: [
          "查看资料",
          { content: "复制用户id", status: true },
          "移除该会话",
          "在联系人中查看",
          "在单聊窗口中打开",
          "会话置顶"
        ],
        handler: {
          checkingData(parameter: string) {
            console.log(parameter);
            console.log(obj.this.$store.state.token);
            console.log("查看资料点击事件");
          },
          copyId() {
            console.log("复制用户id点击事件");
          },
          removeItem() {
            console.log("移除会话点击事件");
          },
          showContact() {
            console.log("在联系人中查看");
          },
          showSingleChat() {
            console.log("在单聊窗口中打开");
          },
          topConversation() {
            console.log("会话置顶");
          }
        }
      };
      return obj;
    }
  }
});
</script>

<style lang="scss" scoped src="../assets/scss/msg-list.scss"></style>
