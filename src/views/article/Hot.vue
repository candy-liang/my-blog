<template>
    <el-card class="card">
        <h3>热门文章</h3>
        <ul class="hot-article" v-show="hot_article.length">
            <li v-for="item in hot_article" @click="checkArticle(item.id)">{{ item.title }}</li>
        </ul>
        <el-skeleton :rows="3" v-show="skeleton_hot" animated />
        <el-empty v-show="!skeleton_hot && !hot_article.length" :image-size="100" style="padding:10px 0"
            description="暂无文章" />
    </el-card>
</template>
              
              
<script setup lang="ts">
import { apiArticle } from "../../api/blog"
import { skipRouter } from "../../hooks/router.hook";

// 获取热门文章
const skeleton_hot = ref(true)
const hot_article = ref<any[]>([])
apiArticle("/getHotArticleList").then((res: any) => {
    hot_article.value = res.filter((v: any) => v.status == 'show')
    skeleton_hot.value = false
}).catch((e: any) => {
    skeleton_hot.value = false
})

// 查看文章
const checkArticle = (id: number) => {
    skipRouter('detail', { id })
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
        display: flex;
        align-items: center;
    }

    .hot-article {
        font-size: 14px;
        color: #666;

        li {
            padding: 0 10px;
            border       : 1px solid #fff;

            &:hover {
                font-weight: bold;
                color: #409EFF;
            }
        }
    }
}
</style>