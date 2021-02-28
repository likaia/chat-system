<!--公用组件：消息内容展示，实现群聊和单聊业务-->
<template>
  <div id="mainContent">
    <div class="top-panel" ref="topPanel">
      <div class="title-panel">
        <p v-if="messageStatus === 0">{{ buddyName }}</p>
        <p v-else>{{ buddyName }}({{ onlineUsers }})</p>
        <!--在线设备类型-->
        <!--<div class="equipmentType">
                    <img :src="this.resourceObj.phoneNormal" alt="">
                </div>-->
      </div>
      <div class="operate-panel">
        <div class="ico-panel">
          <div
            ref="createDisSrcPanel"
            class="item-panel"
            @mouseenter="createDisEvent('hover')"
            @mouseleave="createDisEvent('leave')"
            @click="createDisEvent('click')"
          >
            <img :src="createDisSrc" alt="" draggable="false" />
          </div>
        </div>
      </div>
    </div>
    <!--消息显示-->
    <div class="messages-panel transparent-scroll-bar" ref="messagesContainer">
      <div class="loading-msg-panel" v-if="isLoading">
        <img
          src="../assets/img/messageDisplay/Translate_AIO_Loading@2x.png"
          alt="加载消息"
          draggable="false"
        />
      </div>
      <div
        class="row-panel"
        v-for="(item, index) in senderMessageList"
        :style="{ visibility: msgShowStatus }"
        :key="item.id"
      >
        <!--消息发送时间:当前发送消息为第一条显示时间-->
        <div class="sender-time-panel" v-if="index === 0">
          <!--非今天的消息显示日期与时间-->
          <span
            v-if="
              Date.parse(serverTime.substring(0, 10)) -
                Date.parse(item.createTime.substring(0, 10)) >=
                86400000
            "
            >{{ item.createTime.substring(5, 16) }}</span
          >
          <!--今天的消息显示时间-->
          <span v-else>{{ item.createTime.substring(10, 16) }}</span>
        </div>
        <!--当前消息与上一条消息发送时间间隔1分钟就显示-->
        <div
          class="sender-time-panel"
          v-else-if="
            Date.parse(String(item.createTime)) -
              Date.parse(String(senderMessageList[index - 1].createTime)) >=
              60000
          "
        >
          <!--非今天的消息显示日期与时间-->
          <span
            v-if="
              Date.parse(serverTime.substring(0, 10)) -
                Date.parse(item.createTime.substring(0, 10)) >=
                86400000
            "
            >{{ item.createTime.substring(5, 16) }}</span
          >
          <!--今天的消息显示时间-->
          <span v-else>{{ item.createTime.substring(10, 16) }}</span>
        </div>
        <!--发送者消息样式-->
        <div
          class="sender-panel"
          v-if="item.userId === userID"
          :data-createTime="item.createTime"
        >
          <!--昵称展示-->
          <div class="user-name-panel sender">
            <p>{{ item.userName }}</p>
          </div>
          <!--消息-->
          <div class="msg-body">
            <!--消息尾巴-->
            <div class="tail-panel">
              <svg class="icon" aria-hidden="true">
                <use
                  xlink:href="#icon-zbds30duihuakuangyou"
                  color="#dce7dc"
                ></use>
              </svg>
            </div>
            <!--消息内容-->
            <p v-html="item.msgText" />
          </div>
          <!--头像-->
          <div class="avatar-panel">
            <img :src="item.avatarSrc" alt="" draggable="false" />
          </div>
        </div>
        <!--对方消息样式-->
        <div class="otherSide-panel" v-else :data-createTime="item.createTime">
          <!--头像-->
          <div class="avatar-panel">
            <img :src="item.avatarSrc" alt="" draggable="false" />
          </div>
          <!--昵称展示-->
          <div class="user-name-panel sender">
            <p>{{ item.userName }}</p>
          </div>
          <!--消息-->
          <div class="msg-body">
            <!--消息尾巴-->
            <div class="tail-panel">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zbds30duihuakuangzuo"></use>
              </svg>
            </div>
            <!--消息内容-->
            <p v-html="item.msgText" />
          </div>
        </div>
      </div>
    </div>
    <!--用户输入模块-->
    <div class="user-input-panel" @click="getEditableDivFocus()">
      <div class="toolbar-panel">
        <div class="item-panel" v-for="item in toolbarList" :key="item.info">
          <div v-if="item.name === 'selectImg'" class="file-panel">
            <img
              class="emoticon"
              ref="selectImg"
              :src="require(`../assets/img/${item.src}`)"
              :alt="item.info"
              draggable="false"
            />
            <input
              class="file"
              name="file"
              type="file"
              accept="image/png,image/gif,image/jpeg"
              @mouseenter="
                toolbarSwitch(
                  'hover',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mouseleave="
                toolbarSwitch(
                  'leave',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mousedown="
                toolbarSwitch(
                  'down',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @mouseup="
                toolbarSwitch(
                  'up',
                  $event,
                  item.src,
                  item.hover,
                  item.down,
                  item.name
                )
              "
              @change="sendImage($event)"
            />
          </div>
          <img
            v-else
            class="emoticon"
            :src="require(`../assets/img/${item.src}`)"
            draggable="false"
            @mouseenter="
              toolbarSwitch(
                'hover',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mouseleave="
              toolbarSwitch(
                'leave',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mousedown="
              toolbarSwitch(
                'down',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            @mouseup="
              toolbarSwitch(
                'up',
                $event,
                item.src,
                item.hover,
                item.down,
                item.name
              )
            "
            :alt="item.info"
          />
        </div>
      </div>
      <div
        id="msgInputContainer"
        class="input-panel"
        ref="msgInputContainer"
        @keypress.enter.exact="sendMessage($event)"
        contenteditable="true"
        spellcheck="false"
      ></div>
      <!--表情面板-->
      <div
        class="emoticon-panel"
        :style="{ display: emoticonShowStatus }"
        ref="emoticonPanel"
      >
        <div class="container transparent-scroll-bar">
          <div class="row-panel">
            <div class="item-panel" v-for="item in emojiList" :key="item.info">
              <img
                :src="require(`../assets/img/emoji/${item.src}`)"
                :alt="item.info"
                draggable="false"
                @mouseover="
                  emojiConversion(
                    $event,
                    'over',
                    item.src,
                    item.hover,
                    item.info
                  )
                "
                @mouseleave="
                  emojiConversion(
                    $event,
                    'leave',
                    item.src,
                    item.hover,
                    item.info
                  )
                "
                @click="
                  emojiConversion(
                    $event,
                    'click',
                    item.src,
                    item.hover,
                    item.info
                  )
                "
              />
            </div>
          </div>
        </div>
        <div class="ico-panel"></div>
      </div>
    </div>
    <!--截图组件-->
    <screen-short
      v-if="screenshortStatus"
      @destroy-component="destroyComponent"
      @get-image-data="getImg"
    ></screen-short>
    <!--查看大图组件-->
    <show-img
      v-if="showImgStatus"
      :src="imgSrc"
      @destroy-component="destroyShowImg"
    ></show-img>
  </div>
</template>

<script lang="ts">
import { defineComponent, ComputedRef } from "vue";
import _ from "lodash";
import { messageDisplayPropsType } from "@/type/ComponentDataType";
import { SetupContext } from "@vue/runtime-core";
import initData from "@/module/message-display/main-entrance/InitData";
import eventMonitoring from "@/module/message-display/main-entrance/EventMonitoring";
import createDisEvent from "@/module/message-display/components-metords/CreateDisEvent";
import getEditableDivFocus from "@/module/message-display/components-metords/GetEditableDivFocus";
import toolbarSwitch from "@/module/message-display/components-metords/ToolbarSwitch";
import sendImage from "@/module/message-display/components-metords/SendImage";
import sendMessage from "@/module/message-display/components-metords/SendMessage";
import emojiConversion from "@/module/message-display/components-metords/EmojiConversion";
import destroyComponent from "@/module/message-display/components-metords/DestroyComponent";
import getImg from "@/module/message-display/split-method/GetImg";
import ShowImg from "@/views/teleport/show-img.vue";
import { destroyShowImg } from "@/module/message-display/components-metords/DestroyShowImg";
export default defineComponent({
  name: "message-display",
  components: { ShowImg },
  props: {
    listId: String, // 消息id
    messageStatus: Number, // 消息类型
    buddyId: String, // 好友id
    buddyName: String, // 好友昵称
    serverTime: String // 服务器时间
  },
  setup(props, context) {
    // 事件监听函数
    const { userID, onlineUsers } = eventMonitoring(
      props as messageDisplayPropsType,
      context as SetupContext<any>
    ) as {
      userID: ComputedRef<string>;
      onlineUsers: ComputedRef<number>;
    };

    // 返回组件需要用到的方法
    return {
      createDisSrc: initData().createDisSrc,
      resourceObj: initData().resourceObj,
      messageContent: initData().messageContent,
      emoticonShowStatus: initData().emoticonShowStatus,
      emojiList: initData().emojiList,
      toolbarList: initData().toolbarList,
      senderMessageList: initData().senderMessageList,
      isBottomOut: initData().isBottomOut,
      audioCtx: initData().audioCtx,
      arrFrequency: initData().arrFrequency,
      pageStart: initData().pageStart,
      pageEnd: initData().pageEnd,
      pageNo: initData().pageNo,
      pageSize: initData().pageSize,
      sessionMessageData: initData().sessionMessageData,
      msgListPanelHeight: initData().msgListPanelHeight,
      isLoading: initData().isLoading,
      isLastPage: initData().isLastPage,
      msgTotals: initData().msgTotals,
      isFirstLoading: initData().isFirstLoading,
      screenshortStatus: initData().screenshortStatus,
      showImgStatus: initData().showImgStatus,
      imgSrc: initData().imgSrc,
      messagesContainer: initData().messagesContainer,
      msgInputContainer: initData().msgInputContainer,
      selectImg: initData().selectImg,
      msgShowStatus: initData().msgShowStatus,
      userID: userID,
      onlineUsers: onlineUsers,
      createDisEvent: createDisEvent,
      getEditableDivFocus: getEditableDivFocus,
      toolbarSwitch: toolbarSwitch,
      sendImage: sendImage,
      sendMessage: sendMessage,
      emojiConversion: emojiConversion,
      destroyComponent: destroyComponent,
      getImg: getImg,
      destroyShowImg: destroyShowImg
    };
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "update-last-message": (val: {
      id: string;
      text: string;
      time: string;
      isPush: boolean;
    }) => {
      return !_.isEmpty(val);
    }
  }
});
</script>

<style lang="scss" src="../assets/scss/message-display.scss" scoped></style>
