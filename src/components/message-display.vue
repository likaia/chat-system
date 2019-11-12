<template>
    <div>
        当前用户id: {{userId}}
    </div>
</template>

<script>
    export default {
        name: "message-display",
        data(){
            return{
                userId:this.$route.params.userId
            }
        },
        beforeRouteUpdate(to,form,next){
            // 路由更新改变当前userId
            this.userId = to.params.userId;
            next();
        }
    }
</script>

<style scoped>

</style>
