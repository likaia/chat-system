<template>
  <teleport to="body">
    <div id="screenshortContainer" ref="screenShortController">
      <div
        class="frame-selection-panel"
        ref="frameSelectionController"
        :style="{
          top: topPosition + 'px',
          left: leftPosition + 'px',
          width: selectAreaWidth + 'px',
          height: selectAreaHeight + 'px'
        }"
      ></div>
    </div>
  </teleport>
</template>

<script lang="ts">
import initData from "@/module/screen-short/main-entrance/InitData";
import eventMonitoring from "@/module/screen-short/main-entrance/EventMonitoring";
import { SetupContext } from "@vue/runtime-core";

export default {
  name: "screen-short",
  props: {},
  setup(props: Record<string, any>, context: SetupContext<any>) {
    const data = new initData();
    const leftPosition = data.getScreenshortLeftPosition();
    const topPosition = data.getScreenshortTopPosition();
    const selectAreaWidth = data.getScreenshortSelectWidth();
    const selectAreaHeight = data.getScreenshortSelectHeight();
    const frameSelectionController = data.getFrameSelectionController();
    const screenShortController = data.getScreenShortController();
    new eventMonitoring(props, context as SetupContext<any>);
    return {
      leftPosition,
      topPosition,
      frameSelectionController,
      screenShortController,
      selectAreaWidth,
      selectAreaHeight
    };
  }
};
</script>

<style
  scoped
  lang="scss"
  src="../assets/scss/teleport/screen-short.scss"
></style>
