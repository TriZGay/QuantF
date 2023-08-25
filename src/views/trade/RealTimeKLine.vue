<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useWsKLine } from '@/stores/rt-k';
import type { EChartsOption } from 'echarts';

const rtWsKlineStore = useWsKLine();
const { rtKline } = storeToRefs(rtWsKlineStore)

type RehabTypesWithOptions = {
  rehabType: number,
  options?: EChartsOption
}

type RehabTypesWithData = {
  rehabType: number,
  updateTime: Set<string>,
  kArray: Array<Array<number>>
}

const marketAndCodes = ref<{
  title: string,
  key: string,
  rehabTypesWithOptions: Array<RehabTypesWithOptions>, // {rehabType:0,options:{}}
  closable?: boolean
}[]>([])

const dataMap = ref<{
  key: string,
  rehabTypesWithData: Array<RehabTypesWithData>
}[]>([])

function updateKLineData(key: string, rehabType: number,
  updateTime: string, kArray: Array<number>) {
  let found = dataMap.value.find(val => val.key === key);
  if (typeof found !== 'undefined') {
    let foundData = found.rehabTypesWithData.find(val => val.rehabType === rehabType);
    if (typeof foundData !== 'undefined') {
      foundData.updateTime.add(updateTime);
      foundData.kArray.push(kArray)
    } else {
      //初始化时把第一个数据放进去
      found.rehabTypesWithData.push({
        rehabType: rehabType,
        updateTime: new Set<string>().add(updateTime),
        kArray: [kArray]
      })
    }
  } else {
    dataMap.value.push({
      key: key,
      rehabTypesWithData: []
    })
  }
}
function updateKLineChart(key: string, rehabType: number,
  updateTime: Array<string>, kArray: Array<Array<number>>) {
  let found = marketAndCodes.value.find(val => val.key === key);
  if (typeof found !== 'undefined') {
    let foundOptions = found.rehabTypesWithOptions.find(val => val.rehabType === rehabType);
    if (typeof foundOptions !== 'undefined') {
      foundOptions.options = {
        title: {
          text: key + ":" + rehabType + "K线图"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {},
        xAxis: {
          type: "category",
          data: updateTime,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          axisPointer: {
            z: 100
          }
        },
        yAxis: {
          scale: true,
          splitArea: {
            show: true
          }
        },
        series: [{
          name: key + ":" + rehabType + "K线图",
          type: "candlestick",
          data: kArray,
        }]
      }
    } else {
      found.rehabTypesWithOptions.push({ rehabType: rehabType })
    }
  } else {
    marketAndCodes.value.push({
      title: key,
      key: key,
      rehabTypesWithOptions: [],
      closable: false
    })
  }
}
function getKLineData(key: string, rehabType: number): RehabTypesWithData | undefined {
  return dataMap.value.find(val => val.key === key)
    ?.rehabTypesWithData.find(val => val.rehabType === rehabType);
}

watch(() => rtKline, (kline) => {
  let marketAndCode = kline.value.market + "+" + kline.value.code;
  let rehabType = kline.value.rehabType;
  let updateTime = kline.value.updateTime;
  let kArray = [kline.value.openPrice, kline.value.closePrice, kline.value.lowPrice, kline.value.highPrice]
  updateKLineData(marketAndCode, rehabType, updateTime, kArray)
  let target = getKLineData(marketAndCode, rehabType);
  //@ts-ignore
  updateKLineChart(marketAndCode, rehabType, Array.from(target.updateTime), target.kArray)
}, { deep: true })

const activeKey = computed(() => {
  if (marketAndCodes.value.length === 0) {
    return ""
  } else {
    return marketAndCodes.value[0].key
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