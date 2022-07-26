<template>
    <el-config-provider :locale="zhCn">
        <Header />
        <div class="main">
            <router-view></router-view>
            <el-backtop target=".main" :bottom="60" :visibility-height="50">
                <rocket-one theme="outline" size="24" title='回到顶部'/>
            </el-backtop>
        </div>
        <Footer />
    </el-config-provider>
</template>

<script setup lang="ts">
import Header from "@C/Header.vue"
import Footer from "@C/Footer.vue"
import { ElConfigProvider } from 'element-plus'
import { RocketOne } from "@icon-park/vue-next"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    position: absolute;
    top: 70px;
    padding: 20px;
    height: calc(100vh - 120px);
    overflow-y: overlay;
    overflow-x: hidden;
    box-sizing: border-box;
    background-color: #fafafa;
}
</style>
<style lang="scss">
@import "/style/reset.css";

.app {
    background: url("@/assets/poster.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
