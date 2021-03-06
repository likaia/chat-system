<template>
  <div id="setting">
    <toast class="toast" v-if="isShow" :info="toastMsg" />
    <table v-if="userInfo">
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
                <p class="tips">支持jipg、png、 jpeg格式大小2M以内的图片</p>
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
              :maxLength="20"
              contentValue="用户名"
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
                <!-- <option value="">请选择</option> -->
                <option
                  v-for="(item, optionIndex) in list"
                  :value="item.code"
                  :key="optionIndex"
                  >{{ item.name }}</option
                >
              </select>
              <!-- 城市 -->
              <select v-model="cityVal" @change="updateNativePlace">
                <!-- <option value="">请选择</option> -->
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
              :maxLength="10"
              contentValue="职业"
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
              :maxLength="20"
              contentValue="个性签名"
            />
          </td>
          <td>
            <div class="input-box">
              <span class="title">性别</span>
              <select v-model="userInfo.gender" @change="updateGender">
                <!-- <option value="">性别</option> -->
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
              :maxLength="50"
              contentValue="邮箱地址"
            />
          </td>
          <td>
            <inputBox
              title="联系电话"
              placeholder="填写联系点话"
              :keyNum="7"
              :value="userInfo.contactNumber"
              @save-info="saveInfo"
              :maxLength="20"
              contentValue="联系电话"
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
              :maxLength="30"
              contentValue="学校"
            />
          </td>
          <td>
            <inputBox
              title="详细地址"
              placeholder="填写详细地址"
              :keyNum="8"
              :value="userInfo.address"
              @save-info="saveInfo"
              :maxLength="30"
              contentValue="详细地址"
            />
          </td>
        </tr>
        <tr>
          <td>
            <inputBox
              title="修改密码"
              placeholder="填写新的密码"
              :keyNum="16"
              @save-info="saveInfo"
              :maxLength="16"
              contentValue="修改密码"
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
      this.province = this.userInfo.province;
      this.cityVal = this.userInfo.city;
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
          this.saveInfo(fileName, 0);
        });
    },
    // 更新用户信息
    async saveInfo(val: string, keyNum: number, cityVal: string) {
      if (keyNum === 16) {
        // 修改密码
        this.$api.websiteManageAPI
          .modifyPassword({ password: val })
          .then((res: responseDataType) => {
            if (res.code == 0) {
              this.toastMsg = res.data;
              this.isShow = true;
              setTimeout(() => {
                this.toastMsg = "";
                this.isShow = false;
              }, 2000);
            } else {
              this.toastMsg = res.msg;
              this.isShow = true;
              setTimeout(() => {
                this.toastMsg = "";
                this.isShow = false;
              }, 2000);
            }
          });
        return;
      }
      const userObj = this.switchInfo(val, keyNum, cityVal);
      const { data } = await this.$api.websiteManageAPI.updateUserInfo({
        userId: this.$store.state.userID,
        ...userObj
      });
      if (data == "用户信息更新成功") {
        const dataUid = await this.$api.websiteManageAPI.getUserDataByUid({
          userId: this.$store.state.userID
        });
        if (dataUid.code == 0) {
          this.$store.commit("updateUserInfo", {
            token: this.$store.state.token,
            profilePicture: dataUid.data.avatarSrc,
            userID: this.$store.state.userID,
            username: dataUid.data.userName
          });
        }

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
        const optionIndex = this.$refs.provinces.selectedIndex;
        if (optionIndex === -1) {
          return;
        }
        this.city = this.list[optionIndex].children;
      }, 0);
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
      this.saveInfo(this.province, 11, this.cityVal);
    },
    switchInfo(val: string, keyNum: number, cityVal: string) {
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
  }
});
</script>

<style
  scoped
  lang="scss"
  src="@/assets/scss/moreListChild/settings.scss"
></style>
