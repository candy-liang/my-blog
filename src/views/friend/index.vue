<template>
    <div class="btn">
        <el-button @click="addFriendLink('add')" type="primary">新增</el-button>
        <el-button @click="deleteFriendLink" type="danger">删除</el-button>

        <el-input v-model="search_val" class="search_bar" placeholder="请输入友链名称">
            <template #append>
                <el-button @click="searchHandle" :icon="Search" />
            </template>
        </el-input>
    </div>
    <el-table :data="table_data" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="sort" label="排序权重" align="center" width="100" />
        <el-table-column label="状态" align="center" width="100">
            <template #default="scope">
                <el-switch v-model="scope.row.status" @change="changeStatus(scope.row)" active-value="show"
                    inactive-value="hide" />
            </template>
        </el-table-column>
        <el-table-column label="logo" align="center" width="100">
            <template #default="scope">
                <el-avatar :src="scope.row.logo">
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center" width="160" />
        <el-table-column prop="introduction" label="简介" align="center" />
        <el-table-column label="地址" align="center">
            <template #default="scope">
                <a :href="scope.row.link" target="_blank">{{ scope.row.link }}</a>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
            <template #default="scope">
                <el-button @click="addFriendLink('edit', scope.row)" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination v-model:currentPage="current_page" v-model:page-size="page_size" class="pagination"
        :page-sizes="[10, 20, 50, 100]" background layout="total,sizes,prev,pager,next" :total="total"
        @size-change="getTableData" @current-change="getTableData" />

    <el-dialog v-model="add_friend_link_dialog" :title="dialog_type == 'edit' ? '编辑友链信息' : '新增友链'" width="500px "
        center>
        <el-form label-width="80px">
            <el-form-item label="友链名称">
                <el-input v-model="new_friendLink.name" />
            </el-form-item>
            <el-form-item label="logo地址">
                <el-input v-model="new_friendLink.logo" />
            </el-form-item>
            <el-form-item label="友链地址">
                <el-input v-model="new_friendLink.link" />
            </el-form-item>
            <el-form-item label="简介描述">
                <el-input v-model="new_friendLink.introduction" autosize type="textarea" />
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="new_friendLink.status" style="width:100%">
                    <el-option label="不显示" value="hide" />
                    <el-option label="显示" value="show" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序权重">
                <el-input-number v-model="new_friendLink.sort" style="width:100%" :min="1" :max="100" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="createFriendLink">确定</el-button>
                <el-button @click="add_friend_link_dialog = false">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>
              
              
<script setup lang="ts">
import { getFriendLink } from "../../api/blog";
import { Search, UserFilled } from '@element-plus/icons-vue'
const route = useRoute()
const router = useRouter()
const dialog_type = ref('')
const cur_id = ref(0)
const add_friend_link_dialog = ref(false)   //新增友链弹窗
const new_friendLink = reactive({  //新增友链配置
    name: "",
    logo: "",
    introduction: "",
    link: "",
    status: "",
    sort: 1,
})
const addFriendLink = (type: string, row?: any) => {
    dialog_type.value = type
    if (type == 'edit') {
        const { id, name, logo, introduction, link, status, sort } = row
        cur_id.value = id
        new_friendLink.name = name
        new_friendLink.logo = logo
        new_friendLink.introduction = introduction
        new_friendLink.link = link
        new_friendLink.status = status
        new_friendLink.sort = sort
    } else {
        new_friendLink.name = ''
        new_friendLink.logo = ''
        new_friendLink.introduction = ''
        new_friendLink.link = ''
        new_friendLink.status = ''
        new_friendLink.sort = 1
    }
    add_friend_link_dialog.value = true
}
const changeStatus = ((row: any) => {
    getFriendLink("/createFriendLink", { id: row.id, status: row.status }).then((res: any) => {
        ElMessage.success('修改显示状态成功')
    })
})
// 创建友链/修改友链
const createFriendLink = () => {
    const is_add = dialog_type.value == 'add'
    let param = is_add ? { ...new_friendLink } : { id: cur_id.value, ...new_friendLink }
    getFriendLink("/createFriendLink", param).then((res: any) => {
        ElMessage.success(is_add ? '创建成功' : '修改成功')
        add_friend_link_dialog.value = false
        getTableData()
    })
}

// -----------获取列表数据---------------
const search_val = ref('')  //搜索值
const current_page = ref(1) //当前页码
const page_size = ref(10)   //每页数
const total = ref(0)    //友链总数
const table_data = ref<any[]>([])   //列表数据
const loading = ref(false)  //列表loading
current_page.value = Number(route.query.current_page as string) || 1
page_size.value = Number(route.query.page_size as string) || 10
const getTableData = () => {
    loading.value = true
    router.push({
        name: 'admin',
        query: {
            activeName: route.query.activeName,
            current_page: current_page.value,
            page_size: page_size.value
        }
    })
    getFriendLink("/getFriendLink", {
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

// 搜索友链
const searchHandle = () => {
    current_page.value = 1
    getTableData()
}

// 删除所选友链
const deleteFriendLink = () => {
    ElMessageBox.confirm(
        `确定删除所选${table_selected.value.length}条友链`,
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        getFriendLink("/deleteFriendLink", {
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