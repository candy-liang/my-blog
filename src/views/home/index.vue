<template>
    <div class="menu">
        <el-card class="card">
            <el-radio-group v-model="current_class" @change="changeClass">
                <el-radio-button v-for="item in menu_list" v-show="item.count>0" :label="item.type">
                {{ item.name }}
                </el-radio-button>
            </el-radio-group>
        </el-card>
    </div>
    <div class="blog">
        <!-- 文章列表 -->
        <div class="center">
            <ul v-loading="loading" v-show="total > 0">
                <li v-for="item in article_list" @click="checkArticle(item.id)">
                    <el-card class="card list">
                        <h3>{{ item.title }}</h3>
                        <div class="description">
                            <div class="left">
                                {{ item.description }}
                            </div>
                            <div class="right">
                                <img :src="item.poster" alt="" />
                            </div>
                        </div>
                        <div class="correlation">
                            <application-two theme="outline" size="18" />
                            <span class="item">{{ class_label[item.type] }}</span>
                            <preview-open theme="outline" size="20" />
                            <span class="item">{{ item.view_count }}</span>
                            <calendar theme="outline" size="18" />
                            <span class="item">{{ item.createdAt }}</span>
                        </div>
                    </el-card>
                </li>
            </ul>
            <el-empty v-show="total == 0" :image-size="200" description="暂无文章,请浏览其他分类" />
        </div>

        <!-- 热门文章/标签/友链 -->
        <div class="aside">
            <el-card class="card">
                <h3>热门文章</h3>
                <ul class="hot-article">
                    <li v-for="item in hot_article" @click="checkArticle(item.id)">{{ item.title }}</li>
                </ul>
                <el-empty v-show="hot_article.length == 0" :image-size="100" style="padding:10px 0"
                    description="暂无文章" />
            </el-card>

            <el-card class="card">
                <h3>友链
                    <el-button :icon="Plus" @click="friend_link_dialog = true" title="申请添加友链" class="ml10" circle
                        size="small" />
                </h3>
                <div class="friend-link" v-for="item in friend_list" @click="linkTo(item.link)"
                    :title="item.introduction" v-show="item.status == 'show'">
                    <el-avatar :src="item.logo">
                        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                    </el-avatar>
                    <div class="name">
                        <h4>{{ item.name }}</h4>
                        <p>— {{ item.introduction }}</p>
                    </div>
                </div>
                <el-empty v-show="friend_list.length == 0" :image-size="100" style="padding:10px 0"
                    description="暂无友链" />
            </el-card>
        </div>

    </div>
    <el-pagination :currentPage="current_page" :page-size="page_size" class="pagination" :page-sizes="[5, 10, 20, 50]"
        background layout="total,prev,pager,next,sizes" :total="total" @size-change="sizeChange"
        @current-change="currentChange" v-show="total > 0" />

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
                <el-input v-model="new_friendLink.introduction" autosize type="textarea" />
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
import { ApplicationTwo, PreviewOpen, Calendar } from "@icon-park/vue-next"
import { apiArticle, apiFriendLink } from "../../api/blog"
import { ArticleClass } from "../../type/article.type"
import { Plus } from '@element-plus/icons-vue'
import { updateQuery, skipRouter } from "../../hooks/router.hook";
const route = useRoute()

// 获取分类总览
const menu_list = ref<ArticleClass[]>([])
const class_label = ref<any>({})
apiArticle("/getArticleClass").then((res: any) => {
    menu_list.value = res.list
    class_label.value = res.label
})

// 获取热门文章
const hot_article = ref<any[]>([])
apiArticle("/getHotArticleList").then((res: any) => {
    hot_article.value = res
})

// 获取友链
const friend_list = ref<any[]>([])
apiFriendLink("/getFriendLink", { type: 'show' }).then((res: any) => {
    friend_list.value = res.list
})

// 获取当前分类文章列表
const article_list = ref<any[]>([])
const loading = ref(false)      //列表loading
const current_class = ref("all")//当前分类
const current_page = ref(1)     //当前页码
const page_size = ref(5)        //每页数
const total = ref(0)            //文章总数
const key = ref("")             //当前搜索值
current_class.value = route.query.current_class as string || 'all'
current_page.value = Number(route.query.current_page as string) || 1
page_size.value = Number(route.query.page_size as string) || 5

const getArticleList = () => {
    loading.value = true
    apiArticle("/getArticleList", {
        type: current_class.value,
        current_page: current_page.value,
        page_size: page_size.value,
        key: key.value,
    }).then((res: any) => {
        article_list.value = res.list
        total.value = res.total
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}
getArticleList()

// 更改每页文章数量
const sizeChange = (val: number) => {
    current_page.value = 1
    page_size.value = val
    updateQuery(route, { page_size: val, current_page: 1 })
    getArticleList()
}
// 更改当前页
const currentChange = (val: number) => {
    current_page.value = val
    updateQuery(route, { current_page: val })
    getArticleList()
}
// 更改分类
const changeClass = () => {
    updateQuery(route, { current_class: current_class.value })
    getArticleList()
}

// 友链跳转
const linkTo = (link: string) => {
    window.open(link, '_blank')
}
// 查看文章
const checkArticle = (id: number) => {
    skipRouter('detail', { id })
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

// 监听搜索key变化,重新获取列表数据
watchEffect(async () => {
    key.value = route.query.key as string
    await getArticleList()
})
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


.menu {
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;

    .el-radio-button {
        margin-bottom: 10px;
    }
}

.blog {
    display: flex;
    width: 80%;
    max-width: 1200px;
    margin: 0 auto;
}

.center {
    flex: 1;

    .list {
        position: relative;
        height: 182px;
        cursor: pointer;

        &:hover {
            transform: scale(1.01);
            transition: all 0.3s linear;
            box-shadow: 0px 0px 12px rgba(64, 158, 255, 0.5);
        }

        .description {
            display: flex;

            .left {
                flex: 1;
                color: #aaa;
                font-size: 13px;
                line-height: 22px;
                margin: 5px 0;
                height: 66px;
                @include textEllipsis(3);
            }

            .right {
                width: 76px;
                margin-left: 15px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }
        }

        .correlation {
            font-size: 13px;
            display: flex;
            white-space: nowrap;
            color: #aaa;
            align-items: center;

            // justify-content: center;
            .item {
                margin-left: 5px;
                margin-right: 20px;
            }
        }
    }
}

.pagination {
    justify-content: center;

    li,
    .btn-prev,
    .btn-next {
        background-color: #fff;
    }
}

.aside {
    margin-left: 20px;

    h3 {
        font-weight: normal;
    }

    .hot-article {
        font-size: 14px;
        color: #666;

        li {
            padding: 0 10px;
        }
    }

    .tag-list {
        .el-check-tag {
            margin: 0 10px 10px 0;
        }
    }

    .friend-link {
        display: flex;
        margin-bottom: 15px;
        cursor: pointer;

        &:hover {
            h4 {
                color: #409eff;
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
                font-size: 12px;
                color: #aaa;
                @include textEllipsis(1);
            }
        }
    }
}

.ml10 {
    margin-left: 10px;
}

@media screen and (max-width: 1366px) {
    .aside {
        width: 240px;
        transition: all 0.5s;
    }
}

@media screen and (max-width: 1100px) {
    .aside {
        display: none;
    }
}

@media screen and (max-width: 1024px) {}
</style>
