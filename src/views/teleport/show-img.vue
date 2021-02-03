<template>
  <teleport to="body">
    <div
      id="photoPanel"
      ref="photoContainer"
      :style="{
        width: photoContainerWidth + 'px',
        height: photoContainerHeight + 'px',
        top: photoContainerTop + 'px',
        left: photoContainerLeft + 'px'
      }"
    >
      <div class="top-panel" ref="topPanel">
        <div
          class="left-panel"
          @mouseover="showLeftIco(true)"
          @mouseleave="showLeftIco(false)"
        >
          <div class="icon-panel">
            <div class="fillet-ico-panel close-ico">
              <img
                src="@/assets/img/close.png"
                alt=""
                :style="{ display: leftIco }"
              />
            </div>

            <div class="fillet-ico-panel mini-ico">
              <img
                src="@/assets/img/min.png"
                alt=""
                :style="{ display: leftIco }"
              />
            </div>
            <div class="fillet-ico-panel max-ico">
              <img
                src="@/assets/img/max.png"
                alt=""
                :style="{ display: leftIco }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { SetupContext } from "@vue/runtime-core";
import InitData from "@/module/show-img/main-entrance/InitData";
import EventMonitoring from "@/module/show-img/main-entrance/EventMonitoring";
import { imgPropsType } from "@/module/show-img/type/ShowImgDataType";

export default {
  name: "show-img",
  props: {
    src: String
  },
  setup(props: imgPropsType, context: SetupContext<any>) {
    const data = new InitData();
    const photoContainer = data.getPhotoContainer();
    const photoContainerWidth = data.getPhotoControllerWidth();
    const photoContainerHeight = data.getPhotoControllerHeight();
    const photoContainerTop = data.getPhotoContainerTop();
    const photoContainerLeft = data.getPhotoContainerLeft();
    const imgSrc = data.getImgsrc();
    new EventMonitoring(props as imgPropsType, context as SetupContext<any>);
    return {
      photoContainer,
      photoContainerWidth,
      photoContainerHeight,
      photoContainerTop,
      photoContainerLeft,
      imgSrc
    };
  }
};
</script>

<style
  scoped
  lang="scss"
  src="../../assets/scss/show-img/show-img.scss"
></style>
