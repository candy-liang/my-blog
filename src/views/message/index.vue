<template>
    <div class="message">
        <el-card class="card">
            <el-input v-model="name" placeholder="尊姓大名(选填)" class="w200 mb15" />
            <el-input v-model="message" :autosize="{ minRows: 3 }" class="mb15" type="textarea" placeholder="宝贵意见" />
            <p class="tar">
                <el-button type="primary" @click="submit">提交</el-button>
            </p>
        </el-card>
        <el-card class="card" v-for="item in 4">
            <template #header>
                <h3>name</h3>
            </template>
            <p class="content mb15">把垃圾圣诞把垃圾圣诞节卡开机阿斯顿把垃圾圣诞节卡开机阿斯顿把垃圾圣诞节卡开机阿斯顿把垃圾圣诞节卡开机阿斯顿把垃圾圣诞节卡开机阿斯顿节卡开机阿斯顿</p>
            <p class="tar time">2022-12-12 18:88</p>
        </el-card>
    </div>
</template>

<script setup lang="ts">
const name = ref('')
const message = ref('')
const submit = () => {

}
</script>

<style lang="scss" scoped>
.card {
    width: 60%;
    min-width: 400px;
    margin: 0 auto 15px;
}

.content {
    text-indent: 2em;
    color: #666;
}

.time {
    font-size: 14px;
    color: #999;
}

.w200 {
    width: 200px;
}

.mb15 {
    margin-bottom: 15px;
}

.tar {
    text-align: right;
}
</style>
