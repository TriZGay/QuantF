<script setup lang="ts">
//@ts-nocheck
import { routes } from '@/router';
import { useTagsView } from '@/stores/tagsView';
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, type RouteRecordRaw, RouterLink, useRouter } from 'vue-router';
import path from 'path-browserify'
const {
    visitedViews,
    addView,
    addVistedView,
    updateVisitedView,
    delView
} = useTagsView()
const computedVisitedViews = computed<RouteRecordRaw[]>(() => visitedViews)
const route = useRoute()
const router = useRouter();
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

function closeSelectedTag(tag: RouteRecordRaw) {
    delView(tag).then(({ visitedViews }) => {
        if (isActive(tag)) {
            toLastView(visitedViews, tag)
        }
    })
}
function toLastView(visitedViews: [], tag: RouteRecordRaw) {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
        router.push(latestView.fullPath)
    } else {
        if (tag.name === 'Home') {
            router.replace({ path: "/redirect" + tag.fullPath })
        } else {
            router.push("/")
        }
    }
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
        addView(route)
    }
    return false
}

function moveToCurrentTag() {
    const tags = tag.value
    console.log(tags)
    nextTick(() => {
        for (const tag of tags) {
            if (tag.to.path === route.path) {
                if (tag.to.fullPath !== route.fullPath) {
                    updateVisitedView(route)
                }
                break
            }
        }
    })
}

const activeKey = ref()

function onEdit(targetKey, action) {

}

function selectedTab(activeKey) {
    
}

</script>
<template>
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit" :hideAdd="true" @change="selectedTab">
        <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        </a-tab-pane>
    </a-tabs>
    <!-- <div id="tags-view-container" class="tags-view-container">
        <span class="left-caret">
            <caret-left-outlined />
        </span>
        <RouterLink v-for="tag in computedVisitedViews" ref="tag" :class="isActive(tag) ? 'active' : ''" :key="tag.path"
            :to="tag" class="tags-view-item">
            {{ tag.meta?.title }}
            <close-outlined @click="closeSelectedTag(tag)" />
        </RouterLink>
        <span class="right-caret">
            <caret-right-outlined />
        </span>
    </div> -->
</template>
<style scoped lang="less">
:deep(div.ant-tabs-content-holder) {
    display: none;
    /*隐藏标签页内容，标签页内容由<router-view>内容替代*/
}

.tags-view-container {
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;

    .left-caret,
    .right-caret {
        position: absolute;
        display: inline-block;
        transition: all 0.5s;
    }

    .left-caret:hover,
    .right-caret:hover {
        cursor: pointer;
        transform: scale(1.8);
    }

    .left-caret {
        left: 0;
    }

    .right-caret {
        right: 0;
    }

    .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border: 1px solid #d8dce5;
        color: #495060;
        background: #fff;
        padding: 0 8px;
        font-size: 12px;
        margin-left: 5px;
        margin-top: 4px;

        &:first-of-type {
            margin-left: 30px;
        }

        &:last-of-type {
            margin-right: 30px;
        }

        &.active {
            background-color: #42b983;
            color: #fff;
            border-color: #42b983;

            &::before {
                content: '';
                background: #fff;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                margin-right: 2px;
            }
        }
    }
}
</style>