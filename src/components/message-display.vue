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
        <div class="messages-panel" ref="messagesContainer">
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
                <div class="sender-panel" v-for="item in senderMessageList" :key="item.msgId">
                    <!--消息-->
                    <div class="msg-body">
                        <!--消息尾巴-->
                        <div class="tail-panel">
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-zbds30duihuakuangyou"></use>
                            </svg>
                        </div>
                        <!--消息内容-->
                        <p v-html="item.msgText"/>
                    </div>
                    <!--头像-->
                    <div class="avatar-panel">
                        <img :src="item.avatarSrc" alt="">
                    </div>
                </div>
            </div>

        </div>

        <!--用户输入模块-->
        <div class="user-input-panel">
            <div class="toolbar-panel">
                <div class="item-panel" v-for="item in toolbarList" :key="item.info">
                    <img class="emoticon" :src="require(`../assets/img/${item.src}`)"
                         @mouseenter="toolbarSwitch('hover',$event,item.src,item.hover,item.down,item.name)"
                         @mouseleave="toolbarSwitch('leave',$event,item.src,item.hover,item.down,item.name)"
                         @mousedown="toolbarSwitch('down',$event,item.src,item.hover,item.down,item.name)"
                         @mouseup="toolbarSwitch('up',$event,item.src,item.hover,item.down,item.name)" :alt="item.info">
                </div>
            </div>
            <div class="input-panel" ref="msgInputContainer" @keydown.enter.exact="sendMessage($event)"
                 contenteditable="true" spellcheck="false"></div>
            <!--表情面板-->
            <div class="emoticon-panel" :style="{display: emoticonShowStatus}">
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

<script>
    import emoji from '../assets/json/emoji';
    import toolbar from '../assets/json/toolbar';

    export default {
        name: "message-display",
        data() {
            return {
                userId: this.$route.params.userId,
                messagesContainerTimer:"",
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
                },
                messageContent: "",
                InputContent: "",
                emoticonShowStatus: "none",
                emojiList: emoji,
                toolbarList: toolbar,
                senderMessageList:[

                ]
            }
        },
        mounted: function () {
            // 全局点击事件，点击表情框以外的地方，隐藏当前表情框
            document.addEventListener('click', (e) => {
                let thisClassName = e.target.className;
                if (thisClassName !== "emoticon-panel" && thisClassName !== "emoticon") {
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
            sendMessage: function (event) {
                if (event.keyCode === 13) {
                    // 阻止编辑框默认生成div事件
                    event.preventDefault();
                    let msgText = "";
                    // 获取输入框下的所有子元素
                    let allNodes = event.target.childNodes;
                    for(let item of allNodes){
                        // 判断当前元素是否为img元素
                        if(item.nodeName==="IMG"){
                            msgText += `/${item.alt}/`;
                        }
                        else{
                            // 获取text节点的值
                            if(item.nodeValue!==null){
                                msgText += item.nodeValue;
                            }
                        }
                    }

                    // 解析接口返回的数据进行渲染
                    let separateReg = /(\/[^/]+\/)/g;
                    let finalMsgText = "";
                    // 将符合条件的字符串放到数组里
                    const resultArray = msgText.match(separateReg);
                    if(resultArray!==null){
                        for (let item of resultArray){
                            // 删除字符串中的/符号
                            item = item.replace(/\//g,"");
                            for (let emojiItem of this.emojiList){
                                // 判断捕获到的字符串与配置文件中的字符串是否相同
                                if(emojiItem.info === item){
                                    const imgSrc = require(`../assets/img/emoji/${emojiItem.hover}`);
                                    const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${item}">`;
                                    // 替换匹配的字符串为img标签:全局替换
                                    msgText = msgText.replace(new RegExp(`/${item}/`,'g'),imgTag);
                                }
                            }
                        }
                        finalMsgText = msgText;
                    }else{
                        finalMsgText = msgText;
                    }
                    const thisSenderMessageObj = {
                        "msgText": finalMsgText,
                        "msgId": Date.now(),
                        "avatarSrc": require("../assets/img/avatar.jpg")
                    };
                    // 渲染页面
                    this.senderMessageList.push(thisSenderMessageObj);
                    // 修改滚动条位置
                    this.$nextTick(function () {
                        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
                    });
                    // 清空输入框中的内容
                    event.target.innerHTML = "";
                }
            },
            // 显示表情
            toolbarSwitch: function (status, event, path, hoverPath, downPath, toolItemName) {
                if (status === "hover" || status === "up") {
                    event.target.src = require(`../assets/img/${hoverPath}`);
                } else if (status === "leave") {
                    event.target.src = require(`../assets/img/${path}`);
                } else {
                    event.target.src = require(`../assets/img/${downPath}`);
                    // 表情框显示条件
                    if (toolItemName === "emoticon") {
                        if (this.emoticonShowStatus === "flex") {
                            this.emoticonShowStatus = "none";
                        } else {
                            this.emoticonShowStatus = "flex";
                        }
                    } else {
                        this.emoticonShowStatus = "none";
                    }
                }
            },
            // 判断一个对象是否为函数类型
            isFunction: function (obj) {
                return typeof obj === "function" && typeof obj.nodeType !== "number";
            },
            // 表情框鼠标悬浮显示动态表情
            emojiConversion: function (event, status, path, hoverPath, info) {
                if (status === "over") {
                    event.target.src = require(`../assets/img/emoji/${hoverPath}`);
                } else if (status === "click") {
                    // 表情输入
                    const imgSrc = require(`../assets/img/emoji/${hoverPath}`);
                    const imgTag = `<img src="${imgSrc}" width="28" height="28" alt="${info}">`;
                    document.execCommand("insertHTML", false, imgTag);
                } else {
                    event.target.src = require(`../assets/img/emoji/${path}`);
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
