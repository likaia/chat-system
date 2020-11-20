<!--公用组件：好友资料展示组件-->
<template>
  <div id="dataShowContent">
    <div class="top-panel">
      <div class="main-panel">
        <!--头像-->
        <div class="headPortrait">
          <img :src="userInfo.avatarSrc" alt="" />
        </div>
        <!--昵称-->
        <div class="nickname-panel">
          <p>{{ userInfo.userName }}</p>
        </div>
        <!--个性签名-->
        <div class="signature-panel">
          <p>{{ userInfo.signature }}</p>
        </div>
        <!--底部图标-->
        <div class="bottomIcon-panel">
          <div class="main-content">
            <div class="item-panel">
              <img :src="message" alt="消息图标" />
            </div>
            <div class="item-panel">
              <img :src="email" alt="邮箱图标" />
            </div>
            <div class="item-panel">
              <img :src="qzone" alt="空间图标" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-panel">
      <div class="main-panel">
        <div class="icon-data-panel">
          <div class="row-panel">
            <div class="item-panel">
              <div class="ico-panel" v-if="userInfo.gender == 1">
                <img :src="gender.woman" alt="" />
              </div>
              <div class="ico-panel" v-else>
                <img :src="gender.man" alt="" />
              </div>
              <div class="title-panel">
                <p>性别</p>
              </div>
            </div>
            <div class="item-panel">
              <div class="ico-panel">
                <img
                  :src="item"
                  v-for="(item, index) in age"
                  :key="index"
                  style="width: 20px; height: 30px"
                  alt=""
                />
              </div>
              <div class="title-panel">
                <p>年龄</p>
              </div>
            </div>
            <div class="item-panel">
              <div class="ico-panel">
                <img :src="zodiacSign.dragon" alt="" />
              </div>
              <div class="title-panel">
                <p>属龙</p>
              </div>
            </div>
          </div>
          <div class="row-panel">
            <div class="item-panel">
              <div class="ico-panel">
                <img :src="constellation.Aries" alt="" />
              </div>
              <div class="title-panel">
                <p>白羊座</p>
              </div>
            </div>
            <div class="item-panel">
              <div class="ico-panel">
                <img
                  :src="ageNumber.woman.four"
                  style="width: 20px; height: 30px"
                  alt=""
                />
                |
                <img
                  :src="ageNumber.woman.one"
                  alt=""
                  style="width: 10px; height: 20px"
                />
                <img
                  :src="ageNumber.woman.four"
                  alt=""
                  style="width: 10px; height: 20px"
                />
              </div>
              <div class="title-panel">
                <p>生日</p>
              </div>
            </div>
            <div class="item-panel"></div>
          </div>
        </div>
        <div class="text--data-panel">
          <div class="row-panel">
            <div class="left-panel">
              <p>UID</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.userId }}</p>
              <img
                src="../assets/img/list/profile_copy_normal@2x.png"
                height="32"
                width="32"
                alt=""
              />
            </div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>昵称</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.userName }}</p>
            </div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>备注</p>
            </div>
            <div class="right-panel"></div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>分组</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.groupName }}</p>
            </div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>手机</p>
            </div>
            <div class="right-panel">
              <p></p>
            </div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>职业</p>
            </div>
            <div class="right-panel">
              <p></p>
            </div>
          </div>
          <div class="row-panel">
            <div class="left-panel">
              <p>故乡</p>
            </div>
            <div class="right-panel">
              <p>
                {{ userInfo.country }}{{ userInfo.province }}{{ userInfo.city }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import { responseDataType } from "@/type/ComponentDataType";
export default defineComponent({
  name: "data-panel",
  props: {
    paramsId: String,
    groupName: String,
  },
  created() {
    // 页面创建时获取好友详情信息
    this.getUserDataByUid(this.paramsId);
  },
  data() {
    return {
      message: require("../assets/img/list/profile_sendmsg_normal@2x.png"),
      email: require("../assets/img/list/profile_email_normal@2x.png"),
      qzone: require("../assets/img/list/profile_qzone_normal@2x.png"),
      gender: {
        man: require("../assets/img/gender/gender_man@2x.png"),
        woman: require("../assets/img/gender/gender_woman@2x.png"),
      },
      ageNumber: {
        man: {
          zero: require("../assets/img/ageNumber/profile_age_num_0@2x.png"),
          one: require("../assets/img/ageNumber/profile_age_num_1@2x.png"),
          two: require("../assets/img/ageNumber/profile_age_num_2@2x.png"),
          three: require("../assets/img/ageNumber/profile_age_num_3@2x.png"),
          four: require("../assets/img/ageNumber/profile_age_num_4@2x.png"),
          five: require("../assets/img/ageNumber/profile_age_num_5@2x.png"),
          six: require("../assets/img/ageNumber/profile_age_num_6@2x.png"),
          seven: require("../assets/img/ageNumber/profile_age_num_7@2x.png"),
          eight: require("../assets/img/ageNumber/profile_age_num_8@2x.png"),
          nine: require("../assets/img/ageNumber/profile_age_num_9@2x.png"),
        },
        woman: {
          zero: require("../assets/img/ageNumber/profile_birth_num_0@2x.png"),
          one: require("../assets/img/ageNumber/profile_birth_num_1@2x.png"),
          two: require("../assets/img/ageNumber/profile_birth_num_2@2x.png"),
          three: require("../assets/img/ageNumber/profile_birth_num_3@2x.png"),
          four: require("../assets/img/ageNumber/profile_birth_num_4@2x.png"),
          five: require("../assets/img/ageNumber/profile_birth_num_5@2x.png"),
          six: require("../assets/img/ageNumber/profile_birth_num_6@2x.png"),
          seven: require("../assets/img/ageNumber/profile_birth_num_7@2x.png"),
          eight: require("../assets/img/ageNumber/profile_birth_num_8@2x.png"),
          nine: require("../assets/img/ageNumber/profile_birth_num_9@2x.png"),
        },
      },
      zodiacSign: {
        mouse: require("../assets/img/zodiacSign/zodiac_mouse@2x.png"),
        cow: require("../assets/img/zodiacSign/zodiac_cow@2x.png"),
        tiger: require("../assets/img/zodiacSign/zodiac_tiger@2x.png"),
        rabbit: require("../assets/img/zodiacSign/zodiac_rabbit@2x.png"),
        dragon: require("../assets/img/zodiacSign/zodiac_dragon@2x.png"),
        snake: require("../assets/img/zodiacSign/zodiac_snake@2x.png"),
        horse: require("../assets/img/zodiacSign/zodiac_horse@2x.png"),
        sheep: require("../assets/img/zodiacSign/zodiac_sheep@2x.png"),
        monkey: require("../assets/img/zodiacSign/zodiac_monkey@2x.png"),
        chicken: require("../assets/img/zodiacSign/zodiac_chicken@2x.png"),
        dog: require("../assets/img/zodiacSign/zodiac_dog@2x.png"),
        pig: require("../assets/img/zodiacSign/zodiac_pig@2x.png"),
      },
      constellation: {
        Aquarius: require("../assets/img/constellation/constellation_Aquarius@2x.png"),
        Aries: require("../assets/img/constellation/constellation_Aries@2x.png"),
        cancer: require("../assets/img/constellation/constellation_cancer@2x.png"),
        Capricorn: require("../assets/img/constellation/constellation_Capricorn@2x.png"),
        Gemini: require("../assets/img/constellation/constellation_Gemini@2x.png"),
        Leo: require("../assets/img/constellation/constellation_Leo@2x.png"),
        Libra: require("../assets/img/constellation/constellation_Libra@2x.png"),
        Pisces: require("../assets/img/constellation/constellation_Pisces@2x.png"),
        Sagittarius: require("../assets/img/constellation/constellation_Sagittarius@2x.png"),
        Scorpio: require("../assets/img/constellation/constellation_Scorpio@2x.png"),
        Taurus: require("../assets/img/constellation/constellation_Taurus@2x.png"),
        Virgo: require("../assets/img/constellation/constellation_Virgo@2x.png"),
      },
      userInfo: {
        avatarSrc: "",
        userName: "",
        userId: "",
        signature: "",
        bloodGroup: "",
        city: "",
        country: "",
        dateOfBirth: [],
        gender: 1,
        province: "",
        age: "",
        mouth: "",
        day: "",
      },
      zodiacSignField:["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"],
      ageNumberValue: [],
      zodiacSignValue:[]
    };
  },
  methods: {
    // 获取用户信息
    getUserDataByUid: function (userId: string) {
      if (_.isEmpty(userId)) {
        return false;
      }
      this.$api.websiteManageAPI
        .getUserDataByUid({ userId: userId })
        .then((res: responseDataType) => {
          console.log(res.data);
          //好友资料赋值
          this.userInfo.userId = userId;
          this.userInfo.gender = res.data.gender;
          this.userInfo.groupName = this.groupName;
          this.userInfo.userName = res.data.userName;
          this.userInfo.avatarSrc = res.data.avatarSrc;
          this.userInfo.signature = res.data.signature;
          this.userInfo.country = res.data.country;
          this.userInfo.province = res.data.province;
          this.userInfo.city = res.data.city;
          //分割数据为年月日
          this.dateOfBirth = res.data.dateOfBirth.split("-");
          //显示年龄
          this.manageAge();
          //显示生肖
        });
    },
    //处理年龄的数据
    manageAge() {
      this.age =
        Number(new Date().getFullYear()) + 1 - Number(this.dateOfBirth[0]) + "";
      this.age = this.age.split("").map((item: string) => Number(item));
      if (this.userInfo.gender == 1) {
        for (const key in this.ageNumber.woman) {
          this.ageNumberValue.push(this.ageNumber.woman[key]);
        }
        this.age[0] = this.ageNumberValue[this.age[0]];
        this.age[1] = this.ageNumberValue[this.age[1]];
      } else {
        for (const key in this.ageNumber.man) {
          this.ageNumberValue.push(this.ageNumber.man[key]);
        }
        this.age[0] = this.ageNumberValue[this.age[0]];
        this.age[1] = this.ageNumberValue[this.age[1]];
      }
      this.ageNumberValue = [];
    },
  },
  watch: {
    paramsId: function (val: string) {
      this.getUserDataByUid(val);
    },
  },
});
</script>

<style lang="scss" src="../assets/scss/data-panel.scss" scoped></style>

