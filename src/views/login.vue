<template>
    <div id="login-panel" ref="loginPanel">
        <div class="loading-box">
            <span>loading...</span>
        </div>
        <div class="top-panel">
            <div class="qrCode-panel">
                <img src="../assets/img/login/code_normal@2x.png"/>
            </div>
        </div>
        <!--头像区域-->
        <div class="headPortrait-panel">
            <!--加载层-->
            <div class="load-panel loadWhirl" v-if="isLoginStatus==='loggingIn'">
                <!--头像显示层:登录中-->
                <div class="headPortrait-img-panel avatarRotation">
                    <img src="../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png"/>
                </div>
            </div>
            <!--头像显示层:注册-->
            <div class="headPortrait-img-panel" v-else-if="isLoginStatus===false">
                <!--灰色蒙层:默认头像-->
                <div class="cover-panel" v-if="isDefaultAvatar===true">
                    <p>上传头像</p>
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="uploadAvatar($event)"/>
                </div>
                <!--头像已上传：取消灰色蒙层-->
                <div class="cover-panel" v-else style="background: rgba(0,0,0,.0);">
                    <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg" @change="uploadAvatar($event)"/>
                </div>
                <img :src="avatarSrc"/>
            </div>
            <!--头像显示层:登录-->
            <div class="headPortrait-img-panel" v-else>
                <img src="../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png"/>
            </div>
        </div>
        <!--输入区域:登录-->
        <div class="inputArea-panel" v-if="isLoginStatus===true">
            <div class="item-panel">
                <input type="text" v-model="userName" placeholder="输入用户名" onfocus="this.placeholder=''" onblur="this.placeholder='输入用户名'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="password" placeholder="输入密码" onfocus="this.placeholder=''" onblur="this.placeholder='输入密码'" @keydown.enter.exact="login('click')">
                <div class="login-btn-panel" @click="login('click')" @mouseenter="login('hover')" @mouseleave="login('leave')">
                    <img :src="loginBtnNormal"/>
                </div>
            </div>
        </div>
        <!--输入区域:登录中-->
        <div class="inputArea-panel" v-else-if="isLoginStatus==='loggingIn'">
            <div class="username-view-panel">
                <p>
                    {{userName}}
                </p>
            </div>
            <div class="cancel-btn-panel" @click="cancelLogin()" ref="cancelBtn">
                <p>取消</p>
            </div>
        </div>
        <!--输入区域:注册-->
        <div class="inputArea-panel" v-else>
            <div class="item-panel">
                <input type="text" v-model="userName" placeholder="输入用户名" onfocus="this.placeholder=''" onblur="this.placeholder='输入用户名'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="password" placeholder="输入密码" onfocus="this.placeholder=''" onblur="this.placeholder='输入密码'">
            </div>
            <div class="item-panel">
                <input type="password" v-model="confirmPassword" placeholder="确认密码" onfocus="this.placeholder=''" onblur="this.placeholder='确认密码'" @keydown.enter.exact="login('clickRegistered')">
                <div class="login-btn-panel" @click="login('clickRegistered')" @mouseenter="login('hover')" @mouseleave="login('leave')">
                    <img :src="loginBtnNormal"/>
                </div>
            </div>
        </div>
        <!--注册区域-->
        <div class="registration-area-panel" v-if="isLoginStatus!=='loggingIn'">
            <p v-if="isLoginStatus===true" @click="registered(true)">立即注册</p>
            <p v-else @click="registered(false)">返回登录</p>
        </div>
    </div>
</template>

<script>
    import base from '../api/base'

    export default {
        name: "login",
        data(){
            return {
                loginUndo: require("../assets/img/login/icon-enter-undo@2x.png"),
                loginBtnNormal: require("../assets/img/login/icon-enter-undo@2x.png"),
                loginBtnHover: require("../assets/img/login/icon-enter-hover@2x.png"),
                loginBtnDown: require("../assets/img/login/icon-enter-down@2x.png"),
                userName: "",
                password: "",
                confirmPassword:"",
                isLoginStatus: true,
                isDefaultAvatar: true,
                avatarSrc:require("../assets/img/login/LoginWindow_BigDefaultHeadImage@2x.png")
            }
        },
        methods: {
            login: function (status) {
                let loginBtnTime;
                if(status==="hover"){
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnHover
                    }
                }else if(status==="click"){
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnDown;
                        clearTimeout(loginBtnTime);
                        loginBtnTime = setTimeout(()=>{
                            // 登录
                            this.isLoginStatus = "loggingIn";
                            this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                        },150);
                    }
                }else if(status==="clickRegistered"){
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = this.loginBtnDown;
                        clearTimeout(loginBtnTime);
                        loginBtnTime = setTimeout(()=>{
                            // 注册函数
                            console.log("注册");
                            this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                        },300);
                    }
                } else{
                    if(this.password===""){
                        this.loginBtnNormal = this.loginUndo;
                    }else{
                        this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                    }

                }
            },
            registered: function (status) {
                let degreeOfRotation = 0;
                const timer = setInterval(()=>{
                    degreeOfRotation+=30;
                    if(degreeOfRotation>=360){
                        // 显示登录或注册
                        this.isLoginStatus = status !== true;
                        clearInterval(timer);
                    }
                    this.$refs.loginPanel.style.transform = `rotateY(${degreeOfRotation}deg)`
                },40);

            },
            cancelLogin:function () {
                this.$refs.cancelBtn.style.background = "#f3f3f3";
                // 清空密码显示登录
                this.password = "";
                this.isLoginStatus = true;
                this.$refs.cancelBtn.style.background = "";
            },
            uploadAvatar:function (e) {
                console.log("上传点击了");
                let file = e.target.files[0];
                // 构造form对象
                let formData = new FormData();
                // 后台取值字段 | blob文件数据 | 文件名称
                formData.append("file",file,file.name);
                // 调用上传api
                this.$api.fileManageAPI.baseFileUpload(formData).then((res)=>{
                    const fileName = `${base.lkBaseURL}/uploads/${res.fileName}`;
                    // 更改默认头像状态
                    this.isDefaultAvatar = false;
                    // 头像赋值
                    this.avatarSrc = fileName;
                });
                console.log(e);
            }
        },
        watch: {
            // 监听确认密码状态
            'password':function (thisVal) {
                if(thisVal===""){
                    this.loginBtnNormal = this.loginUndo;
                }else{
                    this.loginBtnNormal = require("../assets/img/login/icon-enter-normal@2x.png")
                }
            }
        }
    }
</script>

<style scoped lang="scss" src="../assets/scss/login.scss"/>