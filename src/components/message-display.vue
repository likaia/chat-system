<template>
    <div id="mainContent">
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
                        <p v-html="item.msgText"/>
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
                <div class="send-panel" ref="sendPanel" @click="mobileSend()">
                    <p>发送</p>
                </div>
            </div>
            <div class="input-panel" ref="msgInputContainer" @keydown.enter.exact="sendMessage($event)"
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

<script>
    import emoji from '../assets/json/emoji';
    import toolbar from '../assets/json/toolbar';
    import lodash from 'lodash';

    export default {
        name: "message-display",
        data() {
            return {
                userId: this.$route.params.userId,
                messagesContainerTimer:"",
                onlineUsers: this.$store.state.onlineUsers,
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

                ],
                userID:this.$store.state.userID
            }
        },
        mounted: function () {
            // 设置列容器高度
            this.$refs.messagesContainer.style.height = this.getThisWindowHeight()-450+"px";
            // 判断移动端打开
            if(this.getThisWindowWidth()<500){
                this.createDisSrc = this.$store.state.profilePicture;
                this.$refs.createDisSrcPanel.style.width = "40px";
                this.$refs.createDisSrcPanel.style.height = "40px";
                this.$refs.createDisSrcPanel.style.borderRadius = "50%";
                this.$refs.createDisSrcPanel.style.overflow = "hidden";
                this.resourceObj.createDisClick = this.$store.state.profilePicture;
                this.$refs.topPanel.style.height = "45px";
                this.$refs.messagesContainer.style.height = this.getThisWindowHeight()-240+"px";
                this.$refs.emoticonPanel.style.left = "0";
                this.$refs.emoticonPanel.style.width = this.getThisWindowWidth()+"px";
                this.$refs.sendPanel.style.display = "block";
            }
            /**
             * 设置粘贴监听事件: 实现图片粘贴
             */
            let that = this;
            document.body.addEventListener('paste', function (e) {
                let reader = new FileReader();//监听文件流
                let clipboard = e.clipboardData;
                reader.onload = function (evt) {
                    let img = document.createElement('img');//创建一个img
                    //$(img).css({'width': '65px', 'height': '65px'});
                    img.src = evt.target.result;//设置链接
                    // 图片渲染
                    that.$refs.msgInputContainer.append(img);
                };
                let file = clipboard.items[0];
                if (file.kind == 'file') {
                    reader.readAsDataURL(file.getAsFile());//启动文件流事件
                }
            });
            // 全局点击事件，点击表情框以外的地方，隐藏当前表情框
            document.addEventListener('click', (e) => {
                let thisClassName = e.target.className;
                if (thisClassName !== "emoticon-panel" && thisClassName !== "emoticon") {
                    this.emoticonShowStatus = "none";
                }
            });
            //从本地存储中获取数据渲染页面
            this.renderPage("","",1);
            // 监听消息接收
            this.$options.sockets.onmessage = (res)=>{
                const data = JSON.parse(res.data);
                if(data.code===200){
                    // 连接建立成功
                    console.log(data.msg);
                    this.$store.state.onlineUsers = data.onlineUsers;
                    // 更新在线人数
                    this.onlineUsers = data.onlineUsers;
                }else{
                    this.$store.state.onlineUsers = data.onlineUsers;
                    // 更新在线人数
                    this.onlineUsers = data.onlineUsers;
                    // 获取服务端推送的消息
                    const msgObj = {
                        msg: data.msg,
                        avatarSrc: data.avatarSrc,
                        userID: data.userID,
                        username: data.username
                    };
                    // 渲染页面:如果msgArray存在则转json
                    if(lodash.isEmpty(localStorage.getItem("msgArray"))){
                        this.renderPage([],msgObj,0);
                    }else{
                        this.renderPage(JSON.parse(localStorage.getItem("msgArray")),msgObj,0);
                    }
                }
            };
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
            getThisWindowHeight:()=>window.innerHeight,
            getThisWindowWidth:()=>window.innerWidth,
            sendMessage: function (event) {
                if (event.keyCode === 13) {
                    console.log(event);
                    // 阻止编辑框默认生成div事件
                    event.preventDefault();
                    let msgText = "";
                    // 获取输入框下的所有子元素
                    let allNodes = event.target.childNodes;
                    for(let item of allNodes){
                        // 判断当前元素是否为img元素
                        if(item.nodeName==="IMG"){
                            console.log(item.src.length);
                            if(item.alt===""){
                                // 是图片
                                msgText += `[图片]`;
                            }else{
                                msgText += `/${item.alt}/`;
                            }

                        }
                        else{
                            // 获取text节点的值
                            if(item.nodeValue!==null){
                                msgText += item.nodeValue;
                            }
                        }
                    }
                    if(msgText.trim().length === 0){
                        alert("不能发送空内容");
                    }else{
                        // 消息发送
                        this.$socket.sendObj({msg: msgText,code: 0,username: this.$store.state.username,avatarSrc: this.$store.state.profilePicture,userID: this.$store.state.userID});
                        // 清空输入框中的内容
                        event.target.innerHTML = "";
                    }
                }
            },
            mobileSend:function(){
                // 模拟触发回车事件
                this.fireKeyEvent(this.$refs.msgInputContainer, 'keydown', 13);
            },
            //  渲染页面
            renderPage: function(msgArray,msgObj,status){
                if(status===1){
                    // 页面第一次加载，如果本地存储中有数据则渲染至页面
                    let msgArray = [];
                    if(localStorage.getItem("msgArray")!==null){
                        msgArray = JSON.parse(localStorage.getItem("msgArray"));
                        for (let i = 0; i<msgArray.length;i++){
                            const thisSenderMessageObj = {
                                "msgText": msgArray[i].msg,
                                "msgId": i,
                                "avatarSrc": msgArray[i].avatarSrc,
                                "userID": msgArray[i].userID,
                                "username": msgArray[i].username
                            };
                            // 解析并渲染
                            this.messageParsing(thisSenderMessageObj);
                        }
                    }
                }else{
                    // 判断本地存储中是否有数据
                    if(localStorage.getItem("msgArray")===null){
                        // 新增记录
                        msgArray.push(msgObj);
                        localStorage.setItem("msgArray",JSON.stringify(msgArray));
                        for (let i = 0; i <msgArray.length; i++){
                            const thisSenderMessageObj = {
                                "msgText": msgArray[i].msg,
                                "msgId": i,
                                "avatarSrc": msgArray[i].avatarSrc,
                                "userID": msgArray[i].userID,
                                "username": msgArray[i].username
                            };
                            // 解析并渲染
                            this.messageParsing(thisSenderMessageObj);
                        }
                    }else{
                        // 更新记录
                        msgArray = JSON.parse(localStorage.getItem("msgArray"));
                        msgArray.push(msgObj);
                        localStorage.setItem("msgArray",JSON.stringify(msgArray));
                        const thisSenderMessageObj = {
                            "msgText": msgObj.msg,
                            "msgId": Date.now(),
                            "avatarSrc": msgObj.avatarSrc,
                            "userID": msgObj.userID,
                            "username": msgObj.username
                        };
                        // 解析并渲染
                        this.messageParsing(thisSenderMessageObj);
                    }
                }
            },
            // 模拟触发事件
            fireKeyEvent:function(el, evtType, keyCode){
                let doc = el.ownerDocument,
                    win = doc.defaultView || doc.parentWindow,
                    evtObj;
                if(doc.createEvent){
                    if(win.KeyEvent) {
                        evtObj = doc.createEvent('KeyEvents');
                        evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
                    }
                    else {
                        evtObj = doc.createEvent('UIEvents');
                        Object.defineProperty(evtObj, 'keyCode', {
                            get : function() { return this.keyCodeVal; }
                        });
                        Object.defineProperty(evtObj, 'which', {
                            get : function() { return this.keyCodeVal; }
                        });
                        evtObj.initUIEvent( evtType, true, true, win, 1 );
                        evtObj.keyCodeVal = keyCode;
                        if (evtObj.keyCode !== keyCode) {
                            console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
                        }
                    }
                    el.dispatchEvent(evtObj);
                }
                else if(doc.createEventObject){
                    evtObj = doc.createEventObject();
                    evtObj.keyCode = keyCode;
                    el.fireEvent('on' + evtType, evtObj);
                }
            },
            // 消息解析
            messageParsing: function(msgObj){
                // 解析接口返回的数据进行渲染
                let separateReg = /(\/[^/]+\/)/g;
                let msgText = msgObj.msgText;
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
                msgObj.msgText = finalMsgText;
                // 渲染页面
                this.senderMessageList.push(msgObj);
                // 修改滚动条位置
                this.$nextTick(function () {
                    this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
                });
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
