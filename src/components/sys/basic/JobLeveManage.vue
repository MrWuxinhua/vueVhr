<template>
    <div>
        <div>
            <el-input prefix-icon="el-icon-plus" size="small" style="width: 250px" placeholder = "添加职称"></el-input>
            <el-select v-model="jobLeve" placeholder="职称等级" size = "small" style="margin-left: 8px ; margin-right: 8px ; width: 150px;">
                <el-option
                        v-for="item in jobLeveMangers"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
        </div>
        <div>

        </div>

    </div>
</template>

<script>
    export default {
        name: "JobLeveManage",
        data(){
            return {
                jobLeveMangers :[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级'
                ],
                jobLeve:''
            }
        }
    }
</script>

<style scoped>

</style>