<template>
    <el-card>
        <div class="admin">
            <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick" style="height: 100%"
                class="demo-tabs">
                <el-tab-pane label="文章分类" name="class" lazy>
                    <Class />
                </el-tab-pane>
                <el-tab-pane label="我的文章" name="article" lazy>
                    <List />
                </el-tab-pane>
                <el-tab-pane label="友链管理" name="friend" lazy>
                    <Friend />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
</template>
              
              
<script setup lang="ts">
import Class from "./article/Class.vue";
import List from "./article/List.vue";
import Friend from "./friend/index.vue";
import type { TabsPaneContext } from 'element-plus'
const router = useRouter()
const route = useRoute()

const activeName = ref('class')
activeName.value = route.query.activeName as string || 'class'
const handleClick = (tab: TabsPaneContext) => {
    router.push({
        name: "admin",
        query: { activeName: tab.paneName }
    })

}
</script>
              
              
<style lang="scss" scoped>
.admin {

    // min-height: 500px;
    :deep(.el-tabs__header) {
        margin-right: 20px;
    }
}
</style>