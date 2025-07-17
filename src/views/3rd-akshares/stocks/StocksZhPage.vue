<script setup lang="ts">
import { useAkSharesApi } from "@/stores/akshares-api";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import type { TableColumnProps } from "ant-design-vue";
import type { BigARealTimeType, StockZhHistory, StockZhHistoryRequest } from "@/api/akshares";

const {
  computedBigASummaries,
  bigARealTimeLoading,
  computedBigARealTime,
  computedBigAHistory,
  bigAHistoryLoading,
  computedBigAStockIndividual
} = storeToRefs(useAkSharesApi());
const {
  requestBigAStockTodaySummary,
  requestBigARealTime,
  requestBigAHistory,
  requestBigAStockIndividual
} = useAkSharesApi();

onMounted(() => {
  requestBigAStockTodaySummary();
  // requestBigAStockIndividual("603777");
});

const shStockSummariesColumns = ref<TableColumnProps[]>([
  {
    title: "项目",
    dataIndex: "name"
  },
  {
    title: "股票",
    dataIndex: "stock"
  },
  {
    title: "主板",
    dataIndex: "main"
  },
  {
    title: "科创板",
    dataIndex: "sen"
  }
]);
const szStockSummariesColumns = ref<TableColumnProps[]>([
  {
    title: "证券类别",
    dataIndex: "type"
  },
  {
    title: "数量",
    dataIndex: "num"
  },
  {
    title: "成交金额",
    dataIndex: "turnoverVal"
  },
  {
    title: "总市值",
    dataIndex: "totalMarketVal"
  },
  {
    title: "流通市值",
    dataIndex: "circularMarketVal"
  }
]);
const bigARealTimeColumns = ref<TableColumnProps[]>([
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
    title: "量比",
    dataIndex: "equivalentRatio"
  }, {
    title: "换手率(%)",
    dataIndex: "turnoverRatio"
  }, {
    title: "市盈率-动态",
    dataIndex: "peRatio"
  }, {
    title: "市净率",
    dataIndex: "pbRatio"
  }, {
    title: "总市值(元)",
    dataIndex: "marketCap"
  }, {
    title: "流通市值(元)",
    dataIndex: "circularRatio"
  }, {
    title: "涨速",
    dataIndex: "growthRatio"
  }, {
    title: "5分钟涨跌(%)",
    dataIndex: "fiveMRatio"
  }, {
    title: "60日涨跌幅(%)",
    dataIndex: "sixtyDRatio"
  }, {
    title: "年初至今涨跌幅(%)",
    dataIndex: "ytdPercentRatio"
  }
]);

const onRequestBigARealTime = (type: BigARealTimeType) => {
  requestBigARealTime(type);
};

const bigAHistoryFormState = ref<StockZhHistoryRequest>({
  symbol: "",
  period: "daily",
  startDate: "",
  endDate: "",
  adjust: "qfq"
});
const bigAHistoryOptions = ref({});
const drawBigAHistoryPic = (his: Array<StockZhHistory>) => {
  let xAxisTime: Array<string> = [];
  let candelstickArray: Array = [];
  let volumes: Array = [];
  his.forEach((k, index) => {
    xAxisTime.push(k.date);
    candelstickArray.push([k.open, k.close, k.low, k.high]);
    volumes.push([index, k.volume, k.open > k.close ? 1 : -1]);
  });
  bigAHistoryOptions.value = {
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
        name: bigAHistoryFormState.value.symbol,
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
      }
    ]
  };
};

const onSearchBigAHistory = () => {
  requestBigAHistory(bigAHistoryFormState.value).then(result => {
    if (result.status === 200) {
      let { data } = result;
      drawBigAHistoryPic(data.histories);
    }
  });
};
</script>

<template>
  <div>
    <a-typography>
      <a-typography-title :level="4">今日概览</a-typography-title>
      <a-typography-paragraph>
        <a-row :gutter="[8,8]">
          <a-col span="12">
            <a-card title="上海交易所">
              <a-table size="small" :data-source="computedBigASummaries?.shStockSummaries"
                       :columns="shStockSummariesColumns"></a-table>
            </a-card>
          </a-col>
          <a-col span="12">
            <a-card title="深圳交易所">
              <a-table size="small"
                       :data-source="computedBigASummaries?.szSummaries"
                       :columns="szStockSummariesColumns"
                       :scroll="{x:600}"
              ></a-table>
            </a-card>
          </a-col>
        </a-row>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="4">大A实时行情</a-typography-title>
      <a-typography-paragraph>
        <a-space>
          <a-button size="small" :loading="bigARealTimeLoading" danger
                    @click="onRequestBigARealTime('all')">全部
          </a-button>
          <a-button type="primary" size="small" :loading="bigARealTimeLoading"
                    @click="onRequestBigARealTime('sh')">上海
          </a-button>
          <a-button type="primary" size="small" :loading="bigARealTimeLoading"
                    @click="onRequestBigARealTime('sz')">深圳
          </a-button>
          <a-button type="primary" size="small" :loading="bigARealTimeLoading"
                    @click="onRequestBigARealTime('bj')">北京
          </a-button>
        </a-space>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <a-table :loading="bigARealTimeLoading"
                 size="small"
                 :data-source="computedBigARealTime?.rtPrices"
                 :columns="bigARealTimeColumns"
                 :scroll="{x:2400}"
        ></a-table>
      </a-typography-paragraph>
    </a-typography>
    <a-typography>
      <a-typography-title :level="4">查询历史行情</a-typography-title>
      <a-typography-paragraph>
        <a-form layout="inline" :model="bigAHistoryFormState">
          <a-form-item label="股票代码">
            <a-input v-model:value="bigAHistoryFormState.symbol" />
          </a-form-item>
          <a-form-item label="粒度">
            <a-select v-model:value="bigAHistoryFormState.period" :options="[{
              label:'天',
              value:'daily'
            },{
              label:'周',
              value:'weekly'
            },{
              label:'月',
              value:'monthly'
            }]" />
          </a-form-item>
          <a-form-item label="开始日期">
            <a-date-picker v-model:value="bigAHistoryFormState.startDate"
                           format="YYYYMMDD"
                           value-format="YYYYMMDD" />
          </a-form-item>
          <a-form-item label="结束日期">
            <a-date-picker v-model:value="bigAHistoryFormState.endDate"
                           format="YYYYMMDD"
                           value-format="YYYYMMDD" />
          </a-form-item>
          <a-form-item label="复权类型">
            <a-select v-model:value="bigAHistoryFormState.adjust" allow-clear :options="[{
              label:'前复权',
              value:'qfq'
            },{
              label:'后复权',
              value:'hfq'
            }]" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSearchBigAHistory" :loading="bigAHistoryLoading">
              <template #icon>
                <SearchOutlined />
              </template>
              查询
            </a-button>
          </a-form-item>
        </a-form>
      </a-typography-paragraph>
      <a-typography-paragraph>
        <v-chart style="height: 500px;" :loading="bigAHistoryLoading" :autoresize="true"
                 :option="bigAHistoryOptions"></v-chart>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style scoped lang="less">

</style>
