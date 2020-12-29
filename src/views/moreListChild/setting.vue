<template>
  <div id="setting">
    <toast class="toast" v-if="isShow" :info="toastMsg" />
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
                  <input
                    type="file"
                    name="file"
                    accept="image/png,image/gif,image/jpeg"
                    @change="uploadAvatar($event)"
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="用户名"
              :keyNum="1"
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
              <select v-model="cityVal" @change="updateNativePlace">
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
            <inputBox
              title="职业"
              :value="userInfo.occupation"
              :keyNum="2"
              placeholder="填写你的职业"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <div class="input-box">
              <span class="title">生日</span>
              <input
                type="date"
                v-model="userInfo.dateOfBirth"
                @change="updateBirth"
              />
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <inputBox
              title="个性签名"
              placeholder="填写你的个性签名"
              :keyNum="3"
              :value="userInfo.signature"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <div class="input-box">
              <span class="title">性别</span>
              <select v-model="userInfo.gender" @change="updateGender">
                <option value="">性别</option>
                <option value="0">男</option>
                <option value="1">女</option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="邮箱地址"
              placeholder="填写你的邮箱地址"
              :keyNum="4"
              :value="userInfo.emailAddress"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <inputBox
              title="联系电话"
              placeholder="填写联系点话"
              :keyNum="7"
              :value="userInfo.contactNumber"
              @save-info="saveInfo"
            />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="学校"
              placeholder="填写你的学校"
              :keyNum="5"
              :value="userInfo.schoolName"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <inputBox
              title="详细地址"
              placeholder="填写详细地址"
              :keyNum="8"
              :value="userInfo.address"
              @save-info="saveInfo"
            />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="公司"
              placeholder="填写你的公司"
              :keyNum="6"
              :value="userInfo.corporationName"
              @save-info="saveInfo"
            />
          </td>
          <td>
            <button class="layout" @click="updateOnlineStatus">退出登录</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import inputBox from "@/components/common/input-box.vue";
import toast from "@/components/common/toast.vue";
import { set } from "lodash";
import { responseDataType } from "@/type/ComponentDataType";
import base from "../../api/base";

export default defineComponent({
  name: "setting",
  components: {
    inputBox,
    toast
  },
  props: {},
  data() {
    return {
      userInfo: "",
      currentIndex: 0,
      list: require("@/assets/json/provinces.json"), // 导入省市数据
      province: "", // 省份
      city: [], // 城市
      cityVal: "",
      toastMsg: "",
      isShow: false
    };
  },
  methods: {
    // -----网络相关请求-----------
    // 获取个人信息
    async getUserDataByUid() {
      const { data } = await this.$api.websiteManageAPI.getUserDataByUid({
        userId: this.$store.state.userID
      });
      this.userInfo = data;
      console.log(this.userInfo);
      this.province = this.userInfo.province;
      this.getProvinces(this.province);
    },
    uploadAvatar: function<T>(e: { target: { files: FileList } }) {
      // 头像上传
      const file = e.target.files[0];
      // 构造form对象
      const formData = new FormData();
      // 后台取值字段 | blob文件数据 | 文件名称
      formData.append("file", file, file.name);
      // 调用上传api
      this.$api.fileManageAPI
        .upload(formData)
        .then((res: responseDataType<T>) => {
          const fileName = `${base.lkBaseURL}/uploads/${res.fileName}`;
          // 头像赋值
          this.avatarSrc = fileName;
          console.log(fileName);
          this.saveInfo(fileName, 0);
        });
    },
    // 更新用户信息
    async saveInfo(val: string, keyNum: number) {
      const userObj = this.switchInfo(val, keyNum);
      const { data } = await this.$api.websiteManageAPI.updateUserInfo({
        userId: this.$store.state.userID,
        ...userObj
      });
      console.log(data);
      if (data == "用户信息更新成功") {
        this.toastMsg = data;
        this.isShow = true;
        setTimeout(() => {
          this.toastMsg = "";
          this.isShow = false;
        }, 2000);
      } else {
        alert("用户信息更新失败");
      }
      this.getUserDataByUid();
    },
    // 更新用户状态（退出登录）
    async updateOnlineStatus() {
      await this.$api.websiteManageAPI.updateOnlineStatus({
        userId: this.$store.state.userID,
        status: false
      });
      localStorage.removeItem("token");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("userID");
      localStorage.removeItem("username");
      this.$router.push("/login");
    },
    // ------其他方法-------------
    getProvinces() {
      setTimeout(() => {
        const optionIndex = this.$refs.provinces.selectedIndex - 1;
        console.log("------------", optionIndex);
        this.city = this.list[optionIndex].children;
      }, 1000);
    },
    updateBirth() {
      // 更新出生日期
      this.saveInfo(this.userInfo.dateOfBirth, 9);
    },
    updateGender() {
      // 更新性别
      this.saveInfo(this.userInfo.gender, 10);
    },
    updateNativePlace() {
      // 更新籍贯
      console.log(this.cityVal);
      this.saveInfo(this.province, 11, this.cityVal);
    },
    switchInfo(val: string, keyNum: number, cityVal: string) {
      console.log(val, keyNum, cityVal);
      let userObj = {};
      switch (keyNum) {
        case 0:
          // 头像
          userObj = { avatarSrc: val };
          break;
        case 1:
          // 用户名
          userObj = { userName: val };
          break;
        case 2:
          // 职业
          userObj = { occupation: val };
          break;
        case 3:
          // 个性签名
          userObj = { signature: val };
          break;
        case 4:
          // 邮箱
          userObj = { emailAddress: val };
          break;
        case 5:
          // 学校
          userObj = { schoolName: val };
          break;
        case 6:
          // 公司
          userObj = { corporationName: val };
          break;
        case 7:
          // 联系电话
          userObj = { contactNumber: val };
          break;
        case 8:
          // 地址
          userObj = { address: val };
          break;
        case 9:
          // 出生日期
          userObj = { dateOfBirth: val };
          break;
        case 10:
          // 性别
          userObj = { gender: val };
          break;
        case 11:
          // 籍贯
          userObj = { province: val, city: cityVal };
          break;
        default:
          userObj = { msg: "没有值" };
          break;
      }
      return userObj;
    }
  },
  created() {
    this.getUserDataByUid();
    console.log(this.city, "-----");
    console.log(111);
  },
  mounted() {
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
.toast {
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
