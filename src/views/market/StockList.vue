<script setup lang="ts">
import type { Stock } from '@/api/stock';
import { useStockStore } from '@/stores/stock';
import { computed } from 'vue';

const stockStore = useStockStore()
const stocks = computed<Stock[]>(() => stockStore.stocks)

stockStore.getStocks()

</script>
<template>
    <div>{{ stocks }}</div>

</template>

<style scoped>

</style>
