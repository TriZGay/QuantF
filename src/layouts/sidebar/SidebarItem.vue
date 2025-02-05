<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
    menuInfo: RouteRecordRaw,
}>()

</script>
<template>
    <template v-if="!menuInfo.meta?.hidden">
        <template v-if="menuInfo.children?.length === 1">
            <a-menu-item :key="menuInfo.children[0].path">
                <component :is="menuInfo.children[0].meta?.icon || menuInfo.meta?.icon"
                    v-if="menuInfo.children[0].meta?.icon || menuInfo.meta?.icon" />
                <span>{{ menuInfo.children[0].meta?.title || menuInfo.meta?.title }}</span>
            </a-menu-item>
        </template>
        <template v-else>
            <a-sub-menu :key="menuInfo.path">
                <template #title>
                    <span>
                        <component v-if="menuInfo.meta?.icon" :is="menuInfo.meta?.icon" />
                        <span>{{ menuInfo.meta?.title }}</span>
                    </span>
                </template>
                <template v-for="child in menuInfo.children" :key="child.key">
                    <template v-if="!child.children">
                        <a-menu-item :key="child.path">
                            <component v-if="child.meta?.icon" :is="child.meta?.icon" />
                            <span> {{ child.meta?.title }} </span>
                        </a-menu-item>
                    </template>
                    <template v-else>
                        <SidebarItem :menu-info="child" key="child.path" />
                    </template>
                </template>
            </a-sub-menu>
        </template>
    </template>

</template>
