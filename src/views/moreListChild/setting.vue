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
                <img :src="userInfo.avatarSrc" alt="头像" />
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
              :value="userInfo.userName"
              placeholder="填写用户名"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <div class="input-box">
              <span class="title">地区</span>
              <!-- 国籍 -->
              <select>
                <option value="">中国</option>
              </select>
              <!-- 省份 -->
              <select ref="provinces" v-model="province" @change="getProvinces">
                <option value="">请选择</option>
                <option
                  v-for="(item, optionIndex) in list"
                  :value="item.code"
                  :key="optionIndex"
                  >{{ item.name }}</option
                >
              </select>
              <!-- 城市 -->
              <select v-model="cityVal">
                <option value="">请选择</option>
                <option
                  v-for="(item, optionIndex) in city"
                  :value="item.code"
                  :key="optionIndex"
                  >{{ item.name }}</option
                >
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="职业" placeholder="填写你的职业" />
          </td>
          <td>
            <div class="input-box">
              <span class="title">生日</span>
              <input type="date" />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="个性签名" placeholder="填写你的个性签名" />
          </td>
          <td>
            <div class="input-box">
              <span class="title">性别</span>
              <select>
                <option value="">性别</option>
                <option
                  value="0"
                  :selected="userInfo.gender == 0 ? true : false"
                  >男</option
                >
                <option
                  value="1"
                  :selected="userInfo.gender == 1 ? true : false"
                  >女</option
                >
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="邮箱地址" placeholder="填写你的邮箱地址" />
          </td>
          <td>
            <inputBox title="联系电话" placeholder="填写联系点话" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="学校" placeholder="填写你的学校" />
          </td>
          <td>
            <inputBox title="详细地址" placeholder="填写详细地址" />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox title="公司" placeholder="填写你的公司" />
          </td>
          <td>
            <button class="layout">退出登录</button>
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
      userInfo: "",
      currentIndex: 0,
      list: require("@/assets/json/provinces.json"), // 导入省市数据
      province: "", // 省份
      city: [], // 城市
      cityVal: ""
    };
  },
  methods: {
    getProvinces() {
      // 省市联动
      const optionIndex = this.$refs.provinces.selectedIndex - 1;
      this.city = this.list[optionIndex].children;
    },
    // 获取个人信息
    async getUserDataByUid() {
      const { data } = await this.$api.websiteManageAPI.getUserDataByUid({
        userId: this.$store.state.userID
      });
      this.userInfo = data;
      console.log(this.userInfo);
    },
    async saveInfo(val: string) {
      console.log("保存按钮发出的事件", val);
      const { data } = await this.$api.websiteManageAPI.updateUserInfo({
        avatarSrc: this.userInfo.avatarSrc,
        userId: this.$store.state.userID,
        userName: val
      });
      console.log(data);
    }
  },
  created() {
    console.log(111);
  },
  mounted() {
    this.getUserDataByUid();
    console.log(222);
  }
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
      .layout {
        width: 140px;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: #fff;
        text-align: center;
        border: 0;
        outline: none;
        border-radius: 5px;
        background-color: rgb(245, 108, 108);
        margin: auto;
        cursor: pointer;
      }
    }
    td:nth-child(1) {
      padding-right: 100px;
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

.input-box {
  display: flex;
  .title {
    width: 100px;
    line-height: 30px;
  }
  select {
    width: 70px;
    height: 28px;
    border-radius: 4px;
    margin-right: 10px;
    outline: none;
  }
}
</style>
