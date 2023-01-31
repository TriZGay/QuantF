<script setup lang="ts">
import { useStockStore } from '@/stores/stock';
import { ref } from 'vue';

const { data } = useStockStore();
const stocksColumns = ref([])

</script>
<template>
    <div class="stock-list-container">
        {{ data }}
        <!-- <a-table :columns="stocksColumns" :data-source="stocks">

        </a-table> -->
    </div>
</template>

<style lang="less" scoped>

</style>
