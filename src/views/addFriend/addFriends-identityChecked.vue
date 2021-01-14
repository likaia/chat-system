<template>
  <moveSettings ref="move">
    <div
      class="identityChecked-content"
      @mousedown="alertDown($event)"
      @mousemove="alertMove($event)"
      @mouseup="alertUp"
      @blur="alertUp"
      ref="identityCheckedContent"
    >
      <div class="userInfo">{{ argUserName }}({{ argUserId }})</div>
      <template v-if="receiveChecked == 'sendChecked'">
        <div class="checkedInfo">
          <p>
            验证人需要验证您的身份，请输入您的验证信息：
          </p>
          <textarea
            v-model="checkedArgIntput.verifyMessage"
            @mousemove.stop=""
            @mousedown.stop=""
            @mouseout.stop=""
          >
          </textarea>
        </div>
      </template>
      <template v-if="receiveChecked == 'receiveChecked'">
        <div class="checkedInfo">
          <p>
            验证信息：
          </p>
          <textarea v-model="receiveArea.message" disabled> </textarea>
        </div>
      </template>
      <div class="groupInfo">
        <div v-if="groupsData.length > 0" class="selectedGroupInfo">
          <span>分组：</span>
          <select name="" id="" v-model="selectedValue">
            <option
              :value="item.childrenId"
              v-for="(item, index) in groupsData"
              :key="index"
              >{{ item.groupName }}</option
            >
          </select>
        </div>
        <div class="remarksInfo">
          <span>备注：</span>
          <input
            v-model="checkedArgIntput.remarks"
            type="text"
            @mousemove.stop=""
            @mousedown.stop=""
            @mouseout.stop=""
          />
        </div>
      </div>

      <div class="buttonInfo">
        <input
          class="cencelCheckedButton"
          type="button"
          value="取消"
          @click="removeIdentityChecked"
        />
        <template v-if="receiveChecked == 'sendChecked'">
          <input
            class="sendCheckedButton"
            type="button"
            value="发送"
            @click="sendCheckedSuccess()"
            :disabled="sendInputState"
            ref="sendRequest"
          />
        </template>
        <template v-if="receiveChecked == 'receiveChecked'">
          <input
            class="sendCheckedButton"
            type="button"
            value="同意"
            @click="receiveCheckedSuccess()"
            :disabled="sendInputState"
            ref="sendRequest"
          />
        </template>
      </div>
    </div>
    <div v-if="promptAlert.state" class="sendRequestMessage">
      <div>
        <p>{{ promptAlert.massage }}</p>
      </div>
    </div>
  </moveSettings>
</template>
<script lang="ts">
import { responseDataType } from "@/type/ComponentDataType";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
import _ from "lodash";
import { defineComponent } from "vue";
export default defineComponent({
  name: "addFriends-identityChecked",
  components: {
    moveSettings
  },
  // 获取分组信息并渲染页面
  mounted() {
    // 初始化分组信息
    this.groupsData = [];
    if (this.receiveChecked == "receiveChecked") {
      this.receiveArea.message = this.argVerifyMessage;
    }
    // 发送请求获取分组信息
    this.$api.websiteManageAPI
      .getFriendsList({ userId: this.$store.state.userID })
      .then((res: responseDataType) => {
        res.data.forEach((item: any) => {
          // 获取成功后才可以点击发送请求
          if (res.data.length > 0) {
            this.sendInputState = false;
            this.$refs.sendRequest.style.backgroundColor = "#10BAF3";
            this.$refs.sendRequest.style.color = "white";
          }
          // 遍历并获取分组信息
          if (item.childrenId) {
            this.groupsData.push(
              JSON.stringify({
                childrenId: item.childrenId,
                groupName: item.groupName
              })
            );
          }
        });
        // 去除相同的分组信息
        this.groupsData = [...new Set(this.groupsData)];
        // 解析成对象
        for (let index = 0; index < this.groupsData.length; index++) {
          this.groupsData[index] = JSON.parse(this.groupsData[index]);
        }
        // 绑定默认选择的内容
        this.selectedValue = this.groupsData[0].childrenId;
      });
  },
  data() {
    return {
      groupsData: [],
      selectedValue: 0,
      checkedArg: {},
      checkedArgIntput: {
        remarks: "",
        verifyMessage: ""
      },
      sendInputState: true,
      promptAlert: {
        massage: "",
        state: false
      },
      receiveArea: {
        verifyMessage: ""
      }
    };
  },
  emits: {
    // vue3中建议对所有emit事件进行验证
    "no-show-identity-checked": (val: boolean) => {
      return !_.isNull(val);
    }
  },
  methods: {
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
    // 关闭身份验证弹窗
    removeIdentityChecked() {
      this.$emit("no-show-identity-checked", !this.show);
    },
    // 发送者验证身份请求
    sendCheckedSuccess() {
      // 请求时禁止点击
      this.sendInputState = true;
      this.$refs.sendRequest.style.backgroundColor = "#EEE";
      this.$refs.sendRequest.style.color = "#666";
      // 必要参数好友id和分组id
      this.checkedArg.userId = this.argUserId;
      this.checkedArg.groupId = this.selectedValue;
      // 可选参数备注和验证信息
      if (this.checkedArgIntput.remarks) {
        this.checkedArg.remarks = this.checkedArgIntput.remarks;
      }
      if (this.checkedArgIntput.verifyMessage) {
        this.checkedArg.verifyMessage = this.checkedArgIntput.verifyMessage;
      }
      // 发送请求
      this.$api.websiteManageAPI
        .addFriend(this.checkedArg)
        .then((res: responseDataType) => {
          // 首次请求为成功，有data，多次请求为失败，则为msg
          if (res.code == 0) {
            this.promptAlert.massage = res.data;
            this.promptAlert.state = true;
          } else {
            this.promptAlert.massage = res.msg;
            this.promptAlert.state = true;
          }
          // 请求成功后改变所以添加好友弹窗状态，并关闭
          setTimeout(() => {
            this.promptAlert.state = false;
            this.$router.go(0);
            this.$store.commit("updateAddFriendStatus", false);
          }, 3000);
        });
    },
    // 接收者验证身份请求
    receiveCheckedSuccess() {
      // 请求时禁止点击
      this.sendInputState = true;
      this.$refs.sendRequest.style.backgroundColor = "#EEE";
      this.$refs.sendRequest.style.color = "#666";
      // 必要参数好友id和分组id和状态
      this.checkedArg.groupId = this.selectedValue;
      this.checkedArg.subId = this.argSubId;
      this.checkedArg.status = 0;
      // 可选参数备注
      if (this.checkedArgIntput.remarks) {
        this.checkedArg.remarks = this.checkedArgIntput.remarks;
      }
      // 发送请求
      this.$api.websiteManageAPI
        .updateFriend(this.checkedArg)
        .then((res: responseDataType) => {
          // 首次请求为成功，有已同意，多次请求为失败，则为msg
          if (res.code == 0) {
            this.promptAlert.massage = "已同意";
            this.promptAlert.state = true;
          } else {
            this.promptAlert.massage = res.msg;
            this.promptAlert.state = true;
          }

          // 请求成功后改变关闭验证列表弹窗状态，刷新获取最新好友信息
          setTimeout(() => {
            this.promptAlert.state = false;
            this.$router.go(0);
            this.$store.commit("updateFriendCheckedStatus", false);
          }, 3000);
        });
    }
  },
  props: {
    argUserName: String,
    argUserId: String,
    isChecked: Boolean,
    receiveChecked: String,
    argVerifyMessage: String,
    argSubId: Number
  }
});
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/addFriend/addFriends-identityChecked.scss"
></style>
