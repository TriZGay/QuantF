<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAkSharesApi } from "@/stores/akshares-api";
import { ref } from "vue";
import type { TableColumnProps } from "ant-design-vue";

const { computedUsRealTime, usRealTimeLoading } = storeToRefs(useAkSharesApi());
const { requestUsRealTime } = useAkSharesApi();
const onRequestUsRealTime = () => {
  requestUsRealTime();
};
const stockUsRealTimeColumns = ref<TableColumnProps[]>([
  {
    title: "序号",
    dataIndex: "id"
  }, {
    title: "代码",
    dataIndex: "code"
  }, {
    title: "名称",
    dataIndex: "name"
  }, {
    title: "最新价",
    dataIndex: "price"
  }, {
    title: "涨跌幅(%)",
    dataIndex: "ratio"
  }, {
    title: "涨跌额",
    dataIndex: "ratioVal"
  }, {
    title: "成交量(手)",
    dataIndex: "turnover"
  }, {
    title: "成交额(元)",
    dataIndex: "volume"
  }, {
    title: "振幅(%)",
    dataIndex: "amplitude"
  }, {
    title: "最高",
    dataIndex: "high"
  }, {
    title: "最低",
    dataIndex: "low"
  }, {
    title: "今开",
    dataIndex: "open"
  }, {
    title: "昨收",
    dataIndex: "close"
  }, {
    title: "换手率(%)",
    dataIndex: "turnoverRatio"
  }, {
    title: "市盈率",
    dataIndex: "peRatio"
  }, {
    title: "总市值(元)",
    dataIndex: "marketCap"
  }
]);
</script>

<template>
  <div>
    <a-typography>
      <a-typography-title :level="4">美股实时行情</a-typography-title>
      <a-typography-paragraph>
        <a-button size="small" :loading="usRealTimeLoading" danger
                  @click="onRequestUsRealTime">全部
        </a-button>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <a-table size="small" :loading="usRealTimeLoading" :data-source="computedUsRealTime?.stockUsRtPrices"
                 :columns="stockUsRealTimeColumns" :scroll="{x:2000}"></a-table>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped lang="less">

</style>
