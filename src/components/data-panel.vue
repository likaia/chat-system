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
            <div
              class="item-panel"
              @click="
                singleChat({
                  buddyAvatarSrc: userInfo.avatarSrc,
                  type: 0,
                  buddyId: userInfo.userId,
                  buddyName: userInfo.userName
                })
              "
            >
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
            <div
              class="item-panel"
              v-if="userInfo.gender === 1 || userInfo.gender === 0"
            >
              <div class="ico-panel" v-if="userInfo.gender === 1">
                <img :src="gender.woman" alt="" />
              </div>
              <div class="ico-panel" v-else>
                <img :src="gender.man" alt="" />
              </div>
              <div class="title-panel">
                <p>性别</p>
              </div>
            </div>
            <div class="item-panel" v-if="userInfo.age">
              <div class="ico-panel">
                <img
                  :src="item"
                  v-for="(item, index) in userInfo.age"
                  :key="index"
                  style="width: 20px; height: 30px"
                  alt=""
                />
              </div>
              <div class="title-panel">
                <p>年龄</p>
              </div>
            </div>
            <div
              class="item-panel"
              v-if="JSON.stringify(userInfo.zodiacSign) !== '{}'"
            >
              <div class="ico-panel">
                <img :src="userInfo.zodiacSign.zodiacSignSrc" alt="" />
              </div>
              <div class="title-panel">
                <p>属{{ userInfo.zodiacSign.zodiacSignName }}</p>
              </div>
            </div>
          </div>
          <div class="row-panel">
            <div
              class="item-panel"
              v-if="JSON.stringify(userInfo.constellation) !== '{}'"
            >
              <div class="ico-panel">
                <img :src="userInfo.constellation.constellationSrc" alt="" />
              </div>
              <div class="title-panel">
                <p>{{ userInfo.constellation.constellationName }}座</p>
              </div>
            </div>
            <div class="item-panel" v-if="userInfo.mouth && userInfo.day">
              <div class="ico-panel">
                <img
                  v-for="(item, index) in userInfo.mouth"
                  :key="index"
                  :src="item"
                  style="width: 20px; height: 30px"
                  alt=""
                />
                |
                <img
                  v-for="(item, index) in userInfo.day"
                  :key="index"
                  :src="item"
                  alt=""
                  style="width: 10px; height: 20px"
                />
              </div>
              <div class="title-panel">
                <p>生日</p>
              </div>
            </div>
            <div class="item-panel" v-if="userInfo.blood">
              <div class="ico-panel">
                <img
                  :src="userInfo.blood"
                  style="width: 30px; height: 30px"
                  alt=""
                />
              </div>
              <div class="title-panel">
                <p>血型</p>
              </div>
            </div>
          </div>
        </div>
        <div class="text--data-panel">
          <div class="row-panel" v-if="userInfo.userId">
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
          <div class="row-panel" v-if="userInfo.userName">
            <div class="left-panel">
              <p>昵称</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.userName }}</p>
            </div>
          </div>
          <div class="row-panel" v-if="userInfo.remarks">
            <div class="left-panel">
              <p>备注</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.remarks }}</p>
            </div>
          </div>
          <div class="row-panel" v-if="userInfo.groupName">
            <div class="left-panel">
              <p>分组</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.groupName }}</p>
            </div>
          </div>
          <div class="row-panel" v-if="userInfo.contactNumber">
            <div class="left-panel">
              <p>手机</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.contactNumber }}</p>
            </div>
          </div>
          <div class="row-panel" v-if="userInfo.occupation">
            <div class="left-panel">
              <p>职业</p>
            </div>
            <div class="right-panel">
              <p>{{ userInfo.occupation }}</p>
            </div>
          </div>
          <div
            class="row-panel"
            v-if="userInfo.country || userInfo.province || userInfo.city"
          >
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
import {
  addTotalMessageType,
  responseDataType
} from "@/type/ComponentDataType";
export default defineComponent({
  name: "data-panel",
  props: {
    paramsId: String,
    groupName: String,
    remarks: String
  },
  created() {
    // 页面创建时获取好友详情信息
    this.getUserDataByUid(this.paramsId);
  },
  data() {
    return {
      message: this.getImageUrl("list/profile_sendmsg_normal@2x.png"),
      email: this.getImageUrl("list/profile_email_normal@2x.png"),
      qzone: this.getImageUrl("list/profile_qzone_normal@2x.png"),
      gender: {
        man: this.getImageUrl("gender/gender_man@2x.png"),
        woman: this.getImageUrl("gender/gender_woman@2x.png")
      },
      ageNumber: {
        man: {
          zero: this.getImageUrl("ageNumber/profile_age_num_0@2x.png"),
          one: this.getImageUrl("ageNumber/profile_age_num_1@2x.png"),
          two: this.getImageUrl("ageNumber/profile_age_num_2@2x.png"),
          three: this.getImageUrl("ageNumber/profile_age_num_3@2x.png"),
          four: this.getImageUrl("ageNumber/profile_age_num_4@2x.png"),
          five: this.getImageUrl("ageNumber/profile_age_num_5@2x.png"),
          six: this.getImageUrl("ageNumber/profile_age_num_6@2x.png"),
          seven: this.getImageUrl("ageNumber/profile_age_num_7@2x.png"),
          eight: this.getImageUrl("ageNumber/profile_age_num_8@2x.png"),
          nine: this.getImageUrl("ageNumber/profile_age_num_9@2x.png")
        },
        woman: {
          zero: this.getImageUrl("ageNumber/profile_birth_num_0@2x.png"),
          one: this.getImageUrl("ageNumber/profile_birth_num_1@2x.png"),
          two: this.getImageUrl("ageNumber/profile_birth_num_2@2x.png"),
          three: this.getImageUrl("ageNumber/profile_birth_num_3@2x.png"),
          four: this.getImageUrl("ageNumber/profile_birth_num_4@2x.png"),
          five: this.getImageUrl("ageNumber/profile_birth_num_5@2x.png"),
          six: this.getImageUrl("ageNumber/profile_birth_num_6@2x.png"),
          seven: this.getImageUrl("ageNumber/profile_birth_num_7@2x.png"),
          eight: this.getImageUrl("ageNumber/profile_birth_num_8@2x.png"),
          nine: this.getImageUrl("ageNumber/profile_birth_num_9@2x.png")
        }
      },
      zodiacSign: {
        monkey: this.getImageUrl("zodiacSign/zodiac_monkey@2x.png"),
        chicken: this.getImageUrl("zodiacSign/zodiac_chicken@2x.png"),
        dog: this.getImageUrl("zodiacSign/zodiac_dog@2x.png"),
        pig: this.getImageUrl("zodiacSign/zodiac_pig@2x.png"),
        mouse: this.getImageUrl("zodiacSign/zodiac_mouse@2x.png"),
        cow: this.getImageUrl("zodiacSign/zodiac_cow@2x.png"),
        tiger: this.getImageUrl("zodiacSign/zodiac_tiger@2x.png"),
        rabbit: this.getImageUrl("zodiacSign/zodiac_rabbit@2x.png"),
        dragon: this.getImageUrl("zodiacSign/zodiac_dragon@2x.png"),
        snake: this.getImageUrl("zodiacSign/zodiac_snake@2x.png"),
        horse: this.getImageUrl("zodiacSign/zodiac_horse@2x.png"),
        sheep: this.getImageUrl("zodiacSign/zodiac_sheep@2x.png")
      },
      constellation: {
        Capricorn: this.getImageUrl(
          "constellation/constellation_Capricorn@2x.png"
        ), // 摩羯座
        Aquarius: this.getImageUrl(
          "constellation/constellation_Aquarius@2x.png"
        ), // 水瓶座
        Pisces: this.getImageUrl("constellation/constellation_Pisces@2x.png"), // 双鱼座
        Aries: this.getImageUrl("constellation/constellation_Aries@2x.png"), // 白羊座
        Taurus: this.getImageUrl("constellation/constellation_Taurus@2x.png"), // 金牛座
        Gemini: this.getImageUrl("constellation/constellation_Gemini@2x.png"), // 双子座
        Cancer: this.getImageUrl("constellation/constellation_cancer@2x.png"), // 巨蟹座
        Leo: this.getImageUrl("constellation/constellation_Leo@2x.png"), // 狮子座
        Virgo: this.getImageUrl("constellation/constellation_Virgo@2x.png"), // 处女座
        Libra: this.getImageUrl("constellation/constellation_Libra@2x.png"), // 天平座
        Scorpio: this.getImageUrl("constellation/constellation_Scorpio@2x.png"), // 天蝎座
        Sagittarius: this.getImageUrl(
          "constellation/constellation_Sagittarius@2x.png"
        ) // 射手座
      },
      bloods: {
        A: this.getImageUrl("blood/blood_A@2x.png"),
        AB: this.getImageUrl("blood/blood_AB@2x.png"),
        B: this.getImageUrl("blood/blood_B@2x.png"),
        O: this.getImageUrl("blood/blood_O@2x.png"),
        Other: this.getImageUrl("blood/blood_other@2x.png")
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
        occupation: "",
        province: "",
        age: "",
        mouth: "",
        day: "",
        zodiacSign: {},
        constellation: {},
        blood: "",
        remarks: "",
        contactNumber: ""
      },
      ageNumberOfAgeValue: [],
      zodiacSignValue: {
        zodiacSignName: "",
        zodiacSignSrc: [],
        zodiacSignField: [
          "猴",
          "鸡",
          "狗",
          "猪",
          "鼠",
          "牛",
          "虎",
          "兔",
          "龙",
          "蛇",
          "马",
          "羊"
        ]
      },
      constellationValue: {
        constellationName: "",
        constellationSrc: [],
        constellationFieldData:
          "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯",
        constellationDay: [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22]
      },
      ageNumberOfBrithdayMouthValue: [],
      ageNumberOfBrithdayDayValue: []
    };
  },
  methods: {
    // 获取用户信息
    getUserDataByUid: function(userId: string) {
      if (_.isEmpty(userId)) {
        return false;
      }
      this.$api.websiteManageAPI
        .getUserDataByUid({ userId: userId })
        .then((res: responseDataType) => {
          // 好友资料赋值
          this.userInfo.userId = userId;
          this.userInfo.gender = res.data.gender;
          this.userInfo.groupName = this.groupName;
          this.userInfo.userName = res.data.userName;
          this.userInfo.avatarSrc = res.data.avatarSrc;
          this.userInfo.signature = res.data.signature;
          this.userInfo.country = res.data.country;
          this.userInfo.province = res.data.province;
          this.userInfo.city = res.data.city;
          this.userInfo.occupation = res.data.occupation;
          this.userInfo.blood = res.data.bloodGroup;
          this.userInfo.remarks = this.remarks;
          this.userInfo.contactNumber = res.data.contactNumber;
          // 分割数据为年月日
          this.dateOfBirth = [];
          this.userInfo.zodiacSign = {};
          this.userInfo.constellation = {};
          this.userInfo.age = "";
          this.userInfo.mouth = "";
          this.userInfo.day = "";
          if (res.data.dateOfBirth != null) {
            this.dateOfBirth = res.data.dateOfBirth.split("-");
            // 显示年龄
            this.manageAge();
            // 显示生肖
            this.manageAgeZodiacSign();
            // 显示星座
            this.manageConstellation(
              Number(this.dateOfBirth[1]),
              Number(this.dateOfBirth[2])
            );
            // 显示生日的月份
            this.manageBrithdayMouth(Number(this.dateOfBirth[1]));
            // 显示生日的日期
            this.manageBrithdayDay(Number(this.dateOfBirth[2]));
            // 显示血型
            this.manageBlood(this.userInfo.blood);
          }
        });
    },
    // 跳转到单聊
    singleChat(params: addTotalMessageType) {
      console.log(params);
      this.$api.messageListAPI
        .addMessage(params)
        .then((res: responseDataType) => {
          if (res.code == 0) {
            this.$router.push({
              path: "/index",
              params: { userId: params.buddyId }
            });
          }
        });
    },
    getImageUrl(fileName: string) {
      return new URL(`/src/assets/img/${fileName}`, import.meta.url).href;
    },
    // 处理年龄的数据
    manageAge() {
      this.ageNumberOfAgeValue = [];
      this.userInfo.age =
        Number(new Date().getFullYear()) + 1 - Number(this.dateOfBirth[0]) + "";
      this.userInfo.age = this.userInfo.age
        .split("")
        .map((item: string) => Number(item));
      if (this.userInfo.gender == 1) {
        for (const key in this.ageNumber.woman) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.woman, key)) {
            this.ageNumberOfAgeValue.push(this.ageNumber.woman[key]);
          }
        }
      } else {
        for (const key in this.ageNumber.man) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.man, key)) {
            this.ageNumberOfAgeValue.push(this.ageNumber.man[key]);
          }
        }
      }
      this.userInfo.age.forEach((item: number, index: number) => {
        this.userInfo.age[index] = this.ageNumberOfAgeValue[
          this.userInfo.age[index]
        ];
      });
    },
    // 处理生肖的数据
    manageAgeZodiacSign() {
      this.zodiacSignValue.zodiacSignSrc = [];
      this.zodiacSignValue.zodiacSignName = this.zodiacSignValue.zodiacSignField[
        Number(this.dateOfBirth[0]) % 12
      ];
      for (const key in this.zodiacSign) {
        // 判断当前遍历到的属性是否存在
        if (Object.prototype.hasOwnProperty.call(this.zodiacSign, key)) {
          this.zodiacSignValue.zodiacSignSrc.push(this.zodiacSign[key]);
        }
      }
      this.zodiacSignValue.zodiacSignSrc = this.zodiacSignValue.zodiacSignSrc[
        Number(this.dateOfBirth[0]) % 12
      ];
      this.userInfo.zodiacSign = this.zodiacSignValue;
    },
    // 处理星座数据
    manageConstellation(mouth: number, day: number) {
      this.constellationValue.constellationSrc = [];
      // 字段对应的值
      this.constellationValue.constellationName = this.constellationValue.constellationFieldData.substr(
        mouth * 2 -
          (day < this.constellationValue.constellationDay[mouth - 1] ? 2 : 0),
        2
      );
      for (const key in this.constellation) {
        // 判断当前遍历到的属性是否存在
        if (Object.prototype.hasOwnProperty.call(this.constellation, key)) {
          this.constellationValue.constellationSrc.push(
            this.constellation[key]
          );
        }
      }
      // 当月的星座的判断小于该节点为该星座，否则是下一个月的星座
      if (day < this.constellationValue.constellationDay[mouth - 1]) {
        this.constellationValue.constellationSrc = this.constellationValue.constellationSrc[
          mouth - 1
        ];
      } else {
        this.constellationValue.constellationSrc = this.constellationValue.constellationSrc[
          mouth
        ];
      }
      this.userInfo.constellation = this.constellationValue;
    },
    // 处理生日的月份数据
    manageBrithdayMouth(mouth: number) {
      this.ageNumberOfBrithdayMouthValue = [];
      this.userInfo.mouth = mouth + "";
      this.userInfo.mouth = this.userInfo.mouth
        .split("")
        .map((item: string) => Number(item));

      if (this.userInfo.gender == 1) {
        for (const key in this.ageNumber.woman) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.woman, key)) {
            this.ageNumberOfBrithdayMouthValue.push(this.ageNumber.woman[key]);
          }
        }
      } else {
        for (const key in this.ageNumber.man) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.man, key)) {
            this.ageNumberOfBrithdayMouthValue.push(this.ageNumber.man[key]);
          }
        }
      }
      this.userInfo.mouth.forEach((item: number, index: number) => {
        this.userInfo.mouth[index] = this.ageNumberOfBrithdayMouthValue[
          this.userInfo.mouth[index]
        ];
      });
      console.log(this.userInfo.mouth);
    },
    // 处理生日的日期数据
    manageBrithdayDay(day: number) {
      this.ageNumberOfBrithdayDayValue = [];
      this.userInfo.day = day + "";
      this.userInfo.day = this.userInfo.day
        .split("")
        .map((item: string) => Number(item));

      if (this.userInfo.gender == 1) {
        for (const key in this.ageNumber.woman) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.woman, key)) {
            this.ageNumberOfBrithdayDayValue.push(this.ageNumber.woman[key]);
          }
        }
      } else {
        for (const key in this.ageNumber.man) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.ageNumber.man, key)) {
            this.ageNumberOfBrithdayDayValue.push(this.ageNumber.man[key]);
          }
        }
      }
      this.userInfo.day.forEach((item: number, index: number) => {
        this.userInfo.day[index] = this.ageNumberOfBrithdayDayValue[
          this.userInfo.day[index]
        ];
      });
    },
    // 处理血型
    manageBlood(blood: string) {
      for (const key in this.bloods) {
        if (key == blood) {
          // 判断当前遍历到的属性是否存在
          if (Object.prototype.hasOwnProperty.call(this.bloods, key)) {
            this.userInfo.blood = this.bloods[key];
          }
          break;
        }
        if (blood == undefined) {
          this.userInfo.blood = this.bloods["Other"];
        }
      }
    }
  },
  watch: {
    paramsId: function(val: string) {
      this.getUserDataByUid(val);
    }
  }
});
</script>
<style lang="scss" src="../assets/scss/data-panel.scss" scoped></style>
