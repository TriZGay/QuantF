import { defineStore } from "pinia";
import { ref } from 'vue';
import type { RouteRecordRaw } from "vue-router";

export const useTagsView = defineStore("tagsView", () => {
    const visitedViews = ref<RouteRecordRaw[]>([])
    const cachedViews = ref<string[]>([])

    function addVistedView(view: RouteRecordRaw) {
        if (visitedViews.value.some(v => v.path === view.path)) {
            return
        }
        visitedViews.value.push(
            Object.assign({}, view, {
                title: view.meta?.title || 'no-name'
            })
        )
    }

    function addCachedView(view: RouteRecordRaw) {
        //@ts-ignore
        if (cachedViews.value.includes(view.name)) {
            return
        }
        if (!view.meta?.noCache) {
            //@ts-ignore
            cachedViews.value.push(view.name)
        }

    }

    function addView(view: RouteRecordRaw) {
        addVistedView(view)
        addCachedView(view)
    }

    function delView(view: RouteRecordRaw) {
        return new Promise(resolve => {
            delVisitedView(view)
            delCachedView(view)
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })
        })
    }

    function delVisitedView(view: RouteRecordRaw) {
        return new Promise(resolve => {
            for (const [i, v] of visitedViews.value.entries()) {
                if (v.path === view.path) {
                    visitedViews.value.splice(i, 1)
                    break
                }
            }
            resolve([...visitedViews.value])
        })
    }

    function delCachedView(view: RouteRecordRaw) {
        //@ts-ignore
        const index = cachedViews.value.indexOf(view.name)
        index > -1 && cachedViews.value.splice(index, 1)
    }

    function delOthersViews(view: RouteRecordRaw) {
        return new Promise(resolve => {
            delOthersVisitedViews(view)
            delOthersCachedViews(view)
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })
        })
    }

    function delOthersVisitedViews(view: RouteRecordRaw) {
        return new Promise(resolve => {
            visitedViews.value = visitedViews.value.filter(v => {
                return v.meta?.affix || v.path === view.path
            })
            resolve([...visitedViews.value])
        })
    }

    function delOthersCachedViews(view: RouteRecordRaw) {
        return new Promise(resolve => {
            //@ts-ignore
            const index = cachedViews.value.indexOf(view.name)
            if (index > -1) {
                cachedViews.value = cachedViews.value.slice(index, index + 1)
            } else {
                cachedViews.value = []
            }
            resolve([...cachedViews.value])
        })
    }

    function delAllViews() {
        return new Promise(resolve => {
            delAllVisitedViews()
            delAllCachedViews()
            resolve({
                visitedViews: [...visitedViews.value],
                cachedViews: [...cachedViews.value]
            })
        })
    }

    function delAllVisitedViews() {
        return new Promise(resolve => {
            const affixTags = visitedViews.value.filter(tag => tag.meta?.affix)
            visitedViews.value = affixTags
            resolve([...visitedViews.value])
        })
    }

    function delAllCachedViews() {
        return new Promise(resolve => {
            cachedViews.value = []
            resolve([...cachedViews.value])
        })
    }

    function updateVisitedView(view: RouteRecordRaw) {
        for (let v of visitedViews.value) {
            if (v.path === view.path) {
                v = Object.assign(v, view)
                break
            }
        }
    }

    return {
        visitedViews,
        cachedViews,
        addView,
        addCachedView,
        addVistedView,
        delView,
        delVisitedView,
        delCachedView,
        delOthersViews,
        delOthersVisitedViews,
        delOthersCachedViews,
        delAllViews,
        delAllVisitedViews,
        delAllCachedViews,
        updateVisitedView
    }
})