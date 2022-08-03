<template>
    <div class="header">
        <div class="logo" @click="skipRouter('blog')" title="返回首页">
            <img src="../assets/logohei.png" alt="" />
        </div>
        <div class="center">
            <el-input v-model="search_val" placeholder="输入文章标题进行搜索" clearable class="input-with-select w500">
                <template #append>
                    <el-button :icon="Search" @click="searchArticle" />
                </template>
            </el-input>
        </div>
        <div class="login">
            <span v-for="item in menu" :class="{ active: route.name == item.path }" @click="skipRouter(item.path)">{{
                    item.label
            }}</span>
            <!-- <span>登 录</span> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
import { updateQuery, skipRouter } from "../hooks/router.hook";
const route = useRoute()
const search_val = ref("")
watchEffect(() => {
    search_val.value = route.query.key as string || ''
})
// 导航菜单
const menu = reactive([
    {
        label: '首页',
        path: 'blog'
    },
    {
        label: '关于',
        path: 'about'
    },
    {
        label: '留言',
        path: 'message'
    },
    // {
    //     label: '管理',
    //     path: 'admin'
    // },
])
// 处理搜索
const searchArticle = () => {
    // 首页与非首页的参数不同
    const param = route.name == 'blog' ? route : { name: 'blog' }
    updateQuery(param, { key: search_val.value, current_page: 1 })
}
</script>

<style lang="scss" scoped>
.el-col {
    text-align: center;
}

.header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 70px;
    z-index: 999;
    line-height: 70px;
    font-size: 16px;
    background-color: rgba(255, 255, 255, 0.8);
    color: #333;
    box-shadow: inset 0 -1px 4px rgb(0 0 0 / 12%);
    border-bottom: 1px solid rgb(234 234 234 / 80%);
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: space-between;

    .logo {
        width: 200px;
        height: 100%;
        text-align: center;
        cursor: pointer;

        img {
            height: 70px;
        }
    }

    .center {
        flex: 1;
        text-align: center;
    }

    .login {
        width: 280px;
        text-align: right;
        font-weight: bold;

        span {
            display: inline-block;
            width: 60px;
            text-align: center;
            cursor: pointer;
        }
    }
}

.active {
    color: #409EFF;
    border-bottom: 3px solid #409EFF;
    height: 70px;
    box-sizing: border-box;
}

.w500 {
    width: 500px;
    transition: all 0.5s;
}

@media screen and (max-width: 950px) {
    .w500 {
        width: 300px;
        transition: all 0.5s;
    }
}

@media screen and (max-width: 730px) {
    .w500 {
        display: none;
    }
}
</style>
