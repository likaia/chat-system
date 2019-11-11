<template>
    <div id="mainBody" :style="{height:this.$store.state.thisWindowHeight+'px'}">
        <div class="list-panel">
            <div class="row-panel">
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
        </div>
        <div class="content-panel">

        </div>
    </div>
</template>

<script>
    export default {
        name: "msg-list",
        data(){
            return{
                msgSubscriptIco:require("../assets/img/msg-subscript.png"),
                avatarIco:require("../assets/img/avatar-ico.png")
            }
        }
    }
</script>

<style lang="scss" scoped src="../assets/scss/msg-list.scss"></style>
