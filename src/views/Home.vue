<template>
    <el-container>
        <el-header class="homeHeader">
            <div class="title">微人事</div>
            <el-dropdown class='userInfo' @command='commandHandler'>
                  <span class="el-dropdown-link">
                    {{user.name}}<i><img class="userface" :src="user.userface"> </i>
                  </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='userInfo'>个人中心</el-dropdown-item>
                    <el-dropdown-item command='setting'>设置</el-dropdown-item>
                    <el-dropdown-item command='logout' divided>注销登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
<!--            左侧导航栏-->
            <el-aside width="200px">
                <el-menu router>
                    <el-submenu :index="index+''" v-for="(item , index) in routes" v-if="!item.hidden"
                                :key="index">
                        <template slot="title">
                            <i :class="item.iconCls" style="color: #469eff" ></i>
                            <span class="iconCls" >{{item.name}}</span>
                        </template>
                        <el-menu-item v-for="(children, indexj) in item.children " :key="indexj" :index="children.path">
                            {{children.name}}
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("user"))
            }
        },
        computed: {
            routes() {
                return this.$store.state.routes;
            }
        },
        methods: {

            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将退出当前登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        //发送退出信息
                        this.getRequest("/logout");
                        //删除sessionStorage
                        window.sessionStorage.removeItem("user");
                        this.$store.commit('initRoutes',[]);

                        //跳转登录页
                        this.$router.replace("/")
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消退出'
                        });
                    });
                }
            }
        }
    };
</script>

<style>
    .homeHeader {
        background-color: #469eff; /*背景颜色*/
        display: flex; /*（容器）弹性布局*/
        align-items: center; /*和上一起弹性居中*/
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff;
    }

    .homeHeader .userInfo {
        cursor: pointer; /*使指针变为手指样式*/
    }

    .userface {
        width: 45px;
        height: 45px;
        border-radius: 45px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
    .iconCls{
        margin-left: 5px;
    }

</style>