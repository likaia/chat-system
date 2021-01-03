<template>
  <div class="addFriends-identityChecked-outer-mask">
    <div
      style="width: 100vw;height: 100vh;display:flex;align-items:center;justify-content: center; position:unset;z-index:-999;"
    >
      <div
        class="identityChecked-content"
        @mousedown="alertDown($event)"
        @mousemove="alertMove($event)"
        @mouseup="alertUp"
        @blur="alertUp"
        ref="identityCheckedContent"
      >
        <div class="userInfo">{{ argUserName }}({{ argUserId }})</div>
        <div class="checkedInfo">
          <p>
            验证人需要验证您的身份，请输入您的验证信息：
          </p>
          <textarea v-model="checkedArgIntput.verifyMessage"> </textarea>
        </div>
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
            <input v-model="checkedArgIntput.remarks" type="text" />
          </div>
        </div>
        <div class="buttonInfo">
          <input
            class="cencelCheckedButton"
            type="button"
            value="取消"
            @click="removeIdentityChecked"
          />
          <input
            class="sendCheckedButton"
            type="button"
            value="发送"
            @click="checkedSuccess()"
            :disabled="sendInputState"
            ref="sendRequest"
          />
        </div>
      </div>
      <div v-if="promptAlert.state" class="sendRequestMessage">
        <div>
          <p>{{ promptAlert.massage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { responseDataType } from "@/type/ComponentDataType";
import _ from "lodash";
import { defineComponent } from "vue";
export default defineComponent({
  name: "addFriends-identityChecked",
  // 获取分组信息并渲染页面
  mounted() {
    // 初始化分组信息
    this.groupsData = [];
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
      moveAlertData: {
        x: 0,
        y: 0,
        l: 0,
        t: 0,
        moveX: 0,
        moveY: 0,
        movel: 0,
        movet: 0,
        isDown: false
      },
      checkedArg: {
        userId: "",
        groupId: ""
      },
      checkedArgIntput: {
        remarks: "",
        verifyMessage: ""
      },
      sendInputState: true,
      promptAlert: {
        massage: "",
        state: false
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
      // 获取初始时当前框距离对应边界的大小位置和当前鼠标左键点下时事件的位置
      this.moveAlertData.x = e.clientX;
      this.moveAlertData.y = e.clientY;
      this.moveAlertData.t = this.$refs.identityCheckedContent.offsetTop;
      this.moveAlertData.l = this.$refs.identityCheckedContent.offsetLeft;
      this.moveAlertData.isDown = true;
      // 将鼠标图标换成可拖动
      this.$refs.identityCheckedContent.style.cursor = "move";
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      // 防止未按下事件触发时，可获取并持续触发可拖曳事件
      if (this.moveAlertData.isDown == false) {
        return;
      }
      // 获取移动时最新的鼠标位位置
      this.moveAlertData.moveX = e.clientX;
      this.moveAlertData.moveY = e.clientY;
      // 移动时最新位置 = 移动时最新的鼠标位位置 - （初始时的鼠标大小位置 - 初始时鼠标左键点下时事件的位置）
      this.moveAlertData.movel =
        this.moveAlertData.moveX -
        (this.moveAlertData.x - this.moveAlertData.l);
      this.moveAlertData.movet =
        this.moveAlertData.moveY -
        (this.moveAlertData.y - this.moveAlertData.t);
      // 对左边界进行边界处理

      if (this.moveAlertData.movel < 0) {
        this.moveAlertData.movel = 0;
      }
      // 对右边界进行边界处理
      if (
        this.moveAlertData.movel +
          this.$refs.identityCheckedContent.offsetWidth >
        window.innerWidth
      ) {
        this.moveAlertData.movel =
          window.innerWidth - this.$refs.identityCheckedContent.offsetWidth;
      }
      // 对下边界进行边界处理
      if (
        this.moveAlertData.movet +
          this.$refs.identityCheckedContent.offsetHeight >
        window.innerHeight
      ) {
        this.moveAlertData.movet =
          window.innerHeight - this.$refs.identityCheckedContent.offsetHeight;
      }
      // 对上边界进行边界处理
      if (this.moveAlertData.movet < 0) {
        this.moveAlertData.movet = 0;
      }
      // 渲染最新位置
      this.$refs.identityCheckedContent.style.left =
        this.moveAlertData.movel + "px";
      this.$refs.identityCheckedContent.style.top =
        this.moveAlertData.movet + "px";
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.moveAlertData.isDown = false;
      this.$refs.identityCheckedContent.style.cursor = "default";
    },
    // 关闭身份验证弹窗
    removeIdentityChecked() {
      this.$emit("no-show-identity-checked", !this.show);
    },
    // 验证身份请求
    checkedSuccess() {
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
          if (res.data) {
            this.promptAlert.massage = res.data;
            this.promptAlert.state = true;
          } else {
            this.promptAlert.massage = res.msg;
            this.promptAlert.state = true;
          }
          // 请求成功后改变所以添加好友弹窗状态，并关闭
          setTimeout(() => {
            this.promptAlert.state = false;
            this.$store.commit("updateAddFriendStatus", false);
          }, 3000);
        });
    }
  },
  props: {
    argUserName: String,
    argUserId: String,
    isChecked: Boolean
  }
});
</script>
<style
  scoped
  lang="scss"
  src="../assets/scss/addFriends-identityChecked.scss"
></style>
