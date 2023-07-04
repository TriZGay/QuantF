<script setup lang="ts">
import { ReloadOutlined } from '@ant-design/icons-vue'
import { usePositionStore } from '@/stores/position';

const positionStore = usePositionStore();

</script>
<template>
    <div class="position-list-container">
        <a-button type="primary" @click="positionStore.refreshPos()">
            <template #icon>
                <ReloadOutlined />
            </template>
            刷新持仓数据
        </a-button>
        <a-table class="searchResult">

        </a-table>
    </div>
</template>
<style lang="less" scoped>
.searchResult {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
}
</style>