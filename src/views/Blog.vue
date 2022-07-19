<template>
    <div class="menu">
        <el-card class="card">
            <el-radio-group v-model="current_class" @change="getArticleList">
                <el-radio-button v-for="item in menu_list" :label="item.type">{{ item.name }}</el-radio-button>
            </el-radio-group>
        </el-card>
    </div>
    <div class="blog">
        <!-- 文章列表 -->
        <div class="center" v-if="!is_detail">
            <ul>
                <li v-for="item in article_list" @click="checkDetail">
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
                            <comment theme="outline" size="18" />
                            <span class="item">{{ item.comment_count }}</span>
                            <preview-open theme="outline" size="20" />
                            <span class="item">{{ item.view_count }}</span>
                            <calendar theme="outline" size="18" />
                            <span class="item">{{ item.create_time }}</span>
                        </div>
                    </el-card>
                </li>
            </ul>
        </div>

        <!-- 热门文章/标签/友链 -->
        <div class="aside" v-if="!is_detail">
            <el-card class="card">
                <h3>热门文章
                    <fire theme="outline" size="16" fill="#ee8f8f" />
                </h3>
                <ul class="hot-article">
                    <li v-for="(item, index) in hot_article">{{ `${index + 1}、${item.title}` }}</li>
                </ul>
            </el-card>
            <el-card class="card">
                <h3>热门标签
                    <tag theme="outline" size="16" fill="#f0a01c" />
                </h3>
                <div class="tag-list">
                    <el-check-tag v-for="(item, index) in tag_list" :checked="item.name == current_tag" type="info"
                        @change="checkedTag(item.name)">{{ item.name }}</el-check-tag>
                </div>
            </el-card>
            <el-card class="card">
                <h3>友链
                    <link-two theme="outline" size="16" fill="#4a90e2" />
                </h3>
                <div class="friend-link" v-for="item in friend_list">
                    <el-avatar shape="square" :size="40" :src="item.avatar" />
                    <div class="name">
                        <h4>{{ item.name }}</h4>
                        <p>—{{ item.motto }}</p>
                    </div>
                </div>
            </el-card>
        </div>

    </div>
    <el-pagination class="pagination" background layout="prev, pager,next" :total="1000" />
</template>

<script setup lang="ts">
import { Comment, PreviewOpen, Calendar, Tag, Fire, LinkTwo } from "@icon-park/vue-next"
import { Plus } from "@element-plus/icons-vue"

import { getArticle, getTags, getFriendLink } from "../api/blog"
import { ArticleClass } from "../type/article.type"

const route = useRoute()
const router = useRouter()
const current_class = ref("all")
current_class.value = route.query.current_class as string || 'all'

// 获取分类总览
let menu_list = ref<ArticleClass[]>([])
getArticle("/getArticleClass").then((res: any) => {
    menu_list.value = res
})



// 获取热门文章
const hot_article = ref<any[]>([])
getArticle("/getListData", {
    type: "all",
    sort: "hot",
    current_page: 1,
    page_size: 5,
}).then((res: any) => {
    hot_article.value = res.data
})

// 获取所有标签
const tag_list = ref<any[]>([])
getTags("/getAllTags").then((res: any) => {
    tag_list.value = res.data
})

// 控制点击标签高亮
const current_tag = ref("")
const checkedTag = (name: string) => {
    current_tag.value = name
}

// 获取友链
const friend_list = ref<any[]>([])
getFriendLink("/getAllLink").then((res: any) => {
    friend_list.value = res.data
})

// 获取当前分类文章列表
const article_list = ref<any[]>([])
const getArticleList = () => {
    getArticle("/getArticleList", {
        type: current_class.value,
        sort: "",
        current_page: 1,
        page_size: 6,
    }).then((res: any) => {
        article_list.value = res.list
    })
}
getArticleList()

const is_detail = ref(false)


// 获取文章详情

const checkDetail = () => {
    router.push({ name: 'detail' })
    // getArticle("/getDetail", {
    //     id: 1,
    // }).then((res: any) => {
    //     htmltext.value = res.data.html
    //     comment_total.value = res.data.comment_total
    //     comment_data.push(...res.data.comment_data)
    //     is_detail.value = true
    // })
}



</script>

<style lang="scss" scoped>
.card {
    margin-bottom: 20px;

    h3 {
        font-size: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        margin-bottom: 10px;
    }
}


.menu {
    width: 80%;
    margin: 0 auto;
}

.blog {
    display: flex;
    width: 80%;
    margin: 0 auto;
}

.center {
    flex: 1;

    .list {
        position: relative;
        height: 182px;
        cursor: pointer;

        &:hover {
            box-shadow: 0px 0px 12px rgba(42, 228, 219, 0.3);
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

    .detail {
        margin-bottom: 10px;
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

    .hot-article {
        font-size: 14px;
        color: #666;
    }

    .tag-list {
        .el-check-tag {
            margin: 0 10px 10px 0;
        }
    }

    .friend-link {
        display: flex;
        margin-bottom: 10px;
        cursor: pointer;

        &:hover {
            h4 {
                color: #409eff;
            }
        }

        .name {
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
