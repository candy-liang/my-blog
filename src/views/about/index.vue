<template>
    <div class="about">
        <el-card class="card">
            <h3>
                <el-avatar :size="70" src="src/assets/avatar.jpg" />
            </h3>
            <h3>关于博主</h3>
            <p class="slogan">一名在广州漂泊的前端小白，喜欢学习技术和粤语文化</p>
            <p class="slogan">记录进步的点点滴滴</p>
        </el-card>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.card {

    width: 600px;
    margin: 0 auto;
    box-shadow: inset -2px -2px 8px rgba(0, 0, 0, 0.12);
}

h3 {
    text-align: center;
}

.slogan {
    text-align: center;
    margin-top: 15px;
}
</style>
