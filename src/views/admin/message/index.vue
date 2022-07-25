<template>
    <div class="btn">
        <el-button @click="deleteMessage" type="danger">删除</el-button>

        <el-input v-model="search_val" class="search_bar" clearable placeholder="请输入留言名称">
            <template #append>
                <el-button @click="searchHandle" :icon="Search" />
            </template>
        </el-input>
    </div>
    <el-table :data="table_data" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="name" label="昵称" align="center" width="180" />
        <el-table-column prop="content" label="留言内容" align="center" />

    </el-table>
    <el-pagination v-model:currentPage="current_page" v-model:page-size="page_size" class="pagination"
        :page-sizes="[10, 20, 50, 100]" background layout="total,sizes,prev,pager,next" :total="total"
        @size-change="sizeChange" @current-change="currentChange" />


</template>
              
              
<script setup lang="ts">
import { apiMessage } from "../../../api/blog";
import { Search } from '@element-plus/icons-vue'
import { updateQuery } from "../../../hooks/router.hook";
const route = useRoute()

// -----------获取列表数据---------------
const search_val = ref('')  //搜索值
const current_page = ref(1) //当前页码
const page_size = ref(10)   //每页数
const total = ref(0)    //留言总数
const table_data = ref<any[]>([])   //列表数据
const loading = ref(false)  //列表loading
current_page.value = Number(route.query.current_page as string) || 1
page_size.value = Number(route.query.page_size as string) || 10

const getTableData = () => {
    loading.value = true
    apiMessage("/getMessage", {
        current_page: current_page.value,
        page_size: page_size.value,
        key: search_val.value
    }).then((res: any) => {
        table_data.value = res.list
        total.value = res.total
        loading.value = false
    }).catch(e => {
        loading.value = false
    })
}
getTableData()

// 搜索留言
const searchHandle = () => {
    current_page.value = 1
    getTableData()
}

// 删除所选留言
const deleteMessage = () => {
    ElMessageBox.confirm(
        `确定删除所选${table_selected.value.length}条留言`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        apiMessage("/deleteMessage", {
            id: table_selected.value.map((v: any) => v.id),
        }).then((res: any) => {
            ElMessage.success('删除成功')
            getTableData()
        })
    })
}
const table_selected = ref([])  //列表勾选数据
// 列表勾选处理
const handleSelect = (val: any) => {
    table_selected.value = val
}
// 更改每页留言数量
const sizeChange = (val: number) => {
    current_page.value = 1
    page_size.value = val
    updateQuery(route, { page_size: val, current_page: 1 })
    getTableData()
}
// 更改当前页
const currentChange = (val: number) => {
    current_page.value = val
    updateQuery(route, { current_page: val })
    getTableData()
}
</script>
              
              
<style lang="scss" scoped>
.btn {
    line-height: 33px;
    margin-bottom: 20px;

    .title {
        font-weight: bold;
        margin-right: 15px;
    }

    .search_bar {
        width: 300px;
        float: right;
    }
}

.pagination {
    justify-content: flex-end;
    margin-top: 20px;
}
</style>