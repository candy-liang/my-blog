<template>
    <el-card class="card">
        <div class="header">
            <el-button text @click="goBack" class="back">
                <back theme="outline" size="24" title='返回' />
            </el-button>
            <span class="title">{{ detail.title }}{{ previewOnly ? ' (编辑中...)' : '' }}</span>
            <div class="btn" v-if='is_admin'>
                <el-button type="primary" @click="previewOnly = !previewOnly">{{ previewOnly ? '完成' : '编辑' }}
                </el-button>
                <el-button type="success" @click="submit">保存</el-button>
            </div>
        </div>
    </el-card>
    <div id="detail">
        <!-- 文章详情 -->
        <div class="center" v-loading="loading">
            <el-card class="card detail">
                <md-editor editorId="my-editor" v-model="text" v-show="previewOnly" :preview="false" code-theme="atoms"
                    @onHtmlChanged="saveHtml" @onGetCatalog="onGetCatalog" style="height:600px" />
                <div v-show="!previewOnly && htmltext" class="default-theme" ref="artContent" v-html="htmltext">
                </div>
                <el-empty v-show="!htmltext && !previewOnly" :image-size="200" description="暂无文章内容，请浏览其他文章" />

            </el-card>
            <div class="chapter">
                <div class="pre" v-show="pre_article?.title" @click="nearArticle(pre_article.id)">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                    <span class="title">{{ pre_article?.title }}</span>
                </div>
                <div class="next" v-show="next_article?.title" @click="nearArticle(next_article.id)">
                    <span class="title">{{ next_article?.title }}</span>
                    <el-icon>
                        <ArrowRight />
                    </el-icon>
                </div>
            </div>
            <!-- <el-card class="card">
                <Comments :data="comment_data" :total="comment_total"></Comments>
            </el-card> -->
        </div>
        <!-- 目录 -->
        <div class="aside aside2" v-if="!previewOnly" :class="{ aside3: !is_fold && catalogList.length > 0 }">
            <el-card class="card">
                <h3 class="catalog">目录
                    <menu-fold-one @click="foldCatalog" title='收起目录' />
                </h3>
                <ul>
                    <li v-for="item in catalogList" :class="'title' + item.level" @click="goAnchor(item.text)"
                        :title="item.text">
                        {{ item.text }}
                    </li>
                </ul>
            </el-card>
        </div>
        <!-- 展开目录的按钮 -->
        <transition name="el-fade-in">
            <div class="open_catalog" v-show="is_show_open" @click="openCatalog" title="展开目录">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>
            </div>
        </transition>
    </div>
</template>
              
              
<script setup lang="ts">
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
// import Comments from "@C/Comments.vue"
import { apiArticle } from "../../api/blog";
import { Back, MenuFoldOne } from '@icon-park/vue-next';
import { updateQuery, skipRouter } from "../../hooks/router.hook";
import { goAnchor } from "../../hooks/goAnchor.hook";
const router = useRouter()
const route = useRoute()
const is_admin = window.localStorage.getItem('admin_psw') == 'liangyaokang';


const previewOnly = ref(false)
const is_fold = ref(false)
const is_show_open = ref(false)
const foldCatalog = () => {
    is_fold.value = true
    setTimeout(() => {
        is_show_open.value = true
    }, 1000);
}
const openCatalog = () => {
    is_show_open.value = false
    is_fold.value = false
}
const id = ref<number | string>(0)
id.value = route.query.id as string || 0

const text = ref("Hello Editor!")
const htmltext = ref("")
const detail = ref<any>({})
const pre_article = ref<any>({})
const next_article = ref<any>({})
const catalogList = ref<any>([])
const onGetCatalog = (list: []) => {
    catalogList.value = list
}

const loading = ref(false)
const getDetail = () => {
    loading.value = true
    apiArticle("/getArticleDetail", {
        id: id.value
    }).then((data: any) => {
        detail.value = data.res
        htmltext.value = data.res.md_html || ''
        text.value = data.res.text
        pre_article.value = data.pre_article
        next_article.value = data.next_article
        loading.value = false

    }).catch(() => {
        loading.value = false
    })
}

const submit = () => {
    apiArticle("/updateArticleDetail", {
        id: id.value,
        md_html: htmltext.value,
        text: text.value,
    }).then((res: any) => {
        ElMessage.success('保存成功')
    })
}
getDetail()

// const comment_data = reactive([])
// const comment_total = ref(0)
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

const saveHtml = (h: string) => {
    htmltext.value = h
}
const goBack = async () => {
    const query = window.sessionStorage.getItem('route_home') || '{}'
    await skipRouter('blog', JSON.parse(query))
}
// 查看文章
const nearArticle = async (art_id: number) => {
    await updateQuery(route, { id: art_id })
    id.value = art_id
    await getDetail()
    goAnchor()
}

</script>
              
              
<style lang="scss" scoped>
.chapter {
    // display: flex;
    // justify-content: space-between;
    overflow: hidden;

    .pre,
    .next {

        display: flex;
        padding: 12px;
        align-items: center;
        cursor: pointer;
        border-radius: 10px;
        color: #666;
        max-width: 200px;

        &:hover {
            color: #409EFF;
            background-color: #fff;
            box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.12);
        }

        .title {
            display: inline-block;
            // width: 160px;
            @include textEllipsis(1);
        }
    }

    .pre {
        float: left;

        .title {
            margin-left: 15px;
        }
    }

    .next {
        float: right;

        .title {
            text-align: right;
            margin-right: 15px;
        }
    }
}

.open_catalog {
    background-color: #fefefe;
    position: fixed;
    width: 20px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    top: 50%;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-50%);
    right: 20px;
    cursor: pointer;
    border-radius: 10px 0 0 10px;
    font-weight: bold;

    &:hover {
        color: #409EFF;
        background-color: #f5f7fa;
    }
}

.card {
    margin-bottom: 20px;

    h3 {
        font-size: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        margin-bottom: 10px;
    }
}

.catalog {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        cursor: pointer;

        &:hover {
            color: #409EFF;
        }
    }
}

.title1 {
    font-weight: bold;
    font-size: 16px;
    @include textEllipsis(1);
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

.header {
    text-align: center;
    vertical-align: middle;
    height: 30px;

    .back {
        float: left;
        color: #999;
        border-radius: 6px;
        border: 1px solid #fff;

        &:hover {
            border: 1px solid #c6e2ff;
            outline: none;
            background-color: #ecf5ff;

            span {
                color: #409EFF;
            }
        }
    }

    .btn {
        float: right;
    }

    .title {
        font-size: 22px;
        font-weight: bold;
        color: #666;
    }
}

#detail {
    display: flex;

    .center {
        flex: 1;
    }

    .aside {
        .card {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            border: none;
        }



        ul {
            max-height: 60vh;
            overflow-y: overlay;
            overflow-x: hidden;
        }

        li {
            padding: 0 6px;

            &:hover {
                color: #409EFF;
                transform: scale(1.03);
                border-radius: 10px;
            }
        }

        transition: all 0.7s ease-in-out;

    }

    .aside2 {
        width: 0;
        transform: translateX(100%);
        margin-left: 0px;
    }

    .aside3 {

        width: 280px;
        transform: translateX(0);
        margin-left: 20px;
    }

}
</style>
