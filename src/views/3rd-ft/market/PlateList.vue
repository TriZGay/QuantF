<script lang="ts" setup>
//@ts-nocheck
import { marketTypeToSelectOptions } from "@/api/code";
import { onMounted, ref, watch } from "vue";
import { useFutuApi } from "@/stores/futu-api";
import { storeToRefs } from "pinia";
import type { TableColumnsType } from "ant-design-vue";
import type { PlateItem, SnapshotCommand } from "@/types/message";
import { useFutuStomp } from "@/stores/futu-stomp";
import ValuationPlateStockCharts from "@/components/ValuationPlateStockCharts/index.vue";

const { sendFtCommandOnNotifyEndPoint } = useFutuStomp();

const { queryPlates, queryAllStocks, querySnapshots } = useFutuApi();
const { plates, computedAllStocks, computedSnapshots } = storeToRefs(
  useFutuApi()
);
const market = ref("1");
const plateId = ref();

const plateCode = ref("");

const platesSelectOptions = ref([]);

onMounted(() => {
  queryPlates({
    market: parseInt(market.value),
    size: 200,
    current: 1,
  });
});

watch(plates, (newPlates) => {
  if (newPlates.data.length > 0) {
    let platesOnPage = plates.value.data.map((p) => {
      return { value: p.id, label: p.name, code: p.code, market: p.marketCode };
    });
    platesSelectOptions.value = platesSelectOptions.value.concat(platesOnPage);
    if (plates.value.current !== plates.value.totalPage) {
      plateId.value = newPlates.data[0].id;
      querySnapshots({
        market: newPlates.data[0].marketCode,
        code: newPlates.data[0].code,
        securityType: 7, //7-板块
      });
    }
  } else {
    platesSelectOptions.value = [];
    plateId.value = null;
  }
});

const onPopupScroll = (e) => {
  const { target } = e;
  const { scrollTop, scrollHeight, offsetHeight } = target;
  if (scrollTop + 2 + offsetHeight >= scrollHeight) {
    if (plates.value.current !== plates.value.totalPage) {
      let current = plates.value.current;
      current = current + 1;
      queryPlates({
        market: parseInt(market.value),
        size: 200,
        current: current,
      });
      let platesOnPage = plates.value.data.map((p) => {
        return {
          value: p.id,
          label: p.name,
          code: p.code,
          market: p.marketCode,
        };
      });
      platesSelectOptions.value =
        platesSelectOptions.value.concat(platesOnPage);
    }
  }
};

const plateFilterOption = (input, option) => {
  return option.label.includes(input);
};

const onSelectPlate = (value, option) => {
  queryAllStocks({
    plateId: value,
  });
  //查询板块快照
  let foundPlate = platesSelectOptions.value.find((ps) => ps.value === value);
  market.value = foundPlate.market.toString();
  plateCode.value = foundPlate.code;
  querySnapshots({
    market: foundPlate.market,
    code: foundPlate.code,
    securityType: 7, //7-板块
  });
};

const stocksColumns = ref<TableColumnsType>([
  {
    title: "股票代码",
    dataIndex: "code",
    fixed: "left",
    width: 120,
  },
  {
    title: "名称",
    dataIndex: "name",
    fixed: "left",
    width: 120,
  },
]);

const onConfirmReqSnapshot = () => {
  requestSnapshot();
};

const requestSnapshot = () => {
  let securities = computedAllStocks.value.map((s) => {
    return { market: s.marketCode, code: s.code };
  });
  let command: SnapshotCommand = {
    type: "SNAPSHOT",
    isPlate: 0,
    securities: securities as PlateItem[],
  };
  sendFtCommandOnNotifyEndPoint(command);
};
</script>
<template>
  <div class="grid grid-cols-[40%_60%] gap-4">
    <div class="border-gray-700 border-solid p-4 rounded">
      <div class="mb-2">
        <a-form layout="inline">
          <a-form-item>
            <a-select
              v-model:value="market"
              placeholder="市场"
              :options="marketTypeToSelectOptions()"
            />
          </a-form-item>
          <a-form-item class="w-52">
            <a-select
              v-model:value="plateId"
              placeholder="板块"
              show-search
              :filter-option="plateFilterOption"
              :options="platesSelectOptions"
              @select="onSelectPlate"
              @popupScroll="onPopupScroll"
            />
          </a-form-item>
          <a-form-item label="页数">
            {{
              "(" +
              plates.current +
              "/" +
              plates.totalPage +
              ")" +
              "(" +
              plates.total +
              ")"
            }}
          </a-form-item>
          <a-form-item>
            <a-popconfirm title="确定" @confirm="onConfirmReqSnapshot">
              <a-button type="primary" size="small"
                >请求快照数据({{ computedAllStocks.length }})</a-button
              >
            </a-popconfirm>
          </a-form-item>
        </a-form>
      </div>
      <a-table
        :data-source="computedAllStocks"
        :columns="stocksColumns"
        size="small"
      ></a-table>
    </div>
    <div class="border-gray-700 border-solid p-4 rounded overflow-y-auto">
      <div class="h-[500px]">
        <a-descriptions
          :title="computedSnapshots?.baseResponse?.name"
          layout="vertical"
          bordered
          :column="4"
          size="small"
        >
          <a-descriptions-item label="代码">{{
            computedSnapshots?.baseResponse?.code
          }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{
            computedSnapshots?.baseResponse?.isSuspend
          }}</a-descriptions-item>
          <a-descriptions-item label="上市时间">{{
            computedSnapshots?.baseResponse?.listTime
          }}</a-descriptions-item>
          <a-descriptions-item label="更新时间">
            {{ computedSnapshots?.baseResponse?.updateTime }}
          </a-descriptions-item>
          <a-descriptions-item label="上涨支数">
            {{ computedSnapshots?.plateResponse?.raiseCount
            }}<caret-up-outlined :style="{'color': 'red'}"/>
          </a-descriptions-item>
          <a-descriptions-item label="下跌支数">
            {{ computedSnapshots?.plateResponse?.fallCount }}
            <caret-down-outlined :style="{'color': 'green'}"/>
          </a-descriptions-item>
          <a-descriptions-item label="平盘支数">
            {{ computedSnapshots?.plateResponse?.equalCount }}
          </a-descriptions-item>
          <a-descriptions-item label=""></a-descriptions-item>
          <a-descriptions-item label="最高价">
            {{ computedSnapshots?.baseResponse?.highPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="最低价">
            {{ computedSnapshots?.baseResponse?.lowPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="开盘价">
            {{ computedSnapshots?.baseResponse?.openPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="昨收价">
            {{ computedSnapshots?.baseResponse?.lastClosePrice }}
          </a-descriptions-item>
          <a-descriptions-item label="最新价">
            {{ computedSnapshots?.baseResponse?.curPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="成交量">
            {{ computedSnapshots?.baseResponse?.volume }}
          </a-descriptions-item>
          <a-descriptions-item label="成交额">
            {{ computedSnapshots?.baseResponse?.turnover }}
          </a-descriptions-item>
          <a-descriptions-item label="换手率">
            {{ computedSnapshots?.baseResponse?.turnoverRate }}
          </a-descriptions-item>
          <a-descriptions-item label="卖价">
            {{ computedSnapshots?.baseResponse?.askPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="买价">
            {{ computedSnapshots?.baseResponse?.bidPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="卖量">
            {{ computedSnapshots?.baseResponse?.askVol }}
          </a-descriptions-item>
          <a-descriptions-item label="买量">
            {{ computedSnapshots?.baseResponse?.bidVol }}
          </a-descriptions-item>
          <a-descriptions-item label="振幅">
            {{ computedSnapshots?.baseResponse?.amplitude }}
          </a-descriptions-item>
          <a-descriptions-item label="平均价">
            {{ computedSnapshots?.baseResponse?.avgPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="委比">
            {{ computedSnapshots?.baseResponse?.bidAskRatio }}
          </a-descriptions-item>
          <a-descriptions-item label="量比">
            {{ computedSnapshots?.baseResponse?.volumeRatio }}
          </a-descriptions-item>
          <a-descriptions-item label="52周最高价">
            {{ computedSnapshots?.baseResponse?.highest52WeeksPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="52周最低价">
            {{ computedSnapshots?.baseResponse?.lowest52WeeksPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="历史最高价">
            {{ computedSnapshots?.baseResponse?.highestHistoryPrice }}
          </a-descriptions-item>
          <a-descriptions-item label="历史最低价">
            {{ computedSnapshots?.baseResponse?.lowestHistoryPrice }}
          </a-descriptions-item>
        </a-descriptions>
        <ValuationPlateStockCharts :market="market" :code="plateCode" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
