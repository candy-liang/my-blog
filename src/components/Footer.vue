<template>
    <div class="footer">粤ICP备2022095572</div>
</template>

<script setup lang="ts">
const props = defineProps({
    isHome: {
        type: Boolean,
        default: true,
    },
})
</script>

<style lang="scss" scoped>
.footer {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    color: #666;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    box-shadow: inset 0 1px 4px rgb(0 0 0 / 12%);
}
</style>
