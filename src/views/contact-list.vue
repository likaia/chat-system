<!--联系人选项卡-->
<template>
  <div class="contact-content">
    <!--列表-->
    <div class="list-panel">
      <!--加好友-->
      <div class="top-panel">
        <div class="add-friend-panel" @click="addFriendsInfoSearch">
          <p>加好友</p>
        </div>
      </div>
      <!--好友验证-->
      <template v-if="showFriendCheckedContent">
        <div
          v-if="friendsCheckedList.friendsCheckedInfo.length > 0"
          class="friend-checked-panel"
          ref="friendCheckedPanel"
          @click="friendsCheckedAlert"
        >
          <div class="clear-checked-icon">
            <img
              src="@/assets/img/list/AIO_Tab_Close_Normal@2x.png"
              alt=""
              @click.stop="clearFriendCheckedPanel"
            />
          </div>
          <div class="validate-icon">
            <div>
              <img
                src="@/assets/img/list/aio_buddy_validate_icon@2x.png"
                alt=""
              />
            </div>
          </div>
          <div class="checked-userName">
            <p>
              好友验证信息
            </p>
            <p>我是 {{ friendsCheckedList.newest.userName }}</p>
          </div>
          <div class="checked-Time">
            <p>
              {{ friendsCheckedList.newest.date }}
            </p>
            <div
              v-if="
                friendsCheckedList.newest.count < 10 &&
                  friendsCheckedList.newest.count > 0
              "
            >
              <span>
                {{ friendsCheckedList.newest.count }}
              </span>
            </div>
            <div
              class="count-ten"
              v-if="
                friendsCheckedList.newest.count >= 10 &&
                  friendsCheckedList.newest.count < 99
              "
            >
              <span>
                {{ friendsCheckedList.newest.count }}
              </span>
            </div>
            <div
              class="count-hundred"
              v-if="friendsCheckedList.newest.count > 99"
            >
              <span>
                99+
              </span>
            </div>
          </div>
        </div>
      </template>
      <!--设备组-->
      <div class="group-panel">
        <div class="title-panel">
          <p class="title">设备</p>
        </div>
        <div class="device-panel" tabindex="0">
          <div class="main-panel">
            <div class="icon-panel">
              <img src="../assets/img/MyDevice@2x.png" alt="我的设备" />
            </div>
            <div class="name-panel">
              <p>我的手机</p>
            </div>
          </div>
        </div>
      </div>
      <!--群聊组-->
      <div class="group-panel">
        <div class="title-panel">
          <p class="title">群聊</p>
        </div>
        <div class="row-panel">
          <div class="main-content">
            <div class="icon-panel">
              <img
                src="../assets/img/list/tchat_his_arrow_right@2x.png"
                alt="左箭头"
              />
            </div>
            <div class="name-panel">
              <p>群组</p>
            </div>
            <div class="quantity-panel">
              <p>0</p>
            </div>
          </div>
        </div>
        <div class="row-panel">
          <div class="main-content">
            <div class="icon-panel">
              <img
                src="../assets/img/list/tchat_his_arrow_right@2x.png"
                alt="左箭头"
              />
            </div>
            <div class="name-panel">
              <p>多人聊天</p>
            </div>
            <div class="quantity-panel">
              <p>0</p>
            </div>
          </div>
        </div>
      </div>
      <!--好友组-->
      <div class="group-panel">
        <div class="title-panel">
          <p class="title">好友</p>
        </div>
        <div
          class="row-panel"
          v-for="(item, index) in friendsList"
          :key="item.childrenId"
        >
          <div
            class="main-content"
            @click="groupingStatus(index)"
            v-right-click:[{childrenId:item.childrenId,groupName:item.groupName}]="
              rightMenuObj
            "
          >
            <div class="icon-panel">
              <img
                :ref="setGroupArrow"
                src="../assets/img/list/tchat_his_arrow_right@2x.png"
                alt="左箭头"
              />
            </div>
            <div class="name-panel">
              <p>{{ item.groupName }}</p>
            </div>
            <div class="quantity-panel">
              <p>{{ item.onlineUsers }}/{{ item.totalPeople }}</p>
            </div>
          </div>
          <!--好友列表-->
          <div class="buddy-panel" :ref="setGroupList" style="display: none">
            <template v-for="(list, index) in item.friendsData" :key="index">
              <div
                class="item-panel"
                tabindex="0"
                v-if="list.userId !== undefined"
              >
                <div
                  v-right-click:[{childrenId:item.childrenId,avatarSrc:list.avatarSrc,userId:list.userId,userName:list.userName}]="
                    rightMenuFriend
                  "
                  @dblclick.stop="
                    singleChat({
                      buddyAvatarSrc: list.avatarSrc,
                      type: 0,
                      buddyId: list.userId,
                      buddyName: list.userName
                    })
                  "
                  class="main-panel"
                  @click="
                    getBuddyInfo(list.userId, list.groupName, list.remarks)
                  "
                >
                  <div class="head-img-panel">
                    <img :src="list.avatarSrc" alt="用户头像" />
                  </div>
                  <div class="nickname-panel">
                    <!--昵称-->
                    <div class="name-panel">
                      <span>{{ list.userName }}</span>
                      <span v-if="list.remarks">({{ list.remarks }})</span>
                    </div>
                    <!--签名-->
                    <div class="signature-panel">
                      [{{ list.onlineStatus ? "在线" : "离线" }}]{{
                        list.signature
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!--信息资料-->
    <div class="info-panel">
      <img
        src="@/assets/img/list/contact_non_selected@2x.png"
        width="280"
        height="280"
        alt="空组件"
        v-if="widgetIsNull"
      />
      <data-panel
        :params-id="paramsID"
        :group-name="groupName"
        :remarks="remarks"
        v-else
      ></data-panel>
    </div>
    <!--添加好友弹框-->
    <teleport to="body">
      <addFriendsList v-if="getSendData"></addFriendsList>
      <friendsCheckedAlert
        v-if="getCheckedData"
        :showCheckedAlert="showCheckedAlert"
        :friendCheckedDataList="friendsCheckedList"
        @close-checked-alert="closeCheckedAlert(noShow)"
      ></friendsCheckedAlert>
      <manageGroups
        v-if="getManageGroupsData"
        :manageGroupsArgs="manageGroupsArgs"
      ></manageGroups>
      <manageFriend
        v-if="getManageFriendData"
        :manageFriendArgs="manageFriendArgs"
      ></manageFriend>
    </teleport>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import dataPanel from "@/components/data-panel.vue";
import addFriendsList from "./addFriend/addFriends-list.vue";
import friendsCheckedAlert from "./addFriend/friendsChecked-alert.vue";
import manageGroups from "./manageGroups/manageGroups.vue";
import manageFriend from "./manageFriend/manageFriend.vue";
import {
  contactListDataType,
  friendsListType,
  friendsDataType,
  responseDataType,
  addTotalMessageType
} from "@/type/ComponentDataType";
import { rightMenuType } from "vue-right-click-menu-next/dist/lib/type/pluginsType";
export default defineComponent({
  name: "contact-list",
  data(): contactListDataType<friendsListType<friendsDataType>> {
    return {
      friendsList: [],
      groupArrow: [],
      groupList: [],
      paramsID: "",
      widgetIsNull: true,
      groupName: "",
      remarks: "",
      friendsCheckedList: {
        serverTime: "",
        friendsCheckedInfo: [],
        newest: {
          time: "",
          userName: "",
          date: "",
          count: 0
        }
      },
      showFriendCheckedContent: true,
      showCheckedAlert: false,
      manageGroupsArgs: {},
      manageFriendArgs: {}
    };
  },
  components: {
    dataPanel,
    addFriendsList,
    friendsCheckedAlert,
    manageGroups,
    manageFriend
  },
  methods: {
    // 获取列表好友信息
    getBuddyInfo: function(
      paramsID: string,
      groupName: string,
      remarks: string
    ) {
      // id为空时显示空组件状态
      if (_.isEmpty(paramsID)) {
        this.widgetIsNull = true;
        return false;
      }
      // 显示好友详情组件
      this.widgetIsNull = false;
      this.paramsID = paramsID;
      this.groupName = groupName;
      this.remarks = remarks;
    },
    // 设置分组箭头Dom
    setGroupArrow: function(el: Element) {
      this.groupArrow.push(el);
    },
    // 设置分组列表dom
    setGroupList: function(el: Element) {
      this.groupList.push(el);
    },
    // 列表状态切换
    groupingStatus: function(index: number) {
      // 获取transform的值
      let transformVal = this.groupArrow[index].style.transform;
      if (!_.isEmpty(transformVal)) {
        // 截取rotate的值
        transformVal = transformVal.substring(7, 9);
        // 判断分组列表是否展开
        if (parseInt(transformVal) === 90) {
          this.groupArrow[index].style.transform = "rotate(0deg)";
          this.groupList[index].style.display = "none";
          // 好友详情组件显示为空
          this.widgetIsNull = true;
        } else {
          this.groupArrow[index].style.transform = "rotate(90deg)";
          this.groupList[index].style.display = "block";
        }
      } else {
        // 第一次点击添加transform属性，旋转90度
        this.groupArrow[index].style.transform = "rotate(90deg)";
        this.groupList[index].style.display = "block";
      }
    },
    // 添加好友弹框
    addFriendsInfoSearch: function() {
      this.$store.commit("updateAddFriendStatus", true);
    },
    // 获取好友验证人员信息
    getToBeVerifiedList() {
      this.friendsCheckedList.newest.count = 0;
      this.$api.websiteManageAPI
        .getToBeVerifiedList()
        .then((res: responseDataType) => {
          // 请求数组不为0
          if (res.data.verifiedList.length > 0) {
            this.friendsCheckedList.serverTime = res.data.serverTime;
            this.friendsCheckedList.friendsCheckedInfo = res.data.verifiedList;
            // 待验证的次数
            for (
              let index = 0;
              index < this.friendsCheckedList.friendsCheckedInfo.length;
              index++
            ) {
              if (
                this.friendsCheckedList.friendsCheckedInfo[index].status == 1
              ) {
                this.friendsCheckedList.newest.count += 1;
              }
            }
            // 时间由新到旧
            if (this.friendsCheckedList.friendsCheckedInfo.length > 1) {
              this.friendsCheckedList.friendsCheckedInfo = this.forwardRankingDate(
                this.friendsCheckedList.friendsCheckedInfo,
                "createTime"
              );
            }
            // 显示最新好友添加时间及最新好友添加名称
            if (this.friendsCheckedList.newest.count == 0) {
              this.getAddTime(0);
              this.friendsCheckedList.newest.userName = this.friendsCheckedList.friendsCheckedInfo[0].userName;
            } else {
              for (
                let index = 0;
                index < this.friendsCheckedList.friendsCheckedInfo.length;
                index++
              ) {
                const element = this.friendsCheckedList.friendsCheckedInfo[
                  index
                ];
                if (element.status == 1) {
                  this.getAddTime(index);
                  this.friendsCheckedList.newest.userName = this.friendsCheckedList.friendsCheckedInfo[
                    index
                  ].userName;
                  break;
                }
              }
            }
          } else {
            return;
          }
        });
    },
    // 获取好友列表人员
    getFriendsList() {
      this.$api.websiteManageAPI
        .getFriendsList({ userId: this.$store.state.userID })
        .then((res: responseDataType) => {
          // 遍历获取分组名称
          res.data.forEach((item: friendsDataType) => {
            this.groupList.push(
              JSON.stringify({
                childrenId: item.childrenId,
                groupName: item.groupName
              })
            );
          });
          // 去重相同分组
          this.groupList = [...new Set(this.groupList)];
          // 获取好友列表人员在线信息
          for (let index = 0; index < this.groupList.length; index++) {
            // 将字符串转为对象
            this.groupList[index] = JSON.parse(this.groupList[index]);
            // 处理好友列表数据
            this.friendsList.push({
              groupName: this.groupList[index].groupName,
              totalPeople: 0,
              onlineUsers: 0,
              friendsData: [],
              childrenId: this.groupList[index].childrenId
            });
            // 处理好友陈列数据
            res.data.forEach((item: friendsDataType) => {
              if (this.groupList[index].childrenId == item.childrenId) {
                this.friendsList[index].friendsData.push({
                  userName: item.userName,
                  avatarSrc: item.avatarSrc,
                  signature: item.signature,
                  onlineStatus: item.onlineStatus,
                  userId: item.userId,
                  groupName: item.groupName,
                  remarks: item.remarks,
                  childrenId: item.childrenId
                });
                // 获取对应的每个好友分组总人数
                if (item.userId) {
                  this.friendsList[index].totalPeople++;
                }
              }
            });
          }
          // 获取对应的每个好友分组在线人员
          for (let index = 0; index < this.friendsList.length; index++) {
            this.friendsList[index].friendsData.forEach(
              (item: friendsDataType) => {
                if (item.onlineStatus) {
                  this.friendsList[index].onlineUsers++;
                }
              }
            );
          }
        });
    },
    // 封装的日期排序方法
    forwardRankingDate(data: any, p: string) {
      for (let i = 0; i < data.length - 1; i++) {
        for (let j = 0; j < data.length - 1 - i; j++) {
          if (Date.parse(data[j][p]) < Date.parse(data[j + 1][p])) {
            const temp = data[j];
            data[j] = data[j + 1];
            data[j + 1] = temp;
          }
        }
      }
      return data;
    },
    // 清除好友验证框
    clearFriendCheckedPanel() {
      this.showFriendCheckedContent = false;
    },
    // 好友验证信息框的时间显示
    getAddTime(index: number) {
      if (
        Math.floor(
          Date.parse(this.friendsCheckedList.serverTime) /
            (1 * 24 * 3600 * 1000)
        ) -
          Math.floor(
            Date.parse(
              this.friendsCheckedList.friendsCheckedInfo[index].createTime
            ) /
              (1 * 24 * 3600 * 1000)
          ) ==
        0
      ) {
        if (
          Number(
            this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
              this.friendsCheckedList.friendsCheckedInfo[
                index
              ].createTime.indexOf(":") - 2,
              2
            )
          ) < 12
        ) {
          this.friendsCheckedList.newest.date =
            "上午" +
            this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
              this.friendsCheckedList.friendsCheckedInfo[
                index
              ].createTime.indexOf(":") - 2,
              5
            );
        } else if (
          Number(
            this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
              this.friendsCheckedList.friendsCheckedInfo[
                index
              ].createTime.indexOf(":") - 2,
              2
            )
          ) < 18
        ) {
          this.friendsCheckedList.newest.date =
            "下午" +
            this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
              this.friendsCheckedList.friendsCheckedInfo[
                index
              ].createTime.indexOf(":") - 2,
              5
            );
        } else {
          this.friendsCheckedList.newest.date =
            "晚上" +
            this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
              this.friendsCheckedList.friendsCheckedInfo[
                index
              ].createTime.indexOf(":") - 2,
              5
            );
        }
      } else if (
        Math.floor(
          Date.parse(this.friendsCheckedList.serverTime) /
            (1 * 24 * 3600 * 1000)
        ) -
          Math.floor(
            Date.parse(
              this.friendsCheckedList.friendsCheckedInfo[index].createTime
            ) /
              (1 * 24 * 3600 * 1000)
          ) ==
        1
      ) {
        this.friendsCheckedList.newest.date =
          "昨天" +
          this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
            this.friendsCheckedList.friendsCheckedInfo[
              index
            ].createTime.indexOf(":") - 2,
            5
          );
      } else if (
        Math.floor(
          Date.parse(this.friendsCheckedList.serverTime) /
            (1 * 24 * 3600 * 1000)
        ) -
          Math.floor(
            Date.parse(
              this.friendsCheckedList.friendsCheckedInfo[index].createTime
            ) /
              (1 * 24 * 3600 * 1000)
          ) >
        1
      ) {
        this.friendsCheckedList.newest.date =
          this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
            this.friendsCheckedList.friendsCheckedInfo[
              index
            ].createTime.indexOf("-") + 1,
            5
          ) +
          " " +
          this.friendsCheckedList.friendsCheckedInfo[index].createTime.substr(
            this.friendsCheckedList.friendsCheckedInfo[
              index
            ].createTime.indexOf(":") - 2,
            5
          );
      }
    },
    // 出现好友添加时选择框
    friendsCheckedAlert() {
      this.$store.commit("updateFriendCheckedStatus", true);
    },
    // 关闭好友添加时选择框
    closeCheckedAlert(noShow: boolean) {
      this.showCheckedAlert = noShow;
    },
    // 跳转到单聊
    singleChat(params: addTotalMessageType) {
      this.$api.messageListAPI
        .addMessage(params)
        .then((res: responseDataType) => {
          if (res.code == 0) {
            this.$router.push({
              name: "message",
              params: { userId: params.buddyId }
            });
          }
        });
    }
  },
  // 请求好友列表与验证消息
  mounted() {
    this.getToBeVerifiedList();
    this.getFriendsList();
    this.$options.sockets.onmessage = (res: any) => {
      const obj = JSON.parse(res.data);

      if (obj.code == 1) {
        this.$router.go(0);
      }
    };
  },
  // 页面更新前晴空分组列表dom
  beforeUpdate() {
    this.groupArrow = [];
    this.groupList = [];
  },
  unmounted() {
    // 移除监听
    this.$options.sockets.onmessage = null;
  },
  // 更新最新添加好友弹窗和验证弹窗状态
  computed: {
    getSendData() {
      return this.$store.state.closeFriendAllAlert;
    },
    getCheckedData() {
      return this.$store.state.closeFriendCheckedAlert;
    },
    getManageGroupsData() {
      return this.$store.state.closeManageGroupsAlert;
    },
    getManageFriendData() {
      return this.$store.state.closeManageFriendAlert;
    },
    rightMenuObj(): rightMenuType {
      // 右键菜单对象，菜单内容和处理事件
      const obj: rightMenuType = {
        this: this,
        text: [
          "添加分组",
          {
            status: this.friendsList.length > 1 ? false : true,
            content: "删除分组"
          },
          "分组重命名"
        ],
        handler: {
          addGroup(parameter: any) {
            console.log(obj.this);
            obj.this.manageGroupsArgs = {};
            obj.this.$store.commit("updateManageGroupsStatus", true);
            if (parameter.childrenId > 0) {
              obj.this.manageGroupsArgs = parameter;
              obj.this.manageGroupsArgs.verifySameName = [];
              obj.this.friendsList.forEach((element: any) => {
                obj.this.manageGroupsArgs.verifySameName.push(
                  element.groupName
                );
              });
              obj.this.manageGroupsArgs.typeName = "addGroup";
            }
            console.log("添加分组事件", parameter);
          },
          delGroup(parameter: any) {
            obj.this.manageGroupsArgs = {};
            obj.this.$store.commit("updateManageGroupsStatus", true);
            if (parameter.childrenId > 0) {
              obj.this.manageGroupsArgs = parameter;

              obj.this.manageGroupsArgs.typeName = "delGroup";
            }
            console.log("删除分组事件", parameter);
          },
          renameGroup(parameter: any) {
            obj.this.manageGroupsArgs = {};
            obj.this.$store.commit("updateManageGroupsStatus", true);
            if (parameter.childrenId > 0) {
              obj.this.manageGroupsArgs = parameter;
              obj.this.manageGroupsArgs.verifySameName = [];
              obj.this.friendsList.forEach((element: any) => {
                obj.this.manageGroupsArgs.verifySameName.push(
                  element.groupName
                );
              });
              obj.this.manageGroupsArgs.typeName = "renameGroup";
            }
            console.log("分组重命名事件", parameter);
          }
        }
      };
      return obj;
    },
    rightMenuFriend(): rightMenuType {
      // 右键菜单对象，菜单内容和处理事件
      const obj: rightMenuType = {
        this: this,
        text: [
          "发送即时消息",
          "查看聊天记录",
          "在单聊窗口打开",
          "移动联系人至",
          "删除好友"
        ],
        handler: {
          sendInfo(parameter: any) {
            obj.this.singleChat({
              buddyAvatarSrc: parameter.avatarSrc,
              type: 0,
              buddyId: parameter.userId,
              buddyName: parameter.userName
            });
          },
          baseInfoFriend(parameter: any) {
            console.log("查看聊天记录事件", parameter);
          },
          singleChat(parameter: any) {
            obj.this.singleChat({
              buddyAvatarSrc: parameter.avatarSrc,
              type: 0,
              buddyId: parameter.userId,
              buddyName: parameter.userName
            });
          },
          removeFriend(parameter: any) {
            console.log("移动联系人至事件", parameter);
          },
          delFriend(parameter: any) {
            obj.this.manageFriendArgs = {};
            obj.this.$store.commit("updateManageFriendStatus", true);
            obj.this.manageFriendArgs = parameter;
            obj.this.manageFriendArgs.typeName = "delFriend";
            console.log("删除好友事件", parameter);
          }
        }
      };
      return obj;
    }
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/contact-list.scss"></style>
