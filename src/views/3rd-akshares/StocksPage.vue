<script setup lang="ts">
import { useAkSharesApi } from "@/stores/akshares-api";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const {
  computedBigASummaries,
  computedBigAStockIndividual
} = storeToRefs(useAkSharesApi());
const {
  requestBigAStockTodaySummary,
  requestBigAStockIndividual
} = useAkSharesApi();

onMounted(() => {
  requestBigAStockTodaySummary();
  // requestBigAStockIndividual("603777");
});
</script>

<template>
  <div>{{ computedBigASummaries }}
    {{ computedBigAStockIndividual }}
  </div>
</template>

<style scoped lang="less">

</style>
