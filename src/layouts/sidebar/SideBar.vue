<script setup lang="ts">
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import { routes } from '@/router';
import { computed } from 'vue';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const { meta, path } = useRoute();
const { sidebar } = useAppStore();
const isCollapse = computed<boolean>(() => sidebar.opened);


</script>
<template>
    <div class="has-logo">
        <Logo :collapse="isCollapse" />
        <a-menu mode="inline">
            <SidebarItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
        </a-menu>
    </div>
</template>
<style lang="less">

</style>