<script setup lang="ts">
import { useAkSharesApi } from "@/stores/akshares-api";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { computedBigASummaries } = storeToRefs(useAkSharesApi());
const { requestBigAStockTodaySummary } = useAkSharesApi();

onMounted(() => {
  requestBigAStockTodaySummary();
});
</script>

<template>
  <div>{{ computedBigASummaries}}</div>
</template>

<style scoped lang="less">

</style>
