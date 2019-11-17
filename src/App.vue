<template>
  <div id="app" :style="appStyleObj">
    <main-content/>
  </div>
</template>
<script>
  import mainContent from '@/components/main-content.vue';
  export default {
    // 当前组件名
    name:'app',
    components:{
      // 需要在页面所引入的组件进行声明
      mainContent
    },
    data(){
      // 当前页面需要用到的数据
      return{
        appStyleObj: {
          height: window.innerHeight+"px",
          background: "#0C9A9A"
        }
      }
    },
    created: function(){
      // 页面创建完成后调用获取当前屏幕高度方法
      let thisHeight = this.getThisWindowHeight();
      console.log(thisHeight);
    },
    methods:{
      // 获取当前屏幕高度
      getThisWindowHeight:()=>window.innerHeight
    }
  }
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  body{
    box-sizing: border-box;
  }
  #app{
    width: 100%;
    height: 100%;
    background: #0C9A9A;
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
