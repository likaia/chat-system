<template>
  <teleport to="body">
    <canvas
      id="screenshortContainer"
      :width="screenShortWidth"
      :height="screenShortHeight"
      ref="screenShortController"
    ></canvas>
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
    const screenShortWidth = data.getScreenShortWidth();
    const screenShortHeight = data.getScreenShortHeight();
    const screenShortController = data.getScreenShortController();
    new eventMonitoring(props, context as SetupContext<any>);
    return {
      screenShortWidth,
      screenShortHeight,
      screenShortController
    };
  }
};
</script>

<style
  scoped
  lang="scss"
  src="../assets/scss/teleport/screen-short.scss"
></style>
