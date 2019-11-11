<template>
    <!--消息列表组件-->
    <div v-if="thisStatus==='message'">
        当前状态:message
        <router-view name="msgList"/>
    </div>
    <!--联系人组件-->
    <div v-else-if="thisStatus==='list'">
        当前状态:list
        <router-view name="contactList"/>
    </div>
    <!--更多内容组件-->
    <div v-else>
        当前状态:more
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
            console.log(to.params.thisStatus);
            next();
        },
    }
</script>

<style scoped>

</style>
