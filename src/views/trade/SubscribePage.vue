<script setup lang="ts">
import { useSubStores } from '@/stores/sub';
import { storeToRefs } from 'pinia';

const subStores = useSubStores();
const refreshSubscribeInfo = subStores.syncSub;
const { syncLoading } = storeToRefs(subStores);

refreshSubscribeInfo()
</script>
<template>
    <div class="subscribe-info-container">
        <a-button @click="refreshSubscribeInfo()" :loading="syncLoading">
            刷新
            <template #icon>
                <reload-outlined />
            </template>
        </a-button>
    </div>
</template>
<style lang="less" scoped>
.subscribe-info-container {}
</style>