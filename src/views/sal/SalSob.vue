<template>
    <div>
        <div style="display: flex; justify-content: space-between ; margin-bottom: 10px">
            <el-button icon="el-icon-plus" type="primary" @click="showAddSalarySob">添加账套</el-button>
            <el-button icon="el-icon-refresh" type="success" @click="initSalarySob"></el-button>
        </div>
        <div>
            <el-table
                    v-loading="loading"
                    :data="salarySobs"
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="账套名称"
                        align="center"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="basicSalary"
                        label="基本工资(元)"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="trafficSalary"
                        label="交通补助(元)"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="lunchSalary"
                        label="午餐补助(元)"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="bonus"
                        label="奖金(元)"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="启用时间"
                        align="center"
                        width="120">
                </el-table-column>
                <el-table-column label="养老金" align="center">
                    <el-table-column
                            prop="pensionPer"
                            label="比率"
                            align="center"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="pensionBase"
                            label="基数"
                            align="center"
                            width="100">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="医疗保险" align="center">
                    <el-table-column
                            prop="medicalPer"
                            label="比率"
                            align="center"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="medicalBase"
                            label="基数"
                            align="center"
                            width="100">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="公积金" align="center">
                    <el-table-column
                            prop="accumulationFundPer"
                            label="比率"
                            align="center"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="accumulationFundBase"
                            label="基数"
                            align="center"
                            width="100">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <el-table-column label="编辑" align="center">
                        <template slot-scope="scope">
                            <el-button @click="showEditSalarySob(scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="删除" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="deleteSalaryById(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin-top: 10px">
            <el-button type="danger" :disabled="deleteDisabled">批量删除</el-button>
        </div>


        <div>
            <el-dialog
                    :title="salarySobEditOrEdit"
                    :visible.sync="dialogVisible"
                    width="50%">
                <div style="display: flex">
                    <div style="display: flex ; justify-content: space-around;align-items: center">
                        <el-steps direction="vertical" :active="activeNum">
                            <el-step v-for="(salarySobTitle , index) in salarySobTitles" :key="index"
                                     :title="salarySobTitle"></el-step>
                        </el-steps>
                        <el-input v-for="(value,title , index) in salarySob"
                                  :key="index"
                                  :placeholder="'请输入'+salarySobTitles[index]+'...' "
                                  v-show="activeNum == index"
                                  style="width: 250px ; height: 26px;margin-left: 150px"
                                  @keydown.enter.native="nextTep"
                                  v-model="salarySob[title]">
                        </el-input>
                    </div>
                </div>
                <span slot="footer" style="display: flex ; justify-content: center">
                    <el-button round type="success" @click="backTep">{{(activeNum == salarySobTitles.length-1 || activeNum == 0) ?'取消':'上一步'}}</el-button>
                    <el-button round type="primary" @click="nextTep">{{activeNum == salarySobTitles.length-1 ? '完成' : '下一步'}}</el-button>
                 </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                deleteDisabled: true,
                loading: false,
                dialogVisible: false,
                salarySobs: [],
                activeNum: 0,
                salarySobEditOrEdit: '添加工资账套',
                salarySobTitles: [
                    "账套名称",
                    "基本工资",
                    "交通壕补助",
                    "午餐补助",
                    "奖金",
                    "养老金比率",
                    "养老金基数",
                    "医疗保险比率",
                    "医疗保险基数",
                    "公积金比率",
                    "公积金基数"
                ],
                salarySob: {
                    name: '', //账套名称
                    basicSalary: '',  //基本工资
                    trafficSalary: '',  //交通补贴
                    lunchSalary: '', //午餐补助
                    bonus: '', //奖金
                    pensionPer: '', //养老金比率
                    pensionBase: '', //养老金基数
                    medicalPer: '', //医疗保险比率
                    medicalBase: '', //医疗保险基数
                    accumulationFundPer: '', //公积金比率
                    accumulationFundBase: '' //公积金基数
                }
            }
        },
        mounted() {
            this.initSalarySob();
        },
        methods: {

            showAddSalarySob() {
                this.salarySobEditOrEdit = '添加工资账套';
                this.salarySob = {
                    name: '', //账套名称
                    basicSalary: '',  //基本工资
                    trafficSalary: '',  //交通补贴
                    lunchSalary: '', //午餐补助
                    bonus: '', //奖金
                    pensionPer: '', //养老金比率
                    pensionBase: '', //养老金基数
                    medicalPer: '', //医疗保险比率
                    medicalBase: '', //医疗保险基数
                    accumulationFundPer: '', //公积金比率
                    accumulationFundBase: '' //公积金基数
                };
                this.activeNum = 0;
                this.dialogVisible = true;
            },
            showEditSalarySob(data) {
                this.salarySobEditOrEdit = '编辑工资账套';
                this.salarySob.name = data.name; //账套名称
                this.salarySob.basicSalary = data.basicSalary; //基本工资
                this.salarySob.trafficSalary = data.trafficSalary;  //交通补贴
                this.salarySob.lunchSalary = data.lunchSalary;//午餐补助
                this.salarySob.bonus = data.bonus; //奖金
                this.salarySob.pensionPer = data.pensionPer; //养老金比率
                this.salarySob.pensionBase = data.pensionBase;//养老金基数
                this.salarySob.medicalPer = data.medicalPer; //医疗保险比率
                this.salarySob.medicalBase = data.medicalBase; //医疗保险基数
                this.salarySob.accumulationFundPer = data.accumulationFundPer; //公积金比率
                this.salarySob.accumulationFundBase = data.accumulationFundBase; //公积金基数
                this.salarySob.id = data.id;

                this.activeNum = 0;
                this.dialogVisible = true;
            },
            //初始化工资套账所有数据
            initSalarySob() {
                this.loading = true;
                this.getRequest("/salary/sob/").then(resp => {
                    this.loading = false;
                    if (resp) {
                        this.salarySobs = resp
                    }
                })

            },
            deleteSalaryById(data) {

                this.$confirm('确认关闭删除【 ' + data.name + "】的工资账套信息吗？")
                    .then(success => {
                        this.deleteRequest("/salary/sob/" + data.id).then(resp => {
                            if (resp && resp.status == 200) {
                                this.initSalarySob();
                            }
                        })
                    })
                    .catch(_error => {
                        this.$message.error(error)
                    });

            },
            //上一步
            backTep() {
                if (this.activeNum == 0 || this.activeNum == this.salarySobTitles.length - 1) {
                    this.dialogVisible = false;
                } else {
                    this.activeNum--;
                }
            },
            //下一步
            nextTep() {
                if (this.activeNum == (this.salarySobTitles.length - 1)) {

                    if (this.salarySob.id) {
                        this.putRequest("/salary/sob/", this.salarySob).then(resp => {
                            if (resp && resp.status == 200) {
                                this.initSalarySob();
                            }
                        })
                    } else {
                        this.postRequest("/salary/sob/", this.salarySob).then(resp => {
                            if (resp && resp.status == 200) {
                                this.initSalarySob();
                            }
                        })
                    }
                    this.dialogVisible = false;
                } else {
                    this.activeNum++;
                }
            }
            ,
            handleSelectionChange() {

            }
        }
    }
</script>

<style>

</style>