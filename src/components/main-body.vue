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
        created() {
            console.log(this.$route.params.thisStatus)
        }
    }
</script>

<style scoped>

</style>
