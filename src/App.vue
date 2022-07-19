<template>
    <Header />
    <div class="main">
        <el-config-provider :locale="zhCn">
            <router-view></router-view>
        </el-config-provider>
    </div>
    <el-backtop :bottom="100" :visibility-height="50"></el-backtop>
    <Footer />
</template>

<script setup lang="ts">
import Header from "@C/Header.vue"
import Footer from "@C/Footer.vue"
import { ElConfigProvider } from 'element-plus'
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
