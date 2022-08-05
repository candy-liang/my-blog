<template>
    <div class="btn">
        <el-button @click="addArticle('add')" type="primary">新增</el-button>
        <el-button @click="deleteArticle" type="danger">删除</el-button>
        <el-select v-model="cur_class" @change="getTableData" style="margin-left: 15px;">
            <el-option v-for="item in class_list" :key="item.type" :label="item.name" :value="item.type" />
        </el-select>
        <el-input v-model="search_val" class="search_bar" placeholder="请输入文章标题">
            <template #append>
                <el-button @click="searchHandle" :icon="Search" />
            </template>
        </el-input>
    </div>
    <el-table :data="table_data" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="sort" label="排序权重" align="center" width="90" />
        <el-table-column label="状态" align="center" width="90">
            <template #default="scope">
                <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" active-value="show"
                    inactive-value="hide" />
            </template>
        </el-table-column>
        <el-table-column label="海报" align="center" width="90">
            <template #default="scope">
                <el-avatar :src="scope.row.poster" shape="square">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" min-width="140"></el-table-column>
        <el-table-column label="分类" align="center" width="120">
            <template #default="scope">
                <span>{{ class_label[scope.row.type] }}</span>
            </template>
        </el-table-column>
        <el-table-column label="描述" align="center" min-width="140">
            <template #default="scope">
                <span class="description" :title="scope.row.description">{{ scope.row.description }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="view_count" label="浏览数" align="center" width="90" />
        <el-table-column prop="createdAt" label="创建时间" align="center" min-width="104" />
        <el-table-column prop="updatedAt" label="更新时间" align="center" min-width="104" />
        <el-table-column label="操作" align="center" min-width="140" fixed="right">
            <template #default="scope">
                <el-button @click="addArticle('edit', scope.row)" size="small">编辑</el-button>
                <el-button @click="checkArticle(scope.row.id)" size="small" type="primary" plain>查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :currentPage="current_page" :page-size="page_size" class="pagination" :page-sizes="[2, 20, 50, 100]"
        background layout="total,sizes,prev,pager,next" :total="total" @size-change="sizeChange"
        @current-change="currentChange" />

    <el-dialog v-model="add_article_dialog" :title="dialog_type == 'edit' ? '编辑文章简要' : '新增文章'" width="500px " center>
        <el-form>
            <el-form-item label="文章标题">
                <el-input v-model="new_article.title" />
            </el-form-item>
            <el-form-item label="所属分类">
                <el-select v-model="new_article.type" style="width:100%">
                    <el-option v-for="item in class_list" :key="item.type" :label="item.name" :value="item.type"
                        v-show="item.type != 'all'" />
                </el-select>
            </el-form-item>
            <el-form-item label="文章描述">
                <el-input v-model="new_article.description" autosize type="textarea" />
            </el-form-item>
            <el-form-item label="封面地址">
                <el-input v-model="new_article.poster" autosize type="textarea" />
            </el-form-item>
            <el-form-item label="激活状态">
                <el-select v-model="new_article.status" style="width:100%">
                    <el-option label="不显示" value="hide" />
                    <el-option label="显示" value="show" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序权重">
                <el-input-number v-model="new_article.sort" style="width:100%" :min="1" :max="100" />
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
import { apiArticle } from "../../../api/blog";
import { ArticleClass } from "../../../type/article.type"
import { Search } from '@element-plus/icons-vue'
import { updateQuery, skipRouter } from "../../../hooks/router.hook";
import { ElMessageBox } from 'element-plus'
const route = useRoute()
const dialog_type = ref('')
const cur_id = ref(0)
const add_article_dialog = ref(false)   //新增文章弹窗
const new_article = reactive({  //新增文章配置
    title: "",
    type: "",
    description: "",
    poster: "",
    status: "show",
    sort: 1,
})
const addArticle = (type: string, row?: any) => {
    dialog_type.value = type
    if (type == 'edit') {
        const { id, title, type, description, sort, poster, status } = row
        cur_id.value = id
        new_article.title = title
        new_article.type = type
        new_article.description = description
        new_article.sort = sort
        new_article.poster = poster
        new_article.status = status
    } else {
        new_article.title = ''
        new_article.type = ''
        new_article.description = ''
        new_article.poster = ''
        new_article.status = 'show'
        new_article.sort = 1
    }
    add_article_dialog.value = true
}
// -----------获取文章分类-----------------
const cur_class = ref('all')    //当前分类
const class_list = ref<ArticleClass[]>([])
const class_label = ref<any>({})
apiArticle("/getArticleClass").then((res: any) => {
    class_list.value = res.list
    class_label.value = res.label
})
// 创建文章/修改文章
const createArticle = () => {
    if (!new_article.title || !new_article.type || !new_article.poster) {
        ElMessage.warning('不能为空')
        return
    }
    const is_add = dialog_type.value == 'add'
    let param = is_add ? { ...new_article } : { id: cur_id.value, ...new_article }
    apiArticle("/createArticle", param).then((res: any) => {
        ElMessage.success(is_add ? '创建成功' : '修改成功')
        add_article_dialog.value = false
        getTableData()
    })
}
const changeStatus = ((row: any) => {
    apiArticle("/createArticle", { id: row.id, status: row.status }).then((res: any) => {
        ElMessage.success('修改显示状态成功')
    })
})
// -----------获取列表数据---------------
const search_val = ref('')  //搜索值
const current_page = ref(1) //当前页码
const page_size = ref(10)   //每页数
const total = ref(0)    //文章总数
const table_data = ref<any[]>([])   //列表数据
const loading = ref(false)  //列表loading
current_page.value = Number(route.query.current_page as string) || 1
page_size.value = Number(route.query.page_size as string) || 10
const getTableData = () => {
    loading.value = true
    apiArticle("/getArticleList", {
        type: cur_class.value,
        current_page: current_page.value,
        page_size: page_size.value,
        key: search_val.value,
        isAll:true,
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
        apiArticle("/deleteArticle", {
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
    window.sessionStorage.removeItem('route_home')
    skipRouter('detail', { id: id })
}
// 更改每页文章数量
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

.description {
    @include textEllipsis(3);

}
</style>