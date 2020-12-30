<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BScroll from "better-scroll";
// import { stringifyQuery } from "vue-router";

export default defineComponent({
  name: "scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
      message: "哈哈哈"
    };
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      mouseWheel: true
    });

    // 2.监听滚动的位置
    // this.scroll.on("scroll", position => {
    //   // console.log(position);
    //   this.$emit("scroll", position);
    // });

    // 3.监听上拉事件
    // this.scroll.on("pullingUp", () => {
    //   this.$emit("pulling-up");
    // });
  },
  methods: {
    scrollTo(x: string, y: string, time = 300) {
      this.scroll.scrollTo(x, y, time);
    }
  }
});
</script>

<style scoped></style>
