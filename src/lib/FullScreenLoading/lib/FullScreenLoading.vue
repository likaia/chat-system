<template>
    <div id="loadingPanel" v-if="show">
        <div class="container-panel">
            <div class="arc"></div>
            <h1><span>{{tips}}</span></h1>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FullScreenLoading",
        data(){
            return{
                tips:"加载中",
                show:false
            }
        }
    }
</script>

<style src="./css/FullScreenLoading.css">

</style>