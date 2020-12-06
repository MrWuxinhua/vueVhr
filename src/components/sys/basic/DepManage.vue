<template>
    <div>
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
                prefix-icon="el-icon-search">
        </el-input>

        <el-tree
                class="filter-tree"
                :data="departments"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree"
                :expand-on-click-node="false"
                style="width: 470px">

             <span class="custom-tree-node" slot-scope="{ node, data }"
                   style="display: flex ;justify-content: space-between; width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
                  type="primary"
                  @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button
                  type="danger"
                  @click="() => delDepartment(data)">
            删除部门
          </el-button>
        </span>
      </span>

        </el-tree>
        <div>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag>上级部门</el-tag>
                            </td>
                            <td>{{partmentName}}</td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>添加部门</el-tag>
                            </td>
                            <td>
                                <el-input placeholder="请输入部门名称" v-model="department.name"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDepartment">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DepManage",
        data() {
            return {
                filterText: '',
                departments: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                department: {
                    name: '',
                    parentId: -1,
                },
                partmentName: '',
                dialogVisible: false


            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
            showAddDep(data) {
                this.dialogVisible = true;
                this.department.parentId = data.id;
                this.partmentName = data.name
            },
            addDepartment() {
                this.postRequest("/system/basic/department/", this.department).then(resp => {
                    if (resp && resp.status == 200) {
                        this.partmentName = '';
                        this.department.parentId = -1;
                        this.department.name = "";
                        this.dialogVisible = false;
                        this.departmentsAddContent(this.departments, resp.obj)
                    }
                })
            },

            delDepartment(data) {

                this.$confirm('此操作将永久删除【 ' + data.name+ ' 】 , 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    this.deleteRequest("/system/basic/department/"+data.id).then(resp => {
                        if(resp && resp.status == 200){
                            this.departmentRemoveData(this.departments ,data.id);
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            departmentRemoveData(data , id){

                for(let i = 0 ; i< data.length ; i++){
                    let datai =  data[i];
                    if(datai.id == id){
                        data.splice(i , 1);
                        return;
                    }else{
                        this.departmentRemoveData(datai.children ,id)
                    }
                }

            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            initDepartment() {
                this.getRequest("/system/basic/department/").then(resp => {
                    if (resp) {
                        this.departments = resp;
                    }
                })
            },
            departmentsAddContent(depData, newDepData) {
                for (let i = 0; i < depData.length; i++) {
                    let dep = depData[i];
                    if (dep.id == newDepData.parentId) {
                        dep.children = dep.children.concat(newDepData)
                        return;
                    } else {
                        this.departmentsAddContent(dep.children, newDepData)
                    }
                }
            }

        },
        mounted() {
            this.initDepartment()
        }

    }
</script>

<style>
    .el-button {
        padding: 2px;
    }

</style>