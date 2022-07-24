<template>
    <el-card>
        <div class="admin">
            <el-tabs v-model="active_name" tab-position="left" @tab-click="handleClick" style="height: 100%"
                class="demo-tabs">
                <el-tab-pane label="文章分类" name="class" lazy>
                    <Class v-if="now_name == 'class'" />
                </el-tab-pane>
                <el-tab-pane label="我的文章" name="article" lazy>
                    <List v-if="now_name == 'article'" />
                </el-tab-pane>
                <el-tab-pane label="友链管理" name="friend" lazy>
                    <Friend v-if="now_name == 'friend'" />
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

const active_name = ref('class')
const now_name = ref('lass')
active_name.value = route.query.active_name as string || 'class'
now_name.value = active_name.value

const handleClick = async (tab: TabsPaneContext) => {
    await router.push({
        name: "admin",
        query: {
            active_name: tab.paneName,
            current_page: 1,
            page_size: 10
        }
    })
    now_name.value = tab.paneName as string
}
</script>
              
              
<style lang="scss" scoped>
.admin {

    :deep(.el-tabs__header) {
        margin-right: 20px;
    }
}
</style>