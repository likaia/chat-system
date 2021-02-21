<!--更多选项卡-->
<template>
  <div id="wrap">
    <div class="tabbar">
      <div class="date">
        <p>{{ currentDate }}</p>
        <p v-if="Object.keys(lunarObj).length > 0">
          <span>{{ lunarObj.ncWeek }}</span>
          <span>{{ lunarObj.monthStr }}{{ lunarObj.dayStr }}</span>
          <span v-if="lunarObj.Terms != false">{{ lunarObj.Terms }}</span>
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
    <div v-if="tabIndex == 0" class="file-panel">
      <div class="fixed-panel">
        <div class="select">
          <div @click="showSelectFile" class="default-value">
            {{ fileContentData.defaultValue }}
          </div>
          <div
            class="selectContent"
            v-if="fileContentData.showSelectValue"
            @mouseleave="closeSelectFile"
          >
            <div
              class="val"
              v-for="(item, index) in fileContentData.fileType"
              :key="index"
              @click="fileSelectedValue(item, index)"
            >
              <img
                src="@/assets/img/more/confirm.png"
                v-if="index === fileContentData.confirmIconIndex"
                alt=""
              />
              {{ item }}
            </div>
          </div>
        </div>
        <div class="serach">
          <input
            type="text"
            placeholder="文件名/文件类型"
            @input="searchFile"
            v-model="searchValue"
          />
        </div>
      </div>
      <file ref="file" />
    </div>
    <div v-if="tabIndex == 1">
      <feed-back />
    </div>
    <div v-if="tabIndex == 2">
      <scroll>
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
import { responseDataType } from "@/type/ComponentDataType";
import { solarToLunar } from "vue-solar-lunar";
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
      currentDate: "", // 当前时间
      tabIndex: -1,
      serverTime: "",
      lunarObj: {},
      fileContentData: {
        fileType: ["全部文件", "发送文件", "接收文件"],
        showSelectValue: false,
        defaultValue: "全部文件",
        confirmIconIndex: 0
      },
      searchValue: ""
    };
  },
  methods: {
    getCrrentDate() {
      this.$api.serverAPI.getServerTime().then((res: responseDataType) => {
        if (res.code == 0) {
          this.currentDate = res.data.split(" ")[0].split("-");
          this.serverTime = this.currentDate;
          this.currentDate = `${parseInt(this.currentDate[1])}月${parseInt(
            this.currentDate[2]
          )}日`;
          this.lunarObj = solarToLunar(
            this.serverTime[0],
            this.serverTime[1],
            this.serverTime[2]
          );
        }
      });
    },
    tabClick(index: string) {
      this.tabIndex = index;
      // this.$refs.tabControl.img.style.height = "180px";
    },
    showSelectFile() {
      this.fileContentData.showSelectValue = !this.fileContentData
        .showSelectValue;
    },
    closeSelectFile() {
      this.fileContentData.showSelectValue = false;
    },
    fileSelectedValue(val: string, index: number) {
      this.fileContentData.defaultValue = val;
      this.fileContentData.confirmIconIndex = index;

      this.closeSelectFile();
    },
    searchFile() {
      if (this.serachValue) {
        return;
      }
      if (this.$refs.file.dataInfoList.fileList.length == 0) {
        return;
      } else {
        setTimeout(() => {
          this.$refs.file.manageList(
            this.$refs.file.dataInfoList.fileList,
            this.searchValue
          );
        }, 1000);
      }
    }
  },
  computed: {},
  created() {
    this.getCrrentDate();
  }
});
</script>

<style scoped lang="scss" src="@/assets/scss/more-list.scss"></style>
