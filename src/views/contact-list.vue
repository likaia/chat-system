<!--联系人选项卡-->
<template>
  <div class="contact-content">
    <!--列表-->
    <div class="list-panel">
      <!--加好友-->
      <div class="top-panel">
        <div class="add-friend-panel">
          <p>加好友</p>
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
          :key="index"
        >
          <div class="main-content" @click="groupingStatus(index)">
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
          <div class="buddy-panel" :ref="setGroupList" style="display:none">
            <div
              class="item-panel"
              v-for="(list, index) in item.friendsData"
              :key="index"
              tabindex="0"
            >
              <div class="main-panel" @click="getBuddyInfo(list.userId)">
                <div class="head-img-panel">
                  <img :src="list.avatarSrc" alt="用户头像" />
                </div>
                <div class="nickname-panel">
                  <!--昵称-->
                  <div class="name-panel">
                    {{ list.username }}
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
          </div>
        </div>
      </div>
    </div>
    <!--信息资料-->
    <div class="info-panel">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import {
  contactListDataType,
  friendsListType,
  friendsDataType
} from "@/type/ComponentDataType";

export default defineComponent({
  name: "contact-list",
  data(): contactListDataType<friendsListType<friendsDataType>> {
    return {
      friendsList: [
        {
          groupName: "我",
          totalPeople: 2,
          onlineUsers: 2,
          friendsData: [
            {
              username: "神奇的程序员",
              avatarSrc:
                "https://www.kaisir.cn/uploads/1ece3749801d4d45933ba8b31403c685touxiang.jpeg",
              signature: "今天的努力只为未来",
              onlineStatus: true,
              userId: "c04618bab36146e3a9d3b411e7f9eb8f"
            },
            {
              username: "admin",
              avatarSrc:
                "https://www.kaisir.cn/uploads/40ba319f75964c25a7370e3909d347c5admin.jpg",
              signature: "",
              onlineStatus: true,
              userId: "32ee06c8380e479b9cd4097e170a6193"
            }
          ]
        },
        {
          groupName: "我的朋友",
          totalPeople: 0,
          onlineUsers: 0,
          friendsData: []
        },
        {
          groupName: "我的家人",
          totalPeople: 0,
          onlineUsers: 0,
          friendsData: []
        },
        {
          groupName: "我的同事",
          totalPeople: 0,
          onlineUsers: 0,
          friendsData: []
        }
      ],
      groupArrow: [],
      groupList: []
    };
  },
  mounted: function() {
    if (!_.isEmpty(this.$route.params.userId)) {
      this.$router.push({ name: "list" }).then();
    }
  },
  methods: {
    // 获取列表好友信息
    getBuddyInfo: function(userId: string) {
      this.$router
        .push({ name: "dataPanel", params: { userId: userId } })
        .then();
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
      if (!_.isEmpty(this.$route.params.userId)) {
        this.$router.push({ name: "list" }).then();
      }
      // 获取transform的值
      let transformVal = this.groupArrow[index].style.transform;
      if (!_.isEmpty(transformVal)) {
        // 截取rotate的值
        transformVal = transformVal.substring(7, 9);
        // 判断分组列表是否展开
        if (parseInt(transformVal) === 90) {
          this.groupArrow[index].style.transform = "rotate(0deg)";
          this.groupList[index].style.display = "none";
        } else {
          this.groupArrow[index].style.transform = "rotate(90deg)";
          this.groupList[index].style.display = "block";
        }
      } else {
        // 第一次点击添加transform属性，旋转90度
        this.groupArrow[index].style.transform = "rotate(90deg)";
        this.groupList[index].style.display = "block";
      }
    }
  },
  beforeUpdate() {
    this.groupArrow = [];
    this.groupList = [];
  }
});
</script>

<style scoped lang="scss" src="../assets/scss/contact-list.scss"></style>
