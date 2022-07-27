<template>
    <el-config-provider :locale="zhCn">
        <Header />
        <div class="main">
            <router-view></router-view>
            <el-backtop target=".main" :bottom="60" :visibility-height="50">
                <rocket-one theme="outline" size="24" title='回到顶部' />
            </el-backtop>
        </div>
        <!-- <Footer /> -->
    </el-config-provider>
    <div class="enter-poster" v-if="is_poster">
        <p>欢 迎 来 到 candy 的 博 客</p>
    </div>
</template>

<script setup lang="ts">
import Header from "@C/Header.vue"
import Footer from "@C/Footer.vue"
import { ElConfigProvider } from 'element-plus'
import { RocketOne } from "@icon-park/vue-next"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const is_poster = ref(false)
if (!window.sessionStorage.getItem('isPoster')) {
    is_poster.value = true
    window.sessionStorage.setItem('isPoster', 'true')
}
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    position: absolute;
    top: 4.375rem;
    padding: 1.25rem;
    height: calc(100vh - 7.5rem);
    overflow-y: overlay;
    overflow-x: hidden;
    box-sizing: border-box;
    background-color: #fafafa;
}
</style>
<style lang="scss">
@import "/style/reset.css";

.enter-poster {
    display: flex;
    justify-content: center;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    position: fixed;
    color: #fff;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 4000;
    background: url("@/assets/poster.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    font-size: 40px;
    animation: poster 2s ease-in-out 3s both;

    p {
        animation: tracking 2s ease-in-out 0.5s both;
    }
}

@keyframes poster {
    99% {
        transform: translateY(-100%);
        opacity: 1;
    }

    100% {
        transform: translateY(-100%);
        opacity: 0;
    }
}



@keyframes tracking {
    0% {
        letter-spacing: 1em;
        -webkit-transform: translateZ(400px) translateY(-300px);
        transform: translateZ(400px) translateY(-300px);
        opacity: 0;
    }

    40% {
        opacity: 0.6;
    }

    100% {
        -webkit-transform: translateZ(0) translateY(0);
        transform: translateZ(0) translateY(0);
        opacity: 1;
    }
}
</style>
