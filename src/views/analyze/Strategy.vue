<script setup lang="ts">
import SearchArea from "@/components/SearchArea/SearchArea.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { klTypeToSelectOptions, rehabTypeToRadioOptions } from "@/api/code";
import dayjs from "dayjs";
import { useAnalyzeMeta } from "@/stores/ana-meta";
import { storeToRefs } from "pinia";
import type { SelectProps } from "ant-design-vue";
import { useAnalyzeStrategy } from "@/stores/ana-strategy";
import type { BackTestTradeSignal, KLine } from "@/api/analyze";

const analyzeMetaStores = useAnalyzeMeta();
const fetchCodes = analyzeMetaStores.requestMetaData;
const { metaCodes } = storeToRefs(analyzeMetaStores);

const analyzeStrategyStores = useAnalyzeStrategy();
const { backTestLoading, strategyTypes } = storeToRefs(analyzeStrategyStores);
const fetchBackTest = analyzeStrategyStores.addBackTest;
const fetchStrategyTypes = analyzeStrategyStores.requestStrategyTypes;

const backTestOptions = ref({});

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
    bindValue: 1
  },
  strategyType: {
    name: "策略",
    type: "select",
    selectOptions: strategyTypes,
    bindValue: 1
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
  initialCapital: {
    name: "初始资金",
    type: "input-number",
    bindValue: "1000000"
  },
  commission: {
    name: "费率",
    type: "input-number",
    step: "0.01",
    precision: 2,
    formatter: (value: number) => `${value}%`,
    bindValue: "0.01"
  }
});

function drawBackTestPic( tradeSignals: BackTestTradeSignal[]) {
  let xAxisTime: Array<string> = [];
  let candelstickArray: Array = [];
  tradeSignals.forEach((k, index) => {
    xAxisTime.push(k.datetime);
    candelstickArray.push([k.openPrice, k.closePrice, k.lowPrice, k.highPrice]);
  });
  backTestOptions.value = {
    xAxis: [{
      type: "category",
      data: xAxisTime,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      axisPointer: {
        z: 100
      }
    }],
    yAxis: [{
      scale: true,
      splitArea: {
        show: true
      }
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
    }],
    grid: [{
      top: "8%",
      left: "5%",
      right: "5%"
    }],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        start: 0,
        end: 100
      },
      {
        show: true,
        type: "slider",
        xAxisIndex: [0],
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
        name: formState.code.bindValue,
        type: "line",
        data: tradeSignals.map(signal => {
          return signal.price;
        }),
        smooth: true,
        markPoint: {
          symbolSize: 20,
          data: tradeSignals.map(signal => {
            if (signal.action == "BUY") {
              return {
                name: signal.action,
                coord: [signal.datetime, signal.price],
                symbol: "pin",
                itemStyle: { color: "#ff4d4f" }
              };
            } else if (signal.action == "SELL") {
              return {
                name: signal.action,
                coord: [signal.datetime, signal.price],
                symbol: "pin",
                itemStyle: { color: "#52c41a" }
              };
            } else {
              return {
                name: signal.action,
                coord: [signal.datetime, signal.price],
                symbol: "none"
              };
            }
          })
        }
      }
    ]
  };

}

function onFinish(values: any) {
  fetchBackTest({
    rehabType: values.rehabType,
    granularity: values.granularity,
    strategyType: values.strategyType,
    code: values.code,
    initialCapital: values.initialCapital,
    commission: values.commission,
    start: dayjs(values.range[0]).format("YYYY-MM-DD HH:mm:ss"),
    end: dayjs(values.range[1]).format("YYYY-MM-DD HH:mm:ss")
  }).then(res => {
    if (res.status === 200) {
      let { backTestOvr, tradeSignals } = res.data;
      drawBackTestPic( tradeSignals);
    }
  });
}

onMounted(() => {
  fetchCodes({
    granularity: 1
  });
  fetchStrategyTypes();
});
</script>

<template>
  <SearchArea :form="formState" @onFinish="onFinish" />
  <v-chart style="height: 500px;" :loading="backTestLoading" :autoresize="true" :option="backTestOptions"></v-chart>
</template>

<style scoped lang="less">

</style>
