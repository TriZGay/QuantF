<script setup lang="ts">
//@ts-nocheck
import { watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWsKLine } from '@/stores/rt-k';
import { useDrawKLine } from '@/views/trade/components/drawKLine';
const rtWsKlineStore = useWsKLine();
const { rtKlineMin1 } = storeToRefs(rtWsKlineStore)
const { getKLineData, updateKLineChart, updateKLineData, marketAndCodes } = useDrawKLine()

rtWsKlineStore.min1RTConnect()

watch(() => rtKlineMin1, (kline) => {
  let marketAndCode = kline.value.market + "+" + kline.value.code;
  let rehabType = kline.value.rehabType;
  let updateTime = kline.value.updateTime;
  let kArray = [kline.value.openPrice, kline.value.closePrice, kline.value.lowPrice, kline.value.highPrice]
  updateKLineData(marketAndCode, rehabType, updateTime, kArray)
  let target = getKLineData(marketAndCode, rehabType);
  updateKLineChart(marketAndCode, rehabType, Array.from(target?.updateTime), target?.kArray)
}, { deep: true })

const activeKey = ref("")

watch(marketAndCodes, (newVal) => {
  if (newVal.length !== 0) {
    activeKey.value = newVal[0].key
  } else {
    activeKey.value = ""
  }
})

</script>
<template>
  <div>
    <a-tabs v-model:activeKey="activeKey" type="editable-card">
      <a-tab-pane v-for="pane in marketAndCodes" :key="pane.key" :tab="pane.title">
        <v-chart v-for="option in pane.rehabTypesWithOptions" style="height: 400px;" :autoresize="true"
          :option="option.options"></v-chart>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<style lang="less" scoped></style>