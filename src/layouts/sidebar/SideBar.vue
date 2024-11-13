<script setup lang="ts">
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import { routes } from '@/router';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const { sidebar, toggleSideBar } = useAppStore();

const router = useRouter()

const selectedMenuKeys = ref<string[]>([])

function toSelectMenu(menu: any) {
    router.push({
        path: menu.key
    })
}

function toCollapseSideBar(collapsed: boolean, type: string) {
    toggleSideBar(collapsed)
}

</script>
<template>
    <a-layout-sider @collapse="toCollapseSideBar" v-model:collapsed="sidebar.collapsed" collapsible>
        <Logo :collapse="sidebar.collapsed" />
        <a-menu v-model:selectedKeys="selectedMenuKeys" mode="inline" theme="dark" @click="toSelectMenu">
            <template v-for="route in routes" :key="route.path">
                <SidebarItem :menu-info="route" />
            </template>
        </a-menu>
    </a-layout-sider>
</template>
<style lang="less" scoped>

</style>