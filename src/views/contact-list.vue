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
                            <img src="../assets/img/MyDevice@2x.png" alt="我的设备">
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
                            <img src="../assets/img/list/tchat_his_arrow_right@2x.png" alt="左箭头"/>
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
                            <img src="../assets/img/list/tchat_his_arrow_right@2x.png" alt="左箭头"/>
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
                <div class="row-panel" v-for="(item,index) in friendsList" :key="index">
                    <div class="main-content" @click="groupingStatus(index)">
                        <div class="icon-panel">
                            <img ref="groupArrow" src="../assets/img/list/tchat_his_arrow_right@2x.png" alt="左箭头"/>
                        </div>
                        <div class="name-panel">
                            <p>{{item.groupName}}</p>
                        </div>
                        <div class="quantity-panel">
                            <p>{{item.onlineUsers}}/{{item.totalPeople}}</p>
                        </div>
                    </div>
                    <!--好友列表-->
                    <div class="buddy-panel" ref="buddyList" style="display:none">
                        <div class="item-panel" v-for="(list,index) in item.friendsData" :key="index" tabindex="0">
                            <div class="main-panel" @click="getBuddyInfo(list.userId)">
                                <div class="head-img-panel">
                                    <img :src="list.avatarSrc" alt="用户头像">
                                </div>
                                <div class="nickname-panel">
                                    <!--昵称-->
                                    <div class="name-panel">
                                        {{list.username}}
                                    </div>
                                    <!--签名-->
                                    <div class="signature-panel">
                                        [{{list.onlineStatus?"在线":"离线"}}]{{list.signature}}
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
            <router-view name="dataPanel"></router-view>
        </div>
    </div>
</template>

<script src="../assets/js/contact-list.js"></script>

<style scoped lang="scss" src="../assets/scss/contact-list.scss"></style>