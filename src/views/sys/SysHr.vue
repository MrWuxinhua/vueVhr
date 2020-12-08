<template>
    <div>
        <div style="display: flex ; justify-content: center">
            <el-input @keydown.enter.native='doSearch' style="width: 500px;margin-right: 8px" v-model="keyWords"
                      prefix-icon="el-icon-search" placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."></el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div class="main-cart-content">

            <el-card class="box-card" v-for="(hr , index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button style="float: right; padding: 3px 0 ; color:red" type="text"
                               icon="el-icon-delete" @click="deleteHr(hr)" ></el-button>
                </div>
                <div style="display: flex ; justify-content: center">
                    <img class="imgContent" :src="hr.userface" style="width: 75px ; height: 75px ; border-radius: 75px"
                         :alt="hr.name" :title="hr.name">
                </div>
                <div style="margin-top: 15px" class="cart-content">
                    <div>用户姓名:{{hr.name}}</div>
                    <div>手机号码:{{hr.phone}}</div>
                    <div>电话号码:{{hr.telephone}}</div>
                    <div>地址:{{hr.address}}</div>
                    <div>用户状态:
                        <el-switch
                                v-model="hr.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="updateEnabled(hr)"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                    <div>用户角色:
                        <el-tag style="margin-right: 4px" v-for="(role , indexj) in hr.roles" :key="indexj"
                                type="primary">{{role.nameZh}}
                        </el-tag>
                        <el-popover
                                placement="right"
                                title="角色选择"
                                width="200"
                                @show="showPop(hr.roles)"
                                @hide="hidePop(hr.id)"
                                trigger="click">
                            <el-select v-model="rolesId" filterable multiple placeholder="请选择角色">
                                <el-option
                                        v-for="(rolek , indexk) in roles"
                                        :key="indexk"
                                        :label="rolek.nameZh"
                                        :value="rolek.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" icon="el-icon-more" type="text"></el-button>
                        </el-popover>
                    </div>
                    <div>备注:{{hr.remark}}</div>
                </div>
            </el-card>

        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                keyWords: '',
                hrs: [],
                roles: [],
                rolesId: [],
                rolesOldId: [],
            }
        },
        mounted() {
            this.initHrs()

        },
        methods: {
            deleteHr(hr){
                this.$confirm('此操作将永久删除【 ' + hr.name+ ' 】 条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp => {
                        if(resp && resp.status == 200 ){
                            this.initHrs();
                        }
                    })


                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            doSearch(){
                this.initHrs()
            },
            hidePop(hid) {

                if ((this.rolesId.sort().toString() == this.rolesOldId.sort().toString())) {
                    this.rolesId = [];
                    this.rolesOldId = [];
                    return;
                }
                let url = "/system/hr/role/?hid=" + hid;
                this.rolesId.sort().forEach(item => {
                    url += "&rids=" + item;
                })

                this.putRequest(url).then(resp => {
                    if (resp && resp.status == 200) {
                        this.initHrs();
                    }
                })

                this.rolesId = [];
                this.rolesOldId = [];
            },
            showPop(rolesOld) {
                this.initRoles();
                rolesOld.forEach(role => {
                    this.rolesId.push(role.id)
                    this.rolesOldId.push(role.id)
                })

            },
            updateEnabled(hr) {
                this.putRequest("/system/hr/", hr).then(resp => {
                    if (resp && resp.status == 200) {
                        this.initHrs();
                    }
                })


            },

            initRoles() {

                this.getRequest("/system/hr/role/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            },
            initHrs() {

                this.getRequest("/system/hr/?keyWords="+this.keyWords.trim()).then(resp => {
                    if (resp) {
                        this.hrs = resp;
                    }
                })
            }


        }
    }
</script>

<style>
    .main-cart-content {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .box-card {
        width: 350px;
        margin-right: 8px;
        margin-top: 8px;
    }

    .imgContent {
        width: 75px;
        height: 75px;
        border-radius: 75px;
        display: flex;
        justify-content: center;
    }

    .cart-content div {
        font-size: 15px;
        color: #67C23A;
        font-size-adjust: none;
        line-height: 1.5;
    }

</style>