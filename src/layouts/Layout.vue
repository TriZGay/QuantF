<script setup lang="ts">
import useResize from "./mixins/ResizeHandler";
import SideBarVue from "./sidebar/SideBar.vue";
import AppMain from "./AppMain.vue";
import { computed } from "vue";
import { useAppStore, type SideBar } from "@/stores/app";

useResize();
const { sidebar, device } = useAppStore()
const $_sidebar = computed<SideBar>(() => sidebar)
const $_device = computed<string>(() => device)
const classObj = computed<Object>(() => {
    return {
        hideSidebar: !$_sidebar.value.opened,
        openSidebar: $_sidebar.value.opened,
        withoutAnimation: $_sidebar.value.withoutAnimation,
        mobile: $_device.value === 'mobile'
    }
})

</script>
<template>
    <div :class="classObj" class="app-wrapper">
        <SideBarVue class="sidebar-container" />
        <div class="main-container">
            <AppMain />
        </div>
    </div>

</template>
<style lang="less" scoped>
.app-wrapper {
    &:after {
        content: "";
        display: table;
        clear: both;
    }

    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - 210px);
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.mobile .fixed-header {
    width: 100%;
}
</style>
