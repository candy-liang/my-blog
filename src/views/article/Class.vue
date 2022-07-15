<template>
    <el-card>
        <div class="btn">
            <el-button @click="add_class_dialog = true" type="primary">新增</el-button>
            <el-button @click="deleteClass" type="danger">删除</el-button>
        </div>
        <el-table :data="tableData" border @selection-change="handleSelect">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="type" label="类型" width="180" align="center" />
            <el-table-column prop="count" label="拥有文章数" width="180" align="center" />
            <el-table-column prop="createdAt" label="创建时间" width="180" align="center" />
            <el-table-column prop="updatedAt" label="更新时间" width="180" align="center" />
        </el-table>
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
const loading = ref(false)
const add_class_dialog = ref(false)

let tableData = ref<ArticleClass[]>([])
const getTableData = () => {
    loading.value = true
    getArticle("/getArticleClass").then((res: any) => {
        tableData.value = res
        loading.value = false
    }).catch(e => {
        loading.value = false
    })
}
getTableData()

const new_class = ref('')
const new_type = ref('')

const addClass = () => {
    if (!new_class.value || !new_type.value) {
        ElMessage.warning('名称与字段都不能为空')
        return
    }
    getArticle("/createArticleClass", {
        name: new_class.value,
        type: new_type.value,
    }).then((res: any) => {
        add_class_dialog.value = false
        new_class.value = ""
        new_type.value = ""
        ElMessage.success('添加成功')
        getTableData()
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
        getArticle("/deleteArticleClass", {
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

</script>
              
              
<style lang="scss" scoped>
.btn {
    margin-bottom: 20px;
}
</style>