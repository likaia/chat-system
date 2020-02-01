<template>
    <!--消息列表组件-->
    <div v-if="thisStatus==='message'">
        <router-view name="msgList"/>
    </div>
    <!--联系人组件-->
    <div v-else-if="thisStatus==='list'">
        <router-view name="contactList"/>
    </div>
    <!--更多内容组件-->
    <div v-else>
        <router-view name="moreList"/>
    </div>
</template>

<script>
    import lodash from 'lodash'
    export default {
        name: "main-body",
        props: ['thisStatus'],
        // 导航守卫: 路由发生改变时执行
        beforeRouteUpdate(to,from,next){
            // to.fullPath = to.fullPath+"/"+to.params.thisStatus;
            next();
        },
        // 页面加载时执行
        created() {
            // Vuex中token不存在则更新
            if(lodash.isEmpty(this.$store.state.token)){
                // 更新vuex中的token
                this.$store.state.token = localStorage.getItem("token");
                this.$store.state.profilePicture = localStorage.getItem("profilePicture");
                this.$store.state.userID = localStorage.getItem("userID");
                this.$store.state.username = localStorage.getItem("username");
            }
        }
    }
</script>

<style scoped>

</style>
