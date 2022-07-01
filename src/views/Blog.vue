<template>
    <div class="blog">
        <!-- 文章分类 -->
        <div class="menu">
            <el-card class="card">
                <h3>文章分类 <all-application theme="outline" size="16" fill="#29b89b" /></h3>
                <ul>
                    <li :class="{ active: current_class == item.type }" v-for="item in menu_list">
                        {{ item.name }}<span class="count">({{ item.count }})</span>
                    </li>
                </ul>
            </el-card>
        </div>

        <!-- 文章列表 -->
        <div class="center" v-if="!is_detail">
            <el-card class="card menu2">
                <!-- <h3>文章分类</h3> -->
                <el-radio-group v-model="radio1">
                    <el-radio-button v-for="item in menu_list" :label="item.name">{{ item.name }}</el-radio-button>
                </el-radio-group>
            </el-card>
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
            <el-pagination class="pagination" background layout="prev, pager,next" :total="1000" />
        </div>

        <!-- 热门文章/标签/友链 -->
        <div class="aside" v-if="!is_detail">
            <el-card class="card">
                <h3>热门文章 <fire theme="outline" size="16" fill="#ee8f8f" /></h3>
                <ul class="hot-article">
                    <li v-for="(item, index) in hot_article">{{ `${index + 1}、${item.title}` }}</li>
                </ul>
            </el-card>
            <el-card class="card">
                <h3>热门标签 <tag theme="outline" size="16" fill="#f0a01c" /></h3>
                <div class="tag-list">
                    <el-check-tag v-for="(item, index) in tag_list" :checked="item.name == current_tag" type="info" @change="checkedTag(item.name)">{{ item.name }}</el-check-tag>
                </div>
            </el-card>
            <el-card class="card">
                <h3>友链 <link-two theme="outline" size="16" fill="#4a90e2" /></h3>
                <div class="friend-link" v-for="item in friend_list">
                    <el-avatar shape="square" :size="40" :src="item.avatar" />
                    <div class="name">
                        <h4>{{ item.name }}</h4>
                        <p>—{{ item.motto }}</p>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 文章详情 -->
        <div class="center" v-if="is_detail">
            <el-card class="card detail">
                <el-page-header @back="goBack" :icon="ArrowLeft" content="detail" />
            </el-card>
            <el-card class="card detail">
                <div class="default-theme" ref="artContent" v-html="htmltext"></div>
            </el-card>
            <el-card class="card">
                <Comments :data="comment_data" :total="comment_total"></Comments>
            </el-card>
            <md-editor editorId="my-editor" v-model="text" :preview="false" code-theme="atoms" @onHtmlChanged="saveHtml" @onGetCatalog="onGetCatalog" />
        </div>

        <div class="aside" v-if="is_detail && state.catalogList.length">
            <el-card class="card">
                <h3>目录</h3>
                <ul>
                    <li v-for="item in state.catalogList" :class="item.level == 2 ? 'title2' : 'title3'" @click="goAnchor(item.text)">
                        {{ item.text }}
                    </li>
                </ul>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue"
import { Comment, PreviewOpen, Calendar, Tag, Fire, LinkTwo, AllApplication } from "@icon-park/vue-next"
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import Comments from "@C/Comments.vue"
import { getArticle, getTags, getFriendLink } from "../api/blog"
import { ArticleClass } from "../type/article.type"

const route = useRoute()
const router = useRouter()

// 获取分类总览
let menu_list = ref<ArticleClass[]>([])
getArticle("/getArticleClass").then((res: any) => {
    menu_list.value = res
})

// 判断当前分类
const current_class = computed(() => {
    return route.query.current_class || "all"
})

// 获取热门文章
const hot_article = reactive([])
getArticle("/getListData", {
    type: "all",
    sort: "hot",
    current_page: 1,
    page_size: 5,
}).then(res => {
    // hot_article.push(...res.data)
})

// 获取所有标签
const tag_list = reactive([])
getTags("/getAllTags").then(res => {
    // tag_list.push(...res.data)
})

// 控制点击标签高亮
const current_tag = ref("")
const checkedTag = (name: string) => {
    current_tag.value = name
}

// 获取友链
const friend_list = reactive([])
getFriendLink("/getAllLink").then(res => {
    // friend_list.push(...res.data)
})

// 获取当前分类文章列表
const article_list = reactive([])
getArticle("/getArticleList", {
    type: current_class.value,
    sort: "",
    current_page: 1,
    page_size: 5,
}).then(res => {
    // article_list.push(...res.list)
})

const is_detail = ref(false)
const htmltext = ref("")
const comment_data = reactive([])
const comment_total = ref(0)

// 获取文章详情

const checkDetail = () => {
    getArticle("/getDetail", {
        id: 1,
    }).then(res => {
        // htmltext.value = res.data.html
        // comment_total.value = res.data.comment_total
        // comment_data.push(...res.data.comment_data)
        is_detail.value = true
    })
}

const radio1 = ref("全部分类")

MdEditor.config({
    editorExtensions: {
        highlight: {
            css: {
                atoms: {
                    light: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/vs2015.min.css",
                    dark: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/vs2015.min.css",
                },
            },
        },
    },
})
const state: any = reactive({
    catalogList: [],
})
const onGetCatalog = (list: []) => {
    state.catalogList = list
}

const goAnchor = (selector: any) => {
    document.getElementById(selector)?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" })
}

const text = ref("Hello Editor!")

const saveHtml = (h: string) => {
    htmltext.value = h
}
const goBack = () => {
    is_detail.value = false
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
.title2 {
    font-weight: bold;
    font-size: 14px;
    @include textEllipsis(1);
}
.title3 {
    text-indent: 1em;
    font-size: 12px;
    @include textEllipsis(1);
}

.blog {
    padding: 20px;
    display: flex;
    overflow-y: auto;
    height: 100%;
}
.menu {
    width: 280px;
    position: fixed;
    transition: all 0.5s;

    li {
        text-align: center;
        line-height: 50px;
        font-size: 20px;
        position: relative;
        color: #666;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
            @extend .active;
        }
    }
    .count {
        font-size: 14px;
        margin-left: 10px;
        color: #aaa;
        font-weight: bold;
        text-decoration: underline;
    }
}
.active {
    color: #333;
    background-color: #eee;
    .count {
        color: #666;
    }
}
.menu2 {
    display: none;
}
.center {
    flex: 1;
    margin: 0 300px;

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
    :deep(.pagination) {
        justify-content: center;
        li,
        .btn-prev,
        .btn-next {
            background-color: #fff;
        }
    }
}
.aside {
    color: #666;
    width: 280px;
    position: fixed;
    transition: all 0.5s;
    right: 20px;
    .card {
        li {
            line-height: 30px;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
                @extend .active;
            }
        }
    }
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
@media screen and (max-width: 1366px) {
    .menu,
    .aside {
        width: 240px;
        transition: all 0.5s;
    }
    .center {
        margin: 0 260px;
        transition: all 1s;
    }
}
@media screen and (max-width: 1100px) {
    .aside {
        display: none;
    }
    .center {
        margin-right: 0px !important;
    }
}
@media screen and (max-width: 1024px) {
    .menu {
        display: none;
        transition: all 1s;
    }
    .menu2 {
        display: block;
        transition: all 1s;
    }
    .center {
        margin-left: 0px !important;
    }
}
</style>
