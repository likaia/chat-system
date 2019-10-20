<template>
    <div id="main-content">
        <div class="top-panel">
            <div class="left-panel">
                <div class="icon-panel">
                    <div class="fillet-ico-panel close-ico">

                    </div>
                    <div class="fillet-ico-panel mini-ico">

                    </div>
                    <div class="fillet-ico-panel max-ico">

                    </div>
                </div>
                <div class="search-panel">
                    <div class="search">
                        <img src="../assets/img/search_editText@2x.png" :style="{display:searchImg}">
                        <input type="text" @focus="hideSearchImg" @blur="showSearchImg" v-model="searchContent">
                    </div>
                    <div class="add-panel" @mouseleave="createGroupChat(false)" @mouseup="createGroupChat(false)" @mousedown="createGroupChat(true)" :style="{background: addBackground}">
                        <img src="../assets/img/create_discuss_simple@2x.png"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "main-content",
        data(){
            return{
                searchImg:"block",
                searchContent:"",
                addBackground:"#ffffff"
            }
        },
        methods:{
            // 显示搜索图标
            showSearchImg: function () {
                // 判断当前输入框是否有数据
                if(this.isEmpty(this.searchContent)){
                    this.searchImg = "block";
                }else{
                    this.searchImg = "none";
                }
            },
            // 隐藏搜索图标
            hideSearchImg: function(){
                this.searchImg = "none";
            },
            // 创建群聊
            createGroupChat: function(status){
                if(status){
                    this.addBackground = "#F0F0F0";
                }else{
                    this.addBackground = "#ffffff";
                }

            },
            // 非空判断
            isEmpty:(str)=>{
                str = str.trim();
                return str === "" || str === null || typeof str === "undefined";
            }
        }
    }
</script>

<style scoped lang="scss" src="../assets/scss/main-content.scss"></style>
