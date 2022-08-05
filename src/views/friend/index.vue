<template>
    <el-card class="card">
        <h3>友链
            <el-button :icon="Plus" @click="friend_link_dialog = true" title="申请添加友链" class="ml10" circle
                size="small" />
        </h3>
        <div class="friend-link" v-for="item in friend_list" @click="linkTo(item.link)" :title="item.introduction"
            v-show="friend_list.length && item.status == 'show'">
            <el-avatar :src="item.logo" class="avatar">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
            <div class="name">
                <h4>{{ item.name }}</h4>
                <p>— {{ item.introduction }}</p>
            </div>
        </div>
        <el-skeleton style="width:100%;margin-bottom: 15px;" v-for="item in 4" v-show="skeleton_friend" animated>
            <template #template>
                <div style="display: flex">
                    <el-skeleton-item variant="image" style="width: 40px; height: 40px;border-radius: 50%;" />
                    <div style="flex:1;margin-left: 10px;">
                        <el-skeleton-item variant="text" style="width: 40%" />
                        <el-skeleton-item variant="text" style="width: 100%" />
                    </div>
                </div>
            </template>
        </el-skeleton>
        <el-empty v-show="!skeleton_friend && !friend_list.length" :image-size="100" style="padding:10px 0"
            description="暂无友链" />
    </el-card>

    <el-dialog v-model="friend_link_dialog" title="填写友链信息" width="500px " center>
        <el-form label-width="90px">
            <el-form-item label="友链名称" required>
                <el-input v-model="new_friendLink.name" />
            </el-form-item>
            <el-form-item label="logo地址" required>
                <el-input v-model="new_friendLink.logo" />
            </el-form-item>
            <el-form-item label="友链地址" required>
                <el-input v-model="new_friendLink.link" />
            </el-form-item>
            <el-form-item label="简介描述">
                <el-input v-model="new_friendLink.introduction" :autosize="{ minRows: 2 }" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="applyFriendLink">确定</el-button>
                <el-button @click="friend_link_dialog = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { apiFriendLink } from "../../api/blog"

// 获取友链
const skeleton_friend = ref(true)
const friend_list = ref<any[]>([])
apiFriendLink("/getFriendLink", { type: 'show' }).then((res: any) => {
    friend_list.value = res.list
    skeleton_friend.value = false
}).catch((e: any) => {
    skeleton_friend.value = false
})
// 友链跳转
const linkTo = (link: string) => {
    window.open(link, '_blank')
}
const friend_link_dialog = ref(false)   //申请友链弹窗
const new_friendLink = reactive({  //申请友链配置
    name: "",
    logo: "",
    introduction: "",
    link: "",
})
// 确认申请友链
const applyFriendLink = () => {
    const { name, link, logo } = new_friendLink
    if (!name || !link || !logo) {
        ElMessage.warning('需填项均不能为空')
        return
    }
    apiFriendLink("/applyFriendLink", { ...new_friendLink }).then((res: any) => {
        ElMessage.success('已提交申请，请等待博主审核')
        friend_link_dialog.value = false
    })
}
</script>
              
              
<style lang="scss" scoped>
.card {
    margin-bottom: 20px;

    h3 {
        font-size: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
    }
}

.friend-link {
    display: flex;
    cursor: pointer;
    border: 1px solid #fff;
    padding: 10px;
    border-radius: 8px;

    &:hover {
        border: 1px solid #eee;
        box-shadow: inset 0 0px 4px rgb(0 0 0 / 12%);

        h4 {
            color: #409eff;
        }

        .avatar {
            transform: scale(1.1);
            transition: all 0.5s;
        }
    }

    .name {
        flex: 1;
        margin-left: 10px;
        font-size: 14px;
        font-weight: bold;
        line-height: 20px;
        color: #666;
        @include textEllipsis(1);

        p {
            font-weight: normal;
            font-size: 12px;
            color: #aaa;
            @include textEllipsis(1);
        }
    }
}

.ml10 {
    margin-left: 10px;
}
</style>