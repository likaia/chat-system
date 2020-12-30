<template>
  <div class="info-con">{{ info }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "toast",
  props: {
    info: {
      type: String,
      default: () => ""
    },
    isShow: Boolean,
    duration: {
      type: Number,
      default: () => 2000
    }
  },
  data() {
    return {};
  },
  methods: {}
});
</script>

<style scoped lang="scss">
.info-con {
  width: 160px;
  height: 30px;
  line-height: 30px;
  color: #19db74;
  text-align: center;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 0px 5px 2px rgb(216, 216, 216);
  z-index: 9999;
}
</style>
