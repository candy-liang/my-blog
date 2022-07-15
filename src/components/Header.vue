<template>
    <div class="header">
        <div class="logo" @click="backHome" title="返回首页">
            <img src="../assets/logohei.png" alt="" />
        </div>
        <div class="center" v-if="!isHome">
            <el-input v-model="input2" placeholder="Search Article" clearable class="input-with-select w500">
                <template #append>
                    <el-button :icon="Search" />
                </template>
            </el-input>
        </div>
        <div class="login">
            <span @click="enterAdmin">管 理</span>
            <span>关 于</span>
            <span>留 言</span>
            <span>登 录</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
const props = defineProps({
    isHome: {
        type: Boolean,
        default: true,
    },
})
const input2 = ref("")
const router = useRouter()
const backHome = () => {
    router.push("/")
}
const enterAdmin = () => {
    router.push({ name: 'admin' })
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
    box-shadow: 0 0 3px rgb(234 234 234 / 80%);
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
