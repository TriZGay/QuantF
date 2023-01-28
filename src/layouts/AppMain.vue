<script setup lang="ts">
import { useTagsView } from '@/stores/tagsView';
import { computed } from 'vue';
import { useRoute, type RouteRecordName, RouterView } from 'vue-router';

const route = useRoute();
const key = computed<string>(() => route.path)

const tagView = useTagsView()
const cachedViews = computed<string[]>(() => tagView.cachedViews)

</script>

<template>
    <section class="app-main">
        <Transition name="fade-transform" mode="out-in">
            <KeepAlive :include="cachedViews">
                <RouterView :key="key"></RouterView>
            </KeepAlive>
        </Transition>
    </section>
</template>

<style lang="less" scoped>
.app-main {
    /* 50= navbar  50  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.fixed-header+.app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
        padding-top: 84px;
    }
}
</style>
