<template>
    <div class="menu" id="menu">
        <el-card class="card">
            <el-radio-group v-model="current_class" v-show="menu_list.length" @change="changeClass">
                <el-radio-button v-for="item in menu_list" v-show="item.count > 0" :label="item.type">
                    {{ item.name }}
                </el-radio-button>
            </el-radio-group>
            <el-skeleton style="width:100%" v-show="!menu_list.length" animated>
                <template #template>
                    <div style="display: flex;align-items: center;justify-items: space-between;">
                        <el-skeleton-item variant="text" style="height: 32px;width: 88px;margin:0 16px 10px 0" />
                        <el-skeleton-item variant="text" style="height: 32px;width: 88px;margin:0 16px 10px 0" />
                        <el-skeleton-item variant="text" style="height: 32px;width: 88px;margin-bottom: 10px" />
                    </div>
                </template>
            </el-skeleton>
        </el-card>
    </div>
    <div class="blog">
        <!-- 文章列表 -->
        <div class="center" v-loading="loading">
            <ul v-show="total > 0">
                <li v-for="item in article_list" @click="checkArticle(item.id)">
                    <el-card class="card list">
                        <h3>{{ item.title }}</h3>
                        <div class="description">
                            <div class="left">
                                — {{ item.description }}
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
            <el-empty v-show="!loading && total == 0" :image-size="200" description="暂无文章,请浏览其他分类" />
            <el-pagination :currentPage="current_page" :page-size="page_size" class="pagination"
                :page-sizes="[5, 10, 20, 50]" background layout="total,prev,pager,next,sizes" :total="total"
                @size-change="sizeChange" @current-change="currentChange" v-show="total > 0" />

        </div>

        <!-- 热门文章/标签/友链 -->
        <div class="aside">
            <Hot />
            <Friend />
        </div>
    </div>


</template>

<script setup lang="ts">
import { ApplicationTwo, PreviewOpen, Calendar } from "@icon-park/vue-next"
import { apiArticle } from "../../api/blog"
import { ArticleClass } from "../../type/article.type"
import { updateQuery, skipRouter } from "../../hooks/router.hook";
import { goAnchor } from "../../hooks/goAnchor.hook";
import Friend from "../friend/index.vue";
import Hot from "../article/Hot.vue";

const route = useRoute()

// 获取分类总览
const menu_list = ref<ArticleClass[]>([])
const class_label = ref<any>({})
apiArticle("/getArticleClass").then((res: any) => {
    menu_list.value = res.list
    class_label.value = res.label
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

const getArticleList = async () => {
    loading.value = true
    await apiArticle("/getArticleList", {
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
const sizeChange = async (val: number) => {
    current_page.value = 1
    page_size.value = val
    await updateQuery(route, { page_size: val, current_page: 1 })
    await getArticleList()
}
// 更改当前页
const currentChange = async (val: number) => {
    current_page.value = val
    await updateQuery(route, { current_page: val })
    await goAnchor()
    await getArticleList()
}
// 更改分类
const changeClass = async () => {
    await updateQuery(route, { current_class: current_class.value })
    await getArticleList()
}


// 查看文章
const checkArticle = (id: number) => {
    window.sessionStorage.setItem('route_home', JSON.stringify(route.query))
    skipRouter('detail', { id })
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
            box-shadow: inset 0px 0px 8px rgba(64, 158, 255, 0.5);
            transition: all 0.5s;

            h3 {
                color: #409EFF;
            }
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
    justify-content: flex-end;

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
        transition: all 0.5s;
    }
}

@media screen and (max-width: 1024px) {}
</style>
