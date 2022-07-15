<template>
    <el-card class="card header">
        <el-button text @click="goBack">
            <el-icon>
                <ArrowLeft />
            </el-icon>返回
        </el-button>
        <el-button type="primary" @click="previewOnly = !previewOnly">评论</el-button>
        <el-button type="primary" @click="previewOnly = !previewOnly">提交</el-button>
        <el-button type="primary" @click="previewOnly = !previewOnly">提交</el-button>
    </el-card>
    <div id="detail">
        <div class="aside" v-if="!previewOnly && state.catalogList.length">
            <el-affix :offset="184">
                <el-card class="card">
                    <h3>目录</h3>
                    <ul>
                        <li v-for="item in state.catalogList" :class="item.level == 2 ? 'title2' : 'title3'"
                            @click="goAnchor(item.text)">
                            {{ item.text }}
                        </li>
                    </ul>
                </el-card>
            </el-affix>
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
const router = useRouter()
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
const state: any = reactive({
    catalogList: [],
})
const onGetCatalog = (list: []) => {
    state.catalogList = list
}

const goAnchor = (selector: any) => {
    console.log(selector);
    document.getElementById(selector)?.scrollIntoView({ block: "start", inline: "center", behavior: "smooth" })
}

const text = ref("Hello Editor!")
const htmltext = ref("")
const previewOnly = ref(true)

const saveHtml = (h: string) => {
    htmltext.value = h
}
const goBack = () => {
    router.go(-1)
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



#detail {
    display: flex;

    .center {
        flex: 1;
    }
.aside{
    margin-right: 20px;

}
}
</style>
