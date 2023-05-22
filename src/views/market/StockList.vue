<script setup lang="ts">
import { useStockStore } from '@/stores/stock';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const stockStore = useStockStore()
const queryStocks = stockStore.run;
const { list, loading, pageSize, current, total } = storeToRefs(stockStore);

const stocksColumns = ref([
    {
        title: "名称",
        dataIndex: "name",
        window: "20%"
    }
])
const pagination = computed<Object>(() => {
    return {
        total: total.value,
        current: current.value,
        pageSize: pageSize.value,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    }
})
function onChangeTable(pagination, filters, sorter, { currentDataSource }) {
    queryStocks({
        size: pagination.pageSize,
        current: pagination.current
    })
}

</script>
<template>
    <div class="stock-list-container">
        <a-table :columns="stocksColumns" :data-source="list" :loading="loading" :pagination="pagination"
            @change="onChangeTable">

        </a-table>
    </div>
</template>

<style lang="less" scoped></style>
