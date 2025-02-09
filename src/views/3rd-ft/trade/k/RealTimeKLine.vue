<script setup lang="ts">
//@ts-nocheck
import { watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useWsKLine } from '@/stores/rt-k';
import { useDrawKLine } from '@/views/trade/k/components/drawKLine';
import KLineTabs from './components/KLineTabs.vue'

const rtWsKlineStore = useWsKLine();
const { rtKlineMin1 } = storeToRefs(rtWsKlineStore)
const { getKLineData, updateKLineChart, updateKLineData, marketAndCodes } = useDrawKLine()

onMounted(() => {
  rtWsKlineStore.min1RTConnect()
})

watch(() => rtKlineMin1, (kline) => {
  let marketAndCode = kline.value.market + "+" + kline.value.code;
  let rehabType = kline.value.rehabType;
  let updateTime = kline.value.updateTime;
  let kArray = [kline.value.openPrice, kline.value.closePrice, kline.value.lowPrice, kline.value.highPrice]
  updateKLineData(marketAndCode, rehabType, updateTime, kArray)
  let target = getKLineData(marketAndCode, rehabType);
  updateKLineChart(marketAndCode, rehabType, Array.from(target?.updateTime), target?.kArray)
}, { deep: true })

</script>
<template>
  <div>
    <KLineTabs :marketAndCodes="marketAndCodes"></KLineTabs>
  </div>
</template>
<style lang="less" scoped></style>