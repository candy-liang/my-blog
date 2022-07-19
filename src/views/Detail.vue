<template>
    <el-card class="card">
        <div class="header">
            <el-button text @click="goBack">
                <el-icon>
                    <ArrowLeft />
                </el-icon>返回
            </el-button>
            <span class="title">{{ detail.title }}{{ previewOnly ? ' (编辑中...)' : '' }}</span>
            <div class="btn">
                <el-button type="primary" @click="previewOnly = !previewOnly">{{ previewOnly ? '完成' : '编辑' }}
                </el-button>
                <el-button type="success" @click="submit">保存</el-button>
            </div>
        </div>
    </el-card>
    <div id="detail">
        <div class="aside" v-if="!previewOnly && catalogList.length">
            <el-card class="card">
                <h3>目录</h3>
                <ul>
                    <li v-for="item in catalogList" :class="'title' + item.level" @click="goAnchor(item.text)">
                        {{ item.text }}
                    </li>
                </ul>
            </el-card>
        </div>
        <!-- 文章详情 -->
        <div class="center">
            <el-card class="card detail">
                <md-editor editorId="my-editor" v-model="text" v-if="previewOnly" :preview="true" code-theme="atoms"
                    @onHtmlChanged="saveHtml" @onGetCatalog="onGetCatalog" style="height:600px" />
                <div v-else class="default-theme" ref="artContent" v-html="htmltext"></div>

            </el-card>
            <el-card class="card">
                <Comments :data="comment_data" :total="comment_total"></Comments>
            </el-card>

        </div>

    </div>
</template>
              
              
<script setup lang="ts">
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import Comments from "@C/Comments.vue"
import { getArticle } from "../api/blog";
import { Message } from "@icon-park/vue-next";
const router = useRouter()
const route = useRoute()
const previewOnly = ref(false)

const id = route.query.id as string || 0

const text = ref("Hello Editor!")
const htmltext = ref("")
const detail = ref<any>({})
const catalogList = ref<any>([])
const onGetCatalog = (list: []) => {
    catalogList.value = list
    console.log(list);
}

const getDetail = () => {
    getArticle("/getArticleDetail", {
        id: id
    }).then((res: any) => {
        detail.value = res
        htmltext.value = res.md_html || ''
        catalogList.value = res.catalogList
        text.value = res.text
    })
}

const submit = () => {
    getArticle("/updateArticleDetail", {
        id: id,
        catalogList: catalogList.value,
        md_html: htmltext.value,
        text: text.value,
    }).then((res: any) => {
        ElMessage.success('保存成功')
    })
}
getDetail()

const comment_data = reactive([])
const comment_total = ref(0)
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
const goBack = () => {
    router.go(-1)
}
const goAnchor = (selector: any) => {
    document.getElementById(selector)?.scrollIntoView({ block: "start", inline: "center", behavior: "smooth" })
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
    display: flex;
    justify-content: space-between;
    align-items: center;

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
        margin-right: 20px;

        .card {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
        }
    }
}
</style>
