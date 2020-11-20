<template>
  <div id="app" :style="appStyleObj">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { responseDataType } from "@/type/ComponentDataType";

export default defineComponent({
  name: "app",
  data() {
    return {
      appStyleObj: {
        height: window.innerHeight + "px",
        background: "#0C9A9A"
      },
      getCurrentComponentName: ""
    };
  },
  created() {
    // 用户离开或返回时切换登录状态
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState == "hidden") {
        // 离开页面
        this.$api.websiteManageAPI
          .updateOnlineStatus({
            userId: this.$store.state.userID,
            status: false
          })
          .then((res: responseDataType) => {
            if (res.code !== 0) {
              // 状态更新失败
              alert(res.msg);
            }
          });
      } else {
        // 返回页面
        this.$api.websiteManageAPI
          .updateOnlineStatus({
            userId: this.$store.state.userID,
            status: true
          })
          .then((res: responseDataType) => {
            if (res.code !== 0) {
              // 状态更新失败
              alert(res.msg);
            }
          });
      }
    });
  }
});
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
body {
  box-sizing: border-box;
}
#app {
  width: 100%;
  height: 100%;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
