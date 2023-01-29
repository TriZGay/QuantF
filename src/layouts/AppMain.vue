<script setup lang="ts">
import { useTagsView } from '@/stores/tagsView';
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';

const route = useRoute();
const key = computed<string>(() => route.path)

const tagView = useTagsView()
const cachedViews = computed<string[]>(() => tagView.cachedViews)

</script>

<template>
    <a-layout>
        <a-layout-header style="background: #fff" />
        <a-layout-content>
            <section class="app-main">
                <RouterView :key="key" v-slot="{ Component }">
                    <KeepAlive>
                        <component :is="Component" />
                    </KeepAlive>
                </RouterView>
            </section>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
            Quantf ©2099 Created by Futakotome
        </a-layout-footer>
    </a-layout>
</template>

<style lang="less" scoped>

</style>
