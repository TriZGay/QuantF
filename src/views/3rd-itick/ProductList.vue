<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useItickApi } from "@/stores/itick-api";
import { onMounted } from "vue";

const { requestProducts } = useItickApi();
const { products } = storeToRefs(useItickApi());

onMounted(() => {
  requestProducts({
    type: "stock",
    region: "hk",
    code: "700"
  });
});
</script>

<template>
  <div>itck标的清单{{ products }}</div>
</template>

<style scoped lang="less">

</style>
