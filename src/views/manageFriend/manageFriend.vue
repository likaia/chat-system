<template>
  <moveSettings ref="move">
    <div
      class="manageFriend-content"
      @mousedown="alertDown($event)"
      @mousemove="alertMove($event)"
      @mouseup="alertUp"
      @blur="alertUp"
      ref="manageFriendContent"
    >
      <div class="top-panel">
        <div class="top-panel-left">
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco(true)"
            @mouseleave="showLeftIco(false)"
            @click.stop="removeManageFriendAlert"
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
        <div class="top-panel-center">
          <p>删除好友</p>
        </div>
        <div class="top-panel-right"></div>
      </div>
      <template v-if="manageFriendArgs.typeName == 'delFriend'">
        <div class="del-middle-panel">
          <p>确定删除({{ manageFriendArgs.userName }})该好友吗？</p>
        </div>
      </template>
      <div class="bottom-panel">
        <input type="button" value="取消" @click="removeManageFriendAlert" />
        <input
          :disabled="sendInputState"
          ref="sendRequest"
          type="button"
          value="确定"
          @click="sendRequest"
        />
      </div></div
  ></moveSettings>
  <div v-if="promptAlert.state" class="sendRequestMessage">
    <div>
      <p>{{ promptAlert.massage }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
import { responseDataType } from "@/type/ComponentDataType";
// import { responseDataType } from "@/type/ComponentDataType";
export default defineComponent({
  name: "manageGroups",
  components: {
    moveSettings
  },
  props: { manageFriendArgs: Object },
  data() {
    return {
      leftIco: "none",
      manageFriendData: {},
      requesetArg: {},
      promptAlert: {
        massage: "",
        state: false
      },
      sendInputState: false
    };
  },
  mounted() {
    // console.log(this.manageFriendArgs);

    this.manageFriendData = this.manageFriendArgs;
  },
  methods: {
    // 按下触发可拖曳事件
    alertDown: function(e: any) {
      this.$refs.move.alertDown(e, this.$refs.manageFriendContent);
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      this.$refs.move.alertMove(e, this.$refs.manageFriendContent);
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.$refs.move.alertUp(this.$refs.manageFriendContent);
    },
    // 判断关闭与最小化图标是否出现
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
    },
    // 关闭好友管理弹框
    removeManageFriendAlert() {
      this.$store.commit("updateManageFriendStatus", false);
    },
    // 处理好友
    sendRequest() {
      this.sendInputState = true;
      this.$refs.sendRequest.style.backgroundColor = "#EEE";
      this.$refs.sendRequest.style.color = "#666";
      this.delFriend();
    },
    // 封装请求后行为
    reqResult(res: any, time: number, content: string) {
      // 首次请求为成功，有已同意，多次请求为失败，则为msg
      if (res.code == 0) {
        this.promptAlert.massage = content;
        this.promptAlert.state = true;
      } else {
        this.promptAlert.massage = res.msg;
        this.promptAlert.state = true;
      }
      // 请求成功后改变关闭验证列表弹窗状态，刷新获取最新好友信息
      setTimeout(() => {
        this.promptAlert.state = false;
        this.$router.go(0);
        this.removeManageFriendAlert();
      }, time);
    },
    delFriend() {
      this.requesetArg.groupId = this.manageFriendData.childrenId;
      this.requesetArg.userId = this.manageFriendData.userId;
      this.$api.websiteManageAPI
        .updateDeleteFriend(this.requesetArg)
        .then((res: responseDataType) => {
          this.reqResult(res, 3000, "删除好友成功");
        });
    }
  }
});
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/manageFriend/manageFriend.scss"
></style>
