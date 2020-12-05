<!--消息选项卡-->
<template>
  <div id="mainBody">
    <ul class="list-panel" ref="listPanel">
      <li
        class="row-panel"
        v-for="(item, index) in msgList"
        :key="item.id"
        @click="showChatInterface(item.id, index)"
        :class="{ active: currentIndex === index }"
        v-right-click="rightMenuObj"
      >
        <div class="item-subscript-panel"></div>
        <div class="item-avatar-panel">
          <img :src="item.avatarSrc" alt="用户头像" />
        </div>
        <div class="item-nickname-panel">
          <p class="title">{{ item.petName }}</p>
          <p class="subtitle">
            {{ lastMessageContent ? lastMessageContent : "暂无消息" }}
          </p>
        </div>
        <div class="item-time-panel">
          <p>{{ item.time }}</p>
          <!--          <div class="msg-count-panel msg-count-more-panel">-->
          <!--            <p></p>-->
          <!--          </div>-->
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
        :message-status="0"
        :list-id="listId"
        @update-last-message="updateLastMessage($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import messageDisplay from "@/components/message-display.vue";

export default defineComponent({
  name: "msg-list",
  components: {
    messageDisplay
  },
  methods: {
    getThisWindowWidth: () => window.innerWidth,
    updateLastMessage: function(data: string) {
      this.lastMessageContent = data;
    },
    showChatInterface: function(listID: string, liIndex: number) {
      if (_.isEmpty(listID)) {
        alert("无消息id");
        return false;
      }
      this.currentIndex = liIndex;
      this.listId = listID;
      this.widgetIsNull = false;
    }
  },
  data() {
    return {
      msgSubscriptIco: require("../assets/img/msg-subscript.png"),
      avatarIco: require("../assets/img/avatar-ico.png"),
      groupMsgImg: require("../assets/img/group-msg-img.jpg"),
      GroupBlocked: require("../assets/img/Group_Blocked@2x.png"),
      otherMsgImg: require("../assets/img/other-msg-img.jpg"),
      lastMessageContent: "",
      currentIndex: -1, // 当前点击项索引
      widgetIsNull: true,
      // 右键菜单对象，菜单内容和处理事件
      rightMenuObj: {
        text: [
          "查看资料",
          "复制用户id",
          "移除该会话",
          "在联系人中查看",
          "在单聊窗口中打开",
          "会话置顶"
        ],
        handler: {
          checkingData() {
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
      },
      listId: "",
      msgList: [
        {
          id: "4417890256",
          petName: "官方测试群",
          time: "上午10:24",
          avatarSrc:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604729759234&di=5f75dfab0948c370fd890fa914fd3bfc&imgtype=0&src=http%3A%2F%2Fwww.2qqtouxiang.com%2Fpic%2FTP4849_01.jpg"
        },
        {
          id: "",
          petName: "小白船",
          time: "上午12:24",
          avatarSrc:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1604735927400&di=500d344ec5ea44ff95c6da8c784026d5&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201703%2F17%2F20170317211440_KWdE8.jpeg"
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped src="../assets/scss/msg-list.scss"></style>
