<template>
  <div id="app" :style="appStyleObj">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

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
