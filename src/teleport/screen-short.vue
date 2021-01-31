<template>
  <teleport to="body">
    <!--截图区域-->
    <canvas
      id="screenshortContainer"
      :width="screenShortWidth"
      :height="screenShortHeight"
      ref="screenShortController"
    ></canvas>
    <!--工具栏-->
    <div
      id="toolPanel"
      v-show="toolStatus"
      :style="{ left: toolLeft + 'px', top: toolTop + 'px' }"
      ref="toolController"
    >
      <div
        v-for="item in toolbar"
        :key="item.id"
        :class="`item-panel ${item.title} `"
        @click="toolClickEvent(item.title, item.id, $event)"
      ></div>
      <!--撤销部分单独处理-->
      <div
        v-if="undoStatus"
        class="item-panel undo"
        @click="toolClickEvent('undo', 9, $event)"
      ></div>
      <div v-else class="item-panel undo-disabled"></div>
      <!--关闭与确认进行单独处理-->
      <div
        class="item-panel close"
        @click="toolClickEvent('close', 10, $event)"
      ></div>
      <div
        class="item-panel confirm"
        @click="toolClickEvent('confirm', 11, $event)"
      ></div>
    </div>
    <!--画笔绘制选项-->
    <div
      class="ico-panel"
      ref="optionIcoController"
      v-show="optionStatus"
      v-if="currentName !== 'mosaicPen'"
      :style="{
        left: toolLeft + optionIcoPosition + 'px',
        top: toolTop + 44 + 'px'
      }"
    ></div>
    <div
      id="optionPanel"
      ref="optionController"
      v-show="optionStatus"
      :style="{ left: toolLeft + 'px', top: toolTop + 44 + 6 + 'px' }"
    >
      <!--画笔大小选择-->
      <div class="brush-select-panel">
        <div
          class="item-panel brush-smail brush-smail-active"
          @click="setBrushSize('smail', 1, $event)"
        ></div>
        <div
          class="item-panel brush-medium"
          @click="setBrushSize('medium', 2, $event)"
        ></div>
        <div
          class="item-panel brush-big"
          @click="setBrushSize('big', 3, $event)"
        ></div>
      </div>

      <div class="right-panel" v-if="currentName !== 'mosaicPen'">
        <!--颜色选择-->
        <div
          class="color-select-panel"
          @click="selectColor()"
          :style="{ background: selectedColor }"
        ></div>
        <div class="color-panel" v-show="colorPanelStatus">
          <div
            class="color-item"
            v-for="index in 10"
            :key="index"
            @click="getColor(index)"
          ></div>
        </div>
        <div class="pull-down-arrow" @click="selectColor()"></div>
      </div>
    </div>
    <!--文本输入区域-->
    <div
      id="textInputPanel"
      ref="textInputController"
      v-show="textStatus"
      contenteditable="true"
      spellcheck="false"
    ></div>
  </teleport>
</template>

<script lang="ts">
import initData from "@/module/screen-short/main-entrance/InitData";
import eventMonitoring from "@/module/screen-short/main-entrance/EventMonitoring";
import { getColor } from "@/module/screen-short/common-methords/GetColor";
import { selectColor } from "@/module/screen-short/common-methords/SelectColor";
import { SetupContext } from "@vue/runtime-core";
import _ from "lodash";
import { setBrushSize } from "@/module/screen-short/common-methords/SetBrushSize";
import toolbar from "@/module/screen-short/config/Toolbar.ts";

export default {
  name: "screen-short",
  props: {},
  setup(props: Record<string, any>, context: SetupContext<any>) {
    const data = new initData();
    const screenShortWidth = data.getScreenShortWidth();
    const screenShortHeight = data.getScreenShortHeight();
    const screenShortController = data.getScreenShortController();
    const toolController = data.getToolController();
    const textInputController = data.getTextInputController();
    const toolStatus = data.getToolStatus();
    const textStatus = data.getTextStatus();
    const undoStatus = data.getUndoStatus();
    const currentName = data.getToolName();
    const optionStatus = data.getOptionStatus();
    const colorPanelStatus = data.getColorPanelStatus();
    const optionIcoController = data.getOptionIcoController();
    const optionController = data.getOptionController();
    const toolLeft = data.getToolLeft();
    const toolTop = data.getToolTop();
    const optionIcoPosition = data.getOptionIcoPosition();
    const selectedColor = data.getSelectedColor();
    const event = new eventMonitoring(props, context as SetupContext<any>);
    const toolClickEvent = event.toolClickEvent;
    return {
      screenShortWidth,
      screenShortHeight,
      screenShortController,
      textInputController,
      toolController,
      optionIcoController,
      optionController,
      toolStatus,
      textStatus,
      undoStatus,
      optionStatus,
      colorPanelStatus,
      currentName,
      toolLeft,
      toolTop,
      optionIcoPosition,
      selectedColor,
      toolbar,
      toolClickEvent,
      getColor,
      selectColor,
      setBrushSize
    };
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "destroy-component": (status: boolean) => {
      return !_.isNull(status);
    },
    "get-image-data": (base64: string) => {
      return !_.isNull(base64);
    }
  }
};
</script>

<style
  scoped
  lang="scss"
  src="../assets/scss/teleport/screen-short.scss"
></style>
