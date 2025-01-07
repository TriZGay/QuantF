<script lang="ts" setup>
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { useAnalyzeKline } from "@/stores/ana-k";
import { useAnalyzeMa } from "@/stores/ana-ma";
import dayjs from "dayjs";
import type { KLine, MaData } from "@/api/analyze";
import { isAll200 } from "@/utils/web";
import { maTypeToCheckBoxOptions, rehabTypeToRadioOptions } from "@/api/code";

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);

const analyzeKStores = useAnalyzeKline();
const fetchKLine = analyzeKStores.requestK;
const { kLoading } = storeToRefs(analyzeKStores);
const kLineOptions = ref({});

const analyzeMaStores = useAnalyzeMa();
const fetchMaLine = analyzeMaStores.requestMaData;

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
    radioOptions: rehabTypeToRadioOptions(),
    bindValue: "1"
  },
  range: {
    name: "时间范围",
    type: "datetime-range",
    bindValue: [dayjs(), dayjs().subtract(1, "minute")],
    ranges: {
      "大A交易时段": [dayjs().hour(9).minute(30).second(0), dayjs().hour(15).minute(30).second(0)],
      "港股交易时段": [dayjs().hour(9).minute(0).second(0), dayjs().hour(16).minute(0).second(0)]
    }
  }
});

function drawAnalyzePic(kLines: KLine[], maLines: MaData[]) {
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
      }
    ]
  };
}

function onFinish(values: any) {
  Promise.all([
    fetchKLine({
      rehabType: values.rehabType,
      granularity: 1,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    }), fetchMaLine({
      rehabType: values.rehabType,
      granularity: 1,
      code: values.code,
      start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
      end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
    })
  ]).then(allPromises => {
    if (isAll200(allPromises)) {
      let kLines = allPromises[0].data;
      let maLines = allPromises[1].data;
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
