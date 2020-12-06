<template>
    <div>
        <div>
            <el-input size="small" placeholder="请输入角色英文名称" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名称" v-model="role.nameZh"
                      @keydown.enter.native="addRole"></el-input>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addRole">添加角色</el-button>
        </div>
        <div>
            <el-collapse accordion @change="change" v-model="activeNames">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r , index) in roles" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0; color: #ff1123" icon="el-icon-delete"
                                       type="text" @click="deleteRole(r.id,r.nameZh)"></el-button>
                        </div>
                        <div>
                            <el-tree
                                    :data="allMenus"
                                    :props="AllMenusProps"
                                    node-key="id"
                                    ref="tree"
                                    @key="index"
                                    :default-checked-keys="nodeChecked"
                                    show-checkbox
                            >
                            </el-tree>
                        </div>
                        <div style="display:flex ;justify-content: flex-end">
                            <el-button size="small" @click="activeNames = -1">取消修改</el-button>
                            <el-button size="small" type="primary" @click="doUpdate(index,r.id)">确认修改</el-button>

                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissManage",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
                },
                roles: [],
                allMenus: [],
                AllMenusProps: {
                    label: 'name',
                    children: 'children'
                },
                nodeChecked: [],
                activeNames: -1
            }
        },
        mounted() {
            this.initRoles();
        },
        methods: {
            deleteRole(id, nameZh) {

                this.$confirm('此操作将永久删除【 ' + nameZh + ' 】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/permiss/role/" + id).then(resp => {
                        if (resp && resp.status == 200) {
                            this.initRoles();
                        }
                    })


                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            addRole() {
                if (this.role.name && this.role.nameZh) {
                    this.postRequest("/system/basic/permiss/role/", this.role).then(resp => {
                        if (resp && resp.status == 200) {
                            this.role.name = '';
                            this.role.nameZh = '';
                            this.initRoles();
                        }
                    })
                } else {
                    this.$message.error("添加失败")
                }

            },
            doUpdate(index, rid) {
                let trees = this.$refs.tree[index];
                let SellectNodes = trees.getCheckedKeys(true)
                let url = '/system/basic/permiss/?rid=' + rid;

                SellectNodes.forEach(item => {
                    url += "&ids=" + item
                })

                this.putRequest(url).then(resp => {
                    if (resp && resp.status == 200) {
                        this.activeNames = -1
                        this.change(rid)
                    }
                })
            },
            change(id) {
                if (id) {
                    this.initAllMenus();
                    this.getMenusIdByRid(id)
                }
            },
            initAllMenus() {
                this.getRequest("/system/basic/permiss/menus/").then(resp => {
                    if (resp) {
                        this.allMenus = resp
                    }
                })
            },
            getMenusIdByRid(rid) {
                this.getRequest("/system/basic/permiss/role/" + rid).then(resp => {
                    if (resp) {
                        this.nodeChecked = resp;
                    }
                })
            },
            initRoles() {
                this.getRequest("/system/basic/permiss/").then(resp => {
                    if (resp) {
                        this.roles = resp;
                    }
                })
            }
        },

    }
</script>

<style>
    .el-input {
        width: 300px;
        margin-right: 8px;
    }

    .el-collapse {
        width: 700px;
        margin-top: 8px;
    }

</style>