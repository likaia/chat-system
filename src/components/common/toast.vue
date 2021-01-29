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

<style scoped lang="scss" src="@/assets/scss/toast.scss"></style>
