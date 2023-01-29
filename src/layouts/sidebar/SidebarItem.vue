<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
    menuInfo: RouteRecordRaw,
}>()

</script>
<template>
    <div v-if="!menuInfo.meta?.hidden">
        <template v-if="menuInfo.children?.length === 1">
            <a-menu-item :key="menuInfo.children[0].path">
                {{ menuInfo.children[0].meta?.title || menuInfo.meta?.title }}
            </a-menu-item>
        </template>
        <template v-else>
            <a-sub-menu>
                <template #title>{{ menuInfo.meta?.title }}</template>
                <template v-for="child in menuInfo.children" :key="child.key">
                    <template v-if="!child.children">
                        <a-menu-item :key="child.path">
                            {{ child.meta?.title }}
                        </a-menu-item>
                    </template>
                    <template v-else>
                        <SidebarItem :menu-info="child" key="child.path" />
                    </template>
                </template>
            </a-sub-menu>
        </template>
    </div>
</template>