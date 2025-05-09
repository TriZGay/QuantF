<script lang="ts" setup>
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import dayjs from "dayjs";
import type {
  ArbrResponse,
  BollResponse,
  EMaData,
  KdjResponse,
  KLine,
  MacdResponse,
  MaData,
  RsiResponse
} from "@/api/analyze";
import { isAll200 } from "@/utils/web";
import { klTypeToSelectOptions, rehabTypeToRadioOptions } from "@/api/code";
import type { AxiosResponse } from "axios";
import type { SelectProps } from "ant-design-vue";
import { useAnalyzeIndies } from "@/stores/ana-indicator";

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);
// k线
const analyzeKStores = useAnalyzeKline();
const fetchKLine = analyzeKStores.requestK;
const { kLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({});
// 指标
const analyzeIndiesStores = useAnalyzeIndies();
const fetchRsiData = analyzeIndiesStores.requestRsiData;
const fetchKdjData = analyzeIndiesStores.requestKdjData;
const fetchBolls = analyzeIndiesStores.requestBollData;
const fetchEmaData = analyzeIndiesStores.requestEmaData;
const fetchMaLine = analyzeIndiesStores.requestMaData;
const fetchMacdData = analyzeIndiesStores.requestMacdData;
const fetchArbrData = analyzeIndiesStores.requestArbrData;

const metaCodeSelectOptions = computed(() => {
  let options: Array<SelectProps["options"]> = [];
  metaCodes.value.forEach((item) => {
    options.push({
      label: item.market + "+" + item.code,
      value: item.code
    });
  });
  return options;
});

const formState = reactive({
  code: {
    name: "标的物代码",
    type: "select",
    selectOptions: metaCodeSelectOptions,
    bindValue: ""
  },
  granularity: {
    name: "K线类型",
    type: "select",
    selectOptions: klTypeToSelectOptions(),
    bindValue: "1"
  },
  rehabType: {
    name: "复权类型",
    type: "radio-group",
    radioOptions: rehabTypeToRadioOptions(),
    bindValue: "1"
  },
  range: {
    name: "时间范围",
    type: "datetime-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(15).minute(30).second(0)],
      "港股交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(16).minute(0).second(0)]
    }
  },
  indies: {
    name: "指标",
    type: "checkbox-group",
    bindValue: ["k"],
    checkboxOptions: [
      { label: "K", value: "k" },
      { label: "MA(5/10/20/30/60/120)", value: "ma" },
      { label: "BOLL(20,2.0)", value: "boll" },
      { label: "EMA(5/10/20/60/120)", value: "ema" },
      { label: "MACD(12,26,9)", value: "macd" },
      { label: "RSI(6,12,24)", value: "rsi" },
      { label: "KDJ(9,3,3)", value: "kdj" },
      { label: "ARBR(26)", value: "arbr" }
    ]
  }
});

function drawAnalyzePic(kLines: KLine[], maLines: MaData[],
                        bollLines: BollResponse[], emaLines: EMaData[],
                        macdLines: MacdResponse[], rsiLines: RsiResponse[],
                        kdjLines: KdjResponse[], arbrLines: ArbrResponse[]
) {
  let xAxisTime: Array<string> = [];
  let candelstickArray: Array = [];
  let volumes: Array = [];
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
    }, {
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      gridIndex: 2,
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
    }, {
      scale: true,
      gridIndex: 2,
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
    visualMap: [{
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
    }, {
      show: false,
      seriesIndex: 18,
      pieces: [
        { lt: 0, color: "#00da3c" },
        { gt: 0, color: "#ec0000" }
      ]
    }],
    grid: [
      {
        top: "8%",
        left: "5%",
        right: "5%",
        height: "40%"
      },
      {
        top: "50%",
        left: "5%",
        right: "5%",
        height: "20%"
      },
      {
        top: "73%",
        left: "5%",
        right: "5%",
        height: "20%"
      }
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1, 2],
        start: 0,
        end: 100
      },
      {
        show: true,
        type: "slider",
        xAxisIndex: [0, 1, 2],
        top: "90%",
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: formState.code.bindValue,
        type: "candlestick",
        data: candelstickArray,
        markPoint: {
          data: [
            {
              name: "highest value",
              type: "max",
              valueDim: "highest"
            }, {
              name: "lowest value",
              type: "min",
              valueDim: "lowest"
            }
          ]
        },
        markLine: {
          symbol: ["none", "none"],
          data: [
            [
              {
                name: "from lowest to highest",
                type: "min",
                valueDim: "lowest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                type: "max",
                valueDim: "highest",
                symbol: "circle",
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ]
          ]
        }
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
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma5Value)
      },
      {
        name: "MA10",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma10Value)
      },
      {
        name: "MA20",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma20Value)
      },
      {
        name: "MA30",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma30Value)
      },
      {
        name: "MA60",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma60Value)
      },
      {
        name: "MA120",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: maLines.map(ma => ma.ma120Value)
      },
      {
        name: "MID",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: bollLines.map(ma => ma.ma20Mid)
      },
      {
        name: "UPPER",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: bollLines.map(ma => ma.doubleUpper)
      },
      {
        name: "LOWER",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: bollLines.map(ma => ma.doubleLower)
      }, {
        name: "EMA5",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: emaLines.map(ema => ema.ema5Value)
      },
      {
        name: "EMA10",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: emaLines.map(ema => ema.ema10Value)
      },
      {
        name: "EMA20",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: emaLines.map(ema => ema.ema20Value)
      },
      {
        name: "EMA60",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: emaLines.map(ema => ema.ema60Value)
      },
      {
        name: "EMA120",
        type: "line",
        showSymbol: false,
        smooth: true,
        data: emaLines.map(ema => ema.ema120Value)
      },
      {
        name: "DIF",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        smooth: true,
        data: macdLines.map(macd => macd.dif)
      },
      {
        name: "DEA",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        showSymbol: false,
        smooth: true,
        data: macdLines.map(macd => macd.dea)
      },
      {
        name: "MACD",
        type: "bar",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: macdLines.map(macd => macd.macd)
      },
      {
        name: "RSI6",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: rsiLines.map(rsi => rsi.rsi6)
      },
      {
        name: "RSI12",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: rsiLines.map(rsi => rsi.rsi12)
      },
      {
        name: "RSI24",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: rsiLines.map(rsi => rsi.rsi24)
      },
      {
        name: "K",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: kdjLines.map(kdj => kdj.k)
      },
      {
        name: "D",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: kdjLines.map(kdj => kdj.d)
      },
      {
        name: "J",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: kdjLines.map(kdj => kdj.j)
      },
      {
        name: "AR",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: arbrLines.map(arbr => arbr.ar)
      },
      {
        name: "BR",
        type: "line",
        xAxisIndex: 2,
        yAxisIndex: 2,
        data: arbrLines.map(arbr => arbr.br)
      }
    ]
  };
}

function onFinish(values: any) {
  let fetchMethods: Array<Promise<AxiosResponse>> = [];
  if (values.indies.includes("k")) {
    fetchMethods.push(fetchKLine({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("ma")) {
    fetchMethods.push(fetchMaLine({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("boll")) {
    fetchMethods.push(fetchBolls({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("ema")) {
    fetchMethods.push(fetchEmaData({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("macd")) {
    fetchMethods.push(fetchMacdData({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("rsi")) {
    fetchMethods.push(fetchRsiData({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("kdj")) {
    fetchMethods.push(fetchKdjData({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  if (values.indies.includes("arbr")) {
    fetchMethods.push(fetchArbrData({
      rehabType: values.rehabType,
      granularity: values.granularity,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }));
  }
  Promise.all(fetchMethods).then(allPromises => {
    if (isAll200(allPromises)) {
      let kLines: KLine[] = [];
      let kPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/k/n");
      if (kPromiseIndex != -1) {
        kLines = allPromises[kPromiseIndex].data;
      }
      let maLines: MaData[] = [];
      let maPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/ma/n");
      if (maPromiseIndex != -1) {
        maLines = allPromises[maPromiseIndex].data;
      }
      let bollLines: BollResponse[] = [];
      let bollPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/boll/boll202");
      if (bollPromiseIndex != -1) {
        bollLines = allPromises[bollPromiseIndex].data;
      }
      let emaLines: EMaData[] = [];
      let emaPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/ema/n");
      if (emaPromiseIndex != -1) {
        emaLines = allPromises[emaPromiseIndex].data;
      }
      let macdLines: MacdResponse[] = [];
      let macdPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/macd/macd12269");
      if (macdPromiseIndex != -1) {
        macdLines = allPromises[macdPromiseIndex].data;
      }
      let rsiLines: RsiResponse[] = [];
      let rsiPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/rsi/rsi61224");
      if (rsiPromiseIndex != -1) {
        rsiLines = allPromises[rsiPromiseIndex].data;
      }
      let kdjLines: KdjResponse[] = [];
      let kdjPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/kdj/kdj933");
      if (kdjPromiseIndex != -1) {
        kdjLines = allPromises[kdjPromiseIndex].data;
      }
      let arbrLines: ArbrResponse[] = [];
      let arbrPromiseIndex = allPromises.findIndex(promise => promise.config.url === "/ana/arbr/arbr26");
      if (arbrPromiseIndex != -1) {
        arbrLines = allPromises[arbrPromiseIndex].data;
      }
      drawAnalyzePic(kLines, maLines, bollLines, emaLines, macdLines, rsiLines, kdjLines, arbrLines);
    }
  });
}

onMounted(() => {
  fetchCodes({
    granularity: 1
  });
});
</script>
<template>
  <SearchArea :form="formState" @onFinish="onFinish" />
  <v-chart style="height: 500px;" :loading="kLoading" :autoresize="true" :option="kLineOptions"></v-chart>
</template>
<style lang="less" scoped></style>
