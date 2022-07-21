<template>
    <div class="btn">
        <el-button @click="addArticle('add')" type="primary">新增</el-button>
        <el-button @click="deleteArticle" type="danger">删除</el-button>

        <el-input v-model="search_val" class="search_bar" placeholder="请输入友链名称">
            <template #append>
                <el-button @click="searchHandle" :icon="Search" />
            </template>
        </el-input>
    </div>
    <el-table :data="table_data" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="title" label="logo" align="center" width="100"></el-table-column>
        <el-table-column prop="type" label="名称" align="center" />
        <el-table-column prop="description" label="状态" align="center" width="100" />
        <el-table-column prop="id" label="简介" align="center" />
        <el-table-column prop="view_count" label="地址" align="center" width="100" />
        <el-table-column prop="createdAt" label="创建时间" align="center" />
        <el-table-column label="操作" align="center" width="140">
            <template #default="scope">
                <el-button @click="addArticle('edit', scope.row)" size="small">编辑</el-button>
                <el-button @click="checkArticle(scope.row.id)" size="small" type="primary" plain>查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="current_page" v-model:page-size="page_size" class="pagination"
        :page-sizes="[10, 20, 50, 100]" background layout="total,sizes,prev,pager,next" :total="total"
        @size-change="getTableData" @current-change="getTableData" />

    <el-dialog v-model="add_article_dialog" :title="dialog_type == 'edit' ? '编辑文章简要' : '新增文章'" width="500px " center>
        <el-form>
            <el-form-item label="友链名称">
                <el-input v-model="new_article.title" />
            </el-form-item>
            <el-form-item label="logo地址">
                <el-input v-model="new_article.type" />
            </el-form-item>
            <el-form-item label="友链地址">
                <el-input v-model="new_article.type" />
            </el-form-item>
            <el-form-item label="简介描述">
                <el-input v-model="new_article.description" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="createArticle">确定</el-button>
                <el-button @click="add_article_dialog = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import { getArticle } from "../../api/blog";
import { ArticleClass } from "../../type/article.type"
import { Search, Edit, View } from '@element-plus/icons-vue'
const router = useRouter()
const dialog_type = ref('')
const cur_id = ref(0)
const add_article_dialog = ref(false)   //新增文章弹窗
const new_article = reactive({  //新增文章配置
    title: "",
    type: "",
    description: "",
})
const addArticle = (type: string, row?: any) => {
    dialog_type.value = type
    if (type == 'edit') {
        const { id, title, type, description } = row
        cur_id.value = id
        new_article.title = title
        new_article.type = type
        new_article.description = description
    } else {
        new_article.title = ''
        new_article.type = ''
        new_article.description = ''
    }
    add_article_dialog.value = true
}
// -----------获取文章分类-----------------
const cur_class = ref('all')    //当前分类
const class_list = ref<ArticleClass[]>([])
getArticle("/getArticleClass").then((res: any) => {
    class_list.value = res
})
// 创建文章/修改文章
const createArticle = () => {
    const is_add = dialog_type.value == 'add'
    let param = is_add ? { ...new_article } : { id: cur_id.value, ...new_article }
    getArticle("/createArticle", param).then((res: any) => {
        ElMessage.success(is_add ? '创建成功' : '修改成功')
        add_article_dialog.value = false

        getTableData()
    })
}

// -----------获取列表数据---------------
const search_val = ref('')  //搜索值
const current_page = ref(1) //当前页码
const page_size = ref(10)   //每页数
const total = ref(0)    //文章总数
const table_data = ref<any[]>([])   //列表数据
const loading = ref(false)  //列表loading
const getTableData = () => {
    loading.value = true
    getArticle("/getArticleList", {
        type: cur_class.value,
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

// 搜索文章
const searchHandle = () => {
    current_page.value = 1
    getTableData()
}
// 删除所选文章
const deleteArticle = () => {
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
const table_selected = ref([])  //列表勾选数据
// 列表勾选处理
const handleSelect = (val: any) => {
    table_selected.value = val
}
// 查看文章
const checkArticle = (id: number) => {
    router.push({
        name: 'detail',
        query: {
            id: id
        }
    })
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