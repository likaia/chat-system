<template>
  <teleport to="body">
    <div
      id="photoPanel"
      class="center"
      ref="photoContainer"
      :style="{
        width: photoContainerWidth + 'px',
        height: photoContainerHeight + 'px',
        top: photoContainerTop + 'px',
        left: photoContainerLeft + 'px'
      }"
    >
      <div class="top-panel" ref="topContainer">
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
                v-show="leftIco"
                @click="destroyComponent()"
              />
            </div>
            <div class="fillet-ico-panel mini-ico">
              <img src="@/assets/img/min.png" alt="" v-show="leftIco" />
            </div>
            <div class="fillet-ico-panel max-ico">
              <img src="@/assets/img/max.png" alt="" v-show="leftIco" />
            </div>
          </div>
        </div>
      </div>
      <!--图片展示区域-->
      <div class="content-panel">
        <img :src="imgSrc" alt="聊天图片预览" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { SetupContext } from "@vue/runtime-core";
import InitData from "@/module/show-img/main-entrance/InitData";
import EventMonitoring from "@/module/show-img/main-entrance/EventMonitoring";
import { imgPropsType } from "@/module/show-img/type/ShowImgDataType";
import { showLeftIco } from "@/module/show-img/common-methords/ShowLeftIco";
import _ from "lodash";

export default {
  name: "show-img",
  props: {
    src: String
  },
  setup(props: imgPropsType, context: SetupContext<any>) {
    const data = new InitData();
    const photoContainer = data.getPhotoContainer();
    const topContainer = data.getTopContainer();
    const photoContainerWidth = data.getPhotoControllerWidth();
    const photoContainerHeight = data.getPhotoControllerHeight();
    const photoContainerTop = data.getPhotoContainerTop();
    const photoContainerLeft = data.getPhotoContainerLeft();
    const imgSrc = data.getImgsrc();
    const leftIco = data.getLeftIcoStatus();
    const destroyComponent = data.destroyComponent;
    new EventMonitoring(props as imgPropsType, context as SetupContext<any>);
    return {
      photoContainer,
      topContainer,
      photoContainerWidth,
      photoContainerHeight,
      photoContainerTop,
      photoContainerLeft,
      imgSrc,
      leftIco,
      showLeftIco,
      destroyComponent
    };
  },
  emits: {
    "destroy-component": (status: boolean) => {
      return !_.isNull(status);
    }
  }
};
</script>

<style
  scoped
  lang="scss"
  src="../../assets/scss/show-img/show-img.scss"
></style>
