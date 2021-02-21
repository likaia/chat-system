<template>
  <scroll
    :pullUp="true"
    :load-more="loadMore"
    :probeType="0"
    @pulling-up="getUserFileList(loadMore)"
    ref="bScroll"
  >
    <div class="file-content" ref="fileContent">
      <div v-if="dataInfoList.count == 0" class="noFile">没有文件数据</div>
      <div v-if="dataInfoList.count > 0" class="contentInfo-panel">
        <template v-if="showFileData == 'dataInfoList'">
          <div
            v-for="(item, index) in dataInfoList.fileList"
            :key="index"
            class="item-panel"
            ref="itemPanel"
            :style="{ height: itemHeight }"
          >
            <div class="picture">
              <img :src="item.imgSrc" alt="" />
            </div>
            <div class="detailInfo">
              <p>{{ item.fileName }} ({{ item.fileSize }})</p>
              <p>
                <span>{{ item.createTime }}</span
                ><span>发给：你大爷</span><span>已发送</span>
              </p>
            </div>
          </div>
        </template>
        <template v-if="showFileData == 'selectList'">
          1
          <div
            v-for="(item, index) in typeShape.selectList"
            :key="index"
            class="item-panel"
            ref="itemPanel"
            :style="{ height: itemHeight }"
          >
            <div class="picture">
              <img :src="item.imgSrc" alt="" />
            </div>
            <div class="detailInfo">
              <p>{{ item.fileName }} ({{ item.fileSize }})</p>
              <p>
                <span>{{ item.createTime }}</span
                ><span>发给：你大爷</span><span>已发送</span>
              </p>
            </div>
          </div>
        </template>
        <template v-if="showFileData == 'searchList'">
          <div
            v-for="(item, index) in typeShape.searchList"
            :key="index"
            class="item-panel"
            ref="itemPanel"
            :style="{ height: itemHeight }"
          >
            <div class="picture">
              <img :src="item.imgSrc" alt="" />
            </div>
            <div class="detailInfo">
              <p>{{ item.fileName }} ({{ item.fileSize }})</p>
              <p>
                <span>{{ item.createTime }}</span
                ><span>发给：你大爷</span><span>已发送</span>
              </p>
            </div>
          </div>
        </template>
      </div>
      <div class="bottom-panel">
        <div ref="nowLoad" class="loading"></div>
      </div>
    </div>
  </scroll>
</template>

<script lang="ts">
import { responseDataType } from "@/type/ComponentDataType";
import { defineComponent } from "vue";
import scroll from "@/components/common/scroll.vue";

export default defineComponent({
  name: "file",
  components: {
    scroll
  },
  props: {},
  data() {
    return {
      currentIndex: 0,
      suffix: {
        zip: require("@/assets/img/more/large_zip-rar@2x.png"),
        music: require("@/assets/img/more/large_music@2x.png"),
        doc: require("@/assets/img/more/large_doc@2x.png"),
        psd: require("@/assets/img/more/large_psd@2x.png"),
        pdf: require("@/assets/img/more/large_pdf@2x.png"),
        pic: require("@/assets/img/more/large_pic@2x.png"),
        ppt: require("@/assets/img/more/large_ppt@2x.png"),
        word: require("@/assets/img/more/large_word@2x.png"),
        txt: require("@/assets/img/more/large_txt@2x.png"),
        ai: require("@/assets/img/more/large_ai@2x.png"),
        other: require("@/assets/img/more/large_other@2x.png")
      },
      dataInfoList: {},
      loadMore: {
        pageNo: 1,
        pageSize: 18,
        isActionPullup: false
      },
      closeRequestFileList: false,
      itemHeight: 62,
      loading: require("@/assets/img/more/loading.gif"),
      typeShape: {
        searchList: [],
        selectList: [],
        showData: "dataInfoList"
      }
    };
  },
  methods: {
    // 伪造文件列表数据
    async getAddFileInfo() {
      const a = {
        createTime: "2020-12-17 12:59:12",
        fileName: "index.js",
        fileSize: 0.1,
        fileSource: "admin",
        fileType: "js",
        userId: this.$store.state.userID
      };
      await this.$api.fileManageAPI.getAddFileInfo(a);
    },
    getUserFileList(page: any) {
      // 上拉加载效果
      if (page.isActionPullup) {
        this.$refs.nowLoad.innerHTML = `<img src="${this.loading}" alt="" style=" width: 18px;height: 18px;transform: translate(-5px,3px);"/><p>加载中...</p>`;
        if (this.showFileData == "dataInfoList") {
          page.pageNo = this.loadMore.pageNo + 1;
        }
      }
      if (this.showFileData == "dataInfoList") {
        // 文件列表数据请求
        if (!this.closeRequestFileList) {
          this.$api.fileManageAPI
            .getUserFileList({
              userId: this.$store.state.userID,
              pageNo: page.pageNo,
              pageSize: page.pageSize
            })
            .then((res: responseDataType) => {
              // 请求成功
              if (res.code == 0) {
                if (res.count == 0) {
                  return;
                }
                // 首次请求赋值
                if (Object.keys(this.dataInfoList).length == 0) {
                  this.dataInfoList = res.data;
                } else {
                  if (
                    (res.data.count % this.loadMore.pageSize == 0
                      ? this.loadMore.pageNo
                      : this.loadMore.pageNo - 1) *
                      this.loadMore.pageSize <=
                    res.data.count
                  ) {
                    // 当文件列表数据数小于指定分页数
                    if (res.data.fileList.length < this.loadMore.pageSize) {
                      res.data.fileList.forEach((item: responseDataType) => {
                        this.dataInfoList.fileList.push(item);
                      });
                      // 关闭请求开关
                      this.closeRequestFileList = true;
                    } else {
                      // 增加文件列表数据
                      res.data.fileList.forEach((item: responseDataType) => {
                        this.dataInfoList.fileList.push(item);
                      });
                    }
                  } else {
                    // 关闭请求开关
                    this.closeRequestFileList = true;
                    // 不做请求时上拉加载效果
                    this.$refs.fileContent.style.height =
                      this.itemHeight *
                        (this.dataInfoList.fileList.length + 0.75) +
                      "px";
                    this.$refs.bScroll.refresh();
                    // 没有加载更多文件列表数据展示时上拉加载效果
                    setTimeout(() => {
                      this.$refs.nowLoad.innerHTML = "没有更多数据了";
                    }, 500);
                  }
                }
                // 处理文件列表数据
                if (this.dataInfoList.count > 0) {
                  this.dataInfoList.fileList.forEach((item: any) => {
                    item.suffixName = item.fileType;
                    if (this.checkSuffix(item.fileType) != "") {
                      item.suffixName = this.checkSuffix(item.fileType);
                    }
                    for (const key in this.suffix) {
                      if (item.suffixName == key) {
                        item.imgSrc = this.suffix[key];
                      }
                    }
                    item.fileSize = this.selectType(item.fileSize);
                  });
                }
                // 动态赋值可滚动元素高度
                this.$refs.fileContent.style.height =
                  this.itemHeight * (this.dataInfoList.fileList.length + 0.75) +
                  "px";
                // 清空上拉加载效果并刷新
                this.$refs.nowLoad.innerHTML = "";

                this.$refs.bScroll.refresh();
              }
            });
        } else {
          // 不做请求时上拉加载效果
          this.$refs.fileContent.style.height =
            this.itemHeight * (this.dataInfoList.fileList.length + 0.75) + "px";
          this.$refs.bScroll.refresh();
          // 没有加载更多文件列表数据展示时上拉加载效果
          setTimeout(() => {
            this.$refs.nowLoad.innerHTML = "没有更多数据了";
          }, 500);
        }
      } else {
        this.setHeight();
      }
    },
    // 验证文件后缀
    checkSuffix(type: string) {
      if (/(jpg|peng|png|gif)/.test(type)) {
        return "pic";
      }
      if (/(mp3|wav|ra|aac|cda|wma|midi|ogg|ape|flac)/.test(type)) {
        return "music";
      }
      if (/(docx)/.test(type)) {
        return "word";
      }
      if (!/(zip|doc|psd|pdf|ppt|txt|ai)/.test(type)) {
        return "other";
      }
      return "";
    },
    // 选择文件大小类型
    selectType(size: any) {
      switch (true) {
        case size < 1:
          size = 1 + "KB";
          break;
        case size / Math.pow(1024, 0) < 1024:
          size = (size / Math.pow(1024, 0)).toFixed(2) + "KB";
          break;
        case size / Math.pow(1024, 1) < 1024:
          size = (size / Math.pow(1024, 1)).toFixed(2) + "MB";
          break;
        case size / Math.pow(1024, 2) < 1024:
          size = (size / Math.pow(1024, 2)).toFixed(2) + "GB";
          break;
        case size / Math.pow(1024, 3) < 1024:
          size = (size / Math.pow(1024, 3)).toFixed(2) + "TB";
          break;
        default:
          break;
      }
      return size;
    },
    manageList(arr: any, val: string) {
      this.typeShape.searchList = [];
      arr.forEach((element: Record<string, any>) => {
        if (
          element.fileName.indexOf(val) !== -1 ||
          element.fileType.indexOf(val) !== -1 ||
          element.suffixName.indexOf(val) !== -1
        ) {
          this.typeShape.searchList.push(element);
        }
      });
      if (val) {
        this.typeShape.showData = "searchList";
      } else {
        this.typeShape.showData = "dataInfoList";
      }
      this.setHeight();
    },
    setHeight() {
      if (this.showFileData == "searchList") {
        // 不做请求时上拉加载效果
        this.$refs.fileContent.style.height =
          this.itemHeight * (this.typeShape.searchList.length + 0.75) + "px";
        this.$refs.bScroll.refresh();
        // 没有加载更多文件列表数据展示时上拉加载效果
        if (
          parseInt(this.$refs.fileContent.style.height) <
          parseInt(this.$refs.bScroll.$refs.wrapper.style.height)
        ) {
          if (this.typeShape.searchList.length == 0) {
            this.$refs.nowLoad.innerHTML = "没有该类型的文件";
          }
          if (this.typeShape.searchList.length > 0) {
            this.$refs.nowLoad.innerHTML = "没有更多数据了";
          }
        } else {
          this.$refs.nowLoad.innerHTML = "没有更多数据了";
        }
      } else {
        // 不做请求时上拉加载效果
        this.$refs.fileContent.style.height =
          this.itemHeight * (this.dataInfoList.fileList.length + 0.75) + "px";
        this.$refs.bScroll.refresh();
        // 没有加载更多文件列表数据展示时上拉加载效果
        setTimeout(() => {
          this.$refs.nowLoad.innerHTML = "";
        }, 500);
      }
    }
  },
  mounted() {
    // this.getAddFileInfo();
    this.getUserFileList(this.loadMore);
  },
  computed: {
    showFileData() {
      return this.typeShape.showData;
    }
  }
});
</script>

<style scoped lang="scss" src="@/assets/scss/moreListChild/file.scss"></style>
