<template>
    <div class="components-container">
        <el-tabs type = "border-card">
            <el-tab-pane>
                <span slot="label">我的提问</span>
                <el-alert title="Oops,你还没有提问" type="info"></el-alert>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label">我的回答</span>
                <el-alert title="Oops,你还没有回答" type="info"></el-alert>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label">我的分享</span>
                <el-alert title="Oops,你还没有分享" type="info"></el-alert>
                <li class="introduction"><router-link to="/share">快去分享叭</router-link></li>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<style scoped>
.introduction{
  font-size: 15px;
  text-decoration:none;
  color: rgb(195, 233, 106);
}
</style>