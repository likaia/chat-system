<template>
    <!--登录页面-->
    <div v-if="currentComponentName==='login'">
        <router-view name="login"/>
    </div>
    <!--登录后的页面-->
    <div id="main-content" ref="mainContent" v-else>
        <div class="top-panel" ref="topPanel">
            <!--左侧图标-->
            <div class="left-panel">
                <div class="icon-panel" @mouseover="showLeftIco(true)" @mouseleave="showLeftIco(false)">
                    <div class="fillet-ico-panel close-ico">
                        <img :style="{display:leftIco}" src="../assets/img/close.png"/>
                    </div>

                    <div class="fillet-ico-panel mini-ico">
                        <img :style="{display:leftIco}" src="../assets/img/min.png"/>
                    </div>
                    <div class="fillet-ico-panel max-ico">
                        <img :style="{display:leftIco}" src="../assets/img/max.png"/>
                    </div>
                </div>
                <div class="search-panel">
                    <div class="search">
                        <img src="../assets/img/search_editText@2x.png" :style="{display:searchImg}">
                        <input type="text" @focus="hideSearchImg" @blur="showSearchImg" v-model="searchContent">
                    </div>
                    <div class="add-panel" @mouseleave="createGroupChat(false)" @mouseup="createGroupChat(false)"
                         @mousedown="createGroupChat(true)" :style="{background: addBackground}">
                        <img src="../assets/img/create_discuss_simple@2x.png"/>
                    </div>
                </div>
            </div>
            <div class="right-panel">
                <!--功能切换 路由入口-->
                <div class="function-switching-panel">
                    <router-link :to="{name:'contents',params:{thisStatus:'message'}}">
                        <div class="main-ico-area">
                            <img :src="this.$route.params.thisStatus==='message'?messageIcoActive:messageIco" alt="消息"/>
                        </div>
                    </router-link>
                    <router-link :to="{name:'contents',params:{thisStatus:'list'}}">
                        <div class="main-ico-area">
                            <img :src="this.$route.params.thisStatus==='list'?contactIcoActive:contactIco" alt="好友列表"/>
                        </div>
                    </router-link>
                    <router-link :to="{name:'contents',params:{thisStatus:'more'}}">
                        <div class="main-ico-area">
                            <img :src="this.$route.params.thisStatus==='more'?moreIcoActive:moreIco" alt="更多"/>
                        </div>
                    </router-link>
                </div>
                <!--头像区域-->
                <div class="avatar-area-panel">
                    <!--在线状态-->
                    <div class="status-panel" @click="onlineStatus"></div>
                    <div class="avatar-panel">
                        <img :src="profilePicture" alt="在线状态"/>
                    </div>
                </div>
            </div>
        </div>
        <!--路由出口-->
        <div class="main-content-view">
            <router-view name="mainArea"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "main-content",
        data() {
            return {
                searchImg: "block",
                searchContent: "",
                addBackground: "#ffffff",
                leftIco: "none",
                messageIco: require("../assets/img/menu-message-normal@2x.png"),
                messageIcoActive: require("../assets/img/menu-message-down@2x.png"),
                contactIco: require("../assets/img/menu-contact-normal@2x.png"),
                contactIcoActive: require("../assets/img/menu-contact-down@2x.png"),
                moreIco: require("../assets/img/menu-more-normal@2x.png"),
                moreIcoActive: require("../assets/img/menu-more-down@2x.png"),
                profilePicture:this.$store.state.profilePicture,
                currentComponentName:null
            }
        },
        mounted() {
            if(this.getThisWindowWidth()<500){
                // 手机端打开
                this.$refs.mainContent.style.height = "100%";
                this.$refs.mainContent.style.width = "100%";
                this.$refs.mainContent.style.borderRadius = "0";
                this.$refs.topPanel.style.display = "none";
            }
            console.log(this.$store.state.profilePicture);
        },
        updated() {
            this.profilePicture = this.$store.state.profilePicture;
        },
        watch: {
            $route:{
                handler: function (route) {
                    this.currentComponentName=route.name;
                },
                immediate: true
            }
        },
        methods: {
            // 显示搜索图标
            showSearchImg: function () {
                // 判断当前输入框是否有数据
                if (this.isEmpty(this.searchContent)) {
                    this.searchImg = "block";
                } else {
                    this.searchImg = "none";
                }
            },
            getThisWindowHeight:()=>window.innerHeight,
            getThisWindowWidth:()=>window.innerWidth,
            // 隐藏搜索图标
            hideSearchImg: function () {
                this.searchImg = "none";
            },
            // 创建群聊
            createGroupChat: function (status) {
                if (status) {
                    this.addBackground = "#E1E3E5";
                } else {
                    this.addBackground = "#ffffff";
                }
            },
            // 显示左上角图标
            showLeftIco: function (status) {
                if (status) {
                    this.leftIco = "block";
                } else {
                    this.leftIco = "none";
                }
            },
            // 在线状态
            onlineStatus: function () {

            },
            // 非空判断
            isEmpty: (str) => {
                str = str.trim();
                return str === "" || str === null || typeof str === "undefined";
            }
        }
    }
</script>

<style scoped lang="scss" src="../assets/scss/main-content.scss"/>
