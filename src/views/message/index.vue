<template>
    <div class="message">
        <el-card class="card">
            <el-input v-model="message.name" placeholder="昵称" class="w200 mb15" />
            <el-input v-model="message.content" :autosize="{ minRows: 3 }" class="mb15" type="textarea"
                placeholder="请留下您的宝贵意见" />
            <p class="tar">
                <el-button type="primary" @click="submit">提交</el-button>
            </p>
        </el-card>
        <el-card class="card" v-for="item in list">
            <template #header>
                <h3>{{ item.name }}</h3>
            </template>
            <p class="content mb15">{{ item.content }}</p>
            <p class="tar time">{{ item.createdAt }}</p>
        </el-card>
        <el-pagination :currentPage="current_page" class="pagination" background layout="total,prev,pager,next"
            :total="total" @current-change="currentChange" />
    </div>
</template>

<script setup lang="ts">
import { apiMessage } from "../../api/blog"
import { updateQuery } from "../../hooks/router.hook";
const route = useRoute()
const list = ref<any[]>([])
const message = reactive({
    name: '',
    content: "",
})
const current_page = ref(1) //当前页码
const total = ref(0)    //文章总数
const getMessageList = () => {
    apiMessage('/getMessage', {
        current_page: current_page.value,
        page_size: 5,
    }).then((res: any) => {
        list.value = res.list
        total.value = res.total
    })
}
getMessageList()
const submit = () => {
    if (!message.name || !message.content) {
        ElMessage.warning('名称与留言均不能为空')
        return
    }
    apiMessage('/createMessage', message).then((res: any) => {
        ElMessage.success('留言成功')
        getMessageList()
    })
}

// 更改当前页
const currentChange = (val: number) => {
    current_page.value = val
    updateQuery(route, { current_page: val })
    getMessageList()
}
</script>

<style lang="scss" scoped>
.card {
    width: 60%;
    max-width: 980px;
    min-width: 400px;
    margin: 0 auto 15px;
}

.content {
    text-indent: 2em;
    color: #666;
}

.time {
    font-size: 14px;
    color: #999;
}

.w200 {
    width: 200px;
}

.mb15 {
    margin-bottom: 15px;
}

.tar {
    text-align: right;
}

.pagination {
    text-align: center;
    justify-content: center;
    margin-top: 20px;
}
</style>
