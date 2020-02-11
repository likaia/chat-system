<!--公用组件：消息内容展示，实现群聊和单聊业务-->
<template>
    <div id="mainContent">
        <!--图片查看插件-->
        <div class="images" v-viewer="{movable: false}" style="display: none">
            <img v-for="src in images" :src="src" :key="src">
        </div>
        <div class="top-panel" ref="topPanel">
            <div class="title-panel">
                <p>当前在线人数: {{onlineUsers}}</p>
                <!--在线设备类型-->
                <!--<div class="equipmentType">
                    <img :src="this.resourceObj.phoneNormal" alt="">
                </div>-->
            </div>
            <div class="operate-panel">
                <div class="ico-panel">
                    <div ref="createDisSrcPanel" class="item-panel" @mouseenter="createDisEventFun('hover')"
                         @mouseleave="createDisEventFun('leave')" @click="createDisEventFun('click')">
                        <img :src="createDisSrc" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!--消息显示-->
        <div class="messages-panel" ref="messagesContainer">
            <div class="row-panel" v-for="item in senderMessageList" :key="item.msgId">
                <!--发送者消息样式-->
                <div class="sender-panel" v-if="item.userID===userID">
                    <!--昵称展示-->
                    <div class="user-name-panel sender">
                        <p>{{item.username}}</p>
                    </div>
                    <!--消息-->
                    <div class="msg-body">
                        <!--消息尾巴-->
                        <div class="tail-panel">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-zbds30duihuakuangyou" color="#dce7dc"></use>
                            </svg>
                        </div>
                        <!--消息内容-->
                        <p v-html="item.msgText" @click="viewLargerImage($event)"/>
                    </div>
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="item.avatarSrc" alt="">
                    </div>
                </div>
                <!--对方消息样式-->
                <div class="otherSide-panel" v-else>
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="item.avatarSrc" alt="">
                    </div>
                    <!--昵称展示-->
                    <div class="user-name-panel sender">
                        <p>{{item.username}}</p>
                    </div>
                    <!--消息-->
                    <div class="msg-body">
                        <!--消息尾巴-->
                        <div class="tail-panel">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-zbds30duihuakuangzuo"></use>
                            </svg>
                        </div>
                        <!--消息内容-->
                        <p v-html="item.msgText" @click="viewLargerImage($event)"/>
                    </div>
                </div>
            </div>
        </div>
        <!--用户输入模块-->
        <div class="user-input-panel" @click="getEditableDivFocus()">
            <div class="toolbar-panel">
                <div class="item-panel" v-for="item in toolbarList" :key="item.info">
                    <img class="emoticon" :src="require(`../assets/img/${item.src}`)"
                         @mouseenter="toolbarSwitch('hover',$event,item.src,item.hover,item.down,item.name)"
                         @mouseleave="toolbarSwitch('leave',$event,item.src,item.hover,item.down,item.name)"
                         @mousedown="toolbarSwitch('down',$event,item.src,item.hover,item.down,item.name)"
                         @mouseup="toolbarSwitch('up',$event,item.src,item.hover,item.down,item.name)" :alt="item.info">
                </div>
                <div class="send-panel" ref="sendPanel" @click="mobileSend()">
                    <p>发送</p>
                </div>
            </div>
            <div id="msgInputContainer" class="input-panel" ref="msgInputContainer" @keydown.enter.exact="sendMessage($event)"
                 contenteditable="true" spellcheck="false"></div>
            <!--表情面板-->
            <div class="emoticon-panel" :style="{display: emoticonShowStatus}" ref="emoticonPanel">
                <div class="row-panel">
                    <div class="item-panel" v-for="item in this.emojiList" :key="item.info">
                        <img :src="require(`../assets/img/emoji/${item.src}`)" :alt="item.info"
                             @mouseover="emojiConversion($event,'over',item.src,item.hover,item.info)"
                             @mouseleave="emojiConversion($event,'leave',item.src,item.hover,item.info)"
                             @click="emojiConversion($event,'click',item.src,item.hover,item.info)">
                    </div>
                </div>
                <div class="ico-panel"></div>
            </div>
        </div>
    </div>

</template>

<script src="../assets/js/message-display.js"></script>

<style lang="scss" src="../assets/scss/message-display.scss" scoped></style>
