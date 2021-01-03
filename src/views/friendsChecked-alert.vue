<template>
  <div
    style="position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background: rgba(0, 0, 0, 0.2);
  "
  >
    <div
      @click="closeAlert"
      style="width: 100vw;height: 100vh;display:flex;align-items:center;justify-content: center; position:unset;z-index:-999;"
    >
      <div
        @mousedown="alertDown($event)"
        @mousemove="alertMove($event)"
        @mouseup="alertUp"
        @blur="alertUp"
        @click.stop=""
        ref="identityCheckedContent"
        style="width:600px;height:800px;background:white;position:absolute;z-index:999;"
      >
        123
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
export default defineComponent({
  name: "friendsChecked-alert",
  methods: {
    closeAlert() {
      this.$emit("close-checked-alert", false);
    },
    // 按下触发可拖曳事件
    alertDown: function(e: any) {
      // 获取初始时当前框距离对应边界的大小位置和当前鼠标左键点下时事件的位置
      this.moveAlertData.x = e.clientX;
      this.moveAlertData.y = e.clientY;
      this.moveAlertData.t = this.$refs.identityCheckedContent.offsetTop;
      this.moveAlertData.l = this.$refs.identityCheckedContent.offsetLeft;
      this.moveAlertData.isDown = true;
      // 将鼠标图标换成可拖动
      this.$refs.identityCheckedContent.style.cursor = "move";
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
          this.$refs.identityCheckedContent.offsetWidth >
        window.innerWidth
      ) {
        this.moveAlertData.movel =
          window.innerWidth - this.$refs.identityCheckedContent.offsetWidth;
      }
      // 对下边界进行边界处理
      if (
        this.moveAlertData.movet +
          this.$refs.identityCheckedContent.offsetHeight >
        window.innerHeight
      ) {
        this.moveAlertData.movet =
          window.innerHeight - this.$refs.identityCheckedContent.offsetHeight;
      }
      // 对上边界进行边界处理
      if (this.moveAlertData.movet < 0) {
        this.moveAlertData.movet = 0;
      }
      // 渲染最新位置
      this.$refs.identityCheckedContent.style.left =
        this.moveAlertData.movel + "px";
      this.$refs.identityCheckedContent.style.top =
        this.moveAlertData.movet + "px";
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.moveAlertData.isDown = false;
      this.$refs.identityCheckedContent.style.cursor = "default";
    }
  },
  props: {
    showCheckedAlert: Boolean
  },
  data() {
    return {
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
    "close-checked-alert": (val: boolean) => {
      return !_.isNull(val);
    }
  }
});
</script>
<style scoped></style>
