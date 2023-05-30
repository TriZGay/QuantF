<script setup lang="ts">
import { useTagsView } from '@/stores/tagsView';
import { computed, Transition } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Navbar from './Navbar.vue';
import TagView from './tagView/TagView.vue';
import User from './User.vue';

const route = useRoute();
const key = computed<string>(() => route.path)

const tagView = useTagsView()
const cachedViews = computed<string[]>(() => tagView.cachedViews)

</script>

<template>
    <a-layout>
        <a-layout-header style="background: #fff;">
            <a-space>
                <TagView />
                <User />
            </a-space>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
            <Navbar />
            <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                <RouterView :key="key" v-slot="{ Component }">
                    <Transition name="fade" mode="out-in" appear>
                        <KeepAlive :include="cachedViews">
                            <component :is="Component" />
                        </KeepAlive>
                    </Transition>
                </RouterView>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Quantf ©2099 Created by Futakotome
        </a-layout-footer>
    </a-layout>
</template>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
