<script lang="ts" setup>
//@ts-nocheck
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import { useAnalyzeMa } from "@/stores/ana-ma";
import * as dayjs from "dayjs";
import type { KLine, MaData } from "@/api/analyze";


const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchMethod = analyzeKStores.requestK;
const { kLines, kLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({});

const analyzeMaStores = useAnalyzeMa();
const fetchMa = analyzeMaStores.requestMaData;
const { maData, maLoading } = storeToRefs(analyzeMaStores);

const metaCodeMap = computed(() => {
  let map = {};
  metaCodes.value.forEach((item) => {
    map[item.code] = item.market + "+" + item.code;
  });
  return map;
});

const formState = reactive({
  code: {
    name: "标的物代码",
    type: "select",
    kv: metaCodeMap,
    bindValue: ""
  },
  rehabType: {
    name: "复权类型",
    type: "radio-group",
    radioOptions: [
      { label: "前复权", value: "1" },
      { label: "后复权", value: "2" },
      { label: "无复权", value: "0" }],
    bindValue: "1"
  },
  range: {
    name: "时间范围",
    type: "date-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(15).minute(0).second(0)]
    }
  }
});

function drawAnalyzePic(kLines: KLine[], maLines: MaData[]) {
  let xAxisTime = [];
  let candelstickArray = [];
  let volumes = [];
  kLines.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice]);
    volumes.push([index, k.volume, k.openPrice > k.closePrice ? 1 : -1]);
  });
  kLineOptions.value = {
    xAxis: [{
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      axisPointer: {
        z: 100
      }
    }, {
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      gridIndex: 1,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false }
    }],
    yAxis: [{
      scale: true,
      splitArea: {
        show: true
      }
    }, {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    }],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross"
      }
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all"
        }
      ]

    },
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: "#00da3c"
        },
        {
          value: -1,
          color: "#ec0000"
        }
      ]
    },
    grid: [
      {
        height: "50%"
      },
      {
        top: "65%",
        height: "25%"
      }
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 0,
        end: 100
      },
      {
        show: true,
        type: "slider",
        xAxisIndex: [0, 1],
        top: "90%",
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: formState.code.bindValue,
        type: "candlestick",
        data: candelstickArray
      },
      {
        name: "成交量",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumes
      },
      {
        name: "MA5",
        type: "line",
        data: maLines.map(ma => ma.maValue),
      },
    ]
  };
}

function onFinish(values: any) {
  Promise.allSettled([fetchMethod({
    rehabType: values.rehabType,
    granularity: 1,
    code: values.code,
    start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
  }), fetchMa({
    rehabType: values.rehabType,
    granularity: 1,
    span: 1,
    code: values.code,
    start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
  })]).then(([kData, maData]) => {
    if (kData.status === "fulfilled"
      && maData.status === "fulfilled") {
      let kLines = kData.value.data;
      let maLines = maData.value.data;
      drawAnalyzePic(kLines, maLines);
    }
  });
}

fetchCodes({
  granularity: 1
});
</script>
<template>
  <SearchArea :form="formState" @onFinish="onFinish" />
  <v-chart style="height: 400px;" :loading="kLoading" :autoresize="true" :option="kLineOptions"></v-chart>
</template>
<style lang="less" scoped></style>
