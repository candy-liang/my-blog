<template>
    <div class="footer">Footer</div>
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
    color: #333;
    position: absolute;
    bottom: 0;
}

</style>
