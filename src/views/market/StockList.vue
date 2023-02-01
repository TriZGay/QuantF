<script setup lang="ts">
import { useStockStore } from '@/stores/stock';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const stockStore = useStockStore()
const { list, loading, pageSize, totalPage, current } = storeToRefs(stockStore);
const stocksColumns = ref([
    {
        title: "名称",
        dataIndex: "name",
        window: "20%"
    }
])
const pagination = computed<Object>(() => {
    return {
        total: totalPage.value,
        current: current.value,
        pageSize: pageSize.value
    }
})
</script>
<template>
    <div class="stock-list-container">
        <a-table :columns="stocksColumns" :data-source="list" :loading="loading" :pagination="pagination">

        </a-table>
    </div>
</template>

<style lang="less" scoped>

</style>
