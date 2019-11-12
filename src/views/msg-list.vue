<template>
    <div id="mainBody" :style="{height:this.$store.state.thisWindowHeight+'px'}">
        <div class="list-panel">
            <router-link :to="{name:'messageDisplay',params:{userId:'5309190088'}}" tag="div">
                <div class="row-panel topping">
                    <div class="item-subscript-panel">
                        <img :src="msgSubscriptIco" alt="角标">
                    </div>
                    <div class="item-avatar-panel">
                        <img :src="avatarIco" alt="用户头像">
                    </div>
                    <div class="item-nickname-panel">
                        <p class="title">神奇的程序员</p>
                        <p class="subtitle">消息内容</p>
                    </div>
                    <div class="item-time-panel">
                        <p>下午10:22</p>
                    </div>
                </div>
            </router-link>
            <router-link :to="{name:'messageDisplay',params:{userId:'5309190090'}}" tag="div">
                <div class="row-panel">
                    <div class="item-subscript-panel">

                    </div>
                    <div class="item-avatar-panel">
                        <img :src="groupMsgImg" alt="用户头像">
                    </div>
                    <div class="item-nickname-panel">
                        <p class="title">全栈交流群</p>
                        <p class="subtitle">好人一生平胸:要不</p>
                    </div>
                    <div class="item-time-panel">
                        <p>下午10:22</p>
                        <div class="msg-count-panel msg-count-more-panel">
                            <p>99+</p>
                        </div>
                    </div>
                </div>
            </router-link>
            <router-link :to="{name:'messageDisplay',params:{userId:'5309190089'}}" tag="div">
                <div class="row-panel">
                    <div class="item-subscript-panel">

                    </div>
                    <div class="item-avatar-panel">
                        <img :src="otherMsgImg" alt="用户头像">
                    </div>
                    <div class="item-nickname-panel">
                        <p class="title">前端交流群</p>
                        <p class="subtitle">hello:Mess</p>
                    </div>
                    <div class="item-time-panel">
                        <p>下午10:22</p>
                        <div class="doNotDisturb-panel">
                            <img :src="GroupBlocked" alt="">
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="content-panel">
            <!--公用组件(消息展示)-->
            <router-view name="messageDisplay"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "msg-list",
        data(){
            return{
                msgSubscriptIco:require("../assets/img/msg-subscript.png"),
                avatarIco:require("../assets/img/avatar-ico.png"),
                groupMsgImg:require("../assets/img/group-msg-img.png"),
                GroupBlocked:require("../assets/img/Group_Blocked@2x.png"),
                otherMsgImg:require("../assets/img/other-msg-img.jpg")
            }
        }
    }
</script>

<style lang="scss" scoped src="../assets/scss/msg-list.scss"></style>
