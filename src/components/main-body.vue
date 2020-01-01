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
    export default {
        name: "main-body",
        props: ['thisStatus'],
        // 导航守卫: 路由发生改变时执行
        beforeRouteUpdate(to,from,next){
            // to.fullPath = to.fullPath+"/"+to.params.thisStatus;
            next();
        },
    }
</script>

<style scoped>

</style>
