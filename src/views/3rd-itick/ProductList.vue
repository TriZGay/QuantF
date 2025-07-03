<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useItickApi } from "@/stores/itick-api";
import { onMounted, ref } from "vue";
import type { TableColumnProps } from "ant-design-vue";

const { requestProducts } = useItickApi();
const { products } = storeToRefs(useItickApi());

onMounted(() => {
  requestProducts({
    type: "stock",
    region: "hk",
    code: "700"
  });
});

const columns = ref<TableColumnProps[]>([
  {
    title: "产品代码",
    dataIndex: "c",
    fixed: "left"
  },
  {
    title: "产品类别",
    dataIndex: "t",
    fixed: "left"
  },
  {
    title: "交易所",
    dataIndex: "e",
    fixed: "left"
  },
  {
    title: "产品名称",
    dataIndex: "n",
    fixed: "left"
  }
]);
</script>

<template>
  <div>
    <a-typography>
      <a-typography-title :level="4">itck标的清单</a-typography-title>
      <a-typography-paragraph>
        <a-table :data-source="products?.data" size="small"
                 :columns="columns">

        </a-table>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped lang="less">

</style>
