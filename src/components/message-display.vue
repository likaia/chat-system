<template>
    <div id="mainContent">
        <div class="top-panel">
            <div class="title-panel">
                <p>用户id: {{userId}}</p>
                <!--在线设备类型-->
                <div class="equipmentType">
                    <img :src="this.resourceObj.phoneNormal" alt="">
                </div>
            </div>
            <div class="operate-panel">
                <div class="ico-panel">
                    <div class="item-panel" @mouseenter="createDisEventFun('hover')"
                         @mouseleave="createDisEventFun('leave')" @click="createDisEventFun('click')">
                        <img :src="createDisSrc" alt="">
                    </div>
                </div>
            </div>
        </div>
        <!--消息显示-->
        <div class="messages-panel">
            <div class="row-panel">
                <!--对方消息样式-->
                <div class="otherSide-panel">
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="this.resourceObj.groupMsgImg" alt="">
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
                        <p>新文件注意查收</p>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <!--对方消息样式-->
                <div class="otherSide-panel">
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="this.resourceObj.groupMsgImg" alt="">
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
                        <p>新文件注意查收</p>
                    </div>
                </div>
            </div>
            <div class="row-panel">
                <!--发送者消息样式-->
                <div class="sender-panel">
                    <!--消息-->
                    <div class="msg-body">
                        <!--消息尾巴-->
                        <div class="tail-panel">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-zbds30duihuakuangyou"></use>
                            </svg>
                        </div>
                        <!--消息内容-->
                        <p>已收到 👌</p>

                    </div>
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="this.resourceObj.avatarImg" alt="">
                    </div>
                </div>
            </div>

        </div>

        <!--用户输入模块-->
        <div class="user-input-panel">
            <div class="toolbar-panel">
                <div class="item-panel">
                    <img class="emoticon" :src="resourceObj.toolbarBarIco.emoticon" @mouseenter="displayExpression('hover')" @mouseleave="displayExpression('leave')" @mousedown="displayExpression('down')" @mouseup="displayExpression('up')" alt="">
                </div>
                <div class="item-panel">
                    <img :src="resourceObj.toolbarBarIco.screenCaptureNormal" alt="">
                </div>
                <div class="item-panel">
                    <img :src="resourceObj.toolbarBarIco.shakeNormal" alt="">
                </div>
                <div class="item-panel">
                    <img :src="resourceObj.toolbarBarIco.filesNormal" alt="">
                </div>
                <div class="item-panel">
                    <img :src="resourceObj.toolbarBarIco.phoneNormal" alt="">
                </div>
                <div class="item-panel">
                    <img :src="resourceObj.toolbarBarIco.historyNormal" alt="">
                </div>
            </div>
            <div class="input-panel">
                <textarea @keydown.enter.exact="sendMessage($event)" v-model="messageContent"></textarea>
            </div>
            <!--表情面板-->
            <div class="emoticon-panel" :style="{display: emoticonShowStatus}">
                <div class="row-panel">
                    <div class="item-panel" v-for="item in this.emojiList" :key="item.info">
                        <img :src="require('../assets/img/emoji/'+item.src)" :alt="item.info">
                    </div>
                </div>
                <div class="ico-panel"></div>
            </div>
        </div>
    </div>

</template>

<script>
    import emoji from '../assets/json/emoji';
    export default {
        name: "message-display",
        data() {
            return {
                userId: this.$route.params.userId,
                createDisSrc: require("../assets/img/titlebar_function_createDis_normal@2x.png"),
                resourceObj: {
                    createDisNormal: require("../assets/img/titlebar_function_createDis_normal@2x.png"),
                    createDisHover: require("../assets/img/titlebar_function_createDis_hover@2x.png"),
                    createDisClick: require("../assets/img/titlebar_function_createDis_normal_p@2x.png"),
                    phoneNormal: require("../assets/img/phone_normal_ap@2x.png"),
                    groupMsgImg: require("../assets/img/group-msg-img.png"),
                    avatarImg: require("../assets/img/avatar.jpg"),
                    msgImgTest: require("../assets/img/msg-img-test.gif"),
                    msgImgTestB: require("../assets/img/msg-img-testB.gif"),
                    toolbarBarIco: {
                        emoticon: require("../assets/img/toolbar_emoticon_normal@2x.png"),
                        emoticonNormal: require("../assets/img/toolbar_emoticon_normal@2x.png"),
                        emoticonHover: require("../assets/img/toolbar_emoticon_hover@2x.png"),
                        emoticonDown: require("../assets/img/toolbar_emoticon_down@2x.png"),
                        screenCaptureNormal: require("../assets/img/toolbar_screenCapture_normal@2x.png"),
                        screenCaptureHover: require("../assets/img/toolbar_screenCapture_hover@2x.png"),
                        screenCaptureDown: require("../assets/img/toolbar_screenCapture_down@2x.png"),
                        filesNormal: require("../assets/img/toolbar_files_normal@2x.png"),
                        filesHover: require("../assets/img/toolbar_files_hover@2x.png"),
                        filesDown: require("../assets/img/toolbar_files_down@2x.png"),
                        phoneNormal: require("../assets/img/toolbar_phone_normal@2x.png"),
                        phoneHover: require("../assets/img/toolbar_phone_hover@2x.png"),
                        phoneDown: require("../assets/img/toolbar_phone_down@2x.png"),
                        historyNormal: require("../assets/img/toolbar_history_normal@2x.png"),
                        historyHover: require("../assets/img/toolbar_history_hover@2x.png"),
                        historyDown: require("../assets/img/toolbar_history_down@2x.png"),
                        shakeNormal: require("../assets/img/toolbar_shake_normal@2x.png"),
                        shakeHover: require("../assets/img/toolbar_shake_hover@2x.png"),
                        shakeDown: require("../assets/img/toolbar_shake_down@2x.png")
                    },
                    emoticonIco: require("../assets/img/emoticonIco.png")
                },
                messageContent:"",
                InputContent:"",
                emoticonShowStatus: "none",
                emojiSrc:{
                    "funny":require("../assets/img/emoji/178fix@2x.png"),
                    "funnyNormal":require("../assets/img/emoji/178fix@2x.png"),
                    "funnyHover":require("../assets/img/emoji/178@2x.gif"),
                    "smile":require("../assets/img/emoji/14fix@2x.png"),
                    "smileNormal":require("../assets/img/emoji/14fix@2x.png"),
                    "smileHover":require("../assets/img/emoji/14@2x.gif"),
                    "pout":require("../assets/img/emoji/1fix@2x.png"),
                    "poutNormal":require("../assets/img/emoji/1fix@2x.png"),
                    "poutHover":require("../assets/img/emoji/1@2x.gif"),
                    "porn":require("../assets/img/emoji/2fix@2x.png"),
                    "pornNormal":require("../assets/img/emoji/2fix@2x.png"),
                    "pornHover":require("../assets/img/emoji/2@2x.gif"),
                },
                emojiList:emoji
            }
        },
        mounted:function(){
            // 全局点击事件，点击表情框以外的地方，隐藏当前表情框
            document.addEventListener('click',(e)=>{
                let thisClassName = e.target.className;
                if( thisClassName !== "emoticon-panel" && thisClassName !=="emoticon"){
                    this.emoticonShowStatus = "none";
                }
            });
        },
        methods: {
            createDisEventFun: function (status) {
                if (status === "hover") {
                    this.createDisSrc = this.resourceObj.createDisHover
                } else if (status === "leave") {
                    this.createDisSrc = this.resourceObj.createDisNormal
                } else {
                    this.createDisSrc = this.resourceObj.createDisClick
                }
            },
            sendMessage:function (event) {
                if(event.keyCode===13){
                    console.log("消息发送");
                }
            },
            // 显示表情
            displayExpression:function (status) {
                if(status==="hover" || status==="up"){
                    this.resourceObj.toolbarBarIco.emoticon = this.resourceObj.toolbarBarIco.emoticonHover;
                }else if(status==="leave"){
                    this.resourceObj.toolbarBarIco.emoticon = this.resourceObj.toolbarBarIco.emoticonNormal;
                }else{
                    this.resourceObj.toolbarBarIco.emoticon = this.resourceObj.toolbarBarIco.emoticonDown;
                    if(this.emoticonShowStatus ==="flex"){
                        this.emoticonShowStatus = "none";
                    }else{
                        this.emoticonShowStatus = "flex";
                    }
                }
            },
            // 判断一个对象是否为函数类型
            isFunction:function (obj) {
                return typeof obj === "function" && typeof obj.nodeType !== "number";
            },
            // 表情框鼠标悬浮显示动态表情
            emojiConversion:function (status) {
                if(status==="over"){
                    this.emojiSrc.funny = this.emojiSrc.funnyHover;
                }else{
                    this.emojiSrc.funny = this.emojiSrc.funnyNormal;
                }

            }
        },
        beforeRouteUpdate(to, form, next) {
            // 路由更新改变当前userId
            this.userId = to.params.userId;
            next();
        }
    }
</script>

<style lang="scss" src="../assets/scss/message-display.scss" scoped></style>
