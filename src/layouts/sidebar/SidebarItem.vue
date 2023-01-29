<script setup lang="ts">
import path from 'path-browserify'
import { isExternal } from '@/utils/validate';
import MenuItem from './MenuItem.vue';
import AppLink from './Link.vue';
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
    item: RouteRecordRaw,
    isNest?: boolean,
    basePath: string
}>()

let onlyOneChild: any = null

function hasOneShowingChild(children: RouteRecordRaw[] | undefined, parent: RouteRecordRaw) {
    //@ts-ignore
    const showingChildren = children.filter(item => {
        if (item.children) {
            return false
        } else {
            onlyOneChild = item
            return true
        }
    })
    if (showingChildren.length === 1) {
        return true
    }
    if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
    }
    return false
}

function resolvePath(routePath: string) {
    if (isExternal(routePath)) {
        return routePath
    }
    if (isExternal(props.basePath)) {
        return props.basePath
    }
    return path.resolve(props.basePath, routePath)
}


</script>
<template>
    <div v-if="!item.meta?.hidden">
        <template v-if="hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.meta?.alwaysShow">
            <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <a-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <MenuItem :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                        :title="onlyOneChild.meta.title">
                    </MenuItem>
                </a-menu-item>
            </AppLink>
        </template>
        <a-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
            <SidebarItem v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                :base-path="resolvePath(child.path)" class="nest-menu">

            </SidebarItem>
        </a-sub-menu>
    </div>
</template>