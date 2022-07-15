<template>
    <el-card>
        <div class="admin">
            <el-tabs tab-position="left" style="height: 100%" class="demo-tabs">
                <el-tab-pane label="文章分类">
                    <Class />
                </el-tab-pane>
                <el-tab-pane label="我的文章">
                    <List />
                </el-tab-pane>
                <el-tab-pane label="博客总览">博客总览</el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
</template>
              
              
<script setup lang="ts">
import Class from "./article/Class.vue";
import List from "./article/List.vue";
</script>
              
              
<style lang="scss" scoped>
.admin {
    // min-height: 500px;
}
</style>