<script setup lang="ts">
//@ts-nocheck
import { routes } from "@/router";
import { useTagsView } from "@/stores/tagsView";
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute, type RouteRecordRaw, useRouter } from "vue-router";
import path from "path-browserify";

const {
  visitedViews,
  addView,
  addVistedView,
  updateVisitedView,
  delView
} = useTagsView();
const computedVisitedViews = computed<RouteRecordRaw[]>(() => visitedViews);
const route = useRoute();
const router = useRouter();
const affixTags = ref<RouteRecordRaw[]>([]);
const tag = ref<HTMLElement[]>([]);
const activeKey = ref("");

watch(
  () => route.path,
  (newRoute, oldRoute) => {
    addTags();
    moveToCurrentTag();
  }
);

onMounted(() => {
  initTags();
  addTags();
});

function isActive($_route: RouteRecordRaw) {
  return $_route.path === route.path;
}

function isAffix(tag: RouteRecordRaw) {
  return tag.meta && tag.meta.affix;
}

function closeSelectedTag(tag: RouteRecordRaw) {
  delView(tag).then(({ visitedViews }) => {
    if (isActive(tag)) {
      toLastView(visitedViews, tag);
    }
  });
}

function toLastView(visitedViews: [], tag: RouteRecordRaw) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    router.push(latestView.fullPath);
  } else {
    if (tag.name === "Home") {
      router.replace({ path: "/redirect" + tag.fullPath });
    } else {
      router.push("/");
    }
  }
}

function filterAffixTags(routes: RouteRecordRaw[], basepath: string = "/") {
  let tags: RouteRecordRaw[] = [];
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basepath, route.path);
      tags.push({
        ...route,
        // fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      });
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
}

function initTags() {
  const $_affixTags = affixTags.value = filterAffixTags(routes);
  for (const tag of $_affixTags) {
    if (tag.name) {
      addVistedView(tag);
    }
  }
}

function addTags() {
  const { name, path } = route;
  if (name) {
    activeKey.value = path;
    addView(route);
  }
  return false;
}

function moveToCurrentTag() {
  const tags = tag.value;
  nextTick(() => {
    for (const tag of tags) {
      if (tag.to.path === route.path) {
        if (tag.to.fullPath !== route.fullPath) {
          updateVisitedView(route);
        }
        break;
      }
    }
  });
}

function onEdit(targetKey, action) {
  if (action === "remove") {
    let selectedTag = computedVisitedViews.value.find(view => view.path === targetKey);
    closeSelectedTag(selectedTag);
  }
}

function selectedTab(routePath) {
  //选择某页签时激活该页签
  activeKey.value = routePath;
  router.push(routePath);
}

</script>
<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit" :animated="false" size="large"
            :tabBarGutter="8" :hideAdd="true" @change="selectedTab">
      <a-tab-pane v-for="pane in computedVisitedViews" :key="pane.path" :tab="pane.meta?.title"
                  :closable="pane.meta?.closable">
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<style scoped lang="less">
:deep(div.ant-tabs-content-holder) {
  display: none;
  /*隐藏标签页内容，标签页内容由<router-view>内容替代*/
}

:deep(div.ant-tabs-nav) {
  padding: 2px 2px 0 2px;
  margin: 0;
}
</style>
