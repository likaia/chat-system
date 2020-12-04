<template>
  <div class="addFriends-list-outer-mask">
    <div class="addFriends-list-content">
      <div class="top-panel">
        <div class="top-panel-left">
          <div class="top-panel-left-icon"></div>
          <div class="top-panel-left-icon"></div>
        </div>
        <div class="top-panel-right">
          <p>添加联系人/群聊</p>
        </div>
      </div>
      <div class="main-panel">
        <div class="main-panel-content">
          <div class="main-panel-content-icon" style="">
            <img
              src="../assets/img/list/aio_group_search_normal@2x.png"
              alt=""
            />
          </div>
          <input type="text" style="" placeholder="QQ" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({ name: "addFriends-list" });
</script>
<style scoped lang="scss" src="../assets/scss/addFriends-list.scss"></style>
