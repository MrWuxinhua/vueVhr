<template>
    <div>
        <div>
            <el-input v-model="jobLevel.name" prefix-icon="el-icon-plus" size="small" style="width: 200px"
                      placeholder="添加职称"></el-input>
            <el-select v-model="jobLevel.titleLevel" placeholder="职称等级" size="small"
                       style="margin-left: 8px ; margin-right: 8px ; width: 100px;">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button icon="el-icon-plus" type="primary" size="small" @click="addJobLevel">添加</el-button>
        </div>
        <div style="margin-top: 8px; margin-bottom: 8px;">
            <el-table
                    ref="multipleTable"
                    :data="jobLevels"
                    tooltip-effect="dark"
                    style="width: 80%"
                    size="small"
                    border
                    stripe
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别"
                        width="150">
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
                        <el-button size="mini" @click="showEditTable(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteJobLevelById(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-button @click="deleteJobLevels" type="danger" size="small" :disabled="this.multipleSelection == 0">
                批量删除
            </el-button>
        </div>
        <div>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    size="small"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag size="small">职称名称</el-tag>
                            </td>
                            <td>
                                <el-input size="small" style="width: 250px; margin-left: 8px"
                                          v-model="updateJobLevel.name"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag size="small">职称级别</el-tag>
                            </td>
                            <td>
                                <el-select size="small" v-model="updateJobLevel.titleLevel"
                                           style="margin-left: 8px ; width: 250px;">
                                    <el-option
                                            v-for="item in titleLevels"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag size="small" style="float: right">状态</el-tag>
                            </td>
                            <td>
                                <el-switch
                                        style="display: block ; margin: 8px;"
                                        v-model="updateJobLevel.enabled"
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
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateJobLevelById">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "JobLeveManage",
        data() {
            return {
                dialogVisible: false,
                titleLevels: [
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ],
                jobLevel: {
                    name: '',
                    titleLevel: ''
                },
                jobLevels: [],
                multipleSelection: [],
                updateJobLevel: {
                    name: '',
                    titleLevel: '',
                    enabled: false
                }
            }
        },
        mounted() {
            this.initJobLevels()
        },
        methods: {
            updateJobLevelById() {
                if (this.updateJobLevel.name && this.updateJobLevel.titleLevel) {

                    this.putRequest("/system/basic/jobLevel/", this.updateJobLevel).then(resp => {

                        if (resp && resp.status == 200) {
                            this.dialogVisible = false;
                            this.updateJobLevel.name = '';
                            this.updateJobLevel.titleLevel = '';
                            this.updateJobLevel.enabled=false;
                            this.initJobLevels()
                        }
                    })
                }
            },
            showEditTable(index, data) {
                Object.assign(this.updateJobLevel, data)
                this.dialogVisible = true
            },

            deleteJobLevels() {

                if (this.multipleSelection.length > 0) {
                    this.$confirm('此操作将永久删除【 ' + this.multipleSelection.length + ' 】 条数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let ids = '?'
                        this.multipleSelection.forEach(item => {
                            ids += "ids=" + item.id + "&";
                        })
                        this.deleteRequest("/system/basic/jobLevel/ids" + ids).then(resp => {
                            if (resp && resp.status == 200) {
                                this.initJobLevels();
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
            deleteJobLevelById(index, data) {
                this.$confirm('此操作将永久删除【 ' + data.name + ' 】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/jobLevel/" + data.id).then(resp => {
                        if (resp && resp.status == 200) {
                            this.initJobLevels();
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            addJobLevel() {
                if (this.jobLevel.name && this.jobLevel.titleLevel) {
                    this.postRequest("/system/basic/jobLevel/", this.jobLevel).then(resp => {
                        if (resp && resp.status == 200) {
                            this.jobLevel.name = '';
                            this.jobLevel.titleLevel = '';
                            this.initJobLevels();
                        }
                    })
                } else {
                    this.$message.error("职位名称或职位级别不能为空")
                }
            },
            initJobLevels() {
                this.getRequest("/system/basic/jobLevel/").then(resp => {
                    if (resp) {
                        this.jobLevels = resp;
                    }
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            }
        }
    }
</script>

<style scoped>

</style>