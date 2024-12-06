<script setup lang="ts">
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { storeToRefs } from "pinia";

const analyzeMetaStores = useAnalyzeMeta();
const fetchTables = analyzeMetaStores.requestTables;
const { metaTables } = storeToRefs(analyzeMetaStores);

fetchTables();
</script>

<template>
  <div>数据清洗
    {{ metaTables }}
  </div>
</template>

<style scoped lang="less">

</style>
