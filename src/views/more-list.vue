<!--更多选项卡-->
<template>
  <div class="content">
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
        class="tab-control"
        :titles="['文件', '反馈', '设置']"
        @tab-click="tabClick"
      />
    </div>
    <!-- 选项卡内容 -->
    <div v-if="tabIndex == 0">
      <file />
    </div>
    <div v-if="tabIndex == 1">
      <feed-back />
    </div>
    <div v-if="tabIndex == 2">
      <setting />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import tabControl from "@/components/content/tabControl/tab-control.vue";
import file from "@/components/content/tabControl/file.vue";
import feedBack from "@/components/content/tabControl/feed-back.vue";
import setting from "@/components/content/tabControl/setting.vue";

export default defineComponent({
  name: "more-list",
  components: {
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
      tabIndex: ""
    };
  },
  methods: {
    getCrrentDate() {
      console.log(123);
    },
    tabClick(index: string) {
      console.log("index" + index);
      this.tabIndex = index;
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

.tabbar {
  display: flex;
  width: 80%;
  margin: 30px auto;
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
