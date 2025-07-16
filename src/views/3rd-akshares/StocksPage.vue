<script setup lang="ts">
import { useAkSharesApi } from "@/stores/akshares-api";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import type { TableColumnProps } from "ant-design-vue";
import type { BigARealTimeType } from "@/api/akshares";

const {
  computedBigASummaries,
  bigARealTimeLoading,
  computedBigARealTime,
  computedBigAStockIndividual
} = storeToRefs(useAkSharesApi());
const {
  requestBigAStockTodaySummary,
  requestBigARealTime,
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
  </div>
</template>

<style scoped lang="less">

</style>
