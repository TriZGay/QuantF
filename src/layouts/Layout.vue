<script setup lang="ts">
import useResize from "./mixins/ResizeHandler";
import SideBar from "./sidebar/SideBar.vue";
import AppMain from "./AppMain.vue";

useResize();

</script>
<template>
    <a-layout class="app-wrapper">
        <SideBar />
        <AppMain />
    </a-layout>
</template>
<style lang="less" scoped>
.app-wrapper {
    min-height: 100vh;
}
</style>
