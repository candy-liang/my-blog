<template>
    <el-card v-if="is_admin">
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
                <el-tab-pane label="留言管理" name="message" lazy>
                    <Message v-if="now_name == 'message'" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>
    <el-dialog v-model="admin_dialog" title="管理员登录" :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" width="500px" center>
        <el-input v-model="password" @keyup.enter.native="login" placeholder="请输入管理员密码" />
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="login">登录</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import Class from "./article/Class.vue";
import List from "./article/List.vue";
import Friend from "./friend/index.vue";
import Message from "./message/index.vue";
import type { TabsPaneContext } from 'element-plus'
import { skipRouter } from "../../hooks/router.hook";
const route = useRoute()
// 检测是否有权限
const is_admin = window.localStorage.getItem('admin_psw') == 'liangyaokang';
const admin_dialog = ref(false)
const password = ref('')

if (!is_admin) {
    admin_dialog.value = true
}
const login = () => {
    if (password.value != 'liangyaokang') {
        ElMessage.error('密码错误')
        return
    }
    window.localStorage.setItem('admin_psw', 'liangyaokang');
    ElMessage.success('登录成功,即将刷新')
    admin_dialog.value = false
    setTimeout(() => {
        location.reload()
    }, 1000);
}

const active_name = ref('class')
const now_name = ref('lass')
active_name.value = route.query.active_name as string || 'class'
now_name.value = active_name.value

const handleClick = async (tab: TabsPaneContext) => {
    await skipRouter("admin", { active_name: tab.paneName })
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