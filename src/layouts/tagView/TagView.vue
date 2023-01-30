<script setup lang="ts">
import { routes } from '@/router';
import { useTagsView } from '@/stores/tagsView';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, type RouteRecordRaw, RouterLink } from 'vue-router';
import path from 'path-browserify'

const {
    visitedViews,
    addView,
    addVistedView,
    updateVisitedView
} = useTagsView()
const computedVisitedViews = computed<RouteRecordRaw[]>(() => visitedViews)
const route = useRoute()
const affixTags = ref<RouteRecordRaw[]>([])
const tag = ref<HTMLElement[]>([])

watch(
    () => route.path,
    (newRoute, oldRoute) => {
        addTags()
        moveToCurrentTag()
    }
)

onMounted(() => {
    initTags()
    addTags()
})

function isActive($_route: RouteRecordRaw) {
    return $_route.path === route.path
}

function isAffix(tag: RouteRecordRaw) {
    return tag.meta && tag.meta.affix
}

function filterAffixTags(routes: RouteRecordRaw[], basepath: string = "/") {
    let tags: RouteRecordRaw[] = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basepath, route.path)
            tags.push({
                ...route,
                // fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta }
            })
        }
        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }
    })
    return tags
}

function initTags() {
    const $_affixTags = affixTags.value = filterAffixTags(routes)
    for (const tag of $_affixTags) {
        if (tag.name) {
            addVistedView(tag)
        }
    }
}

function addTags() {
    const { name } = route
    if (name) {
        //@ts-ignore
        addView(route)
    }
    return false
}

function moveToCurrentTag() {
    const tags = tag.value
    console.log(tags)
    nextTick(() => {
        for (const tag of tags) {
            //@ts-ignore
            if (tag.to.path === route.path) {
                //@ts-ignore
                if (tag.to.fullPath !== route.fullPath) {
                    //@ts-ignore
                    updateVisitedView(route)
                }
                break
            }
        }
    })
}

</script>
<template>
    <div id="tags-view-container">
        <RouterLink v-for="tag in computedVisitedViews" ref="tag" :key="tag.path" :to="tag">
            {{ tag.meta?.title }}
        </RouterLink>
    </div>
</template>
<style scoped lang="less">

</style>