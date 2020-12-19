<template>
    <div>
        <div>
            <el-table
                    :data="empAndSalarySobs"
                    v-loading="loading"
                    border
                    style="width: 100%">
                <el-table-column type="selection"
                                 align="center"
                                 width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        align="center"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="workID"
                        label="工号"
                        align="center"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="电子邮件"
                        align="center"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="电话号码"
                        align="center"
                        width="250">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="所属部门"
                        align="center"
                        width="200">
                </el-table-column>
                <el-table-column
                        label="工资账套"
                        align="center"
                        min-width="250">
                    <template slot-scope="scope">
                        <el-tooltip placement="right" v-if="scope.row.salary">
                            <div slot="content">
                                <table>
                                    <tr>
                                        <td>基本工资:</td>
                                        <td>{{scope.row.salary.basicSalary}}元</td>
                                    </tr>
                                    <tr>
                                        <td>奖金:</td>
                                        <td>{{scope.row.salary.bonus}}元</td>
                                    </tr>
                                    <tr>
                                        <td>午餐补助:</td>
                                        <td>{{scope.row.salary.lunchSalary}}元</td>
                                    </tr>
                                    <tr>
                                        <td>交通补助:</td>
                                        <td>{{scope.row.salary.trafficSalary}}元</td>
                                    </tr>
                                    <tr>
                                        <td>养老金基数:</td>
                                        <td>{{scope.row.salary.pensionBase}}元</td>
                                    </tr>
                                    <tr>
                                        <td>养老金比率:</td>
                                        <td>{{scope.row.salary.pensionPer}}</td>
                                    </tr>
                                    <tr>
                                        <td>公积金基数:</td>
                                        <td>{{scope.row.salary.accumulationFundBase}}元</td>
                                    </tr>
                                    <tr>
                                        <td>公积金比率:</td>
                                        <td>{{scope.row.salary.accumulationFundPer}}</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险基数:</td>
                                        <td>{{scope.row.salary.medicalBase}}元</td>
                                    </tr>
                                    <tr>
                                        <td>医疗保险比率:</td>
                                        <td>{{scope.row.salary.medicalPer}}</td>
                                    </tr>
                                </table>
                            </div>
                            <el-tag size="medium">{{scope.row.salary.name}}</el-tag>
                        </el-tooltip>
                        <el-tag v-else>暂未设置</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        min-width="150">
                    <template slot-scope="scope">
                        <el-popover
                                placement="left"
                                title="修改工资账套"
                                @show="showPop(scope.row.salary)"
                                @hide="hidePop(scope.row)"
                                width="200"
                                trigger="click">
                            <div>
                                <el-select v-model="salaryId"
                                           placeholder="请选择工资账套..."
                                           size="mini">
                                    <el-option
                                            v-for="item in salarySobs"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-button slot="reference" type="danger">修改账套</el-button>
                        </el-popover>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    align="right"
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: "SalSobCfg",
        data() {
            return {
                loading: false,
                showSalarySobEdit: false,
                total: 0,
                pageSize: 10,
                currentPage: 1,
                salaryId: null,
                empAndSalarySobs: [],
                salarySobs: []
            }
        },
        mounted() {
            this.initEmpAndSalarySbos();
            this.initSalarySobs();
        },
        methods: {
            showPop(data) {
                if (data.id) {
                    this.salaryId = data.id
                }
            },
            hidePop(data) {
                if ((data.salary == null && this.salaryId == null) || (data.salary && (data.salary.id == this.salaryId))) {
                    return;
                }

                this.putRequest("/salary/cfg/?empId=" + data.id + "&currentSalaryId=" + this.salaryId).then(resp => {
                    if (resp && resp.status == 200) {
                        this.initEmpAndSalarySbos();
                    }
                    this.salaryId = null;
                })
            },
            // salaryChage() {
            //     this.showSalarySobEdit = false;
            // },
            initEmpAndSalarySbos() {
                let url = "/salary/cfg/?";
                url = url + "currentPage=" + this.currentPage + "&pageSize=" + this.pageSize;

                this.getRequest(url).then(resp => {
                    if (resp) {
                        this.empAndSalarySobs = resp.data;
                        this.total = resp.total;
                    }
                })
            },
            initSalarySobs() {
                this.getRequest("/salary/sob/").then(resp => {
                    this.salarySobs = resp;
                })

            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.initEmpAndSalarySbos();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initEmpAndSalarySbos();
            }
        }
    }
</script>

<style scoped>

</style>