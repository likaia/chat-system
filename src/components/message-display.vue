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
                    <div class="item-panel" @mouseenter="createDisEventFun('hover')" @mouseleave="createDisEventFun('leave')" @click="createDisEventFun('click')">
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
                    <div class="avatar-panel">
                        <img :src="this.resourceObj.groupMsgImg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "message-display",
        data(){
            return{
                userId:this.$route.params.userId,
                createDisSrc:require("../assets/img/titlebar_function_createDis_normal@2x.png"),
                resourceObj:{
                    createDisNormal:require("../assets/img/titlebar_function_createDis_normal@2x.png"),
                    createDisHover:require("../assets/img/titlebar_function_createDis_hover@2x.png"),
                    createDisClick:require("../assets/img/titlebar_function_createDis_normal_p@2x.png"),
                    phoneNormal:require("../assets/img/phone_normal_ap@2x.png"),
                    groupMsgImg:require("../assets/img/group-msg-img.png"),
                }
            }
        },
        methods:{
            createDisEventFun:function(status){
                if(status==="hover"){
                    this.createDisSrc = this.resourceObj.createDisHover
                }else if(status==="leave"){
                    this.createDisSrc = this.resourceObj.createDisNormal
                }else{
                    this.createDisSrc = this.resourceObj.createDisClick
                }

            }
        },
        beforeRouteUpdate(to,form,next){
            // 路由更新改变当前userId
            this.userId = to.params.userId;
            next();
        }
    }
</script>

<style lang="scss" src="../assets/scss/message-display.scss" scoped></style>
