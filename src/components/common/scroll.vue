<template>
  <div class="wrapper" ref="wrapper">
    <slot></slot>
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
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    loadMore: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      scroll: null,
      message: "哈哈哈",
      loadMoreData: {},
      y: 0
    };
  },
  mounted() {
    this.loadMoreData = this.loadMore;
    const wrapDom = document.getElementById("wrap");
    if (wrapDom == null) return;
    this.$refs.wrapper.style.height = wrapDom.offsetHeight - 65 + "px";
    // 1.创建BScroll对象

    setTimeout(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        mouseWheel: true,
        pullUp: this.pullUp
      });
      this.pullingUp();
    }, 20);
  },
  methods: {
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    pullingUp() {
      this.scroll &&
        this.scroll.on("scrollEnd", () => {
          // 禁止上滑加载数据
          if (this.scroll.y <= this.y) {
            // 触底加载
            if (this.scroll.y == this.scroll.maxScrollY) {
              this.loadMoreData.pageNo++;
              this.loadMoreData.isActionPullup = true;
              this.$emit("pulling-up", this.loadMoreData);
              this.y = this.scroll.y;
            }
          }
        });
    }
  }
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  overflow: hidden;
}
</style>
