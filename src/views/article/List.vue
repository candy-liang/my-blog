<template>
    <el-card>
        <div class="btn">
            <el-button @click="add_class_dialog = true" type="primary">新增</el-button>
            <el-button @click="deleteClass" type="danger">删除</el-button>
            <el-select v-model="cur_class" @change="getTableData" style="margin-left: 15px;">
                <el-option v-for="item in options" :key="item.type" :label="item.name" :value="item.type" />
            </el-select>
            <el-input v-model="search_val" class="search_bar" placeholder="请输入文章标题">
                <template #append>
                    <el-button @click="searchHandle" :icon="Search" />
                </template>
            </el-input>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelect">
            <el-table-column type="selection" align="center" width="55" />
            <el-table-column type="index" label="序号" align="center" width="60" />
            <el-table-column prop="title" label="标题" align="center" />
            <el-table-column prop="type" label="类型" align="center" />
            <el-table-column prop="tag" label="标签" align="center" />
            <el-table-column prop="id" label="评论数" align="center" width="80" />
            <el-table-column prop="id" label="浏览数" align="center" width="80" />
            <el-table-column prop="createdAt" label="创建时间" align="center" />
            <el-table-column prop="updatedAt" label="更新时间" align="center" />
        </el-table>
        <el-pagination v-model:currentPage="current_page" v-model:page-size="page_size" class="pagination"
            :page-sizes="[10, 20, 50, 100]" background layout="sizes,prev, pager, next, jumper,total" :total="total"
            @size-change="getTableData" @current-change="getTableData" />
    </el-card>

    <el-dialog v-model="add_class_dialog" title="新增文章分类" width="30%" center>
        <el-form>
            <el-form-item label="分类名称">
                <el-input v-model="new_class" />
            </el-form-item>
            <el-form-item label="分类字段">
                <el-input v-model="new_type" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="addClass">确定</el-button>
                <el-button @click="add_class_dialog = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import { getArticle } from "../../api/blog";
import { ArticleClass } from "../../type/article.type"
import { Search } from '@element-plus/icons-vue'
const loading = ref(false)
const add_class_dialog = ref(false)
const cur_class = ref('all')
const options = ref<ArticleClass[]>([])
getArticle("/getArticleClass").then((res: any) => {
    options.value = res
})
const search_val = ref('')
const current_page = ref(1)
const page_size = ref(10)
const total = ref(0)
const tableData = ref<any[]>([])
const getTableData = () => {
    loading.value = true
    getArticle("/getArticleList", {
        type: cur_class.value,
        current_page: current_page.value,
        page_size: page_size.value,
        key: search_val.value
    }).then((res: any) => {
        tableData.value = res.list
        total.value = res.total
        loading.value = false
    }).catch(e => {
        loading.value = false
    })
}
getTableData()

const new_class = ref('')
const new_type = ref('')


const addClass = () => {
}
const searchHandle = () => {
    current_page.value = 1
    getTableData()
}

const deleteClass = () => {
    ElMessageBox.confirm(
        `确定删除所选${table_selected.value.length}篇文章`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        getArticle("/deleteArticle", {
            id: table_selected.value.map((v: any) => v.id),
        }).then((res: any) => {
            ElMessage.success('删除成功')
            getTableData()
        })
    })
}
const table_selected = ref([])
const handleSelect = (val: any) => {
    table_selected.value = val
}

const handleSizeChange = (val: number) => {
    getTableData()

}
const handleCurrentChange = (val: number) => {
    getTableData()
}
</script>
              
              
<style lang="scss" scoped>
.btn {
    margin-bottom: 20px;
    vertical-align: middle;

    .title {
        font-weight: bold;
        margin-right: 15px;
    }

    .search_bar {
        width: 300px;
        float: right;
    }
}
</style>