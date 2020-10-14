<template>
    <div class="components-container">
        <el-tabs type = "border-card">
            <el-tab-pane>
                <span slot="label">通知</span>
                <el-alert title="Oops,还没有收到消息" type="info"></el-alert>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label">群消息</span>
                <el-alert title="Oops,还没有收到消息" type="info"></el-alert>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style>

</style>