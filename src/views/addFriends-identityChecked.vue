<template>
  <div class="addFriends-identityChecked-outer-mask">
    <div class="identityChecked-content" v-if="groupsData.length > 0">
      <div>{{ argUserName }}({{ argUserId }})</div>
      <div>
        <p>验证人需要验证您的身份，请输入您的验证信息：</p>
        <textarea name="文本域名称" rows="6" cols="6" style="resize:none">
        </textarea>
      </div>
      <div>
        <div>
          <span>分组：</span
          ><select name="" id=""
            ><option
              value="item.groupId"
              v-for="(item, index) in groupsData"
              :key="index"
              >{{ item.groupName }}</option
            >
          </select>
        </div>
        <div>
          <span>备注：</span>
          <input type="text" />
        </div>
      </div>
      <div>
        <input type="button" value="取消" />
        <input type="button" value="发送" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { responseDataType } from "@/type/ComponentDataType";
import { defineComponent } from "vue";
export default defineComponent({
  name: "addFriends-identityChecked",
  mounted() {
    this.groupsData = [];
    this.groupsList = [];
    this.$api.websiteManageAPI
      .getFriendsList({ userId: this.$store.state.userID })
      .then((res: responseDataType) => {
        res.data.forEach((item: any) => {
          if (item.childrenId) {
            this.groupsData.push({
              childrenId: item.childrenId,
              groupName: item.groupName
            });
            this.groupsList.push(item.childrenId);
          }
        });
        this.groupsList = [...new Set(this.groupsList)];
        for (let index = 0; index < this.groupsList.length; index++) {
          console.log(this.groupsList);
        }
      });
  },
  data() {
    return {
      groupsData: [],
      groupsList: []
    };
  },
  methods: {},
  props: {
    argUserName: String,
    argUserId: String
  }
});
</script>
<style
  scoped
  lang="scss"
  src="../assets/scss/addFriends-identityChecked.scss"
></style>
