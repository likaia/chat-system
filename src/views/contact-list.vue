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
      <div
        style="width: 100%;
    height: 70px;
    list-style: none;
    background: #fdfdfd;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;"
      >
        <div>
          <img
            src="@/assets/img/list/AIO_Tab_Close_Normal@2x.png"
            alt=""
            style="width:18px;height:18px;margin-left: 4px;"
          />
        </div>
        <div
          style="width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;"
        >
          <div>
            <img
              src="@/assets/img/list/aio_buddy_validate_icon@2x.png"
              style="width:38px;height:38px;"
              alt=""
            />
          </div>
        </div>
        <div
          style="width: 35%;
    min-width: 75px;
    height: 40px;"
        >
          <p
            style="font-size: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; font-weight:bold; "
          >
            好友验证信息
          </p>
          <p
            style="color: #7b7b7b;
    font-size: 12px;
      overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 50px;
    "
          >
            我是测试一号2
          </p>
        </div>
        <div
          style="min-width: 61px;
    width: 28%;
    height: 40px;
    font-size: 13px;
    color: #7b7b7b;
    position: relative;
    right: 3px;
    "
        >
          <p
            style=" overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;"
          >
            上午10:42
          </p>
          <div
            style="width:18px;height:18px;border-radius:10px;position:absolute;right:0;bottom: 0;display: flex;
    justify-content: center;background:red;color:white;"
          >
            <span>
              9
            </span>
          </div>
        </div>
      </div>
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
            v-right-click="rightMenuObj"
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
    </teleport>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import dataPanel from "@/components/data-panel.vue";
import addFriendsList from "./addFriends-list.vue";
import {
  contactListDataType,
  friendsListType,
  friendsDataType,
  responseDataType
} from "@/type/ComponentDataType";
// import data from "@/api/index.ts"
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
      rightMenuObj: {
        text: ["添加分组", "删除分组", "分组重命名"],
        handler: {
          addGroup() {
            console.log("添加分组事件");
          },
          delGroup() {
            console.log("删除分组事件");
          },
          renameGroup() {
            console.log("分组重命名事件");
          }
        }
      }
    };
  },
  components: {
    dataPanel,
    addFriendsList
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
    }
  },
  mounted() {
    this.$api.websiteManageAPI
      .getToBeVerifiedList()
      .then((res: responseDataType) => {
        console.log(res.data);
      });
    // 获取好友列表人员
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
  // 页面更新前晴空分组列表dom
  beforeUpdate() {
    this.groupArrow = [];
    this.groupList = [];
  },
  // 更新最新添加好友弹窗状态
  computed: {
    getSendData() {
      return this.$store.state.closeFriendAllAlert;
    }
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/contact-list.scss"></style>
