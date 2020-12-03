<template>
    <div>
        <el-tabs v-model="activeName" type="card" >
            <el-tab-pane label="部门管理" name="depMana"><depManage></depManage></el-tab-pane>
            <el-tab-pane label="职位管理" name="postMana"><postManage></postManage></el-tab-pane>
            <el-tab-pane label="职称管理" name="jobLeveMana"><jobLeveManage></jobLeveManage></el-tab-pane>
            <el-tab-pane label="奖惩规则" name="ecMana"><ecManage></ecManage></el-tab-pane>
            <el-tab-pane label="权限组" name="permissMana"><permissManage></permissManage></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import depManage from '@/components/sys/basic/DepManage'
    import postManage from '@/components/sys/basic/PostManage'
    import jobLeveManage from '@/components/sys/basic/JobLeveManage'
    import ecManage from '@/components/sys/basic/EcManage'
    import permissManage from '@/components/sys/basic/PermissManage'

    export default {
        name: "SysBasic",
        data(){
            return {
                activeName : 'depMana'
            }
        },
        components:{
            depManage,
            postManage,
            jobLeveManage,
            ecManage,
            permissManage

        }

    }
</script>

<style scoped>

</style>