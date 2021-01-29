<template>
  <div class="input-box">
    <span class="title">{{ title }}</span>
    <input
      type="text"
      @focus="onFocus"
      :placeholder="placeholder"
      v-model="inputVal"
      ref="inputText"
    />
    <div v-if="isShowBtn" class="edit">
      <i class="icon"></i>
      <span @click="edit">修改</span>
    </div>
    <div v-else class="save">
      <span class="save-btn" @click="save">保存</span>
      <span class="cancel-btn" @click="cancel">取消</span>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";

export default defineComponent({
  name: "input-box",
  props: {
    placeholder: String,
    title: String,
    keyNum: Number,
    value: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      currentIndex: 0,
      isShowBtn: true,
      inputVal: this.value
    };
  },
  methods: {
    // 保存内容
    save() {
      this.isShowBtn = false;
      this.$emit("save-info", this.inputVal, this.keyNum);
      this.isShowBtn = true;
    },
    // 编辑内容
    edit() {
      this.isShowBtn = false;
      this.$refs.inputText.focus();
    },
    // 获取最新内容
    changeValue() {
      this.inputVal = this.value;
    },
    // 开启修改按钮选择
    onFocus() {
      this.isShowBtn = false;
    },
    // 取消修改
    cancel() {
      this.isShowBtn = true;
    }
  },
  created() {
    this.changeValue();
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "save-info": (val: string) => {
      return !_.isEmpty(val);
    }
  }
});
</script>

<style scoped lang="scss" src="@/assets/scss/common/input-box.scss"></style>
