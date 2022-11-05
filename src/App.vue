<script setup>

</script>

<template>
    <router-view/>
</template>

<style lang='less'>
@import '@/style/common.less';
.tips {
    padding: 7px !important;
    max-width: 200px !important;
    border-radius: 0px !important;
    background: @Header !important;
    .el-notification__group {
        .el-notification__content {
            color: white !important;
        }
        .el-notification__closeBtn {
            top: 11px;
        }
    }
}
</style>