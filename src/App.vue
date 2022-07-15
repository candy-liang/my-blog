<template>
    <Header />
    <div class="main">
        <router-view></router-view>
    </div>
    <el-backtop :bottom="100" :visibility-height="50"></el-backtop>
    <Footer />
</template>

<script setup lang="ts">
import Header from "@C/Header.vue"
import Footer from "@C/Footer.vue"

</script>

<style lang="scss" scoped>
.main {
    width: 100%;
    position: absolute;
    top: 70px;
    padding: 20px;
    height: calc(100vh - 120px);
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
}
</style>
<style lang="scss">
@import "/style/reset.css";

#app {
    background-color: #f1f0f0;
}

.app {
    background: url("@/assets/poster.jpeg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
