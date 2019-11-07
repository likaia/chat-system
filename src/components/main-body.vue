<template>
    <!--消息列表组件-->
    <div v-if="thisStatus==='message'">
        <router-view name="msgList"/>
    </div>
    <!--联系人组件-->
    <div v-else-if="thisStatus==='list'">
        联系人
    </div>
    <!--更多内容组件-->
    <div v-else>
        更多内容
    </div>
</template>

<script>
    export default {
        name: "main-body",
        props: ['thisStatus']
    }
</script>

<style scoped>

</style>
