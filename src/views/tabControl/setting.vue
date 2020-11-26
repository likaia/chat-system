<template>
  <div id="setting">
    <table>
      <tbody>
        <tr>
          <td colspan="2">
            <h2 class="main-title">个人资料</h2>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="uploadAvatar">
              <span class="title">头像</span>
              <div class="avatar">
                <img src="@/assets/img/avatar.jpg" alt="" />
              </div>
              <div class="btn-area">
                <p class="tips">支持jipg、png、 jpeg格式大小5M以内的图片</p>
                <div class="up-btn">
                  点击上传
                  <input type="file" name="file" />
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="用户名"
              placeholder="填写用户名"
              value="网球王子"
            />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="职业" placeholder="填写你的职业" />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="个性签名" placeholder="填写你的个性签名" />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="邮箱地址" placeholder="填写你的邮箱地址" />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="学校" placeholder="填写你的学校" />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="公司" placeholder="填写你的公司" />
          </td>
          <td>
            <inputBox title="地区" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import inputBox from "@/components/common/input-box.vue";

export default defineComponent({
  name: "setting",
  components: {
    inputBox
  },
  props: {},
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {}
});
</script>

<style scoped lang="scss">
$borderColor: #ededed;
$hoverColor: #f5f5f6;
$fontColor: #bbbbbb;
$listFontColor: #777777;
$hoverFontColor: #12b7f5;
$Color: #007fff;
$boderColor: #f5f5f6;

#setting {
  width: 80%;
  height: 800px;
  min-width: 900px;
  margin: auto;
  overflow: auto;
  .main-title {
    width: 500px;
    padding: 20px 0;
    font-weight: 500;
    font-size: 22px;
  }
  table {
    width: 100%;
    td {
      padding: 20px 0;
      border-bottom: 1px solid $boderColor;
    }
    .uploadAvatar {
      display: flex;
      .title {
        width: 100px;
      }
    }
    .avatar {
      width: 80px;
      height: 80px;
      overflow: hidden;
      margin: 0 20px;
      img {
        width: 100%;
      }
    }
    .btn-area {
      position: relative;
      .tips {
        font-size: 14px;
        color: $fontColor;
      }
      .up-btn {
        cursor: pointer;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 80px;
        height: 28px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        line-height: 28px;
        overflow: hidden;
        border-radius: 2px;
        background: $Color;
        input {
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 28px;
          opacity: 0;
          z-index: 2;
        }
      }
    }
  }
}
</style>
