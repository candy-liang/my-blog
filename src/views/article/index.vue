<template>
    <el-card class="card">
        <div class="header">
            <el-button text @click="goBack" class="back">
                <back theme="outline" size="24" fill="#999" title='返回' />
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
            <!-- <el-card class="card">
                <Comments :data="comment_data" :total="comment_total"></Comments>
            </el-card> -->
        </div>
        <div class="aside2" v-if="!previewOnly" :class="{ aside: catalogList.length > 0 }">
            <el-card class="card">
                <h3>目录</h3>
                <ul>
                    <li v-for="item in catalogList" :class="'title' + item.level" @click="goAnchor(item.text)">
                        {{ item.text }}
                    </li>
                </ul>
            </el-card>
        </div>
    </div>
</template>
              
              
<script setup lang="ts">
import MdEditor from "md-editor-v3"
import "md-editor-v3/lib/style.css"
// import Comments from "@C/Comments.vue"
import { apiArticle } from "../../api/blog";
import { Back } from '@icon-park/vue-next';
const router = useRouter()
const route = useRoute()
const is_admin = window.localStorage.getItem('admin_psw') == 'liangyaokang';


const previewOnly = ref(false)

const id = route.query.id as string || 0

const text = ref("Hello Editor!")
const htmltext = ref("")
const detail = ref<any>({})
const catalogList = ref<any>([])
const onGetCatalog = (list: []) => {
    catalogList.value = list
}

const loading = ref(false)
const getDetail = () => {
    loading.value = true
    apiArticle("/getArticleDetail", {
        id: id
    }).then((res: any) => {
        detail.value = res
        htmltext.value = res.md_html || ''
        text.value = res.text
        loading.value = false
    }).catch(() => {
        loading.value = false
    })
}

const submit = () => {
    apiArticle("/updateArticleDetail", {
        id: id,
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
    text-align: center;
    vertical-align: middle;

    .back {
        float: left;
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


    .aside2 {
        width: 0;
        margin-left: 0px;
        transition: all 0.7s ease-in-out;
    }

    .aside {
        width: 280px;
        margin-left: 20px;

        .card {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
        }
    }


}
</style>
