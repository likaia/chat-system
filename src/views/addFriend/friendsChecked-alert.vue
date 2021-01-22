<template>
  <moveSettings ref="move">
    <div
      class="friendsChecked-alert-content"
      @mousedown="alertDown($event)"
      @mousemove="alertMove($event)"
      @mouseup="alertUp"
      @blur="alertUp"
      @click.stop=""
      ref="identityCheckedContent"
    >
      <div class="top-panel">
        <div class="top-panel-left">
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco(true)"
            @mouseleave="showLeftIco(false)"
            @click.stop="closeAlert"
          >
            <img
              :style="{ display: leftIco }"
              src="@/assets/img/close.png"
              class="close-icon"
              alt=""
            />
          </div>
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco()"
            @mouseleave="showLeftIco()"
          >
            <img
              :style="{ display: leftIco }"
              class="min-icon"
              src="@/assets/img/min.png"
              alt=""
            />
          </div>
        </div>
        <div class="top-panel-center">
          好友验证信息
        </div>
        <div class="top-panel-right">
          <p>
            已过滤的通知
          </p>
          <div>
            <img
              @mouseover="ScheduleStutus(true)"
              @mouseout="ScheduleStutus(false)"
              ref="Schedule"
              :src="Schedule[0]"
              alt=""
            />
          </div>
        </div>
      </div>
      <div class="list-panel">
        <div
          v-for="(item, index) in friendCheckedDataList.friendsCheckedInfo"
          :key="item.userId"
        >
          <div class="create-time">
            {{ item.createTime }}
          </div>
          <div class="item-panel">
            <div>
              <div class="avatarSrc">
                <img :src="item.avatarSrc" alt="" />
              </div>
              <template v-if="!item.isSender">
                <div class="is-not-sender">
                  <p>
                    <span>{{ item.userName }}</span
                    >请求加为好友
                  </p>
                  <p><span>附言：</span>{{ item.verifyMessage }}</p>
                </div>
              </template>
              <template v-if="item.isSender">
                <div class="is-sender">
                  <p>
                    <span>{{ item.userName }}</span>
                  </p>
                  <p><span>附言：</span>等待验证信息</p>
                </div>
              </template>
              <template v-if="item.status == 0">
                <div class="status-argee">
                  <p :ref="setAgreeAdd">已同意</p>
                </div>
              </template>
              <template v-if="item.status == 1">
                <div class="status-undetermined" v-if="!item.isSender">
                  <div>
                    <p
                      class="selected-value"
                      :ref="setSelectedValue"
                      @click="showIdentityChecked(index)"
                    >
                      同意
                    </p>
                    <div
                      class="select-icon"
                      @click.stop="showSelectContent(index)"
                    >
                      <img
                        src="@/assets/img/list/MacQQ_icon_arrow_right_down@2x.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div
                    class="select-content"
                    :ref="setSelectedContent"
                    @mouseleave="leaveStyle(index)"
                  >
                    <div
                      class="select-value-agree"
                      @click="updateSelectedValue('同意', index)"
                      :ref="setArgee"
                    >
                      同意
                    </div>
                    <div
                      class="select-value-refuse"
                      @click="updateSelectedValue('拒绝', index)"
                      :ref="setRefuse"
                    >
                      拒绝
                    </div>
                  </div>
                </div>
                <div class="status-undetermined" v-if="item.isSender">
                  <div>
                    <p class="undetermined-checked" :ref="setRefuseAddChecked">
                      等待验证
                    </p>
                  </div>
                </div>
              </template>
              <template v-if="item.status == 2">
                <div class="status-refuse">
                  <p :ref="setRefuseAdd">已拒绝</p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </moveSettings>

  <div v-if="promptAlert.state" class="refuseRequestMessage">
    <div>
      <p>{{ promptAlert.massage }}</p>
    </div>
  </div>
  <addFriendIdentityChecked
    v-if="isChecked"
    :is-checked="isChecked"
    :arg-userName="argValue.argUserName"
    :arg-userId="argValue.argUserId"
    :arg-verify-message="argValue.argVerifyMessage"
    :arg-subId="argValue.argSubId"
    receiveChecked="receiveChecked"
    @no-show-identity-checked="noShowIdentityChecked(noShow)"
  />
</template>
<script lang="ts">
import { responseDataType } from "@/type/ComponentDataType";
import _ from "lodash";
import { defineComponent } from "vue";
import addFriendIdentityChecked from "./addFriends-identityChecked.vue";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
export default defineComponent({
  name: "friendsChecked-alert",
  components: {
    addFriendIdentityChecked,
    moveSettings
  },
  methods: {
    // 关闭弹窗框
    closeAlert() {
      this.$store.commit("updateFriendCheckedStatus", false);
    },
    // 待确定（status=1）时，同意选择的dom
    setArgee(el: Element) {
      this.selectData.argeeDom.push(el);
    },
    // 待确定（status=1）时，拒绝选择的dom
    setRefuse(el: Element) {
      this.selectData.refuseDom.push(el);
    },
    // 待确定（status=1）时，同意拒绝共同的dom
    setSelectedContent(el: Element) {
      this.selectData.selectedContentDom.push(el);
    },
    // 待确定（status=1）时，选择时的dom
    setSelectedValue(el: Element) {
      this.selectData.selectedValue.push(el);
    },
    // 已同意（status=0）时，选择后的dom
    setAgreeAdd(el: Element) {
      this.setSelectedValue(el);
      this.setSelectedContent(el);
      this.setRefuse(el);
      this.setArgee(el);
    },
    // 已拒绝（status=2）时，选择后的dom
    setRefuseAdd(el: Element) {
      this.setSelectedValue(el);
      this.setSelectedContent(el);
      this.setRefuse(el);
      this.setArgee(el);
    },
    // 发送者，待确定（status=1）时的状态的dom
    setRefuseAddChecked(el: Element) {
      this.setSelectedValue(el);
      this.setSelectedContent(el);
      this.setRefuse(el);
      this.setArgee(el);
    },
    // 关闭点击同意后，好友身份认证框（接收者）
    noShowIdentityChecked(noShow: boolean) {
      this.isChecked = noShow;
    },
    // 按下触发可拖曳事件
    alertDown: function(e: any) {
      this.$refs.move.alertDown(e, this.$refs.identityCheckedContent);
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      this.$refs.move.alertMove(e, this.$refs.identityCheckedContent);
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.$refs.move.alertUp(this.$refs.identityCheckedContent);
    },
    // 时间显示格式
    getTimeFormat() {
      this.friendCheckedDataList.friendsCheckedInfo.forEach((item: any) => {
        // 今年的时间格式显示
        if (
          Number(this.friendCheckedDataList.serverTime.split("-")[0]) -
            Number(item.createTime.trim().split("-")[0]) ==
          0
        ) {
          item.createTime = item.createTime.substr(
            item.createTime.indexOf("-") + 1,
            11
          );
        } else {
          // 往年的时间格式显示
          item.createTime =
            item.createTime.split(":")[0] + ":" + item.createTime.split(":")[1];
        }
      });
    },
    // 待确定（status=1）时，显示对应的选择内容
    showSelectContent(index: number) {
      this.selectData.selectedContentDom[index].style.display = "block";
    },
    // 待确定（status=1）时，更新选择后的内容
    updateSelectedValue(val: string, index: number) {
      this.selectData.selectedValue[index].innerHTML = val;
      this.selectData.selectedContentDom[index].style.display = "none";
    },
    // 待确定（status=1）时，做对应的验证
    showIdentityChecked(index: number) {
      // 同意时的验证，跳转到好友验证框，并传值做进一步的操作
      if (this.selectData.selectedValue[index].innerHTML.trim() == "同意") {
        this.isChecked = true;
        this.argValue.argUserName = this.friendCheckedDataList.friendsCheckedInfo[
          index
        ].userName;
        this.argValue.argUserId = this.friendCheckedDataList.friendsCheckedInfo[
          index
        ].userId;
        this.argValue.argVerifyMessage = this.friendCheckedDataList.friendsCheckedInfo[
          index
        ].verifyMessage;
        this.argValue.argSubId = this.friendCheckedDataList.friendsCheckedInfo[
          index
        ].subId;
      } else {
        // 不同意，直接拒绝，回到最初的好友列表页面并刷新
        this.isChecked = false;
        this.$api.websiteManageAPI
          .updateFriend({
            subId: this.friendCheckedDataList.friendsCheckedInfo[index].subId,
            status: 2
          })
          .then((res: responseDataType) => {
            // 首次请求为成功，显示已拒绝，多次请求为失败，则为msg
            if (res.code == 0) {
              this.promptAlert.massage = "已拒绝";
              this.promptAlert.state = true;
            } else {
              this.promptAlert.massage = res.msg;
              this.promptAlert.state = true;
            }
            // 请求成功后改变关闭验证列表弹窗状态，刷新获取最新好友信息
            setTimeout(() => {
              this.promptAlert.state = false;
              this.$router.go(0);
              this.closeAlert();
            }, 3000);
          });
      }
    },
    // 关闭待确定（status=1）时，选择同意或拒绝的dom
    leaveStyle(index: number) {
      this.selectData.selectedContentDom[index].style.display = "none";
    },
    // 垃圾桶图标的切换
    ScheduleStutus(status: boolean) {
      if (status) {
        this.$refs.Schedule.src = this.Schedule[1];
      } else {
        this.$refs.Schedule.src = this.Schedule[0];
      }
    },
    // 判断关闭与最小化图标是否出现
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
    }
  },
  props: {
    showCheckedAlert: Boolean,
    friendCheckedDataList: Object
  },
  data() {
    return {
      leftIco: "none",
      selectData: {
        selectedValue: [],
        argeeDom: [],
        refuseDom: [],
        selectedContentDom: []
      },
      isChecked: false,
      argValue: {
        argUserName: "",
        argUserId: "",
        argVerifyMessage: "",
        argSubId: 0
      },
      promptAlert: {
        message: "",
        state: false
      },
      Schedule: [
        require("@/assets/img/list/Schedule_delete@2x.png"),
        require("@/assets/img/list/Schedule_delete_hover@2x.png")
      ]
    };
  },
  // 显示时间
  mounted() {
    this.getTimeFormat();
  },
  // 更新dom的值
  beforeUpdate() {
    this.selectData.argeeDom = [];
    this.selectData.refuseDom = [];
    this.selectData.selectedContentDom = [];
    this.selectData.selectedValue = [];
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "close-checked-alert": (val: boolean) => {
      return !_.isNull(val);
    }
  }
});
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/addFriend/friendsChecked-alert.scss"
></style>
