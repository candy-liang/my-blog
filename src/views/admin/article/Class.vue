<template>
    <div class="btn">
        <el-button @click="addClass('add')" type="primary">新增</el-button>
        <el-button @click="deleteClass" type="danger">删除</el-button>
    </div>
    <el-table :data="tableData" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" :selectable="selectable" width="55" align="center" />
        <el-table-column prop="sort" label="排序权重" align="center" width="100" />
        <el-table-column prop="name" label="名称" align="center">
            <template #default="scope">
                <span class="class-name" @click="gotoClass(scope.row.type)" title="点击跳转对应分类">{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center" />
        <el-table-column prop="count" label="拥有文章数" width="100" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
        <el-table-column prop="updatedAt" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" align="center" width="140">
            <template #default="scope">
                <el-button @click="addClass('edit', scope.row)" :disabled="scope.row.type == 'all'" size="small">编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="add_class_dialog" title="新增文章分类" width="30%" center>
        <el-form>
            <el-form-item label="分类名称">
                <el-input v-model="new_class.name" />
            </el-form-item>
            <el-form-item label="分类字段">
                <el-input v-model="new_class.type" />
            </el-form-item>
            <el-form-item label="排序权重">
                <el-input-number v-model="new_class.sort" style="width:100%" :min="1" :max="100" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="addClassSure">确定</el-button>
                <el-button @click="add_class_dialog = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import { apiArticle } from "../../../api/blog";
import { ArticleClass } from "../../../type/article.type"
const loading = ref(false)
const add_class_dialog = ref(false)
const router = useRouter()
let tableData = ref<ArticleClass[]>([])
const getTableData = () => {
    loading.value = true
    apiArticle("/getArticleClass").then((res: any) => {
        tableData.value = res.list
        loading.value = false
    }).catch(e => {
        loading.value = false
    })
}
getTableData()
const new_class = reactive({  //新增文章配置
    name: "",
    type: "",
    sort: 1,
    old_type: "",
})

const dialog_type = ref('')
const cur_id = ref(0)
const addClass = (type: string, row?: any) => {
    dialog_type.value = type
    if (type == 'edit') {
        const { id, name, type, sort } = row
        cur_id.value = id
        new_class.name = name
        new_class.type = type
        new_class.old_type = type
        new_class.sort = sort
    } else {
        new_class.name = ''
        new_class.type = ''
        new_class.old_type = ''
        new_class.sort = 1
    }
    add_class_dialog.value = true
}
const addClassSure = () => {
    if (!new_class.name || !new_class.type) {
        ElMessage.warning('名称与字段都不能为空')
        return
    }
    const is_add = dialog_type.value == 'add'
    let param = is_add ? { ...new_class } : { id: cur_id.value, ...new_class }
    apiArticle("/createArticleClass", param).then((res: any) => {
        getTableData()
        add_class_dialog.value = false
        ElMessage.success('添加成功')
    })

}

const deleteClass = () => {
    ElMessageBox.confirm(
        `确定删除所选${table_selected.value.length}条分类`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        apiArticle("/deleteArticleClass", {
            type: table_selected.value.map((v: any) => v.type),
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
const gotoClass = (type: string) => {
    router.push({
        name: 'blog',
        query: {
            current_class: type
        }
    })
}
const selectable = (row: any, index: number) => {
    return row.type != 'all'
}
</script>
              
              
<style lang="scss" scoped>
.btn {
    margin-bottom: 20px;
    line-height: 33px;
}

.class-name {
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        color: #409EFF
    }
}
</style>