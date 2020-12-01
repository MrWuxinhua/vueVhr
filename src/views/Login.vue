<template>
    <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
        <h3 class="loginTitle">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password">
            <el-input type="text" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码" @keydown.enter.native
                    ="submitLogin"></el-input>
        </el-form-item>
        <el-checkbox v-model="checked" class="loginChecked">记住密码</el-checkbox>
        <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
</template>

<script>
    // import {postKeyValueRequest} from '../util/api'


    export default {
        name: "Login",
        data() {
            return {
                //登录用户的用户名和密码
                loginForm: {
                    username: '',
                    password: ''
                },
                checked: true,
                //校验规则
                rules: {
                    username: [{required: true, message: "请输入用户名", target: "blur"}],
                    password: [{required: true, message: "请输入密码", target: "blur"}],
                }
            }
        },
        methods: {
            //登录按钮
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.postKeyValueRequest("/dologin", this.loginForm).then(response => {
                            if (response) {
                                window.sessionStorage.setItem("user" ,JSON.stringify(response.obj) )
                                this.$router.replace("/home")
                            }

                        })
                    } else {
                        this.$message.error("请输入所有字段")
                        return false;
                    }
                });


            }
        }


    }
</script>

<style>
    .loginContainer {
        border-radius: 15px; /* 边框圆角*/
        border: 1px solid #eaeaea; /*设置边框1个像素 ，直线 ，和 边框颜色 */
        background-clip: padding-box; /*设置元素的背景（背景图片或颜色）是否延伸到内边距盒子*/
        background: #fff; /*背景颜色*/
        margin: 180px auto; /*设置外边距 ，上下180 左右自动*/
        padding: 15px 35px 20px 35px; /*设置内边距 上 右 下 左*/
        width: 350px; /*设置宽度*/
        box-shadow: 0 0 25px #cac6c6; /*添加阴影 ，X轴偏移 y轴偏移 ， 模糊半径 ，阴影颜色*/
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
    }

    .loginChecked {
        margin: 0px 0px 15px 15px;
        text-align: left;
    }
</style>