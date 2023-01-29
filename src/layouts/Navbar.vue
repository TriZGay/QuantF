<script setup lang="ts">
import { ref, watch, TransitionGroup } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';

const levelList = ref<RouteRecordRaw[]>([])
const route = useRoute()

watch(
    () => route.path,
    (newRoute, oldRoute) => {
        console.log(newRoute, oldRoute)
        if (newRoute.startsWith("/redirect/")) {
            return
        }
        getBreadcrumb()
    }
)

function getBreadcrumb() {
    let matched = route.matched.filter(item => item.meta && item.meta.title)
    const first = matched[0]

    if (!isHomepage(first)) {
        //@ts-ignore
        matched = [{ path: "/", meta: { title: "首页" } }].concat(matched)
    }
    levelList.value = matched.filter(item => item.meta && item.meta.title)
}

function isHomepage(route: RouteRecordRaw) {
    const name = route && route.name
    if (!name) {
        return false
    }
    return name.toString().trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()

}

getBreadcrumb()

</script>
<template>
    <a-breadcrumb style="margin: 16px 0" separator="/" class="app-breadcrumb">
        <TransitionGroup name="breadcrumb">
            <a-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                <span v-if="item.redirect === 'noRedirect' || index === levelList?.length - 1">{{
                    item.meta?.title
                }}</span>
            </a-breadcrumb-item>
        </TransitionGroup>
    </a-breadcrumb>
</template>
<style lang="less" scoped>
.app-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>