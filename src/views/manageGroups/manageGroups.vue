<template>
  <moveSettings ref="move">
    <div
      class="manageGroups-content"
      @mousedown="alertDown($event)"
      @mousemove="alertMove($event)"
      @mouseup="alertUp"
      @blur="alertUp"
      ref="manageGroupsContent"
    >
      <div class="top-panel">
        <div class="top-panel-left">
          <div
            class="top-panel-left-icon"
            @mouseover="showLeftIco(true)"
            @mouseleave="showLeftIco(false)"
            @click.stop="removeManageGroupsAlert"
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
          <p v-if="manageGroupsArgs.typeName == 'addGroup'">插入分组</p>
          <p v-if="manageGroupsArgs.typeName == 'renameGroup'">分组重命名</p>
          <p v-if="manageGroupsArgs.typeName == 'delGroup'">删除分组</p>
        </div>
        <div class="top-panel-right"></div>
      </div>
      <template v-if="manageGroupsArgs.typeName != 'delGroup'">
        <div class="middle-panel">
          <p v-if="manageGroupsArgs.typeName == 'addGroup'">请输入分组名称：</p>
          <p v-if="manageGroupsArgs.typeName == 'renameGroup'">
            请输入分组重命名：
          </p>
          <input
            type="text"
            @mousemove.stop=""
            @mousedown.stop=""
            @mouseout.stop=""
            v-model="manageGroupData.groupName"
          />
        </div>
      </template>
      <template v-else>
        <div class="del-middle-panel">
          <p>确定删除({{ manageGroupsArgs.groupName }})该分组吗？</p>
        </div>
      </template>
      <div class="bottom-panel">
        <input type="button" value="取消" @click="removeManageGroupsAlert" />
        <input
          :disabled="sendInputState"
          ref="sendRequest"
          type="button"
          value="确定"
          @click="sendRequest"
        />
      </div></div
  ></moveSettings>
  <div v-if="promptAlert.state" class="sendRequestMessage">
    <div>
      <p>{{ promptAlert.massage }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import moveSettings from "@/components/common/moveAlert/moveSettings.vue";
import { responseDataType } from "@/type/ComponentDataType";
export default defineComponent({
  name: "manageGroups",
  components: {
    moveSettings
  },
  props: { manageGroupsArgs: Object },
  data() {
    return {
      leftIco: "none",
      manageGroupData: {},
      requesetArg: {},
      promptAlert: {
        massage: "",
        state: false
      },
      sendInputState: false,
      initGroupName: this.manageGroupsArgs.groupName
    };
  },
  mounted() {
    if (this.manageGroupsArgs.typeName != "addGroup") {
      this.manageGroupData = this.manageGroupsArgs;
    } else {
      this.manageGroupData.typeName = this.manageGroupsArgs.typeName;
    }
  },
  methods: {
    // 按下触发可拖曳事件
    alertDown: function(e: any) {
      this.$refs.move.alertDown(e, this.$refs.manageGroupsContent);
    },
    // 按下并持续触发可拖曳事件
    alertMove: function(e: any) {
      this.$refs.move.alertMove(e, this.$refs.manageGroupsContent);
    },
    // 可拖曳事件完成事件
    alertUp: function() {
      this.$refs.move.alertUp(this.$refs.manageGroupsContent);
    },
    // 判断关闭与最小化图标是否出现
    showLeftIco: function(status: boolean) {
      if (status) {
        this.leftIco = "block";
      } else {
        this.leftIco = "none";
      }
    },
    // 关闭分组管理弹框
    removeManageGroupsAlert() {
      this.$store.commit("updateManageGroupsStatus", false);
    },
    // 处理分组
    sendRequest() {
      if (this.manageGroupData.groupName != null) {
        if (this.manageGroupData.groupName.indexOf(" ") !== -1) {
          this.manageGroupData.groupName = this.manageGroupData.groupName.replace(
            /\s/g,
            ""
          );
        }

        if (this.manageGroupData.groupName.length > 0) {
          this.sendInputState = true;
          this.$refs.sendRequest.style.backgroundColor = "#EEE";
          this.$refs.sendRequest.style.color = "#666";
          if (this.manageGroupData.typeName == "addGroup") {
            this.addGroup();
          }
          if (this.manageGroupData.typeName == "delGroup") {
            this.delGroup();
          }
          if (this.manageGroupData.typeName == "renameGroup") {
            this.renameGroup();
          }
        } else {
          this.promptAlert.massage = "输入内容不能为空";
          this.promptAlert.state = true;
          setTimeout(() => {
            this.promptAlert.state = false;
          }, 3000);
          return;
        }
      } else {
        this.promptAlert.massage = "请先输入名称";
        this.promptAlert.state = true;
        setTimeout(() => {
          this.promptAlert.state = false;
        }, 3000);
        return;
      }
    },
    // 封装请求后行为
    reqResult(res: any, time: number, content: string) {
      // 首次请求为成功，有已同意，多次请求为失败，则为msg
      if (res.code == 0) {
        this.promptAlert.massage = content;
        this.promptAlert.state = true;
      } else {
        this.promptAlert.massage = res.msg;
        this.promptAlert.state = true;
      }
      // 请求成功后改变关闭验证列表弹窗状态，刷新获取最新好友信息
      setTimeout(() => {
        this.promptAlert.state = false;
        this.$router.go(0);
        this.removeManageGroupsAlert();
      }, time);
    },
    // 还原请求按钮初始样式
    styleInitButton(content: string) {
      this.promptAlert.state = true;
      this.promptAlert.massage = content;
      setTimeout(() => {
        this.promptAlert.state = false;
        this.$refs.sendRequest.style.backgroundColor = "#10baf3";
        this.$refs.sendRequest.style.color = "white";
        this.$refs.sendRequest.style.border = "#10baf3 solid 2px";
        this.sendInputState = false;
      }, 3000);
    },
    // 添加分组请求
    addGroup() {
      if (this.manageGroupData.groupName.length > 15) {
        this.styleInitButton("分组字段长度不能超过15个字");
        return;
      }
      if (
        this.manageGroupsArgs.verifySameName.includes(
          this.manageGroupData.groupName
        )
      ) {
        this.styleInitButton("该分组已有,请重新输入添加名");
        return;
      }
      this.requesetArg.groupName = this.manageGroupData.groupName;
      this.requesetArg.userId = this.$store.state.userID;
      this.$api.websiteManageAPI
        .getAddGroup(this.requesetArg)
        .then((res: responseDataType) => {
          this.reqResult(res, 3000, "新增好友分组成功");
        });
    },
    // 删除分组请求
    delGroup() {
      this.requesetArg.userId = this.$store.state.userID;
      this.requesetArg.groupId = this.manageGroupData.childrenId;
      this.$api.websiteManageAPI
        .updateDeleteGroup(this.requesetArg)
        .then((res: responseDataType) => {
          this.reqResult(res, 3000, "删除好友分组成功");
        });
    },
    // 分组重命名请求
    renameGroup() {
      if (this.manageGroupData.groupName.length > 15) {
        this.styleInitButton("分组字段长度不能超过15个字");
        this.manageGroupData.groupName = this.initGroupName;
        return;
      }
      if (
        this.manageGroupsArgs.verifySameName.includes(
          this.manageGroupData.groupName
        )
      ) {
        this.styleInitButton("该分组已有，请重新输入修改名");
        return;
      }
      this.requesetArg.groupId = this.manageGroupData.childrenId;
      this.requesetArg.groupName = this.manageGroupData.groupName;
      this.$api.websiteManageAPI
        .updateRenameGroupName(this.requesetArg)
        .then((res: responseDataType) => {
          this.reqResult(res, 3000, "重命名修改成功");
        });
    }
  }
});
</script>
<style
  scoped
  lang="scss"
  src="@/assets/scss/manageGroups/manageGroups.scss"
></style>
