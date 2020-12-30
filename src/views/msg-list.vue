<!--消息选项卡-->
<template>
  <div id="mainBody">
    <ul class="list-panel" ref="listPanel" v-if="msgList.length > 0">
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
        v-right-click="rightMenuObj"
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
              new Date(serverTime).getDate() -
                new Date(item.lastTime).getDate() >
                1
            "
          >
            {{ item.lastTime.substring(5, 10) }}
          </p>
          <!--今天的消息显示具体时间-->
          <p v-else>{{ item.lastTime.substring(10, 16) }}</p>
          <!--          <div class="msg-count-panel msg-count-more-panel">
            <p>12</p>
          </div>-->
        </div>
      </li>
    </ul>
    <div class="content-panel" ref="contentPanel">
      <img
        src="@/assets/img/list/contact_non_selected@2x.png"
        width="280"
        height="280"
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
        localStorage.setItem("msgList", [msgObj]);
      }
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
              }
            }
            // 渲染页面
            this.msgList = messageList;
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
          checkingData() {
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
