<template>
  <div>
    <ul class="tabbar">
      <li
        v-for="(item, index) in titles"
        :key="index"
        @click="itemClick(index)"
      >
        <div :class="[index == currentIndex ? classList[index] : '']"></div>
        <p :class="index == currentIndex ? 'activecolor' : ''">{{ item }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";

export default defineComponent({
  name: "tab-control",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      currentIndex: -1,
      classList: ["activeIcon0", "activeIcon1", "activeIcon2"]
    };
  },
  methods: {
    itemClick(index: string) {
      this.currentIndex = index;
      this.$emit("tab-click", index);
    }
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "tab-click": (val: number) => {
      return !_.isNumber(val);
    }
  }
});
</script>

<style
  scoped
  lang="scss"
  src="@/assets/scss/moreListChild/tab-control.scss"
></style>
