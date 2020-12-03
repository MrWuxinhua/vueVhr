<template>
    <div>
        <div>
            <el-input
                    class="postAddInput"
                    size="small"
                    placeholder="添加职位"
                    prefix-icon="el-icon-plus"
                    @keydown.enter.native='addPosition'
                    v-model="pos.name">
            </el-input>
            <el-button size="small" type="primary" @click="addPosition">添加</el-button>
        </div>
        <div class="postManageTable">
            <el-table
                    :data="positions"
                    size="small"
                    border
                    stripe
                    style="width: 75%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="状态"
                        width="130">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>已经用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size = "small" style="margin-top: 8px" plain :disabled="this.multipleSelection.length == 0" @click="deletePositionByIds">批量删除</el-button>
        </div>
        <div>
            <el-dialog
                    title="修改职位"
                    :visible.sync="dialogVisible"
                    width="25%">
                <div>
                    <table>
                        <tr>
                            <td><el-tag size='small'>职位</el-tag></td>
                            <td><el-input size='small' class="updatePositionInput" v-model="updatePos.name" @keydown.enter.native = 'updatePosition'></el-input></td>
                        </tr>
                        <tr>
                            <td><el-tag size='small'>状态</el-tag></td>
                            <td>
                                <el-switch
                                        style="display: block ; margin-left: 8px"
                                        v-model="updatePos.enabled"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-text="启用"
                                        inactive-text="禁用">
                                </el-switch>
                            </td>
                        </tr>
                    </table>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size='small' @click="dialogVisible = false">取 消</el-button>
                    <el-button size='small' type="primary" @click="updatePosition">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PostManage",
        data() {
            return {
                pos: {
                    name: ''
                },
                updatePos:{
                    name: '',
                    enabled:false
                },
                multipleSelection:[],
                positions: [],
                dialogVisible: false
            }
        },
        mounted() {
            this.initPositions()
        },
        methods: {
            deletePositionByIds(){
                if(this.multipleSelection.length >0 ){
                    this.$confirm('此操作将永久删除 【' + this.multipleSelection.length+ '】 条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {

                        let ids = '?'
                        this.multipleSelection.forEach(item => {
                            ids += "ids=" + item.id + "&"
                        })
                        this.deleteRequest("/system/basic/position/delePosByIds" + ids).then(resp => {
                            if(resp && resp.status == 200 ){
                                this.initPositions();
                            }
                        })

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }


            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },

            updatePosition(){
                this.putRequest("/system/basic/position/" , this.updatePos).then(response => {
                  if(response && response.status == 200){
                      this.dialogVisible = false;
                      this.updatePos.name = '';
                      this.initPositions();
                  }
                })
            },
            showEditView(index, data) {
                Object.assign(this.updatePos , data);
                // this.updatePos = data;
                this.dialogVisible = true
            },
            handleDelete(index, data) {

                this.$confirm('此操作将永久删除 【' + data.name + '】 , 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {

                    this.deleteRequest("/system/basic/position/" + data.id).then(response => {
                        if (response && response.status == 200) {
                            this.initPositions()
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            initPositions() {
                this.getRequest("/system/basic/position/").then(response => {
                    if (response) {
                        this.positions = response;
                    }
                })
            },
            addPosition() {
                if (this.pos.name) {
                    this.postRequest("/system/basic/position/", this.pos).then(response => {
                        if (response && response.status == 200) {
                            this.initPositions()
                            this.pos.name = ''
                        }
                    })
                } else {
                    this.$message.error("职务名称不能为空")
                }


            }
        }
    }
</script>

<style>
    .postManageTable {
        margin-top: 10px;
    }

    .postAddInput {
        width: 300px;
        margin-right: 5px
    }

    .updatePositionInput {
        margin-left: 8px;
        width: 230px;
    }

</style>