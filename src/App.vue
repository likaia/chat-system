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
        background: "#0C9A9A"
      },
      getCurrentComponentName: ""
    };
  },
  created() {
    // 用户离开或返回时切换登录状态
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState == "hidden") {
        if (
          this.$store.state?.token &&
          localStorage.getItem("token") !== null
        ) {
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
        }
      } else {
        // 返回页面
        if (
          this.$store.state?.token &&
          localStorage.getItem("token") !== null
        ) {
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
//自动移滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, 0.3);
}
::-webkit-scrollbar-track {
  border-radius: 1em;
  background-color: rgba(50, 50, 50, 0.1);
}

/*透明滚动条*/
.transparent-scroll-bar::-webkit-scrollbar {
  color: transparent;
}
.transparent-scroll-bar::-webkit-scrollbar-thumb {
  background: transparent;
}
.transparent-scroll-bar::-webkit-scrollbar-track {
  background: transparent;
}

@font-face {
  font-family: "JetBrainsMono-Light";
  src: url("./assets/font/JetBrainsMono-Light.woff2");
}
@font-face {
  font-family: "JetBrainsMono-Italic";
  src: url("./assets/font/JetBrainsMono-Italic.woff2");
}
@font-face {
  font-family: "JetBrainsMono-Regular";
  src: url("./assets/font/JetBrainsMono-Regular.woff2");
}
@font-face {
  font-family: "JetBrainsMono-Bold";
  src: url("./assets/font/JetBrainsMono-Bold.woff2");
}
@font-face {
  font-family: "JetBrainsMono-BoldItalic";
  src: url("./assets/font/JetBrainsMono-BoldItalic.woff2");
}

p,
span,
div,
body {
  font-family: "JetBrainsMono-Light", "JetBrainsMono-Regular",
    "JetBrainsMono-Italic", "JetBrainsMono-Bold", "JetBrainsMono-BoldItalic",
    sans-serif;
}
#app {
  width: 100%;
  height: 100vh;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
