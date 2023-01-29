<script setup lang="ts">
import { useTagsView } from '@/stores/tagsView';
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Navbar from './Navbar.vue';

const route = useRoute();
const key = computed<string>(() => route.path)

const tagView = useTagsView()
const cachedViews = computed<string[]>(() => tagView.cachedViews)

</script>

<template>
    <a-layout>
        <a-layout-header style="background: #fff;" />
        <a-layout-content style="margin: 0 16px">
            <Navbar />
            <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                <RouterView :key="key" v-slot="{ Component }">
                    <KeepAlive>
                        <component :is="Component" />
                    </KeepAlive>
                </RouterView>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Quantf ©2099 Created by Futakotome
        </a-layout-footer>
    </a-layout>
</template>

<style lang="less" scoped>

</style>
