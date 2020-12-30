<!--更多选项卡-->
<template>
  <div id="wrap">
    <div class="tabbar">
      <div class="date">
        <p>11月7日</p>
        <p>
          <span>星期六</span>
          <span>九月廿十</span>
          <span>立冬</span>
        </p>
      </div>
      <!-- 选项卡组件 -->

      <tab-control
        ref="tabControl"
        class="tab-control"
        :titles="['文件', '反馈', '设置']"
        @tab-click="tabClick"
      />
    </div>

    <!-- 默认显示模块 -->
    <div v-if="tabIndex == -1">
      <h2>默认显示模块</h2>
    </div>
    <!-- 选项卡内容 -->
    <div v-if="tabIndex == 0">
      <file />
    </div>
    <div v-if="tabIndex == 1">
      <feed-back />
    </div>
    <div v-if="tabIndex == 2">
      <scroll class="content">
        <setting />
      </scroll>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import scroll from "@/components/common/scroll.vue";
import tabControl from "./moreListChild/tab-control.vue";
import file from "./moreListChild/file.vue";
import feedBack from "./moreListChild/feed-back.vue";
import setting from "./moreListChild/setting.vue";

export default defineComponent({
  name: "more-list",
  components: {
    scroll,
    tabControl,
    file,
    feedBack,
    setting
  },
  data() {
    return {
      currentDate: new Date(), // 当前时间
      week: "", // 星期
      solarTerms: "", // 节气
      tabIndex: -1
    };
  },
  methods: {
    getCrrentDate() {
      console.log(123);
    },
    tabClick(index: string) {
      console.log("index" + index);
      this.tabIndex = index;
      // this.$refs.tabControl.img.style.height = "180px";
    }
  },
  computed: {},
  created() {
    this.getCrrentDate();
  }
});
</script>

<style scoped lang="scss">
$borderColor: #ededed;
$hoverColor: #f5f5f6;
$fontColor: #bbbbbb;
$listFontColor: #777777;
$hoverFontColor: #12b7f5;

#wrap {
  height: 660px;
  position: relative;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tabbar {
  background: #fff;
  display: flex;
  width: 80%;
  margin: auto;
  margin-top: 30px;
  .date {
    flex: 1;
    p:nth-child(1) {
      font-size: 32px;
    }
    p:nth-child(2) {
      color: $fontColor;
      font-size: 12px;
      span {
        padding-right: 10px;
      }
    }
  }
  .tab-control {
    flex: 1;
  }
}
</style>
