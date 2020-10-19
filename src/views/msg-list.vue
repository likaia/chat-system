<!--消息选项卡-->
<template>
  <div id="mainBody">
    <ul class="list-panel" ref="listPanel">
      <li class="row-panel">
        <div class="item-subscript-panel"></div>
        <div class="item-avatar-panel">
          <img :src="groupMsgImg" alt="用户头像" />
        </div>
        <div class="item-nickname-panel">
          <p class="title">掘金摸鱼群</p>
          <p class="subtitle">{{ lastMessageContent }}</p>
        </div>
        <div class="item-time-panel">
          <!--<p>下午10:22</p>
                        <div class="msg-count-panel msg-count-more-panel">
                            <p></p>
                        </div>-->
        </div>
      </li>
    </ul>
    <div class="content-panel" ref="contentPanel">
      <message-display
        :message-status="0"
        list-id="1892144211"
        @update-last-message="updateLastMessage($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import messageDisplay from "@/components/message-display.vue";

export default defineComponent({
  name: "msg-list",
  components: {
    messageDisplay
  },
  methods: {
    getThisWindowWidth: () => window.innerWidth,
    updateLastMessage: function(data: string) {
      console.log("事件触发");
      this.lastMessageContent = data;
    }
  },
  data() {
    return {
      msgSubscriptIco: require("../assets/img/msg-subscript.png"),
      avatarIco: require("../assets/img/avatar-ico.png"),
      groupMsgImg: require("../assets/img/group-msg-img.png"),
      GroupBlocked: require("../assets/img/Group_Blocked@2x.png"),
      otherMsgImg: require("../assets/img/other-msg-img.jpg"),
      lastMessageContent: ""
    };
  }
});
</script>

<style lang="scss" scoped src="../assets/scss/msg-list.scss"></style>
