<template>
    <div>
        <div>
            <div style="display: flex ; justify-content: space-between ; margin-bottom: 10px">
                <div>
                    <el-input prefix-icon="el-icon-search"
                              placeholder="请输入员工姓名查询..."
                              v-model="empName"
                              style="width: 300px ; margin-right: 8px"
                              :disabled="showAdviceSearchView"
                              @keydown.enter.native="searchEmp"
                              clearable
                              @clear="searchEmp"
                    ></el-input>
                    <el-button icon="el-icon-search" type="primary" @click="searchEmp" :disabled="showAdviceSearchView">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="showAdviceSearchView = !showAdviceSearchView"><i
                            :class="showAdviceSearchView?'fa fa-angle-double-down':'fa fa-angle-double-up'"></i> 高级搜索
                    </el-button>
                </div>
                <div>
                    <el-upload
                            style="display: inline-flex ; margin-right: 10px"
                            action="/employee/basic/import/"
                            :disabled="isDisable"
                            :on-success="onSuccess"
                            :on-error="onError"
                            :before-upload="beforeup"
                            :show-file-list="false">
                        <el-button type="success" :disabled="isDisable" :icon="elIconImport">{{ipmortButtonContent}}
                        </el-button>
                    </el-upload>
                    <el-button type="success" @click="exportExcel" icon="el-icon-download"> 导出数据</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="showEmpEditView">添加员工</el-button>

                </div>
            </div>
            <transition name="fade">
                <div v-show="showAdviceSearchView"
                     style="border: #469eff solid 1px ; border-radius: 5px;; padding: 5px 10px ; margin: 8px 0; box-sizing: border-box ">
                    <el-row>
                        <el-col :span="5">
                            政治面貌:
                            <el-select v-model="advance.politicId" placeholder="请选择政治面貌" style="width: 250px">
                                <el-option
                                        v-for="policit in politicsstatuss"
                                        :key="policit.id"
                                        :label="policit.name"
                                        :value="policit.id">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="5">
                            民族:
                            <el-select v-model="advance.nationId" placeholder="请选择民族" style="width: 250px">
                                <el-option
                                        v-for="nation in nations"
                                        :key="nation.id"
                                        :label="nation.name"
                                        :value="nation.id">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="5">
                            职位:
                            <el-select v-model="advance.positionId" placeholder="请选择职位" style="width: 250px">
                                <el-option
                                        v-for="position in positions"
                                        :key="position.id"
                                        :label="position.name"
                                        :value="position.id">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="5">
                            职称:
                            <el-select v-model="advance.jobLevelId" placeholder="请选择职称" style="width: 250px">
                                <el-option
                                        v-for="joblevel in joblevels"
                                        :key="joblevel.id"
                                        :label="joblevel.name"
                                        :value="joblevel.id">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="4">
                            聘用形式:
                            <el-radio-group v-model="advance.engageForm">
                                <el-radio label="劳动合同">劳动合同</el-radio>
                                <el-radio label="劳务合同">劳务合同</el-radio>
                            </el-radio-group>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 5px">
                        <el-col :span="5">
                            所属部门:
                            <el-popover
                                    placement="right"
                                    title="请选择部门"
                                    width="250"
                                    trigger="manual"
                                    v-model="advanceDevVuew">
                                <el-tree default-expand-all :data="departments" :props="defaultProps"
                                         @node-click="advanceHandleNodeClick"></el-tree>

                                <div slot="reference" @click="showDevViewaAdvance" class="advanceDepmentSolt">
                                    {{advanceInputDep == null ? "请选择部门" : advanceInputDep}}
                                </div>
                            </el-popover>
                        </el-col>
                        <el-col :span="10">
                            入职日期:
                            <el-date-picker
                                    v-model="advance.beginAndEndDate"
                                    type="daterange"
                                    range-separator="至"
                                    style="width: 500px;"
                                    start-placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-col>
                        <el-col :span="3" :offset="6">
                            <el-button icon="el-icon-delete" @click="advanceClean">取消</el-button>
                            <el-button type="primary" icon="el-icon-search" @click="initEmps('advance')">搜索</el-button>
                        </el-col>
                    </el-row>
                </div>
            </transition>
        </div>


        <div>
            <el-table
                    :data="employees"
                    style="width: 100%"
                    v-loading="loading"
                    max-height="650">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        fixed
                        prop="name"
                        label="姓名"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="生日"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"
                        width="55">
                </el-table-column>

                <el-table-column
                        prop="nativePlace"
                        label="籍贯"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="politicsstatus.name"
                        label="政治面貌"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="140">
                </el-table-column>

                <el-table-column
                        prop="phone"
                        label="电话号码"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="address"
                        label="联系地址"
                        width="150">
                </el-table-column>

                <el-table-column
                        prop="department.name"
                        label="所属部门"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="jobLevel.name"
                        label="职称"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="position.name"
                        label="职位"
                        width="100">
                </el-table-column>

                <el-table-column
                        prop="engageForm"
                        label="聘用形式"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        label="最高学历"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="specialty"
                        label="所属专业"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="毕业院校"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        label="入职日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="workState"
                        label="在职状态"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="workID"
                        label="工号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="contractTerm"
                        label="合同期限(年)"
                        width="100">
                    <template slot-scope="scope">
                        {{scope.row.contractTerm}}<span v-if="scope.row.contractTerm">年</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        label="转正日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="notWorkDate"
                        label="离职日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        label="合同其实日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        label="合同终止日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="workAge"
                        label="工龄(月)"
                        width="100">
                    <template slot-scope="scope">
                        {{scope.row.workAge}}<span v-if="scope.row.workAge">个月</span>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="180">
                    <template slot-scope="scope">
                        <el-button @click="updateShow(scope.row)" style="padding: 2px" type="normal" size="mini">编辑
                        </el-button>
                        <el-button style="padding: 2px" type="primary" size="mini">查看高级资料</el-button>
                        <el-button @click="deleteEmployee(scope.row)" style="padding: 2px" type="danger" size="mini">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="display: flex ; justify-content: space-between ; margin-top: 8px">
            <div>
                <el-button type="danger">批量删除</el-button>
            </div>
            <div>
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="prev, pager, next ,total, sizes ,jumper"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="pageSize"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div>
            <el-dialog
                    :title="editEmployeeTitle"
                    :visible.sync="dialogVisible"
                    width="70%">
                <div>
                    <el-form ref="empForm" :rules="rules" :model="employee">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="姓名：" prop="name">
                                    <el-input placeholder="请输入员工姓名" prefix-icon="el-icon-edit" style=" width: 170px;"
                                              szie="mini" v-model="employee.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="性别：" prop="gender">
                                    <el-radio-group v-model="employee.gender" size="mini">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="出生日期：" prop="birthday">
                                    <el-date-picker
                                            v-model="employee.birthday"
                                            size="mini"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="出生日期"
                                            style="width: 170px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="政治面貌：" prop="politicId">
                                    <el-select v-model="employee.politicId" placeholder="政治面貌" size="mini">
                                        <el-option
                                                v-for="(polit,index) in politicsstatuss"
                                                :key="polit.id"
                                                :label="polit.name"
                                                :value="polit.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="民族：" prop="nationId">
                                    <el-select v-model="employee.nationId" placeholder="请选择民族" size="mini">
                                        <el-option
                                                v-for="(na,index) in nations"
                                                :key="na.id"
                                                :label="na.name"
                                                :value="na.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="籍贯：" prop="nativePlace">
                                    <el-input placeholder="员工籍贯" size="mini" v-model="employee.nativePlace"
                                              style="width: 170px"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="电子邮箱：" prop="email">
                                    <el-input placeholder="员工邮箱" prefix-icon="el-icon-message" v-model="employee.email"
                                              size="mini" style="width: 170px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="联系地址：" prop="address">
                                    <el-input placeholder="联系地址" prefix-icon="el-icon-edit" v-model="employee.address"
                                              size="mini" style="width: 170px;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="职位：" prop="posId">
                                    <el-select v-model="employee.posId" placeholder="请选择职位" size="mini">
                                        <el-option
                                                v-for="(posit ,index) in positions"
                                                :key="posit.id"
                                                :label="posit.name"
                                                :value="posit.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>


                            <el-col :span="5">
                                <el-form-item label="职称：" prop="jobLevelId">
                                    <el-select v-model="employee.jobLevelId" placeholder="请选择职称" size="mini">
                                        <el-option
                                                v-for="(jobleve, index) in joblevels"
                                                :key="jobleve.id"
                                                :label="jobleve.name"
                                                :value="jobleve.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="所属部门：" prop="departmentId">

                                    <el-popover
                                            placement="right"
                                            title="请选择部门"
                                            width="200"
                                            trigger="manual"
                                            v-model="devVuew">

                                        <el-tree default-expand-all :data="departments" :props="defaultProps"
                                                 @node-click="handleNodeClick"></el-tree>

                                        <div slot="reference" @click="showDevView" class="depmentSolt">{{inputDep}}
                                        </div>
                                    </el-popover>
                                </el-form-item>
                            </el-col>

                            <el-col :span="7">
                                <el-form-item label="电话号码：" prop="phone">
                                    <el-input placeholder="电话号码..." prefix-icon="el-icon-phone" v-model="employee.phone"
                                              size="mini" style="width: 170px;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="工号：" prop="workID">
                                    <el-input v-model="employee.workID"
                                              prefix-icon="el-icon-edit"
                                              size="mini" style="width: 170px;" disabled></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="5">
                                <el-form-item label="学历：" prop="tiptopDegree">
                                    <el-select v-model="employee.tiptopDegree" placeholder="最高学历" size="mini">
                                        <el-option
                                                v-for="(tip , index) in tiptopDegrees"
                                                :key="tip"
                                                :label="tip"
                                                :value="tip">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="毕业院校：" prop="school">
                                    <el-input placeholder="毕业院校..." prefix-icon="el-icon-edit" v-model="employee.school"
                                              size="mini" style="width: 170px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item label="专业名称：" prop="specialty">
                                    <el-input placeholder="专业名称..." prefix-icon="el-icon-edit"
                                              v-model="employee.specialty"
                                              size="mini" style="width: 170px;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="入职日期：" prop="beginDate">
                                    <el-date-picker
                                            v-model="employee.beginDate"
                                            size="mini"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="入职日期"
                                            style="width: 170px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="转正日期：" prop="conversionTime">
                                    <el-date-picker
                                            v-model="employee.conversionTime"
                                            size="mini"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="转正日期"
                                            style="width: 170px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="合同起始日期：" prop="beginContract">
                                    <el-date-picker
                                            v-model="employee.beginContract"
                                            size="mini"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="合同起始日期"
                                            style="width: 170px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="合同终止日期：" prop="endContract">
                                    <el-date-picker
                                            v-model="employee.endContract"
                                            size="mini"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="合同终止日期"
                                            style="width: 170px">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="身份证号码" prop="idCard">
                                    <el-input placeholder="请输入身份证号码" v-model="employee.idCard" size="mini"
                                              prefix-icon="el-icon-postcard" style="width: 250px"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="聘用形式：" prop="engageForm">
                                    <el-radio-group v-model="employee.engageForm" size="mini">
                                        <el-radio label="劳务合同">劳务合同</el-radio>
                                        <el-radio label="劳动合同">劳动合同</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="婚姻状况：" prop="wedlock">
                                    <el-radio-group v-model="employee.wedlock" size="mini">
                                        <el-radio label="未婚">未婚</el-radio>
                                        <el-radio label="已婚">已婚</el-radio>
                                        <el-radio label="离异">离异</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false ">取 消</el-button>
                    <el-button type="primary" @click="editEmployee">确 定</el-button>
                 </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                devVuew: false,
                employees: [],
                loading: false,
                empName: '',
                dialogVisible: false,
                showAdviceSearchView: false,
                joblevels: [],
                nations: [],
                politicsstatuss: [],
                positions: [],
                departments: [],
                advanceInputDep: null,
                inputDep: '',
                advanceDevVuew: false,
                editEmployeeTitle: '',
                elIconImport: "el-icon-upload2",
                isDisable: false,
                ipmortButtonContent: "导入数据",
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tiptopDegrees: ["小学", "初中", "高中", "中专", "大专", "本科", "研究生", "博士", "硕士"],
                employee: {

                    name: "",
                    gender: "男",
                    birthday: "",
                    idCard: "",
                    wedlock: "未婚",
                    nationId: "",
                    nativePlace: "",
                    politicId: "",
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: "",
                    jobLevelId: "",
                    posId: "",
                    engageForm: "劳务合同",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: "",
                    conversionTime: "",
                    notWorkDate: "",
                    beginContract: "",
                    endContract: "",
                    workAge: ""
                },
                rules: {
                    name: [{required: true, message: "请输入员工姓名", trigger: "blur"}],
                    gender: [{required: true, message: "请选择性别", trigger: "change"}],
                    idCard: [{required: true, message: "请输入身份证号", trigger: "blur"},
                        {
                            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|( ^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                            message: "请输入正确的身份证格式",
                            trigger: "blur"
                        }],
                    birthday: [{required: true, message: "请输入出生日期", trigger: "blur"}],
                    wedlock: [{required: true, message: "请选择婚姻状况", trigger: "change"}],
                    nationId: [{required: true, message: "请选择民族", trigger: "blur"}],
                    nativePlace: [{required: true, message: "请输入籍贯", trigger: "blur"}],
                    politicId: [{required: true, message: "请选择政治面貌", trigger: "blur"}],
                    email: [{required: true, message: "请输入邮箱", trigger: "blur"},
                        {type: "email", message: "请输入正确的邮箱格式", trigger: ['blur', 'change']}],
                    phone: [{required: true, message: "请输入电话号码", trigger: "blur"},
                        {
                            pattern: /^(((13[0-9]{1})|(14[57]{1})|(15[012356789]{1})|(17[03678]{1})|(18[0-9]{1})|(19[89]{1})|(16[6]{1}))+\d{8})$/,
                            message: "请输入正确的手机格式",
                            trigger: "blur"
                        }],
                    address: [{required: true, message: "请输入联系地址", trigger: "blur"}],
                    departmentId: [{required: true, message: "请选择所属部门", trigger: "blur"}],
                    jobLevelId: [{required: true, message: "请选择职称", trigger: "blur"}],
                    posId: [{required: true, message: "请选择职位", trigger: "blur"}],
                    engageForm: [{required: true, message: "请输入聘用形式", trigger: "blur"}],
                    tiptopDegree: [{required: true, message: "请选择学历", trigger: "blur"}],
                    specialty: [{required: true, message: "请输入所属专业", trigger: "blur"}],
                    school: [{required: true, message: "请输入所属院校", trigger: "blur"}],
                    beginDate: [{required: true, message: "请输入入职日期", trigger: "blur"}],
                    workState: [{required: true, message: "请输入在职状态", trigger: "blur"}],
                    workID: [{required: true, message: "请输入工号", trigger: "blur"}],
                    contractTerm: [{required: true, message: "请输入合同期限", trigger: "blur"}],
                    conversionTime: [{required: true, message: "请输入转正日期", trigger: "blur"}],
                    notWorkDate: [{required: true, message: "请输入离职日期", trigger: "blur"}],
                    beginContract: [{required: true, message: "请输入合同起始日期", trigger: "blur"}],
                    endContract: [{required: true, message: "请输入合同终止日期", trigger: "blur"}]
                },
                advance: {
                    politicId: '',  //政治面貌
                    nationId: '',  //民族
                    positionId: '', //职位
                    jobLevelId: '', //职称
                    engageForm: '',  //聘用形式
                    departmentId: '',  //部门
                    beginAndEndDate: "",  //入职日期
                }
            }
        },
        mounted() {
            this.initEmps();

            //临时
            this.initPosition();
            this.initJobLeves();
            this.initDepartments();

            let nations = JSON.parse(window.sessionStorage.getItem("nations"));
            if (nations) {
                this.nations = nations;
            } else {
                this.initNations();
            }

            let politicsstatuss = JSON.parse(window.sessionStorage.getItem("politicsstatuss"));
            if (politicsstatuss) {
                this.politicsstatuss = politicsstatuss;
            } else {
                this.initPoliticsstatuss();
            }


        },
        watch: {

            dialogVisible(val, oldVal) {
                if (!val) {
                    this.initEmployee();
                }
            }

        },
        methods: {
            advanceClean() {
                this.showAdviceSearchView = false;
                this.advance = {
                    politicId: '',  //政治面貌
                    nationId: '',  //民族
                    positionId: '', //职位
                    joblevelId: '', //职称
                    engageForm: '',  //聘用形式
                    departmentId: '',  //部门
                    beginAndEndDate: "",  //入职日期
                }
            },


            beforeup() {
                this.elIconImport = "el-icon-loading";
                this.isDisabled = true
                this.ipmortButtonContent = "正在导入"

            },
            onSuccess(response, file, fileList) {
                this.initEmps();
                this.elIconImport = "el-icon-upload2";
                this.isDisabled = false
                this.ipmortButtonContent = "导入数据"
                this.$message.success("导入数据成功")
            },
            onError(err, file, fileList) {
                this.elIconImport = "el-icon-upload2";
                this.isDisabled = false
                this.ipmortButtonContent = "导入数据"
                this.$message.error("导入数据失败")
            },

            exportExcel() {
                window.open("/employee/basic/export/?keyWords=" + this.empName.trim(), "_parent")

            },
            initEmployee() {
                this.employee = {
                    name: "",
                    gender: "男",
                    birthday: "",
                    idCard: "",
                    wedlock: "未婚",
                    nationId: "",
                    nativePlace: "",
                    politicId: "",
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: "",
                    jobLevelId: "",
                    posId: "",
                    engageForm: "劳务合同",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: "",
                    conversionTime: "",
                    notWorkDate: "",
                    beginContract: "",
                    endContract: "",
                    workAge: ""
                };
                this.inputDep = "";

            },
            updateShow(data) {
                this.editEmployeeTitle = "编辑员工资料";

                this.initJobLeves();
                this.initPosition();
                this.initDepartments();
                this.dialogVisible = true

                this.employee = data;
                this.inputDep = data.department.name;

            },
            editEmployee() {
                if (this.employee.id) {
                    this.updateEmployee();
                } else {
                    this.addEmployee();
                }

            },
            updateEmployee() {
                this.putRequest("/employee/basic/", this.employee).then(resp => {
                    if (resp && resp.status == 200) {
                        this.initEmps();
                        this.dialogVisible = false;
                    }
                })
            },
            addEmployee() {
                this.$refs["empForm"].validate(valid => {
                    if (valid) {
                        this.postRequest("/employee/basic/", this.employee).then(resp => {
                            if (resp) {
                                this.initEmps();
                                this.dialogVisible = false;
                            }
                        })
                    }
                })
            },

            deleteEmployee(data) {

                this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/?id=" + data.id).then(resp => {
                        if (resp && resp.status == 200) {
                            this.initEmps();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },

            handleNodeClick(data) {
                this.devVuew = false;
                this.employee.departmentId = data.id;
                this.inputDep = data.name;
            },
            advanceHandleNodeClick(data) {
                this.advanceDevVuew = false;
                this.advance.departmentId = data.id;
                this.advanceInputDep = data.name;
            },

            showDevView() {
                this.devVuew = !this.devVuew;
            },
            showDevViewaAdvance() {
                this.advanceDevVuew = !this.advanceDevVuew;
            },
            showEmpEditView() {
                this.initJobLeves();
                this.initPosition();
                this.initMarkWorkId();
                this.initDepartments();
                this.dialogVisible = true
            },
            initEmps(type) {
                this.loading = true
                let url = "/employee/basic/?page=" + this.currentPage + "&size=" + this.pageSize;

                if (type && type == "advance") {
                    url = url + "&politicId=" + this.advance.politicId + "&nationId=" + this.advance.nationId
                        + "&posId=" + this.advance.positionId + "&jobLevelId=" + this.advance.jobLevelId
                        + "&engageForm=" + this.advance.engageForm + "&departmentId=" + this.advance.departmentId
                        + "&beginAndEndDate=" + this.advance.beginAndEndDate
                } else {
                    url = url + "&name=" + this.empName.trim()
                }

                this.getRequest(url).then(resp => {
                    this.loading = false
                    if (resp) {
                        this.total = resp.total;
                        this.employees = resp.data
                    }
                })
            },
            //    每页数量发生改变时
            handleSizeChange(val) {
                this.pageSize = val;
                if (this.showAdviceSearchView) {
                    this.initEmps("advance");
                } else {
                    this.initEmps();
                }
            },
            //当前页发生改变时
            handleCurrentChange(val) {
                this.currentPage = val;
                if (this.showAdviceSearchView) {
                    this.initEmps("advance");
                } else {
                    this.initEmps();
                }
            },
            searchEmp() {
                this.currentPage = 1;
                this.initEmps();
            },
            initJobLeves() {
                this.getRequest("/employee/basic/jobleves/").then(resp => {
                    if (resp) {
                        this.joblevels = resp;
                    }
                })
            },
            initNations() {
                this.getRequest("/employee/basic/nations/").then(resp => {
                    if (resp) {
                        window.sessionStorage.setItem("nations", JSON.stringify(resp))
                    }
                })
            },
            initPoliticsstatuss() {
                //政治面貌
                this.getRequest("/employee/basic/politicsstatuss/").then(resp => {
                    if (resp) {
                        window.sessionStorage.setItem("politicsstatuss", JSON.stringify(resp))
                    }
                })
            },
            initPosition() {  //职位
                this.getRequest("/employee/basic/positions/").then(resp => {
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            initDepartments() {
                this.getRequest("/employee/basic/departments/").then(resp => {
                    if (resp) {
                        this.departments = resp;
                    }
                })
            },
            initMarkWorkId() {
                this.getRequest("/employee/basic/maxWorkId/").then(resp => {
                    if (resp && resp.status == 200) {
                        this.employee.workID = resp.obj;
                    }
                })
            }


        }
    }
</script>

<style>
    .depmentSolt {
        display: inline-flex;
        width: 170px;
        height: 26px;
        border: #dedede 1px solid;
        border-radius: 5px;
        box-sizing: border-box;
        font-size: 13px;
        cursor: pointer;
        align-items: center;
        padding-left: 8px;
    }

    .advanceDepmentSolt {
        display: inline-flex;
        width: 250px;
        height: 30px;
        border-radius: 5px;
        border: #dedede 1px solid;
        box-sizing: border-box;
        font-size: 13px;
        cursor: pointer;
        align-items: center;
        padding-left: 12px;
        color: #C0C4CC;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .9s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0.3;
    }


</style>