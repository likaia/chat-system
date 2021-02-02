<template>
  <div class="outer-mask">
    <div class="inside-mask">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "moveSettings",
  methods: {
    // 按下触发可拖曳事件
    alertDown: function(e: any, dom: any) {
      // 获取初始时当前框距离对应边界的大小位置和当前鼠标左键点下时事件的位置
      this.moveAlertData.x = e.clientX;
      this.moveAlertData.y = e.clientY;
      this.moveAlertData.t = dom.offsetTop;
      this.moveAlertData.l = dom.offsetLeft;
      this.moveAlertData.isDown = true;
      // 将鼠标图标换成可拖动
      dom.style.cursor = "move";
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any, dom: any) {
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
      if (this.moveAlertData.movel + dom.offsetWidth > window.innerWidth) {
        this.moveAlertData.movel = window.innerWidth - dom.offsetWidth;
      }
      // 对下边界进行边界处理
      if (this.moveAlertData.movet + dom.offsetHeight > window.innerHeight) {
        this.moveAlertData.movet = window.innerHeight - dom.offsetHeight;
      }
      // 对上边界进行边界处理
      if (this.moveAlertData.movet < 0) {
        this.moveAlertData.movet = 0;
      }
      // 渲染最新位置
      dom.style.left = this.moveAlertData.movel + "px";
      dom.style.top = this.moveAlertData.movet + "px";
    },
    // 可拖曳事件完成事件
    alertUp: function(dom: any) {
      this.moveAlertData.isDown = false;
      dom.style.cursor = "default";
    }
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
  }
});
</script>
<style
  lang="scss"
  scoped
  src="@/assets/scss/common/moveAlert/move.scss"
></style>
